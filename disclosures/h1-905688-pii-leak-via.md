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
submitted: 2020-06-22T21:21:08.924Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "z32"
source: "https://hackerone.com/reports/905688"
title: "PII Leak via /██████"
---
# PII Leak via /██████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-02-18

- Report: [https://hackerone.com/reports/905688](https://hackerone.com/reports/905688)
- CWE: Information Disclosure
- Submitted: 2020-06-22T21:21:08.924Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
An attacker is able to access ServiceNow e-mail notification modules via █████/██████████. Once on this page, the attacker can click any of the notifications, select `Preview Notification`, and choose a user to view their profile data to include Full Name, rank, organization, e-mail address, physical address, and phone number.

## Step-by-step Reproduction Instructions

1. Browse to ██████ and create an account or sign in.
2. Browse to █████████/███████.
3. Click on any of the notification names. Once the notification menu appears, click `Preview Notification` in the top right corner of the screen.
4. The `████` field can now be used to query a user. Once a user is identified, the `(i)` icon can be clicked to view the users PII.
██████

## Suggested Mitigation/Remediation Actions
Restrict access to the █████ and sysevent_email_action.do modules to prevent unauthorized viewing of PII.

## Impact

An adversary can gather PII of all `███████` users via this endpoint.

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
