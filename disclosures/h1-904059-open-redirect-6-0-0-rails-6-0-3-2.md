---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/open-redirect
  - env/web
  - stack/ruby
substate: "resolved"
weakness: "Open Redirect"
enriched: true
body: true
date: 2020-12-22
submitted: 2020-06-21T02:15:14.122Z
bounty_usd: 1000
votes: 19
cve: "CVE-2020-8264", "CVE-2020-8185"
program: "[[programs/rails|Ruby on Rails]]"
reporter: "ooooooo_q"
source: "https://hackerone.com/reports/904059"
title: "Open Redirect (6.0.0 < rails < 6.0.3.2)"
---
# Open Redirect (6.0.0 < rails < 6.0.3.2)

> **Severity:** High | **Bounty:** 1,000 USD | **Votes:** 19 | **Program:** Ruby on Rails | **Disclosed:** 2020-12-22

- Report: [https://hackerone.com/reports/904059](https://hackerone.com/reports/904059)
- CWE: Open Redirect | CVE: CVE-2020-8264, CVE-2020-8185
- Submitted: 2020-06-21T02:15:14.122Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,
I was looking at the change log (https://github.com/rails/rails/commit/2121b9d20b60ed503aa041ef7b926d331ed79fc2) for CVE-2020-8185 and found another problem existed.

https://github.com/rails/rails/blob/v6.0.3.1/actionpack/lib/action_dispatch/middleware/actionable_exceptions.rb#L21

```ruby
  redirect_to request.params[:location]
end

private
  def actionable_request?(request)
    request.show_exceptions? && request.post? && request.path == endpoint
  end

  def redirect_to(location)
    body = "<html><body>You are being <a href=\"#{ERB::Util.unwrapped_html_escape(location)}\">redirected</a>.</body></html>"

    [302, {
      "Content-Type" => "text/html; charset=#{Response.default_charset}",
      "Content-Length" => body.bytesize.to_s,
      "Location" => location,
    }, [body]]
  end
```

There was an open redirect issue because the request parameter `location` was not validated.
In 6.0.3.2, since the condition of `actionable_request?` has changed, this problem is less likely to occur.


### PoC


#### 1. Prepare server

Prepare an attackable 6.0.3.1 version of Rails server

```
❯ rails -v
Rails 6.0.3.1

❯ RAILS_ENV=production rails s
...
* Environment: production
* Listening on tcp://0.0.0.0:3000
```

#### 2. Attack server 

Prepare the server for attack on another port.

```html
<form method="post" action="http://localhost:3000/rails/actions?error=ActiveRecord::PendingMigrationError&action=Run%20pending%20migrations&location=https://www.hackerone.com/">
	<button type="submit">click!</button>
</form>
````

```
python3 -m http.server 8000
```

#### 3. Open browser

Open the `http://localhost:8000/attack.html` url in your browser and click the button.
Redirect to `https://www.hackerone.com/` url.

{F876518}

## Impact

It will be fixed with 6.0.3.2 as with CVE-2020-8185(https://groups.google.com/g/rubyonrails-security/c/pAe9EV8gbM0), but I think it is necessary to announce it again because the range of influence is different.

This open redirect changes from POST method to Get Method, so it may be difficult to use for phishing.On the other hand, it may affect bypass of referrer check or SSRF.

## Timeline

- **Report Filed**
- **2020-06-21** @ooooooo_q: I thought about it after submitting the report, but even in 6.0.3.2, `/rails/actions` is available in developer mode.
If it was started in development mode, the request will be accepted by CSRF, so the same as CVE-2020-8185 still exists.
I think it's better to take CSRF measures in `/rails/actions`.

#### Vulnerabilities, versions and modes

- 6.0.3.1 (production, development)
  - run pending migrations (CVE-2020-8185)
  - open redirect
- 6.0.3.2 (development)
  - run pending migrations (by CSRF)
  - open redirect (by CSRF)
- 6.0.3.2 (production)
  - no problem
- **2020-08-04** @tenderlove: This seems like a good improvement, but I don't think we need to treat it as a security issue.  If you agree, would you mind filing an issue on the Rails GitHub issues?

Thank you!
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **2020-09-01** @tenderlove: > When I tried it, puma and unicorn can insert only the character of \r, and it seems that \n cannot be inserted.

Makes sense.  This seems like a security vulnerability in Puma / Unicorn.

> This is a separate issue from HTTP header injection and depends on how the server handles the value of \r.

I'm not sure exactly which servers are vulnerable (this is too confusing for me 😔), but whatever handles generating the response page shouldn't allow `\r` at the beginning of the href like that.

So [this](https://github.com/rails/rails/blob/master/actionpack/lib/action_dispatch/middleware/actionable_exceptions.rb#L30) needs to check that `location` is a url (http or https).

I don't think we need to set the security policy for the redirect page if we prevent the `javascript:` location from the href.

How does this patch look?

```diff
diff --git a/actionpack/lib/action_dispatch/middleware/actionable_exceptions.rb b/actionpack/lib/action_dispatch/middleware/actionable_exceptions.rb
index 266fd92ce9..1593ca22d0 100644
--- a/actionpack/lib/action_dispatch/middleware/actionable_exceptions.rb
+++ b/actionpack/lib/action_dispatch/middleware/actionable_exceptions.rb
@@ -1,6 +1,7 @@
 # frozen_string_literal: true
 
 require "erb"
+require "uri"
 require "action_dispatch/http/request"
 require "active_support/actionable_error"
 
@@ -27,7 +28,13 @@ def actionable_request?(request)
       end
 
       def redirect_to(location)
-        body = "<html><body>You are being <a href=\"#{ERB::Util.unwrapped_html_escape(location)}\">redirected</a>.</body></html>"
+        uri = URI.parse location
+
+        if uri.relative? || uri.scheme == "http" || uri.scheme == "https"
+          body = "<html><body>You are being <a href=\"#{ERB::Util.unwrapped_html_escape(location)}\">redirected</a>.</body></html>"
+        else
+          return [400, {"Content-Type" => "text/plain"}, ["Invalid redirection URI"]]
+        end
 
         [302, {
           "Content-Type" => "text/html; charset=#{Response.default_charset}",
```

I don't think we need to fix the open redirect as a security issue (maybe we can fix it on the public tracker), but this does seem like a security issue we need to fix.
- **Report Triaged**
- **2020-09-03** @ooooooo_q: @tenderlove 
I confirmed patch. it seems there is no problem.

I have confirmed that there are XSS-enabled services using a version of Rails 6.0.3.1.
Would it be better to report XSS to the service after the patch for that fix was announced?
- **Report Resolved**
- **2020-10-24** @ooooooo_q: Hi @jack_mccracken,

Will it still take time to decision the bounty?

Regarding the contents of the release, Is it intentional that it is not disclosed that XSS is possible even in production mode below 6.0.3.2?
If not, I think it's better to publish the information somewhere.
From the text at the time of release of 6.0.3.2, 6.0.3.3, 6.0.3.4, I think that some users will delay the release by judging that there is no significant impact.
(Actually, there is a version of Gitlab that still uses 6.0.3.1)
- **Agreed On Going Public**
- **2020-12-20** @ooooooo_q: I added the rest to the issue on github.
https://github.com/rails/rails/issues/40892
- **Bounty Awarded**
- **Report Became Public**
