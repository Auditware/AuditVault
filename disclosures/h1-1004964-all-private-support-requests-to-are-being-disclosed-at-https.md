---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2021-07-29
submitted: 2020-10-11T07:02:44.381Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "nagli"
source: "https://hackerone.com/reports/1004964"
title: "All private support requests to ███████ are being disclosed at https://███████"
---
# All private support requests to ███████ are being disclosed at https://███████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-07-29

- Report: [https://hackerone.com/reports/1004964](https://hackerone.com/reports/1004964)
- CWE: Information Disclosure
- Submitted: 2020-10-11T07:02:44.381Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello DoD Team
**Summary:**
I have found out that all personal requests made to https://█████ form are being disclosed to the public at https://███████, which posses a critical privacy issue.

**Description:**
While searching my name at google "naglinagli" i have encountered a weird mention of my xss payload at the following endpoint https://██████████, which made realize that all the requests made at the contact form are open to the public

## Step-by-step Reproduction Instructions

1. Navigate to https://███████
2. File a request.

█████████

3. Your request will publicly appear at https://█████

████

##
## Suggested Mitigation/Remediation Actions
Making the access to the vulnerable endpoint to authorized personal only.

##Best Regards,
nagli.

## Impact

Personal reports made to █████ including PII of customers is being disclosed to the public through publicly accessible endpoint

## Timeline

- **Report Filed**
- **2020-10-11** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2020-10-13** @nagli: Thanks for the high triage @agent-l8, knew i wouldn't have to explain any further the impact here.
More motivation for the hacker of the month award :-)
Have a good week!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
