---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
body: true
date: 2019-10-10
submitted: 2019-07-31T20:41:30.997Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "alyssa_herrera"
source: "https://hackerone.com/reports/665144"
title: "Partial SSN exposed through Presentation slides on ██████████"
---
# Partial SSN exposed through Presentation slides on ██████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-10

- Report: [https://hackerone.com/reports/665144](https://hackerone.com/reports/665144)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2019-07-31T20:41:30.997Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
During a search of ████████ I discovered that one of the slides ina presentation contained a screen shot of live data. 
**Description:**
The slides describe testing and using military application to organize and aggregate data on users. On one of the slides it does show a screen shot of actual data. I'm assuming it's live due to the fact that part of it was blocked out like the previous report where it showed XXXX and 4 digits.
## Impact
Critical
## Step-by-step Reproduction Instructions
████
## Product, Version, and Configuration (If applicable)
N/A
## Suggested Mitigation/Remediation Actions
Purge the file

## Impact

Last 4  digits of an SSN can be used on various web portals along with knowing the full name of the soldier can give us access to sensitive portals

## Timeline

- **Report Filed**
- **2019-07-31** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-07-31** @alyssa_herrera: Oops forgot to mention it's on slide 72 specifically.
- **Report Title Updated**
- **2019-07-31** @agent-1: Awesome find Alyssa, thanks!
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
