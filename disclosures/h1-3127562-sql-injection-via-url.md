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
date: 2026-01-12
submitted: 2025-05-05T16:50:39.131Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "jonasdiasrebelo"
source: "https://hackerone.com/reports/3127562"
title: "SQL Injection via URL"
---
# SQL Injection via URL

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/3127562](https://hackerone.com/reports/3127562)
- CWE: SQL Injection
- Submitted: 2025-05-05T16:50:39.131Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
Hi!
I discovered a SQL Injection vulnerability  via URL on the website ██████████. The vulnerability allows for the manipulation of SQL queries executed by the backend database, which could potentially lead to unauthorized data access or manipulation.

If you edit the sleep() value from 6 to another number, you will see that the page will have a longer/shorter delay to load. Thus proving SQLi.

██████████thank-you0'XOR(if(now()=sysdate(),sleep(6),0))XOR'Z
████████=sysdate(),sleep(6),0))XOR'Z
█████locations0'XOR(if(now()=sysdate(),sleep(6),0))XOR'Z/
██████careers0'XOR(if(now()=sysdate(),sleep(6),0))XOR'Z

## Impact

The ability to manipulate SQL queries can lead to:
Unauthorized access to sensitive data.
Potential data leakage.
Data manipulation or corruption.
Full database compromise if administrative permissions are accessible.

## System Host(s)
██████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
I found these directories vulnerable, try changing the value '6'.

████thank-you0'XOR(if(now()=sysdate(),sleep(6),0))XOR'Z
████=sysdate(),sleep(6),0))XOR'Z
██████████locations0'XOR(if(now()=sysdate(),sleep(6),0))XOR'Z/
██████careers0'XOR(if(now()=sysdate(),sleep(6),0))XOR'Z

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
- **2025-05-05** @jonasdiasrebelo: Hello @terminalnode . You can see the reports #3127184 and #3125511? I think there has been some mistake and I am not getting an answer.
- **2025-05-05** @jonasdiasrebelo: @terminalnode
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
