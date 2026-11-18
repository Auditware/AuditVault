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
body: true
date: 2019-10-10
submitted: 2019-05-11T22:00:06.207Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "bohdansec"
source: "https://hackerone.com/reports/577612"
title: "MSSQL injection via param Customwho in https://█████/News/Transcripts/Search/Sort/ and WAF bypass"
---
# MSSQL injection via param Customwho in https://█████/News/Transcripts/Search/Sort/ and WAF bypass

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-10

- Report: [https://hackerone.com/reports/577612](https://hackerone.com/reports/577612)
- CWE: SQL Injection
- Submitted: 2019-05-11T22:00:06.207Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**

MSSQL injection via param `Customwho` in https://███████/News/Transcripts/Search/Sort/

**Description:**

MSSQL injection via param `Customwho` in https://██████████/News/Transcripts/Search/Sort/

There is WAF, but we can make bypass and via global variable `@@LANGID` we can know that the base is used here - MSSQL

## Impact

Critical

## Step-by-step Reproduction Instructions

Via global variable `@@LANGID` we can find out that here is MSSQL database. ████

https://█████/News/Transcripts/Search/Sort/?Customwho=31002/**/|/**/@@LANGID

And if use a non-existing global variable, then we get an error. ██████

https://██████████/News/Transcripts/Search/Sort/?Customwho=31002/**/|/**/@@nonexisting

## Suggested Mitigation/Remediation Actions

Using prepared statement

## Impact

We can read and do other manipulations in the database. We can also try to make RCE

## Timeline

- **Report Filed**
- **2019-05-11** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
