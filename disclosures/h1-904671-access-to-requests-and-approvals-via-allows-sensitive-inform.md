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
date: 2021-02-18
submitted: 2020-06-22T06:09:37.315Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "z32"
source: "https://hackerone.com/reports/904671"
title: "Access to requests and approvals via /█████ allows sensitive information gathering"
---
# Access to requests and approvals via /█████ allows sensitive information gathering

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-02-18

- Report: [https://hackerone.com/reports/904671](https://hackerone.com/reports/904671)
- CWE: Information Disclosure
- Submitted: 2020-06-22T06:09:37.315Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
An adversary is able to view/modify requests and approvals via ████████/████████.

## Step-by-step Reproduction Instructions

1. Browse to █████ and create an account or sign in.
2. Browse to ███████/██████████. You can now view current/past requests.
3. Clicking on these requests seems to allow an adversary to update/create changes/send e-mails, as well as attach files to the requests. I did not test these features as I did not want to impact existing requests, however I believe the ability to view these requests is enough of a security issue by itself as it allows an attacker to identify hardware/software specifications for NIPR/SIPR assets, as well as identifying justifications for the requests (upcoming TDYs, etc.)

## Suggested Mitigation/Remediation Actions
Restrict access to this endpoint to only allow administrators to view requests as well as allowing users to view their own requests or the requests of users in the same workgroup.

## Impact

An adversary can identify hardware/software specifications of NIPRNET/SIPRNET assets. Additionally, an adversary can gather intel based on justification requirements in the requests (upcoming TDYs, deployments, mission posture due to COVID, etc.)

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
