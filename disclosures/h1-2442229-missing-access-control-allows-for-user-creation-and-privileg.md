---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2024-07-19
submitted: 2024-03-31T02:54:51.546Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "bulldawg"
source: "https://hackerone.com/reports/2442229"
title: "Missing Access Control Allows for User Creation and Privilege Escalation "
---
# Missing Access Control Allows for User Creation and Privilege Escalation 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-07-19

- Report: [https://hackerone.com/reports/2442229](https://hackerone.com/reports/2442229)
- CWE: Improper Access Control - Generic
- Submitted: 2024-03-31T02:54:51.546Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,

The RSI Test Environment application at https://███████████████/ords/f?p=842:1 does not enforce access controls on the user management endpoint. This allows any unauthenticated person to both create new users as well as give them the administrator role. This then provides access to https://███████████████/ords/f?p=303 as an administrator.

The user management endpoint can be accessed at https://████████████/ords/f?p=842:9:::::: 

I have attached screenshots which show this misconfiguration.

If there are any questions or concerns please let me know as I am more than happy to provide additional information!

## Impact

This is a critical security issue which poses risk to the confidentiality and integrity of data within the ███████████████ application. An attacker would be able to view, modify, and/or delete the restricted information and documents within the application as well as manage other user accounts. This provides unauthorized access that is otherwise restricted to USG-authorized individuals per the disclaimer.

## System Host(s)
█████████████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Visit https://█████████████████/ords/f?p=842:9, which is the user management endpoint for the environment.
2. Under "Add New User", enter an email address, first name, last name, and select an Agency.
3. Under "Assign User Roles", select the newly created user and apply the administrator role.
4. Retrieve the credentials for the new account that were sent to the email address entered.
5. Go to https://███████████/ords/f?p=303 and login using the credentials.
6. Change to a new password on prompt.
7. View the logged in username in the top right with the Administrator role.

## Suggested Mitigation/Remediation Actions
Enforce access controls on page 9 of the application with an ID of 842.

## Timeline

- **Report Filed**
- **2024-03-31** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
