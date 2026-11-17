---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-after-free
  - env/web
substate: "not-applicable"
weakness: "Use After Free"
enriched: true
date: 2025-07-31
submitted: 2025-07-31T14:56:24.068Z
bounty_usd: null
votes: 27
cve: []
program: "[[programs/curl|curl]]"
reporter: "geeknik"
source: "https://hackerone.com/reports/3279804"
title: "Stack use-after-scope in HTTP/3 POST request processing via CURLOPT_POSTFIELDS"
---
# Stack use-after-scope in HTTP/3 POST request processing via CURLOPT_POSTFIELDS

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 27 | **Program:** curl | **Disclosed:** 2025-07-31

- Report: [https://hackerone.com/reports/3279804](https://hackerone.com/reports/3279804)
- CWE: Use After Free
- Submitted: 2025-07-31T14:56:24.068Z

## Report summary

**Audit every libcurl POST in your stack. Treat `CURLOPT_POSTFIELDS` like explosives.** Either switch to `CURLOPT_COPYPOSTFIELDS` or prove your pointer lives forever. No exceptions.

## Timeline

- **Report Filed**
- **2025-07-31** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-07-31** @bagder: The documentation for CURLOPT_POSTFIELDS specially emphasizes this so I believe your recipe above is a user error and not a libcurl flaw:

> The data pointed to is NOT copied by the library: as a consequence, it must be
preserved by the calling application until the associated transfer finishes.
This behavior can be changed (so libcurl does copy the data) by instead using
the CURLOPT_COPYPOSTFIELDS(3) option.
- **2025-07-31** @geeknik: User error. Got it. Let's disclose this so other people can steer clear.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
