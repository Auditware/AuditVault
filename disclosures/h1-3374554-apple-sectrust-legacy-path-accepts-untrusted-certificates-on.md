---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-certificate-validation
  - env/mobile
  - os/ios
  - os/macos
substate: "informative"
weakness: "Improper Certificate Validation"
enriched: true
date: 2025-10-09
submitted: 2025-10-07T15:37:19.499Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/curl|curl]]"
reporter: "giant_anteater"
source: "https://hackerone.com/reports/3374554"
title: "Apple SecTrust legacy path accepts untrusted certificates on pre-10.14 macOS/iOS when built with USE_APPLE_SECTRUST"
---
# Apple SecTrust legacy path accepts untrusted certificates on pre-10.14 macOS/iOS when built with USE_APPLE_SECTRUST

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** curl | **Disclosed:** 2025-10-09

- Report: [https://hackerone.com/reports/3374554](https://hackerone.com/reports/3374554)
- CWE: Improper Certificate Validation
- Submitted: 2025-10-07T15:37:19.499Z

## Timeline

- **Report Filed**
- **2025-10-07** @bagder: Thanks!

This is code not shipped in any release yet so by definition we don't count it as a security problem. I think it is better filed as a "normal bug".
- **2025-10-07** @giant_anteater: Ok, will include in a batch of normal bugs I will send over.
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
