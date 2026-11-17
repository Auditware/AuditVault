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
date: 2018-04-10
submitted: 2017-11-26T07:54:43.228Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/unikrn|Unikrn]]"
reporter: "tolo7010"
source: "https://hackerone.com/reports/293016"
title: "CSRF log victim into the attacker account"
---
# CSRF log victim into the attacker account

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 17 | **Program:** Unikrn | **Disclosed:** 2018-04-10

- Report: [https://hackerone.com/reports/293016](https://hackerone.com/reports/293016)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2017-11-26T07:54:43.228Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2017-12-11** @tolo7010: any updates on this?

Regards,
- **2017-12-19** @tolo7010: How's the current status update?

Regardz,
- **2017-12-20** @decrypted: We will look into it next year.
- **2017-12-22** @tolo7010: Thanks, my recommendation here is to provide a new server generated session_id only to non-logged user rather than taking POST input as a set-cookie parameter
- **Report Severity Updated**
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **Bounty Awarded**
- **2018-01-11** @tolo7010: Thanks for the bounty!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
