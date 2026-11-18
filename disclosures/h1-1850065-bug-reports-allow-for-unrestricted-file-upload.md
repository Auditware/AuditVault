---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
  - vuln/file-upload
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
body: true
date: 2023-02-24
submitted: 2023-01-28T21:30:01.346Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "b911bade858ce8e6a0f50f8"
source: "https://hackerone.com/reports/1850065"
title: "[█████] Bug Reports allow for Unrestricted File Upload"
---
# [█████] Bug Reports allow for Unrestricted File Upload

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-02-24

- Report: [https://hackerone.com/reports/1850065](https://hackerone.com/reports/1850065)
- CWE: Violation of Secure Design Principles
- Submitted: 2023-01-28T21:30:01.346Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The web page https://███████/ allows for users to submit bug reports. Users are allowed to attach a file to a bug report. The extension and size of files are not validated by the web server.

## Impact

An attacker can attach a malicious file to a bug report. If a support agent opened the malicious file, malware would be executed on the support agent's system.

## System Host(s)
████████

## Affected Product(s) and Version(s)
Version: 3.4 Build: 35 Revision: 1

## CVE Numbers


## Steps to Reproduce
1. Navigate to the following web page: https://████████/
2. Create an account
3. Log in to the account that you created
4. Click on the text that reads `Report a Bug`
5. Enter any text in to the `Description` input field
6. Attach a file with an allowed file extension to the bug report
7. Click on the text that reads `Submit`
8. Intercept the `HTTP` request and change the extension of the attached file to one that is not allowed

Observe that the bug report was successfully submitted. This should not be the case, as the attached file has a file extension that is not allowed. The same method can be used to attach a file whose size is greater than 5 megabytes.

## Suggested Mitigation/Remediation Actions
Ensure that the extension and size of a file are validated by the web server.

## Timeline

- **Report Filed**
- **2023-01-28** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
