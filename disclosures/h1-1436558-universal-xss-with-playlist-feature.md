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
date: 2023-06-22
submitted: 2021-12-27T10:44:49.676Z
bounty_usd: null
votes: 27
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "nishimunea"
source: "https://hackerone.com/reports/1436558"
title: "Universal XSS with Playlist feature"
---
# Universal XSS with Playlist feature

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 27 | **Program:** Brave Software | **Disclosed:** 2023-06-22

- Report: [https://hackerone.com/reports/1436558](https://hackerone.com/reports/1436558)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-12-27T10:44:49.676Z

## Timeline

- **Report Filed**
- **2021-12-28** @diracdeltas: candidate fix: https://github.com/brave/brave-ios/pull/4776/files

also note we are moving to native sandboxing which will hopefully prevent most of these issues: https://github.com/brave/brave-ios/pull/4753
- **Report Resolved**
- **Bounty Awarded**
- **2023-06-22** @nishimunea: Hello! Could you make this bug ticket accessible to the public?
As time has passed since the fix and this product is now already secure, I'd like to make this hacktivity details available for anyone to reference.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
