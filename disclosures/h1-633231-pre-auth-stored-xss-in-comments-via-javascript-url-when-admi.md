---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2020-08-18
submitted: 2019-07-01T15:53:12.245Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "simonscannell"
source: "https://hackerone.com/reports/633231"
title: "pre-auth Stored XSS in comments via javascript: url when administrator edits user supplied comment"
---
# pre-auth Stored XSS in comments via javascript: url when administrator edits user supplied comment

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** WordPress | **Disclosed:** 2020-08-18

- Report: [https://hackerone.com/reports/633231](https://hackerone.com/reports/633231)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-07-01T15:53:12.245Z

## Timeline

- **Report Filed**
- **2019-07-09** @whyisjake: Hey Simon,

Interesting POC you have provided here. I'm sharing with the team, and we will be evaluating further. We will be in touch.

Cheers,

@whyisjake
- **Report Triaged**
- **2019-08-12** @whyisjake: Hey there @simonscannell,

I think we have a fix for this issue and were wondering if you could confirm with this patch. 

Thanks!

@whyisjake
- **2019-08-13** @simonscannell: Hi Jake,

Sorry for my late reply. The patch seems effective!
- **2019-08-27** @whyisjake: Hi @simonscannell,

We are looking to release the fix for this issue too, how would you like to be credited?

Cheers,

@whyisjake
- **2019-08-28** @simonscannell: Hi Jake,

Sorry for late response on my part, I had no signal the last couple days. If you could say "Simon Scannell of both RIPS Technologies" on bothbissues, that would be amazing, thanks!

Best,
Simon
- **2019-09-06** @whyisjake: Hey @simonscannell,

Thanks for your work in this security disclosure. As you have seen, we released 5.2.3 with a fix for this issue.

https://wordpress.org/news/2019/09/wordpress-5-2-3-security-and-maintenance-release/

We would like to thank you for your contributions. This is being moved over to the bounty queue.

Cheers,

@whyisjake
- **Report Resolved**
- **Bounty Awarded**
- **2019-09-08** @simonscannell: Thank you!
- **Agreed On Going Public**
- **Report Became Public**
