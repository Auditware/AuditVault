---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/file-content-injection
  - env/web
substate: "resolved"
weakness: "File Content Injection"
enriched: true
body: true
date: 2026-01-12
submitted: 2025-11-06T11:53:52.479Z
bounty_usd: null
votes: 10
cve: "CVE-2025-64095"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0xr2r"
source: "https://hackerone.com/reports/3414079"
title: "DNN - Unrestricted Arbitrary File Upload #████████"
---
# DNN - Unrestricted Arbitrary File Upload #████████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/3414079](https://hackerone.com/reports/3414079)
- CWE: File Content Injection | CVE: CVE-2025-64095
- Submitted: 2025-11-06T11:53:52.479Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
DNN (formerly DotNetNuke) \u003C 10.1.1 contains an unrestricted file upload vulnerability caused by the default HTML editor provider allowing unauthenticated file uploads and overwriting existing files, letting unauthenticated attackers deface websites and inject XSS payloads, exploit requires no authentication.

## References
https://nvd.nist.gov/vuln/detail/CVE-2025-64095

## Impact

Unauthenticated attackers can upload and overwrite files, leading to website defacement and cross-site scripting attacks.

## System Host(s)
█████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
#Vulnerable subdomain

https://██████████/Providers/HtmlEditorProviders/DNNConnect.CKE/Browser/FileUploader.ashx

#Testing the Vulnerability
raw POST request

██████████

## Suggested Mitigation/Remediation Actions
Update to version 10.1.1 or later.

## Timeline

- **Report Filed**
- **2025-11-06** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Report Resolved**
- **2025-11-13** @0xr2r: Hi , @redwingreaper  @DC3VDP
Can we disclose it in public
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
