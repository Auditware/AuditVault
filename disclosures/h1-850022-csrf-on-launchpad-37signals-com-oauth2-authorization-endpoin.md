---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
date: 2020-10-30
submitted: 2020-04-14T23:22:27.499Z
bounty_usd: null
votes: 44
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "carbon61"
source: "https://hackerone.com/reports/850022"
title: "CSRF on launchpad.37signals.com OAuth2 authorization endpoint"
---
# CSRF on launchpad.37signals.com OAuth2 authorization endpoint

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 44 | **Program:** Basecamp | **Disclosed:** 2020-10-30

- Report: [https://hackerone.com/reports/850022](https://hackerone.com/reports/850022)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2020-04-14T23:22:27.499Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2020-04-15** @carbon61: i will check it again and try to generate another Poc if you could not  reproduce it
- **2020-04-15** @carbon61: i'm sorry maybe i reported this one too fast  , i will investigate more and let you know
- **2020-04-15** @carbon61: i just tested it with  different accounts in basecamphq.com and 3.basecamp.com and i can get the authorization code from my redirect_uri using the csrf form and i was able to exchange it for an access token
- **Report Severity Updated**
- **Report Triaged**
- **2020-04-17** @carbon61: OK thanks .
- **2020-04-20** @carbon61: any updates about the bounty ?
- **2020-04-21** @rosa: Hi @carbon61, sorry for the delay! We'll award a bounty later today, still discussing the amount between the team. We'll be also deploying a fix shortly. 

Thank you again, this was another great find.
- **Bounty Awarded**
- **2020-04-21** @rosa: Hi again @carbon61! We've just sent a bounty and also deployed a fix for this issue. Would you mind verifying whether you can still reproduce it? 

Thank you!
- **2020-04-22** @carbon61: the fix looks good, and thank you very much for the bounty.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
