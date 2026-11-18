---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2021-06-30
submitted: 2021-05-14T04:39:24.572Z
bounty_usd: null
votes: 27
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "rook1337"
source: "https://hackerone.com/reports/1196976"
title: "IDOR while uploading ████ attachments at [█████████]"
---
# IDOR while uploading ████ attachments at [█████████]

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 27 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-06-30

- Report: [https://hackerone.com/reports/1196976](https://hackerone.com/reports/1196976)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2021-05-14T04:39:24.572Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
There is an IDOR vulnerability in uploading attachments to the ████ section where an attacker can upload attachments in other user's █████████ if there is no attachment uploaded by a user. If this vulnerability will be used with a Race condition, it can allow an attacker to upload attachments in all-new █████████ created by users.

## Impact

A user can upload attachments to other users ███.

## System Host(s)
██████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Go to ██████
2. Login
3. Go to https://███/█████
4. Add a new █████████ and upload an attachment with that and submit it.
5. Send the request to the repeater.

████
6. Change the `███Id` parameter value to the victim user's ██████████ id.

█████████
7. Click on the send button and you will see `success` in response.
8. It will be uploaded in the victim user █████ section.

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2021-05-14** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
