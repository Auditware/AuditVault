---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-exposure-through-debug-information
  - env/web
substate: "resolved"
weakness: "Information Exposure Through Debug Information"
enriched: true
body: true
date: 2026-01-12
submitted: 2025-01-09T07:55:32.675Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "jonasdiasrebelo"
source: "https://hackerone.com/reports/2928785"
title: "ASP.NET Application Trace Enabled"
---
# ASP.NET Application Trace Enabled

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/2928785](https://hackerone.com/reports/2928785)
- CWE: Information Exposure Through Debug Information
- Submitted: 2025-01-09T07:55:32.675Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
The ASP.NET application trace feature is enabled on the public-facing URL: ██████████. This exposes sensitive internal information, including Session ID values and the physical file paths of server-side resources. An attacker could leverage this data to gain unauthorized insights into the server environment or session management mechanisms, increasing the risk of further exploitation.

PoC: ██████

## References

███████
███

## Impact

Information Disclosure: Reveals internal application structure and configuration.
Session Hijacking Risk: Exposed Session ID values could potentially allow unauthorized access to active user sessions.
Attack Surface Expansion: Exposed file paths and server-side request details can aid in reconnaissance for further exploitation attempts.

## System Host(s)
██████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Open the link.

## Suggested Mitigation/Remediation Actions
Remove this file from your website or change its permissions to remove access.

More information: https://www.acunetix.com/vulnerabilities/web/trace-axd-detected/

## Timeline

- **Report Filed**
- **2025-01-09** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
