---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2026-06-20
submitted: 2026-05-09T18:25:56.181Z
bounty_usd: null
votes: 126
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "farr"
source: "https://hackerone.com/reports/3723458"
title: "1-Click Account Takeover via Open Redirect through Regex Bypass in Domain Validation"
---
# 1-Click Account Takeover via Open Redirect through Regex Bypass in Domain Validation

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 126 | **Program:** Khan Academy | **Disclosed:** 2026-06-20

- Report: [https://hackerone.com/reports/3723458](https://hackerone.com/reports/3723458)
- CWE: Improper Access Control - Generic
- Submitted: 2026-05-09T18:25:56.181Z

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **2026-05-10** @farr: Hey there! 

Forgot to mention, even though it is sort of implicit. The victim must be authenticated to the attack be successful,  at least on 1-click : )
- **Report Triaged**
- **2026-05-12** @farr: Hey @jeremyspangler,

Thank you once again for the kind words. I confirm, I have the badge now! 

If there is anything I can do to help, let me know!
- **Report Resolved**
- **2026-05-19** @farr: Hey @jeremyspangler,

I hope you are well. Just checked and is indeed fixed. I can see the regex now is correct:

Before: `/(^|\.)(khanacademy\.(org|dev|test|local)|kastatic\.org|.*-6fmjyrz2lq-uc.a.run.app)$/`
After:  `/(^|\.)(khanacademy\.(org|dev|test|local)|kastatic\.org|.*-6fmjyrz2lq-uc\.a\.run\.app)$/`

Also noted the .js.map files are being blocked (403), which is great. 

One last thing, would it be possible to disclose this report, with proper redaction?
- **2026-05-20** @jeremyspangler: Hi @farr ,

Yes, [there should be a control toward the bottom of the report for you to request the disclosure](https://docs.hackerone.com/en/articles/8475358-requesting-disclosure#h_2cc0ce5d73). When requested, we'll let the redacted report get disclosed  by default after a 30-day waiting period.
- **Agreed On Going Public**
- **Report Became Public**
