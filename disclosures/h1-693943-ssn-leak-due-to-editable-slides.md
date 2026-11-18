---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
body: true
date: 2020-05-14
submitted: 2019-09-12T20:05:50.579Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "alyssa_herrera"
source: "https://hackerone.com/reports/693943"
title: "SSN leak due to editable slides"
---
# SSN leak due to editable slides

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-14

- Report: [https://hackerone.com/reports/693943](https://hackerone.com/reports/693943)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2019-09-12T20:05:50.579Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
A presentation slide contains a screenshot of a records brief which contains an SSN
**Description:**
The slides try to redact the PII of the records with a blue block but we can remove it by editing the slides to remove the offending blue block
## Impact
Critical 
## Step-by-step Reproduction Instructions
We can see an officer record brief, but the area with the SSN is blocked. We can make a copy of the file and edit it to remove the blue block thus allowing us to see the SSN
https://█████████/wp-content/uploads/2018/03/███████
Slide 84
███████
█████████
## Product, Version, and Configuration (If applicable)
N/A
## Suggested Mitigation/Remediation Actions

Purge Doc

## Impact

Identity theft

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
- **Report Severity Updated**
- **Report Triaged**
- **2019-09-13** @alyssa_herrera: @deez_nops should I report a document that's marked Unclassified Sensitive Information//FOUO and shows a SAP portal although no PII is shown besides the portal URL?
- **2019-09-16** @agent-0g: @alyssa_herrera Yeah, probably. We'll push it forward.
- **Report Resolved**
- **Agreed On Going Public**
- **2019-11-26** @ag3nt-j1: @alyssa_herrera just wanted to let you know, many of these findings have been found to be training material.  We've had signed letters from the system owner stating as much that we have on file.  So if you still see the material on the site, this is why and the reason these are closed as resolved.
- **2019-11-26** @alyssa_herrera: Alright thanks you for letting me know
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
