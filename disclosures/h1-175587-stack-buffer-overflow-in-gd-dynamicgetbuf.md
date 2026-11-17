---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/memory-corruption-generic
  - env/web
substate: "resolved"
weakness: "Memory Corruption - Generic"
enriched: true
date: 2019-11-12
submitted: 2016-10-13T12:19:33.057Z
bounty_usd: 1500
votes: 1
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "libnex"
source: "https://hackerone.com/reports/175587"
title: "Stack Buffer Overflow in GD dynamicGetbuf"
---
# Stack Buffer Overflow in GD dynamicGetbuf

> **Severity:** High | **Bounty:** 1,500 USD | **Votes:** 1 | **Program:** Internet Bug Bounty | **Disclosed:** 2019-11-12

- Report: [https://hackerone.com/reports/175587](https://hackerone.com/reports/175587)
- CWE: Memory Corruption - Generic
- Submitted: 2016-10-13T12:19:33.057Z

## Timeline

- **Report Filed**
- **2016-10-18** @libnex: Just an update that this has been assigned CVE-2016-8670

This issue has been marked as "grave" by Debian:
https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=840805
- **2016-11-14** @libnex: Patch also accepted for upstream libgd: 
https://github.com/libgd/libgd/commit/53110871935244816bbb9d131da0bccff734bfe9
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
