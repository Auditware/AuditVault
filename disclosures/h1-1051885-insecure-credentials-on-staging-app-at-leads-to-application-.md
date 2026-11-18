---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insufficiently-protected-credentials
  - env/web
  - vuln/session-management
  - impact/rce
  - trigger/file-upload
substate: "resolved"
weakness: "Insufficiently Protected Credentials"
enriched: true
body: true
date: 2021-02-10
submitted: 2020-12-07T03:22:46.281Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "skarsom"
source: "https://hackerone.com/reports/1051885"
title: "Insecure ███████ credentials on staging app at ████ leads to application takeover"
---
# Insecure ███████ credentials on staging app at ████ leads to application takeover

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-02-10

- Report: [https://hackerone.com/reports/1051885](https://hackerone.com/reports/1051885)
- CWE: Insufficiently Protected Credentials
- Submitted: 2020-12-07T03:22:46.281Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
A ██████████ application called "████" has an old endpoint that accepts insecure/test ████████ credentials despite being a publicly-accessible IP. This endpoint also provides the ability to view information that may be FOUO, to exfiltrate information on registered personnel or contractors, to upload files, and to change configuration settings with ███████████████ privileges.

**Description:**
The IP address ███ points to a deployment of an application called ████/█████, which is a DoD-owned system on █████████). The login for this deployment accepts insecure ███ credentials (███).

There is also an authentication/█████ panel accessible at https://██████████externally accessible with these credentials.

The ████████ system available through this login includes file upload features, data exfiltration and management, workspace management, and infrastructure management.

The ██████████ / authentication █████████istration system available through this login includes file import/export privileges, user management, RBAC management, HTTP header management, OAuth credential management, session management, and frankly anything else you can think of that would be in an ████████ panel.

████████ frontend:
#███████
#██████
#█████

███████ backend:
#███
#█████████
#█████
#██████
#██████

## Step-by-step Reproduction Instructions
1. Navigate to https://████
2. Enter the username "██████" and the password "██████████"
3. After logging in, click "Launch" under ██████
4. Navigate to https://███████████
5. Enter the username "███" and the password "█████████"

## Product, Version, and Configuration (If applicable)
████████████
███
Build Date: 25 November 2020

## Suggested Mitigation/Remediation Actions
1. Immediately disable insecure ███████████████ credentials.
2. I would recommend preventing external access to the ████████ █████████ portal/requiring CAC as a best practice.

## Impact

An unauthorized attacker can exfiltrate intelligence and personnel information stored in a staging █████/█████.
An unauthorized attacker can modify, insert, and delete intelligence and personnel information stored in a staging ████████/███████.

An unauthorized attacker can exfiltrate, modify, upload to, download from, and/or deny access to a staging ██████ environment through the ██████ ████ panel. 

I did not feel comfortable seeing whether I could escalate file uploads to an RCE before getting DOD consent.

## Timeline

- **Report Filed**
- **2020-12-07** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
