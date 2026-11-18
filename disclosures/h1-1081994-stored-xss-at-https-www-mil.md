---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - impact/credential-theft
  - trigger/file-upload
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2021-02-01
submitted: 2021-01-20T00:34:36.040Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "5050thepiguy"
source: "https://hackerone.com/reports/1081994"
title: "Stored XSS at https://www.█████████.mil"
---
# Stored XSS at https://www.█████████.mil

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-02-01

- Report: [https://hackerone.com/reports/1081994](https://hackerone.com/reports/1081994)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-01-20T00:34:36.040Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Stored XSS exists at https://www.██████.mil. A user can fill out the form and upload a file containing javascript code to trigger XSS. 

**Description:**
Stored XSS exists at https://www.████.mil. A user can fill out the form and upload a file containing javascript code to trigger XSS. 


## Impact
A user can steal cookies, deface a site, etc. 

## Step-by-step Reproduction Instructions

(1) Go to https://www.██████.mil/jppso/vendor/WFDPMMiscInvoicingDocuments.aspx
(2) Fill out the form, upload a file, and add the file
(3) Once the file is uploaded right click to get to the Developer Tools.
(4) Inspect the page and find the path for the file -- █████\file.txt. For example, the file path for the file I uploaded is as follows: https://www.██████.mil/jppso/vendor/Data/cme1rjjcnjhnvdzhf5lgfbge-01192021-065856_testing-new.html
(5) Observe that XSS is triggered.

## Product, Version, and Configuration (If applicable)
https://www.████████.mil
Tested in Firefox

## Suggested Mitigation/Remediation Actions

## Impact

Stored XSS exists at https://www.█████.mil. A user can fill out the form and upload a file containing javascript code to trigger XSS.

## Timeline

- **Report Filed**
- **2021-01-20** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
