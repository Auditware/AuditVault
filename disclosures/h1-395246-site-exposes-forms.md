---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/broken-access-control
  - vuln/info-disclosure
  - impact/sensitive-data
  - trigger/auth-required
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2019-04-05
submitted: 2018-08-14T19:53:38.495Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "cablej_dds"
source: "https://hackerone.com/reports/395246"
title: "███████ Site Exposes █████████ forms"
---
# ███████ Site Exposes █████████ forms

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 21 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-04-05

- Report: [https://hackerone.com/reports/395246](https://hackerone.com/reports/395246)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2018-08-14T19:53:38.495Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

The █████ site (https://██████.mil/) allows authenticated users to submit ██████ e-forms. Due to a vulnerability in this system, any authenticated user can access the full █████████ e-form of any other user.

## Steps to reproduce

1. Intercept an authenticated request on █████████ containing an Authorization header.
2. Replace the url with `█████████`. Observe that the id in the url can be incremented/decremented to view recently generated OMPFs.
3. Upon submitting the request, the user's full ███████ form JSON response will be sent.

## Impact

Access to ████ is possible through either a Department of Defense Self-Service logon, CAC card, or █████████password. Thus, a compromise of a single account on any of these systems would allow for unrestricted access to all ████ forms.

The ████ form includes the following
- PII such as SSN, DoB, addresses, etc
- Personal remarks
- Other fields related to security clearances, education, maritial status, etc

## Timeline

- **Report Filed**
- **2018-08-14** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2018-08-14** @cablej_dds: Note that this has been submitted alongside a more critical vulnerability to █████████. Although that vulnerability was remediated, they have not yet addressed this issue.
- **Report Severity Updated**
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
