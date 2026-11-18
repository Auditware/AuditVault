---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - vuln/sql-injection
  - fix/parameterized-query
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2026-01-12
submitted: 2025-05-05T15:00:03.802Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "jonasdiasrebelo"
source: "https://hackerone.com/reports/3127152"
title: "SQL Injection - data[account][id] parameter"
---
# SQL Injection - data[account][id] parameter

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/3127152](https://hackerone.com/reports/3127152)
- CWE: SQL Injection
- Submitted: 2025-05-05T15:00:03.802Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
Hi!
I discovered a SQL Injection vulnerability in the data[account][id] parameter on the website ███████. The vulnerability allows for the manipulation of SQL queries executed by the backend database, which could potentially lead to unauthorized data access or manipulation.

## References

████

## Impact

The ability to manipulate SQL queries can lead to:
Unauthorized access to sensitive data.
Potential data leakage.
Data manipulation or corruption.
Full database compromise if administrative permissions are accessible.

## System Host(s)
█████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Use the sqlmap:

```
sqlmap -r file.txt --dbs --tamper=between --batch -p 'data[account][id]'
```

Use the file.txt attached to the report.

## Suggested Mitigation/Remediation Actions
Use parameterized queries when dealing with SQL queries that contain user input. Parameterized queries allow the database to understand which parts of the SQL query should be considered as user input, therefore solving SQL injection.

## Timeline

- **Report Filed**
- **2025-05-05** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
