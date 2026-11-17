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
submitted: 2017-09-28T04:08:10.330Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/unikrn|Unikrn]]"
reporter: "tolo7010"
source: "https://hackerone.com/reports/272588"
title: "CSRF in Raffles Ticket Purchasing"
---
# CSRF in Raffles Ticket Purchasing

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** Unikrn | **Disclosed:** 2018-04-10

- Report: [https://hackerone.com/reports/272588](https://hackerone.com/reports/272588)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2017-09-28T04:08:10.330Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2017-09-28** @tolo7010: I left it blank intentionally, while many endpoints raise "no_session" error if no session / invalid session specified. This endpoint ignores it, takes cookie as authentication, and the cookie get to the server when visited.
- **2017-09-30** @tolo7010: Please let me know if any updates available, thanks.

Regards.
- **Report Resolved**
- **2017-10-05** @tolo7010: the reproduction doesnot work anymore. fixed confirmed
- **Bounty Awarded**
- **2017-10-05** @tolo7010: thanks for the bounty!

Regards
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
