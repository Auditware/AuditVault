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
date: 2025-06-30
submitted: 2025-04-30T01:08:42.590Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/curl|curl]]"
reporter: "redfoxsec"
source: "https://hackerone.com/reports/3118915"
title: "Potential XSS vector in curl via unsanitized URL parameter handling"
---
# Potential XSS vector in curl via unsanitized URL parameter handling

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** curl | **Disclosed:** 2025-06-30

- Report: [https://hackerone.com/reports/3118915](https://hackerone.com/reports/3118915)
- CWE: Code Injection
- Submitted: 2025-04-30T01:08:42.590Z

## Timeline

- **Report Filed**
- **2025-04-30** @dfandrich: It's not clear exactly what you're alleging is an issue with curl, but it appears that you're confusing the difference between HTTP client and HTTP server. curl lets you send whatever you want to the server; if the server returns code susceptible to  a XSS issue, that's not curl's fault. And if curl returns a string that can be used in a XSS attack, once again it's not a curl problem but rather a problem of whatever is consuming that data.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
