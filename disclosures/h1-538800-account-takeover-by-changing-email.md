---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-request-forgery-csrf
  - env/web
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
date: 2019-05-17
submitted: 2019-04-15T19:54:17.948Z
bounty_usd: null
votes: 80
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "tomoh"
source: "https://hackerone.com/reports/538800"
title: "Account takeover by changing email"
---
# Account takeover by changing email

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 80 | **Program:** Khan Academy | **Disclosed:** 2019-05-17

- Report: [https://hackerone.com/reports/538800](https://hackerone.com/reports/538800)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2019-04-15T19:54:17.948Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2019-04-16** @tomoh: Hi @drosile,
Thanks for the fast response! I found this endpoint when testing the "Invite student by email" functionality. There was an option to change the account email after the student signs up. It's not shown to all new accounts, but nonetheless works for all unconfirmed accounts.
- **Report Resolved**
- **2019-04-17** @tomoh: Yes, this is fixed!
- **Agreed On Going Public**
- **Report Became Public**
