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
date: 2023-12-21
submitted: 2023-11-23T12:30:00.545Z
bounty_usd: null
votes: 22
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "maskedpersian"
source: "https://hackerone.com/reports/2262365"
title: "Default Admin Username and Password on ███"
---
# Default Admin Username and Password on ███

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 22 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-12-21

- Report: [https://hackerone.com/reports/2262365](https://hackerone.com/reports/2262365)
- CWE: Improper Access Control - Generic
- Submitted: 2023-11-23T12:30:00.545Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

It is possible to access the application is using the default username and password 
Steps To Reproduce:
1-Go to https://███/geoportal/ and login with credentials:
user and password: admin
user and password: gptadmin
Poc video attached

## Impact

A Department of Defense website was misconfigured in a manner that may have allowed a malicious user to login with administrator for the default organization account credentials and delete posts , edit website

## System Host(s)
███

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
POC video

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2023-11-23** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
