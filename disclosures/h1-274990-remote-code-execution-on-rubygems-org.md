---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/deserialization-of-untrusted-data
  - env/web
  - vuln/code-injection
  - vuln/deserialization
  - impact/rce
substate: "resolved"
weakness: "Deserialization of Untrusted Data"
enriched: true
body: true
date: 2017-11-09
submitted: 2017-10-06T08:49:52.800Z
bounty_usd: 1500
votes: 51
cve: "CVE-2017-0903"
program: "[[programs/rubygems|RubyGems]]"
reporter: "max"
source: "https://hackerone.com/reports/274990"
title: "Remote code execution on rubygems.org"
---
# Remote code execution on rubygems.org

> **Severity:** Critical | **Bounty:** 1,500 USD | **Votes:** 51 | **Program:** RubyGems | **Disclosed:** 2017-11-09

- Report: [https://hackerone.com/reports/274990](https://hackerone.com/reports/274990)
- CWE: Deserialization of Untrusted Data | CVE: CVE-2017-0903
- Submitted: 2017-10-06T08:49:52.800Z

## Report summary

An unsafe object deserialization vulnerability was found in RubyGems. Unfortunately this vulnerability can be used as a way to escalate to a remote code execution exploit.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

When parsing a gem POSTed to the `/api/v1/gems` endpoint, the rubygems.org application immediately calls `Gem::Package.new(body).spec` inside `app/models/pusher.rb`. The authors of the application correctly observed that parsing untrusted YAML is dangerous (since it can serialize more or less arbitrary objects), so they monkey-patched the spec parser to use `Psych.safe_load` set from `config/initializers/forbidden_yaml.rb`.

However, `YAML.load` is called directly when parsing the gem's checksum file in `Gem::Package#read_checksums`. Using classes accessible within the application, I was able to turn this into a call to `Marshal.load` on attacker-controlled data. From there, I was able to use known Marshal exploitation techniques to achieve code execution on the server (I'm omitting some details here for brevity so that I can submit this report right away).

A proof of concept, `poc.gem`, is attached. Run the exploit with the following command:
`cat poc.gem | curl -H 'Content-Type: application/gzip' --data-binary @- -H 'Authorization: █████' https://rubygems.org/api/v1/gems`

I ran the attached PoC twice. It just does a `wget` to my server.

Please let me know if I should clarify anything! Thanks for running this program.

## Timeline

