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
date: 2019-06-10
submitted: 2017-07-13T05:57:02.081Z
bounty_usd: 1500
votes: 207
cve: []
program: "[[programs/upserve|Upserve ]]"
reporter: "cache-money"
source: "https://hackerone.com/reports/249131"
title: "Ability to create own account UUID leads to stored XSS"
---
# Ability to create own account UUID leads to stored XSS

> **Severity:** High | **Bounty:** 1,500 USD | **Votes:** 207 | **Program:** Upserve  | **Disclosed:** 2019-06-10

- Report: [https://hackerone.com/reports/249131](https://hackerone.com/reports/249131)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2017-07-13T05:57:02.081Z

## Report summary

The server allows the client to create and submit its own UUID which was not validated. This resulted in the ability to create a crafted XSS payload.

## Timeline

- **Report Filed**
- **2017-07-13** @cache-money: Also since I used that UUID you probably won't be able to replicate with that request. You can try this one I just created to the same file: `//is.gd/Xu8ZR8`
- **Report Needs More Info**
- **Report New**
- **2017-07-14** @joystick: Hi,

Thank you for the additional information. We were able to reproduce the issue.

Regards.
- **Report Triaged**
- **Bounty Awarded**
- **2017-07-20** @cache-money: Thanks team :)
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
