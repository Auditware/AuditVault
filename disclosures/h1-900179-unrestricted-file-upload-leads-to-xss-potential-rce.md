---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/unrestricted-upload-of-file-with-dangerous-type
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - vuln/file-upload
  - impact/rce
  - trigger/file-upload
substate: "resolved"
weakness: "Unrestricted Upload of File with Dangerous Type"
enriched: true
body: true
date: 2020-07-08
submitted: 2020-06-17T06:08:54.158Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "5050thepiguy"
source: "https://hackerone.com/reports/900179"
title: "Unrestricted File Upload Leads to XSS & Potential RCE"
---
# Unrestricted File Upload Leads to XSS & Potential RCE

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-07-08

- Report: [https://hackerone.com/reports/900179](https://hackerone.com/reports/900179)
- CWE: Unrestricted Upload of File with Dangerous Type
- Submitted: 2020-06-17T06:08:54.158Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Unrestricted file upload at████████/request?openform. When the user wants to upload a file the app allows the user to upload a HTML file leading to stored XSS and creation of a simple php script. A user can upload the HTML file and trigger XSS and trigger potential RCE with php shell. Please go to the ██████ Request that I created at -- ██████████AllOpenOrders/4F4D0C69EA2B33A58525858A001E2B8C?opendocument and select the file at the bottom "unsure1.html" to trigger payload to show XSS and php shell. You can also go directly to the uploaded file at ████0/4f4d0c69ea2b33a58525858a001e2b8c/$FILE/unsure1.html. Please see the attached PoC video as well. Thanks.

## Impact
The unrestricted file upload vulnerability leads to stored XSS and creation of php shell leading to potential RCE, which opens the door to numerous malicious attacks by the attacker. 

## Step-by-step Reproduction Instructions

1. Go to███/request?openform
2. Enter in the details for this page and you will automatically be redirected to the next page. Do the same thing here and enter in all the necessary information
3. Then, towards the bottom you are given the option to upload files so click "browse" and upload your payload
4. Click "submit request" then go back to █████████ModifyRequest.xsp and enter in the 14 digit Document Number. 
5. Scroll down to the bottom of your request and click the HTML payload.
6. Observe that XSS triggers and php shell is seen as well. 

## Product, Version, and Configuration (If applicable)
███
███request?openform

## Suggested Mitigation/Remediation Actions
Restrict file uploads to only necessary business requirements. If possible restrict uploads to JPG, DOC, DOCX, and PDF. Don't allowed upload of executable files.

##References
Please see attached PoC video
Please see attached PoC HTML page as well used for the payload

## Impact

The unrestricted file upload vulnerability leads to stored XSS and creation of php shell leading to potential RCE, which opens the door to numerous malicious attacks by the attacker.

## Timeline

- **Report Filed**
- **2020-06-17** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2020-07-06** @agent-l8: sure thing- added to the queue, we will most likely process these mid-late this week. Thanks!
- **2020-07-07** @5050thepiguy: thanks @agent-l8
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
