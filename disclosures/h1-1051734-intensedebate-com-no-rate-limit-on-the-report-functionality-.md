---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
date: 2021-01-23
submitted: 2020-12-06T17:51:04.809Z
bounty_usd: null
votes: 50
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "fuzzme"
source: "https://hackerone.com/reports/1051734"
title: "[intensedebate.com] No Rate Limit On The report Functionality Lead To Delete Any Comment When it is enabled"
---
# [intensedebate.com] No Rate Limit On The report Functionality Lead To Delete Any Comment When it is enabled

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 50 | **Program:** Automattic | **Disclosed:** 2021-01-23

- Report: [https://hackerone.com/reports/1051734](https://hackerone.com/reports/1051734)
- CWE: Business Logic Errors
- Submitted: 2020-12-06T17:51:04.809Z

## Timeline

- **Report Filed**
- **2020-12-07** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **2020-12-07** @xknown: Hi @fuzzme, this looks like a valid issue. I'll forward this report to the team so they can add a potential hardening fix. I don't think adding rate limiting is a good fix here, it's probably better to just remove this feature :)
- **2020-12-07** @fuzzme: Hello @xknown, ok, thank you again for quick reply.
- **Report Triaged**
- **2020-12-15** @jgcaruso: Hi @fuzzme we've addressed the issue by removing the "auto delete" function when reporting a comment. You should be able to re-test now to verify.
- **2020-12-15** @fuzzme: Hello @jgcaruso, yes, the "auto delete" is disabled.
- **Report Resolved**
- **Bounty Awarded**
- **2020-12-24** @fuzzme: Hi everyone, thank you for the bounty !
- **Agreed On Going Public**
- **Report Became Public**
