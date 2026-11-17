---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/ruby
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2020-07-13
submitted: 2019-03-31T07:25:13.608Z
bounty_usd: 1000
votes: 80
cve: "CVE-2020-8159"
program: "[[programs/rails|Ruby on Rails]]"
reporter: "ooooooo_q"
source: "https://hackerone.com/reports/519220"
title: "File writing by Directory traversal at actionpack-page_caching and RCE by it"
---
# File writing by Directory traversal at actionpack-page_caching and RCE by it

> **Severity:** High | **Bounty:** 1,000 USD | **Votes:** 80 | **Program:** Ruby on Rails | **Disclosed:** 2020-07-13

- Report: [https://hackerone.com/reports/519220](https://hackerone.com/reports/519220)
- CWE: Path Traversal | CVE: CVE-2020-8159
- Submitted: 2019-03-31T07:25:13.608Z

## Timeline

- **Report Filed**
- **2019-03-31** @matthewd: Ughh, nice find!

Looks like this was introduced in https://github.com/rails/rails/commit/d4576673c0c8d39f89e9798ab89b2c475a9f5f85, to fix https://web.archive.org/web/20070303040451/http://dev.rubyonrails.org:80/ticket/1877, care of https://web.archive.org/web/20051112005838/http://typo.leetsoft.com/trac/ticket/249.

> There may be security implications if the encoded URL contains url-encoded ../../../..-type things. I suspect (but have not tested) that the web server will block most, if not all, of these.

😬😬😬
- **2019-05-28** @ooooooo_q: @matthewd Any updates?
- **2019-06-11** @ooooooo_q: @rails Any updates?
- **2019-08-29** @ooooooo_q: @rails Any updates?
- **2019-09-08** @ooooooo_q: Suggestion for correction.

```
--- a/lib/action_controller/caching/pages.rb
+++ b/lib/action_controller/caching/pages.rb
@@ -145,6 +145,7 @@ module ActionController
               name = "/index"
             else
               name = URI.parser.unescape(path.chomp("/"))
+              name = Rack::Utils::clean_path_info(name)
             end

             if File.extname(name).empty?
```
- **2019-10-19** @ooooooo_q: @matthewd @rails
How about the above correction?
- **2019-12-30** @h1_analyst_chanel: Hey @ooooooo_q

Thank you for your heavy patience on this report. I have asked the internal team about this and will get back to you one we have an update.

We apologize for the lack of information to you. 
@chinch1lla
- **2020-04-19** @ooooooo_q: @chinch1lla 
Any updates? Or should I make an issue on Github?
- **2020-04-21** @h1_analyst_jack: I asked for an update. Let's see if they respond.

Thanks and regards,
@golden__retriever
- **Cve Id Added**
- **Report Resolved**
- **2020-05-17** @ooooooo_q: @tenderlove 
hello,
I confirmed it was fixed in 1.2.2.

Is it possible to upgrade the version at rails-contributors?
https://github.com/rails/rails-contributors/blob/master/Gemfile.lock#L28

After confirming that it has been applied, I request a disclose for this report.
- **2020-06-06** @ooooooo_q: I found another attack pattern on https://github.com/rails/rails-contributors

For paths where `(.format)` is supported, it was possible to embed an attack in the format with `..` as `%2e%2e` as follows:

```
curl "http://localhost:3000/faq.%2f%2e%2e%2f%2e%2e%2ftest"
-> test file is generated in root
```
- **Agreed On Going Public**
- **Report Became Public**
- **2020-10-24** @ooooooo_q: @tenderlove 
Is this report within the scope of Rails bounty?
- **Bounty Awarded**
