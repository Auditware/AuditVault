---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2019-10-08
submitted: 2018-01-28T20:20:51.983Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "alyssa_herrera"
source: "https://hackerone.com/reports/310031"
title: "SQL injection on █████ due to tech.cfm "
---
# SQL injection on █████ due to tech.cfm 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/310031](https://hackerone.com/reports/310031)
- CWE: SQL Injection
- Submitted: 2018-01-28T20:20:51.983Z

## Report summary

The website had an end point like website.mil/xxx/xxx.cfm?sort=grade&type=2.  I probed using an apostrophe which resulted in an error. I proceeded to exploit by using a time based query as a proof of concept.

## Timeline

- **Report Filed**
- **2018-01-28** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **2018-03-23** @alyssa_herrera: I'd like this to be disclosed, please.
- **2018-03-23** @ag3nt-j7: @alyssa_herrera Hi!  You are on our list.  We are working to standardize the process and expect to be able to close out on all the disclose request soon.  Stay tuned!
- **2018-08-11** @alyssa_herrera: Alright good to hear
- **Agreed On Going Public**
- **Report Became Public**
