---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2018-10-21
submitted: 2018-09-20T17:04:29.167Z
bounty_usd: null
votes: 54
cve: []
program: "[[programs/chaturbate|Chaturbate]]"
reporter: "robin0oklay"
source: "https://hackerone.com/reports/411865"
title: "Blind SSRF at https://chaturbate.com/notifications/update_push/"
---
# Blind SSRF at https://chaturbate.com/notifications/update_push/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 54 | **Program:** Chaturbate | **Disclosed:** 2018-10-21

- Report: [https://hackerone.com/reports/411865](https://hackerone.com/reports/411865)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2018-09-20T17:04:29.167Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Title Updated**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2018-09-21** @robin0oklay: Hey can you also please hide "http:\/\/████" from the request body and also http://██████████████ the confirmation link.
- **2018-09-21** @williammmllc: @robin0oklay no problem, this is done.
- **Report Became Public**
