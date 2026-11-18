---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
body: true
date: 2024-07-19
submitted: 2019-09-20T12:36:21.975Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/698793"
title: "Unauthenticated arbitrary file upload on the https://█████/ (█████.mil)"
---
# Unauthenticated arbitrary file upload on the https://█████/ (█████.mil)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-07-19

- Report: [https://hackerone.com/reports/698793](https://hackerone.com/reports/698793)
- CWE: Violation of Secure Design Principles
- Submitted: 2019-09-20T12:36:21.975Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Description
I was able to identify unsafe upload endpoint on the https://██████/upload.php

##POC
1) Go to the https://██████/upload.php
2) Upload some test file.
You will see success message, leaking some internal paths
3) Visit `https://██████████/delete.me` and you will see your uploaded file there
I uploaded example image file there:
█████

## Impact

Arbitrary file upload, may lead to the Stored XSS, hosting attacker's content and code execution.

## Timeline

- **Report Filed**
- **2019-09-20** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Triaged**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