- **Report Filed**
- **2017-10-06** @RubyGems: Thanks for submitting this report to RubyGems. Our team will review and investigate the issue. Please note that only issues in the rubygems library are eligible for our bug bounty program.
- **2017-10-06** @max: Attached is the `checksums.yaml` contained within that gem.
- **Report Title Updated**
- **2017-10-06** @max: Ugh, HackerOne really logs an event when I change the title? Well now I just look silly...
- **Report Triaged**
- **2017-10-06** @max: The `wget` didn’t download anything; I was just listening with netcat on my server (`████████`) to make sure the payload executed. The `wget` then failed and fell through once I closed the connection from the server’s side. I’m not sure what my IP address was, but all of my requests were made with the API key from the first post.
- **2017-10-06** @max: (I should add that you'll see some failed attempts at executing the payload from before I discovered I needed `Content-Type: application/gzip` on the `curl` command. None of those ran because of a weird UTF-8 sanitation thing happening server side.)
- **2017-10-06** @dwradcliffe: Hey max,
We have deployed (actually several hours ago) a patch (included below). Could you try your gem push again and see if it has the same behavior or not?

```
module Gem
  class Package
    def read_checksums gem
      Gem.load_yaml

      [@checksums](/checksums) = gem.seek 'checksums.yaml.gz' do |entry|
        Zlib::GzipReader.wrap entry do |gz_io|
          Psych.safe_load(gz_io.read, Gem::Specification::WHITELISTED_CLASSES, Gem::Specification::WHITELISTED_SYMBOLS, true)
        end
      end
    end
  end
end
```
- **2017-10-06** @max: Hm, I just ran the same exploit again and there was still a request made to my server.
- **2017-10-06** @max: If you would like to test the exploit with your own payload, you can run `ruby generate.rb payload.rb`, where `generate.rb` is attached (adapted from an old rails exploit [here](https://github.com/charliesome/charlie.bz/blob/master/posts/rails-3.2.10-remote-code-execution.md)), and `payload.rb` contains the ruby code you would like to execute. That will output the base64 payload that you insert into the `checksums.yaml` file from my second comment.
- **2017-10-06** @dwradcliffe: Thanks so much for that generator, I was able to make my own test gem to debug with. I have deployed another change and confirmed with my poc gem that this is no longer vulnerable. Feel free to confirm this yourself. Our team is reviewing the situation and we will get back to you soon with next steps.
- **2017-10-06** @tenderlove: @max how would you like to be credited in the CVE?
- **2017-10-06** @max: Yup, confirmed that everything looks fixed from here!

As for CVE credits, please put my name: Max Justicz. If there is a spot for a URL, could it please go to my Mastodon profile [here](https://mastodon.mit.edu/@maxj)?

Thanks for the really quick response! Is it cool if I make a blog post about this?
- **2017-10-06** @tenderlove: @max we can put whatever you want in the credits, so I'll add the link.  😊

It's fine to blog about this, but do you mind waiting until after we've announced the CVE?  The plan right now is to patch RubyGems itself so that other folks who are running systems similar to RubyGems.org will be safe as well.  We also need to make some checks on the RubyGems.org back end to make sure nobody has exploited this and used it to alter existing gems.

I think it will only take 24hrs or so to get the CVE (my CVE person might be off for the weekend, so might be Monday), and I'm not sure how long it will take to verify gems (I will help with that this weekend).  I don't want to commit to a specific date, but I think it should be wrapped up early next week.
- **2017-10-06** @max: Sounds good to me! Patching RubyGems definitely seems like the best way to go.
- **Report Resolved**
- **2017-10-10** @max: Nice, thanks for the quick response! Here's the blog post: https://justi.cz/security/2017/10/07/rubygems-org-rce.html and the post on hacker news: https://news.ycombinator.com/item?id=15439308
- **2017-10-10** @max: Oh - I should mention that even though the date on the post says October 7, I only put this online today. I wrote it on the 7th.
- **Bounty Awarded**
- **Agreed On Going Public**
- **2017-10-11** @max: Thank you for the bounty!

I'm totally cool with making this public, but I'd like to redact the entries containing information about my server, as well as that API key. Could we please redact the following before disclosing publicly?

 1. API key from the first post (I've reset it anyway, but still seems bad to leave it up)
 2. Attachment from the first post
 3. Attachment from the third post
 4. URL from the sixth post
 5. This post

Thank you,

Max
- **2017-10-16** @max: Hi all, just wanted to give a ping on the above. Sorry to bother you.
- **2017-10-26** @max: Friendly bump o-o;
- **2017-10-26** @indirect: hi max, sorry we haven't gotten back to you yet. we aren't able to redact the ticket ourselves, so we submitted a support request to hacker one asking them to help us out, 14 days ago. as soon as they get back to us, we'll publish the report.
- **2017-10-26** @max: Ah gotcha. Thanks for the update.
- **2017-11-05** @max: Could you please bump your h1 ticket? Sorry, just nervous about this getting auto disclosed before that happens.
- **2017-11-06** @indirect: Ugh, yep, will do. Sorry this is turning into such a hassle.
- **2017-11-08** @indirect: @max done, attachments and sensitive information redacted. Unfortunately we don't have the ability to redact entire posts, but if there is anything else that you feel needs to be removed let us know. Thanks!
- **2017-11-08** @max: Thank you!
- **Agreed On Going Public**
- **Report Became Public**
