---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - vuln/info-disclosure
  - impact/sensitive-data
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2021-02-18
submitted: 2020-06-22T05:21:41.931Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "z32"
source: "https://hackerone.com/reports/904659"
title: "PII Leak via /███████"
---
# PII Leak via /███████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-02-18

- Report: [https://hackerone.com/reports/904659](https://hackerone.com/reports/904659)
- CWE: Information Disclosure
- Submitted: 2020-06-22T05:21:41.931Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
The ██████████ website allows access to PII of all site users via faulty access control to the /██████ endpoint.

## Step-by-step Reproduction Instructions

1. Browse to ████████ and login or create an account.
2. Browse to ███████/████████. You will be able to access PII of all site users (click a username to view the PII).

## Suggested Mitigation/Remediation Actions
Restrict access to the /██████████ module to only administrative users.

## Impact

An adversary can gain access to PII of all ███████ users.

## Timeline

- **Report Filed**
- **2020-06-22** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
