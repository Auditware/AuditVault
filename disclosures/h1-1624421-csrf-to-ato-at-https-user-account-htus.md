---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
  - vuln/csrf
  - impact/account-takeover
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2023-01-06
submitted: 2022-07-04T14:14:29.195Z
bounty_usd: 500
votes: 16
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "pwn33d"
source: "https://hackerone.com/reports/1624421"
title: "CSRF to ATO at https://█████/user/account [HtUS]"
---
# CSRF to ATO at https://█████/user/account [HtUS]

> **Severity:** High | **Bounty:** 500 USD | **Votes:** 16 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-01-06

- Report: [https://hackerone.com/reports/1624421](https://hackerone.com/reports/1624421)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2022-07-04T14:14:29.195Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

hello dod security team today while i was doing pentest on your scope
i came across
https://████████/user/account
so i register and after that tried to edit my data and the data was in json request
so i simple change content-type to
content-type application/x-www-form-urlencoded
and the data was change
and in the next step i create html file 
to edit users data with 
0 click 
which allow me to change victim email and leads to account takeover
check my html poc file and video

## Impact

account takeover

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2022-07-05** @h1_analyst_juan: This report is not eligible for bounty, as per the program policy. It will also be cloned into the DoD program as part of tracking.
- **2022-07-05** @pwn33d: Hi @menco how can csrf to account takeover to be marked as medium?
At least it would be high in any other program
Btw i would love to know cvss calculator severity!
- **2022-07-05** @pwn33d: Btw using this csrf i can change victim data and 'i guess i can change even password'!
- **Report Needs More Info**
- **Report New**
- **2022-07-05** @pwn33d: sorry i mean this video
- **2022-07-05** @pwn33d: i tried poc in chrome and firefox and poc works in all 2 browsers check those 2 videos one in firefox and other in chrome!
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
