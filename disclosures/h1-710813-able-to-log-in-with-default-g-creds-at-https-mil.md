---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-exposure-through-an-error-message
  - env/web
substate: "resolved"
weakness: "Information Exposure Through an Error Message"
enriched: true
body: true
date: 2021-01-12
submitted: 2019-10-10T01:34:54.464Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "pirateducky"
source: "https://hackerone.com/reports/710813"
title: "Able to log in with default ██████g creds at  https█████████████████████.mil "
---
# Able to log in with default ██████g creds at  https█████████████████████.mil 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-01-12

- Report: [https://hackerone.com/reports/710813](https://hackerone.com/reports/710813)
- CWE: Information Exposure Through an Error Message
- Submitted: 2019-10-10T01:34:54.464Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary████**
was able to use ████████████████████████ to log into this instance of Adobe Experience Manager, though it does not seem to be in used at the moment 
**Description███████**
while navigating to https█████████████████████████.mil, I performed some fuzzing and found that `/repository` was available which asked for authentication using `███████████████████` worked and I could then access another path found by fuzing `lc` [link](https█████████████.mil/lc) which then showed me the ██████ panel. 

## Impact
Medium since it is not being used
## Step-by-step Reproduction Instructions

1. Navigate to  https████████████████.mil/repository 
2. use ████████████████ (username██████████password)
3. navigate to  https██████████████████████.mil/lc 

## Product, Version, and Configuration (If applicable)

Adobe Experience Manager

## Suggested Mitigation/Remediation Actions

Remove this application if it is not being used

## Impact

Medium - I was able to use █████████████ to log in 

Thanks

## Timeline

- **Report Filed**
- **2019-10-10** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
