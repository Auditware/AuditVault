---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
  - stack/ruby
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2021-04-21
submitted: 2021-04-18T08:08:14.730Z
bounty_usd: null
votes: 49
cve: []
program: "[[programs/homebrew|Homebrew]]"
reporter: "ryotak"
source: "https://hackerone.com/reports/1167608"
title: "Broken parsing of Git diff allows an attacker to inject arbitrary Ruby scripts to Casks on official taps"
---
# Broken parsing of Git diff allows an attacker to inject arbitrary Ruby scripts to Casks on official taps

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 49 | **Program:** Homebrew | **Disclosed:** 2021-04-21

- Report: [https://hackerone.com/reports/1167608](https://hackerone.com/reports/1167608)
- CWE: N/A
- Submitted: 2021-04-18T08:08:14.730Z

## Report summary

https://brew.sh/2021/04/21/security-incident-disclosure/

https://blog.ryotak.me/post/homebrew-security-incident-en/

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Description
Due to improper parsing of Git diff in [Homebrew/actions/review-cask-pr](https://github.com/Homebrew/actions/tree/336bd2aae5314f8c17c66a8319adeba99f13c093/review-cask-pr), it's possible to confuse parser to ignore additional lines.
Which leads injection of malicious Ruby scripts.

## Root cause
`review-cask-pr` uses the git diff file to check if the pull request is "simple" enough to automatically merge it.
To parse the git diff file, it uses [`git_diff`](https://github.com/anolson/git_diff/) gem with some modifications.
https://github.com/Homebrew/actions/blob/master/review-cask-pr/git_diff_extension.rb
Since `git_diff` has a small bug that allows a crafted diff file to confuse additions as a `a_path`, it's possible to confuse `review-cask-pr`.
https://github.com/anolson/git_diff/blob/21913c2a51661449a7250cc3a5ba5f5f4f128959/lib/git_diff/file.rb#L61-L62

## Steps to reproduce
1. Fork [Homebrew/homebrew-cask](https://github.com/Homebrew/homebrew-cask).
2. Modify a cask file to add following lines:
```ruby
++ "b/#{puts 'Going to report it - RyotaK (https://hackeorne.com/ryotak)';b = 1;Casks = 1;iterm2 = {};iterm2.define_singleton_method(:rb) do 1 end}"
++ b/Casks/iterm2.rb
```
3. Open a pull request on [Homebrew/homebrew-cask](https://github.com/Homebrew/homebrew-cask).
4. BrewTestBot will approve these changes.

https://github.com/Homebrew/homebrew-cask/pull/104191

## Impact

Injected script will be evaluated once someone installed the cask, which may allows remote code execution.

## Timeline

- **Report Filed**
- **2021-04-18** @ryotak: After investigating for a while, I noticed that BrewTestBot won't merge pull requests unless all CIs are successful.
As a CI runs Rubocop, the payload above didn't work, and I used the following payload instead:
```ruby
++ "b/#{puts 'Going to report it - RyotaK (https://hackerone.com/ryotak)';b = 1;Casks = 1;iterm2 = {};iterm2.define_singleton_method(:rb) do 1 end; }" # rubocop:disable all
++ "b/" if # rubocop:disable all
++ b/Casks/iterm2.rb
```

(Please delete it as soon as possible; I can't revert back it with this vulnerability.)
{F1269634}
- **Report Resolved**
- **2021-04-18** @ryotak: Hello @mikemcquaid,
Thank you for your response!

Let's talk about this in next workday! (Maybe tomorrow?)

Best regards,
RyotaK
- **2021-04-19** @mikemcquaid: Hi @ryotak! We're still deciding the best way to handle disclosure. The automerge action has been reenabled and review-cask-pr disabled. Do you have a blog post you're planning on writing? You may wish to start yours before we start ours and we'll each review the other. This may take us a few days, I hope that's OK. Thanks!
- **2021-04-19** @ryotak: Hello @mikemcquaid,
Thank you for the update!

> Do you have a blog post you're planning on writing? You may wish to start yours before we start ours and we'll each review the other. 

Yes, I have a plan to write an article about this!
However, as I'm not good at English, I'm going to write the article in Japanese, and then translate it to English.
Because of this, it may take longer time than usual. So it would be great if we can write it in parallel and then each review the other.
Hopefully, I can finish both (Japanese/English) articles this week.

Best regards,
RyotaK
- **2021-04-19** @mikemcquaid: Sounds good, thanks! Here's the last security disclosure we made: https://brew.sh/2018/08/05/security-incident-disclosure/
- **2021-04-19** @ryotak: Thank you for sharing the link!
I think the details such as the background of the incident and the range of impact will be covered in the blog post on brew.sh, so in my blog I will mainly explain the process up to the discovery of the vulnerability and the technical details.
- **2021-04-19** @mikemcquaid: https://github.com/Homebrew/brew.sh/pull/632 is the PR open with the draft of this post, let us know (inline or here) what you think. We can hold off publishing until your post is ready if desired.
- **2021-04-20** @ryotak: Thank you for that pull request! I sent few reviews on the pull request.
Currently, I've finished Japanese part of the article, and translating it to English. I think I can finish it tomorrow. (in JST.)
- **2021-04-20** @mikemcquaid: Perfect, thanks!
- **2021-04-20** @ryotak: As I'm currently blocking the disclosure, I did some hard works and finished the translations.
I've attached the following files:
████████: Rendered article with Chrome (English)
█████: Rendered article with Chrome (Japanese)
██████: Source markdown of article (English)
███████: Source markdown of article (Japanese)
Please check it and let me know if I should change anything!

Best regards,
RyotaK
- **2021-04-20** @mikemcquaid: Thanks, write-up looks good! Do you have a link you'd like us to use in our post?
- **2021-04-20** @ryotak: Thank you for reviewing it!
It will be posted in https://blog.ryotak.me/post/homebrew-security-incident-en/ for English one and https://blog.ryotak.me/post/homebrew-security-incident/ for Japanese one.
I think linking English one would be good for most readers.

Also, I think we should file an issue on [git_diff](https://github.com/anolson/git_diff) repository. Should I do this or can you do this?
- **2021-04-21** @mikemcquaid: https://github.com/Homebrew/brew.sh/pull/632 is ready to ship. Let us know when your post is live and we'll ship ours too.

> Also, I think we should file an issue on git_diff repository. Should I do this or can you do this?

If you can do that it'd be ideal, thanks!
- **2021-04-21** @ryotak: Hello @mikemcquaid,

> https://github.com/Homebrew/brew.sh/pull/632 is ready to ship. Let us know when your post is live and we'll ship ours too.

I've finished the preparations for blog post, and I can now post it.
How about noon in CEST (`19 pm` in JST, 25 minutes from now)?

> If you can do that it'd be ideal, thanks!

I've filed an issue on the repository: https://github.com/anolson/git_diff/issues/18

Best regards,
RyotaK
- **2021-04-21** @mikemcquaid: I'm afraid I'm running with a friend at your proposed time! I could either do 1 hour later or before then?
- **2021-04-21** @ryotak: No problems!
How about `13 pm` in CEST (`20 pm` in JST, 1 hour 20 minutes from now)?
- **2021-04-21** @mikemcquaid: Perfect!
- **2021-04-21** @ryotak: Okay, thank you for confirming it!
- **2021-04-21** @mikemcquaid: Post live in https://brew.sh/2021/04/21/security-incident-disclosure/
- **Agreed On Going Public**
- **2021-04-21** @ryotak: Can you redact ██████ and ██████ as it contains path information?
- **2021-04-21** @mikemcquaid: > The automerge action has been reenabled and review-cask-pr disabled.

Just to be explicit: the action was reenabled but it remained disabled at the organisation level so it has never been run again since your initial disabling. The code has now been removed again.
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
