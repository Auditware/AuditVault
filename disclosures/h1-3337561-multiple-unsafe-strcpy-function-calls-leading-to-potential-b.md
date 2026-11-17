---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/classic-buffer-overflow
  - env/web
substate: "not-applicable"
weakness: "Classic Buffer Overflow"
enriched: true
date: 2025-09-14
submitted: 2025-09-13T18:31:48.770Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/curl|curl]]"
reporter: "anony_gaku"
source: "https://hackerone.com/reports/3337561"
title: "Multiple Unsafe strcpy() Function Calls Leading to Potential Buffer Overflow Vulnerabilities in cURL 8.16.1-DEV"
---
# Multiple Unsafe strcpy() Function Calls Leading to Potential Buffer Overflow Vulnerabilities in cURL 8.16.1-DEV

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** curl | **Disclosed:** 2025-09-14

- Report: [https://hackerone.com/reports/3337561](https://hackerone.com/reports/3337561)
- CWE: Classic Buffer Overflow
- Submitted: 2025-09-13T18:31:48.770Z

## Timeline

- **Report Filed**
- **2025-09-13** @dfandrich: All three alleged unsafe strcpy() calls include length checks immediately preceding them to avoid overwriting buffers. The "Results" sections in your report confirm this, showing no Valgrind issues and only that strcpy() calls exist in the code. Are you saying these length checks are insufficient? Did this "comprehensive" audit including manually verifying that buffer overflows are actually possible?
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
