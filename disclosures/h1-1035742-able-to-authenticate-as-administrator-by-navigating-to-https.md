---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - vuln/authentication-bypass
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2021-01-12
submitted: 2020-11-16T19:20:12.578Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "nagli"
source: "https://hackerone.com/reports/1035742"
title: "Able to authenticate as administrator by navigating to https://█████/admin/"
---
# Able to authenticate as administrator by navigating to https://█████/admin/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-01-12

- Report: [https://hackerone.com/reports/1035742](https://hackerone.com/reports/1035742)
- CWE: Improper Authentication - Generic
- Submitted: 2020-11-16T19:20:12.578Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
The endpoint at https://███████/admin/ authenticates the user  to the administrator user.

## Step-by-step Reproduction Instructions

1. Navigate to https://███/ and youll notice you will need to log in.
2. Navigating to https://██████████/admin/ will show you admin malformed page, with the ability to "log out"

As for now as we can see by the picture no data is present at the administrator panel, sure this might change at the future exposing sensitive ifnormation

████████


## Suggested Mitigation/Remediation Actions

Issuing 403 response when trying to access the /admin endpoint.

##Best regards
nagli

## Impact

Admin authentication bypass

## Timeline

- **Report Filed**
- **2020-11-16** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
