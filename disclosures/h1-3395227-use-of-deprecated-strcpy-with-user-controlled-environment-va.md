---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "not-applicable"
weakness: null
enriched: true
date: 2025-10-22
submitted: 2025-10-22T21:30:38.651Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/curl|curl]]"
reporter: "idris_0x"
source: "https://hackerone.com/reports/3395227"
title: "Use of Deprecated strcpy() with User-Controlled Environment Variable in Memory Debug Initialization"
---
# Use of Deprecated strcpy() with User-Controlled Environment Variable in Memory Debug Initialization

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 17 | **Program:** curl | **Disclosed:** 2025-10-22

- Report: [https://hackerone.com/reports/3395227](https://hackerone.com/reports/3395227)
- CWE: N/A
- Submitted: 2025-10-22T21:30:38.651Z

## Timeline

- **Report Filed**
- **2025-10-22** @bagder: Again, please point out the EXACT line in the source code where your claimed vulnerability exists. I believe you have been mislead by the AI you asked to get this report.
- **2025-10-22** @bagder: Also: debug code is not production code and we actively discourage everyone from using such builds in production. They do insecure things *by definition*. Finding vulnerability problems in debug builds is not in scope and we're actually not even interested.

So, if your identified line of code only builds in debug builds, it is not a security problem.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
