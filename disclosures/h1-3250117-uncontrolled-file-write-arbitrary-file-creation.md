---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
substate: "not-applicable"
weakness: "Code Injection"
enriched: true
date: 2025-07-13
submitted: 2025-07-13T16:50:47.600Z
bounty_usd: null
votes: 20
cve: []
program: "[[programs/curl|curl]]"
reporter: "hadesguy"
source: "https://hackerone.com/reports/3250117"
title: "Uncontrolled File Write/Arbitrary File Creation "
---
# Uncontrolled File Write/Arbitrary File Creation 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 20 | **Program:** curl | **Disclosed:** 2025-07-13

- Report: [https://hackerone.com/reports/3250117](https://hackerone.com/reports/3250117)
- CWE: Code Injection
- Submitted: 2025-07-13T16:50:47.600Z

## Timeline

- **Report Filed**
- **2025-07-13** @bagder: No, this is curl working as intended. The user provides a file name for curl to create the source code in. It is not an attack.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2025-07-13** @jimfuller2024: Maybe I am missing something - I also am not seeing any security issue here.
- **2025-07-13** @bagder: curl can create files anywhere in the file system where the OS lets it, using many different command line options. That's by design.
- **Manually Disclosed**
