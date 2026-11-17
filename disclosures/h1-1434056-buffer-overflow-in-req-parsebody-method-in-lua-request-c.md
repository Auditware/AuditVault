---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/heap-overflow
  - env/web
substate: "resolved"
weakness: "Heap Overflow"
enriched: true
date: 2022-01-04
submitted: 2021-12-22T13:20:52.665Z
bounty_usd: null
votes: 36
cve: "CVE-2021-44790"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "chamal"
source: "https://hackerone.com/reports/1434056"
title: "Buffer overflow in req_parsebody method in lua_request.c"
---
# Buffer overflow in req_parsebody method in lua_request.c

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 36 | **Program:** Internet Bug Bounty | **Disclosed:** 2022-01-04

- Report: [https://hackerone.com/reports/1434056](https://hackerone.com/reports/1434056)
- CWE: Heap Overflow | CVE: CVE-2021-44790
- Submitted: 2021-12-22T13:20:52.665Z

## Report summary

A carefully crafted request body can cause a buffer overflow in the mod_lua multipart parser (r:parsebody() called from Lua scripts).

The Apache httpd team is not aware of an exploit for the vulnerability though it might be possible to craft one.

This issue affects Apache HTTP Server 2.4.51 and earlier.

Acknowledgements: Chamal

Reported to security team: 2021-12-07
Fixed by r1896039 in 2.4.x: 2021-12-16
Update 2.4.52 released: 2021-12-20
Affects: <=2.4.51

https://httpd.apache.org/security/vulnerabilities_24.html

## Timeline

- **Report Filed**
- **2022-01-03** @chamal: Please triage this bug.
- **Cve Id Added**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2022-01-04** @chamal: Hi @kunderkoffler, Thanks a lot for the bounty.
- **Agreed On Going Public**
- **Report Became Public**
