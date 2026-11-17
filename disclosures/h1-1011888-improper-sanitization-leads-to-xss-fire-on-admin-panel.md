---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2021-08-03
submitted: 2020-10-19T16:07:22.235Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/informatica|Informatica]]"
reporter: "montypythin"
source: "https://hackerone.com/reports/1011888"
title: "Improper Sanitization leads to XSS Fire on admin panel"
---
# Improper Sanitization leads to XSS Fire on admin panel

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Informatica | **Disclosed:** 2021-08-03

- Report: [https://hackerone.com/reports/1011888](https://hackerone.com/reports/1011888)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-10-19T16:07:22.235Z

## Timeline

- **Report Filed**
- **2020-10-20** @montypythin: A new domain is also saying my payload is firing from what looks like the same issue, so I am appending it here.
https://█████████/admin/OrgUnitList.aspx

Here is the report information
███

IP ADDRESS of affected user = █████████
- **Report Triaged**
- **2021-07-30** @akilac: @montypythin We have implemented a fix by eliminating special characters int he input field. Woould you mind checking it for us?
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2021-10-21** @aks_infa: Hi @montypythin  We have updated our "Hall of Fame" page.
You can find your name here: https://www.informatica.com/trust-center/security-researcher-hall-of-fame.html
Thank you again for your effort.
