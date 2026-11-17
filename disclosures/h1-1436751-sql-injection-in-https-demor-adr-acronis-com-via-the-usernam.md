---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2024-08-28
submitted: 2021-12-27T16:10:36.479Z
bounty_usd: null
votes: 49
cve: []
program: "[[programs/acronis|Acronis]]"
reporter: "mmg"
source: "https://hackerone.com/reports/1436751"
title: "SQL injection in https://demor.adr.acronis.com/ via the username parameter"
---
# SQL injection in https://demor.adr.acronis.com/ via the username parameter

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 49 | **Program:** Acronis | **Disclosed:** 2024-08-28

- Report: [https://hackerone.com/reports/1436751](https://hackerone.com/reports/1436751)
- CWE: SQL Injection
- Submitted: 2021-12-27T16:10:36.479Z

## Timeline

- **Report Filed**
- **2021-12-27** @security-bot: Hi @mmg

Thanks for participating in Acronis bug bounty program!
Our security team usually replies within 1-2 business days.
❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️
🎄&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🦌🦌🦌🦌🦌🦌🦌🦌🦌🛷🎅
Expect longer response times due to winter holidays.

Meanwhile, I'd recommend you to check out our [policy](https://hackerone.com/acronis).
- **Report Duplicate**
- **2022-01-04** @mmg: Dear @iradostev,

Thank you for the update and i wish you a Happy New Year!

Regards
@mmg
- **2022-01-04** @iradostev: Thanks @mmg! Have a wonderful year
We'll be waiting for new reports from you
- **2022-01-04** @mmg: Dear @iradostev,

I have a question about the duplicate report because it seems is not the same as mine...
My injection is in /ng/api/auth/login and the format is JSON based.

Can you please double-check this ?

Thank you!

Regards
@mmg
- **2022-01-04** @mmg: Also, I have noticed that the server's response is different as well...

Regards
@mmg
- **Report Reopened**
- **Report Severity Updated**
- **Report Triaged**
- **2022-01-04** @iradostev: You are right @mmg, the fix for #1360323 does not resolve this issue.
- **2022-01-04** @mmg: Dear @iradostev,

Thank you for double-checking!

Regards
@mmg
- **Bounty Awarded**
- **2022-04-05** @mmg: Thank you for the bounty and have a great day!

Regards
@mmg
- **Report Resolved**
- **2022-04-08** @mmg: Thank you for the update!
Please let me know if I should expect a retest request.

Regards
@mmg
- **Agreed On Going Public**
- **Manually Disclosed**
