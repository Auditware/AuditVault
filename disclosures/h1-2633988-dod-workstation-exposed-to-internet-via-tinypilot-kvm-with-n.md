---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
  - trigger/unauthenticated
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2024-08-16
submitted: 2024-08-01T00:00:18.667Z
bounty_usd: null
votes: 41
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "socpuppet"
source: "https://hackerone.com/reports/2633988"
title: "DoD workstation exposed to internet via TinyPilot KVM with no authentication"
---
# DoD workstation exposed to internet via TinyPilot KVM with no authentication

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 41 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-08-16

- Report: [https://hackerone.com/reports/2633988](https://hackerone.com/reports/2633988)
- CWE: Improper Access Control - Generic
- Submitted: 2024-08-01T00:00:18.667Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
There appears to be a workstation belonging to ███████ (███) that is completely exposed to the internet via IP web interface by way of a TinyPilot KVM device.

TinyPilot KVMs are hardware devices that enable you to remotely access computers via IP address. This device in question is available over the internet without authentication and is connected to a workstation that appears to belong to ███. There is an "UNCLASSIFIED" green banner at the top. In the top right corner appears to be the initials "SA", which may identify the user.

Please see attached screenshot. Of note: I did **not** interact with the device at all. I immediately closed the connection after taking the screenshot attached to file this report. I do not know how long this device has been exposed like this. There appears to be no notification the user when this happens.

## References
Read more about TinyPilot devices here: https://tinypilotkvm.com/

## Impact
Simply by visiting the IP address in question, anyone on the internet can see the users screen and have full mouse/keyboard control over the workstation. An attacker could also sit and watch the user's screen to gain information.

Confidentiality: The user's entire session is exposed. Anything that appears on screen could be seen/watched by an attacker.
Integrity: An attacker could take control of the mouse/keyboard and modify the system in any way.
Availability: An attacker could take control of the mouse/keyboard and destroy files, inhibit the use of the system, etc.

## System Host(s)
████████ (Comcast Cable Communications, LLC - Houston, TX)

## Steps to Reproduce
Visiting https://█████ loads into the TinyPilot KVM service with no authentication and connects you to what appears to be a ███████ workstation.

## Suggested Mitigation/Remediation Actions
Disconnect the workstation from TinyPilot KVM, or insure proper authentication mechanism is in place.

## Timeline

- **Draft Started**
- **Report Filed**
- **2024-08-01** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Title Updated**
- **Report Vulnerability Information Updated**
- **Report Needs More Info**
- **Report New**
- **2024-08-01** @socpuppet: URGENT - Device is currently connected. See screenshot. The user's name is █████at ███████.███. I've closed my connection.
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **2024-08-09** @socpuppet: I am writing up a research article about KVM over IP devices, specifically talking about TinyPilot and some others, and risks associated. Am I able to disclose this finding, and if so to what degree? I will of course redact anything sensitive. I can leave out the agency name and/or DoD if requested. Please let me know. Thank you!
- **Agreed On Going Public**
- **2024-08-13** @agent-p1: Please request disclosure and we will make a decision. Thank you for your time.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
