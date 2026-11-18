---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2021-04-02
submitted: 2020-09-28T01:31:08.713Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "fiveguyslover"
source: "https://hackerone.com/reports/992618"
title: "Improper Access Control - Generic on https://████"
---
# Improper Access Control - Generic on https://████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-04-02

- Report: [https://hackerone.com/reports/992618](https://hackerone.com/reports/992618)
- CWE: Improper Access Control - Generic
- Submitted: 2020-09-28T01:31:08.713Z

## Report summary

Title : Uncontrolled access to a sensitive U.S. Department of Defense dashboard.
Weakness : Improper Access Control - Generic
Severity : High
Reported at : September 28, 2020 3:31am +0200

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Greetings, I found on one of your sub-domains some tickets that are not supposed to be readable by everyone, we even have the possibility to delete the tickets.
Link : 
https://███/█████/latest
https://█████/███████/all
https://█████/███████ (DELETE HEADER METHOD)

Best regards,
frenchvlad

## Impact

a malicious person can delete tickets and see the progress of tickets in progress

## Timeline

- **Report Filed**
- **2020-09-28** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2020-10-02** @fiveguyslover: can we make the report public?
best regards,
frenchvlad
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
