---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - vuln/info-disclosure
  - impact/sensitive-data
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2019-12-02
submitted: 2019-09-12T19:28:02.016Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "alyssa_herrera"
source: "https://hackerone.com/reports/693933"
title: "PII leakage due to scrceenshot of health records"
---
# PII leakage due to scrceenshot of health records

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 17 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-12-02

- Report: [https://hackerone.com/reports/693933](https://hackerone.com/reports/693933)
- CWE: Information Disclosure
- Submitted: 2019-09-12T19:28:02.016Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Document shows a screenshot of a medical record for a soldier 
**Description:**
One of the slides describes the CIV# and PAD DSN# along with some information relating to the soldier such as their name, the information appears to be old but could be still be an issue if they're in service
## Impact
High? maybe critical? Unsure on impact 
## Step-by-step Reproduction Instructions
Check slide 13 specifically but there's other slides that are suspect too
https://███████/wp-content/uploads/2018/12/HR_TECH_WOBC_Perform_eMILPO_Functions_eMILPO_Brief.pptx

## Product, Version, and Configuration (If applicable)
N/A
## Suggested Mitigation/Remediation Actions
Purge Doc

## Impact

An attacker could assume soldier identities and learn more about possible health information related to them

## Timeline

- **Report Filed**
- **2019-09-12** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-09-12** @alyssa_herrera: Just like #693943 we can edit the slides and remove the Redactions on SSN to reveal the SSNS. Severity is now critical.
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Report Became Public**
