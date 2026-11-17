---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2023-06-22
submitted: 2021-12-26T06:59:17.690Z
bounty_usd: null
votes: 72
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "nishimunea"
source: "https://hackerone.com/reports/1436142"
title: "New XSS vector in ReaderMode with %READER-TITLE-NONCE%"
---
# New XSS vector in ReaderMode with %READER-TITLE-NONCE%

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 72 | **Program:** Brave Software | **Disclosed:** 2023-06-22

- Report: [https://hackerone.com/reports/1436142](https://hackerone.com/reports/1436142)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2021-12-26T06:59:17.690Z

## Timeline

- **Report Filed**
- **2021-12-26** @diracdeltas: thanks, we are investigating
- **2021-12-26** @diracdeltas: great find. i think https://github.com/brave/brave-ios/pull/4773 should fix this but i will need iOS team to help test that it doesn't break anything. it is a holiday here but i will try to ping them tomorrow.
- **Report Resolved**
- **Bounty Awarded**
- **2023-06-22** @nishimunea: Hello! Could you make this bug ticket accessible to the public?
As time has passed since the fix and this product is now already secure, I'd like to make this hacktivity details available for anyone to reference.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
