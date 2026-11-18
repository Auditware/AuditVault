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
submitted: 2018-10-04T14:39:44.321Z
bounty_usd: null
votes: 73
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "arinerron2"
source: "https://hackerone.com/reports/419017"
title: "SQL Injection in ████"
---
# SQL Injection in ████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 73 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-08-19

- Report: [https://hackerone.com/reports/419017](https://hackerone.com/reports/419017)
- CWE: SQL Injection
- Submitted: 2018-10-04T14:39:44.321Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

There is an SQL injection vulnerability in the SSN field at https://██████████/████/candidate_app/status_scholarship.aspx

## Impact

An attacker could use this vulnerability to control the content in the database, exfiltrate information, and potentially obtain remote code execution.

## Step-by-step Reproduction Instructions

Follow these steps:
1. Visit https://███/███/candidate_app/status_scholarship.aspx
2. Right click on the SSN field, click Inspect Element, and edit `maxlength="9"` by changing it to `maxlength="9999"` (or something similar, so that a longer payload can be put in)
3. Choose a random birth date, for example, January 1, 1990.
4. Enter in your SQL injection payload into the SSN field. For example, try `' OR '1'='1`.
5. Click "Check Status". Your SQLi payload will execute. If you did the example payload in step 4, assuming someone has the birth date you entered, it will log in as them and check their scholarship status.

Also, I didn't do much testing, but I think the birth date is also vulnerable to SQL injection. After sending the request, in the network tab, Edit and Resend Request after changing the birth day, month, or year to a payload that will cause invalid syntax like `'`. It will give you an HTTP 500 response. If you do a payload that won't cause invalid syntax like `''`, it will give you an HTTP 200.

## Suggested Mitigation/Remediation Actions
Sanitize everything (use prepared statements) and validate the data.

## Impact

An attacker could use this vulnerability to control the content in the database, exfiltrate information, and potentially obtain remote code execution.

## Timeline

- **Report Filed**
- **2018-10-04** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2018-10-22** @arinerron2: It looks like a fix was implemented; I can no longer reproduce this issue.
- **2018-12-07** @arinerron2: Hi, just following up- I think this issue is ready to be closed (and has been for 2 months). I've extensively tested this particular page, and there do not appear to be any more SQL injection vulnerabilities in it.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
