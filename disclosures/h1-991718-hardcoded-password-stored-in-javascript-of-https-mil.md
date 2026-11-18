---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-of-hard-coded-password
  - env/web
substate: "resolved"
weakness: "Use of Hard-coded Password"
enriched: true
body: true
date: 2020-11-02
submitted: 2020-09-26T00:29:16.549Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "x3ph_"
source: "https://hackerone.com/reports/991718"
title: "hardcoded password stored in javascript of https://████.mil"
---
# hardcoded password stored in javascript of https://████.mil

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-11-02

- Report: [https://hackerone.com/reports/991718](https://hackerone.com/reports/991718)
- CWE: Use of Hard-coded Password
- Submitted: 2020-09-26T00:29:16.549Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**

I have discovered a cleartext password stored within a javascript. This password allows me to authentication to https://█████.mil.

**Description:**

I have discovered a cleartext password stored within a javascript. This password allows me to authentication to https://███████.mil.


To confirm this vulnerability we will first navigate to https://███████.mil, you are now prompted to type a password. We will provide an incorrect password such as 'Password'.

██████████

███

We can confirm the password is invalid. However, reviewing the javascript data for '██████.chunk.js' we can confirm the authentication is validated based on a hardcoded password '█████████!'.

███████

We can now confirm if we can access the staging web app using hardcoded password.

██████

███████

## Impact

By knowing the password, it is possible to understand your password policy and structure which will encourage bruteforcing and password spray attacks in your environment.

## Step-by-step Reproduction Instructions

1. Navigate to https://█████████.mil.
2. Open your browser debugger by pressing F12.
3. Click on Network and refresh the page.
4. Open the javascript '██████████.chunk.js' and look for where the password is stored. You will see "(n=prompt("Enter Password","Password"),o="██████;" copy the password.
5. Now close out your browser debugger and refresh the page and type the password in.
6. You now have access to ████████.mil

## Suggested Mitigation/Remediation Actions

If this staging web application needs to be password protected, you can refer to the following AWS documentation on how to properly setup basic authentication https://docs.aws.amazon.com/speke/latest/documentation/authentication.html.

Resources:
https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password

## Impact

By knowing the password, it is possible to understand your password policy and structure which will encourage bruteforcing and password spray attacks in your environment.

## Timeline

- **Report Filed**
- **2020-09-26** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2020-10-01** @x3ph_: ty sir, i've taken down my http server for security reasons. Please let me know if you need me to bring it back up.
- **Report Resolved**
- **Agreed On Going Public**
- **2020-10-28** @agent-l8: added to queue. Thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
