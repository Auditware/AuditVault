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
date: 2019-08-19
submitted: 2019-04-01T18:15:35.494Z
bounty_usd: null
votes: 49
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "arinerron2"
source: "https://hackerone.com/reports/519631"
title: "SQL Injection in ████"
---
# SQL Injection in ████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 49 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-08-19

- Report: [https://hackerone.com/reports/519631](https://hackerone.com/reports/519631)
- CWE: SQL Injection
- Submitted: 2019-04-01T18:15:35.494Z

## Report summary

See the writeup at https://aaronesau.com/blog/posts/5

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

There is an SQL injection vulnerability in `████████` in the /█████/recruiter/updapp.aspx` page, exploitable through the `app_id` form parameter.

## Impact

An attacker could use this vulnerability to control the content in the database, exfiltrate information, and obtain remote code execution.

## Step-by-step Reproduction Instructions

1. Visit https://█████████/Gateway/sso.aspx and sign in. Note that any user can create a user (and any privilege level works for this vulnerability as long as a user is signed in), so this should be considered an unauthenticated vulnerability.
2. With the Network tab of devtools open, visit https://██████/████/recruiter/updapp.aspx
3. Replay the GET request that returned the HTTP 500 error as a POST request with the body `app_id='`. This can be done by right clicking on the request, copying it as cURL, pasting the command in terminal, and appending ` -k -X POST --data "app_id='"`.
4. Notice in the response, there is an error: `ORA-01756: quoted string not properly terminated`. This is because the single apostrophe (`'`) caused the SQL query to be syntactically invalid.
5. Replay the request in the same way as shown in #3, but with the body `app_id=''` (this time append ` -k -X POST --data "app_id=''"` to the cURL command). 
6. Notice in the response, there is an error: `ORA-01722: invalid number`. This is because the double apostrophes (`''`)  did not cause the SQL query to be syntactically invalid, but because aposrophes are not numbers, they caused a different error.
7. Repeat step #3 as many times as you like. An odd number of apostrophes (`'`) will cause the SQL query to fail because it is syntactically invalid, and an even number will cause it to fail because it is valid, but apostrophes are not numbers.

I did not want to exploit this to get remote code execution because this is a live production system, but to get RCE, simply execute an SQL query that writes the file at https://raw.githubusercontent.com/danielmiessler/SecLists/master/Web-Shells/laudanum-0.8/aspx/shell.aspx to `D:\██████\shell.aspx` using the `INTO OUTFILE` syntax, then visit https://███/█████████/shell.aspx

## Suggested Mitigation/Remediation Actions

Sanitize everything in the SQL query (use prepared statements), and validate the data before putting it in the query.

Note: I wouldn't have been able to find this vulnerability if it wasn't for the fact that verbose error pages were enabled. Because they were, it leaked source code, and I could see that the SQL injection vulnerability existed before testing.

## Impact

An attacker could use this vulnerability to control the content in the database, exfiltrate information, and obtain remote code execution.

## Timeline

- **Report Filed**
- **2019-04-01** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
