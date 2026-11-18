---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - stack/node
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: none
date: 2024-03-16
submitted: 2023-09-18T13:59:11.685Z
bounty_usd: null
votes: 24
cve: "CVE-2024-22017"
program: "[[programs/nodejs|Node.js]]"
reporter: "valette"
source: "https://hackerone.com/reports/2170226"
title: "setuid() does not drop all privileges due to io_uring"
---
# setuid() does not drop all privileges due to io_uring

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 24 | **Program:** Node.js | **Disclosed:** 2024-03-16

- Report: [https://hackerone.com/reports/2170226](https://hackerone.com/reports/2170226)
- CWE: Privilege Escalation | CVE: CVE-2024-22017
- Submitted: 2023-09-18T13:59:11.685Z

## Timeline

- **Draft Started**
- **Report Filed**
- **2023-09-18** @tniessen: 
- **Report Title Updated**
- **2023-09-18** @tniessen: 
- **2023-09-18** @tniessen: 
- **External User Joined**
- **2023-09-18** @bnoordhuis: 
- **2023-09-19** @tniessen: 
- **2023-09-19** @tniessen: 
- **Report Triaged**
- **Report Title Updated**
- **Report Severity Updated**
- **External User Joined**
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
