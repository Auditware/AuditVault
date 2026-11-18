---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2023-11-03
submitted: 2023-10-03T12:06:17.557Z
bounty_usd: null
votes: 88
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "mrr0b0t2324"
source: "https://hackerone.com/reports/2190808"
title: "User automatically logged in as Sys Admin user on https://███/Administration/Administration.aspx"
---
# User automatically logged in as Sys Admin user on https://███/Administration/Administration.aspx

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 88 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-11-03

- Report: [https://hackerone.com/reports/2190808](https://hackerone.com/reports/2190808)
- CWE: Improper Access Control - Generic
- Submitted: 2023-10-03T12:06:17.557Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
Any user can access the Administration section of the following URL: https://███
When the user goes to the following domain they are automatically logged in as "████████" which is a sys admin user on the application, this allows any user to upload files, add users, change permissions for users and delete users.

## References

## Impact

A malicious actor can modify other user's privileges on the application, add users, upload files, delete users. They can also add false information to the application which will jeopardize the integrity of the application. With administrator privileges they have no restrictions on the application.

## System Host(s)
https://█████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Step 1) Go to the following URL: https://███ 
There you will se that you are logged in as a Sys Admin user

## Suggested Mitigation/Remediation Actions
The application should prompt a user to authenticate first before being able to do any other actions on the system.

## Timeline

- **Draft Started**
- **Report Filed**
- **2023-10-03** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2023-10-05** @mrr0b0t2324: Thank you! It has been a pleasure working with you!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
