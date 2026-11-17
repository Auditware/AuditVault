---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-certificate-validation
  - env/web
substate: "not-applicable"
weakness: "Improper Certificate Validation"
enriched: true
date: 2025-11-11
submitted: 2025-11-10T18:04:42.460Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/curl|curl]]"
reporter: "rootsecret3"
source: "https://hackerone.com/reports/3418776"
title: "Silent TLS Trust Model Hijacking via `CURL_CA_BUNDLE` Environment Variable Leads to MITM"
---
# Silent TLS Trust Model Hijacking via `CURL_CA_BUNDLE` Environment Variable Leads to MITM

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 11 | **Program:** curl | **Disclosed:** 2025-11-11

- Report: [https://hackerone.com/reports/3418776](https://hackerone.com/reports/3418776)
- CWE: Improper Certificate Validation
- Submitted: 2025-11-10T18:04:42.460Z

## Timeline

- **Report Filed**
- **2025-11-10** @dfandrich: If an attacker can manipulate the environment of the process running curl, then all bets are off. The attacker could instead manipulate `PATH` or set `LD_PRELOAD` or any of  a number of other variables that would allow an even more direct means of attack. This is curl operating as documented. I don't see this as a vulnerability.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
