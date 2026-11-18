---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - vuln/info-disclosure
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2024-12-18
submitted: 2024-11-21T21:35:30.201Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "moha1sd"
source: "https://hackerone.com/reports/2858876"
title: "Unauthorized Access  Exposing Sensitive Data"
---
# Unauthorized Access  Exposing Sensitive Data

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-12-18

- Report: [https://hackerone.com/reports/2858876](https://hackerone.com/reports/2858876)
- CWE: Improper Authentication - Generic
- Submitted: 2024-11-21T21:35:30.201Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The identified page allows unauthorized access to a user's profile management functionality without requiring authentication. Upon accessing the page, sensitive user details such as name, email address, and EDIPI, 10 digits are exposed. Additionally, an update function is available, suggesting potential for unauthorized data manipulation.

## Impact

Sensitive Data Exposure: Unauthorized parties can view critical personal identifiers
Data Manipulation: If the update function is exploitable  and Privacy and Security Risks

## System Host(s)
████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1- go to the website https://████/
2 - will be asking to select certificate  Just **just click cancel ** Otherwise the server will response 403 - Forbidden: Access is denied
3-  Agree to the agreement and click on ██████████ will redirect to https://█████/███████/
4- click on login 
5- will  redirect you to https://████/███████/Dashboard

## Suggested Mitigation/Remediation Actions
Implement Authentication: Enforce strict authentication requirements

## Timeline

- **Report Filed**
- **2024-11-21** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **2024-11-22** @moha1sd: Kindly note that 
The Microsoft Edge  Version 131.0.2903.6


Regards
- **2024-11-22** @terminalnode: @moha1sd 

Thanks for your further info and we are going to prepare to send this off to our system owners to get this taken care of. I was able to replicate it via Chrome and get a different session with another user's info/course information.

Regards,
The VDP Team
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **2024-12-02** @moha1sd: Hi @terminalnod, Any update?
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
