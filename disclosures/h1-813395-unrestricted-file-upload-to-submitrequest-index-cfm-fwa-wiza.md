---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
  - vuln/code-injection
  - vuln/file-upload
  - impact/rce
  - trigger/file-upload
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
body: true
date: 2020-06-11
submitted: 2020-03-09T03:37:09.345Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "z32"
source: "https://hackerone.com/reports/813395"
title: "Unrestricted File Upload to ███████SubmitRequest/Index.cfm?fwa=wizardform"
---
# Unrestricted File Upload to ███████SubmitRequest/Index.cfm?fwa=wizardform

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-06-11

- Report: [https://hackerone.com/reports/813395](https://hackerone.com/reports/813395)
- CWE: Violation of Secure Design Principles
- Submitted: 2020-03-09T03:37:09.345Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
An attacker is able to upload files of any type to `███SubmitRequest/Index.cfm?fwa=wizardform` as long as they are less than 5 MB.

**Description:**
The █████ ████ Request System allows a user to submit requests to the ██████████ ███ for event support. An attacker can exploit this request form by uploading malicious files due to an unrestricted file upload feature.

## Impact
An attacker is able to upload malicious files onto the server. These files are attached to a request for support from the ██████ █████████. If a member of the ██████ ████ were to open the malicious file, the attacker could gain remote code execution on ████ information systems. Alternatively, if the attacker finds out how to browse to the file, they could obtain a web shell on the target, giving them remote code execution.

## Step-by-step Reproduction Instructions

1. Browse to `██████PublicSite/index.cfm?fwa=newreq` and click on `Create a New Request`.
██████████
2. Fill in your e-mail address and click `Submit`.
██████████
3. Fill out the fields in the form.
███
████
███
███████
4. Before submitting the request, click the `Upload Files` tab.
█████
5. This page will allow you to upload any file you wish as long as it is under 5MB in size. I tested by uploading an executable (visual studio community installer) and a php file. These files were deleted from my request after submitting this report.
███████
6. Once uploaded, you can submit your request. An attacker would need to submit this request in hopes of the █████ ████████ downloading the malicious attachment.

## Suggested Mitigation/Remediation Actions
Restrict file uploads to safe extensions such as .jpg, .png, etc. to prevent an attacker from uploading malicious files onto the server.

## Impact

An attacker is able to upload malicious files onto the server. These files are attached to a request for support from the ████ ██████████. If a member of the ████ ██████████ were to open the malicious file, the attacker could gain remote code execution on ██████ information systems. Alternatively, if the attacker finds out how to browse to the file, they could obtain a web shell on the target, giving them remote code execution.

## Timeline

- **Report Filed**
- **2020-03-09** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2020-06-10** @z32: Hello @agent-l8 @agent-r5,

Just checking in to see if this can be added to the queue for disclosure.

Thanks in advance!
@un4gi
- **2020-06-11** @agent-r5: it has been.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
