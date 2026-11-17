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
date: 2019-01-28
submitted: 2018-12-20T15:15:12.102Z
bounty_usd: null
votes: 34
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "jarvis0x1"
source: "https://hackerone.com/reports/470298"
title: "[██████] Cross-origin resource sharing misconfiguration (CORS)"
---
# [██████] Cross-origin resource sharing misconfiguration (CORS)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 34 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-01-28

- Report: [https://hackerone.com/reports/470298](https://hackerone.com/reports/470298)
- CWE: Improper Access Control - Generic
- Submitted: 2018-12-20T15:15:12.102Z

## Timeline

- **Report Filed**
- **2018-12-20** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2019-01-17** @jarvis0x1: Also severity of this bug is High, not Low. And you can also cut or shade domain  from name of report (If you want)
- **2019-01-22** @agent-1: @jarvis7

This was a great find, thank you! Your disclosure is approved. Please use the following text:

A Cross-origin resource sharing misconfiguration (CORS) vulnerability with a severity rating of high was discovered on a DoD website by researcher jarvis7. He provided an in-depth, step-by-step proof of concept (POC) which demonstrated his ability to compromise a user account; resulting in the hijacking of a user's sessions, theft of some personal information, and follow-on malicious actions. A job well done jarvis7, and thank you for keeping our websites secure!

We would like to congratulate you on Twitter (@DC3VDP) if that is acceptable. If yes please verify your Twitter handle is @Jarvis7717. We will redact information in H1 on this vulnerability submission so you can disclose the technical aspects as well as your POC. Please give us 2 weeks to perform this manual process. Thanks again!

DoD VDP Team
- **Report Severity Updated**
- **2019-01-22** @ag3nt-j1: Also upped the severity since you actually supplied a working PoC.  Thanks Jarvis!
- **2019-01-22** @jarvis0x1: Yes, this is my twitter https://twitter.com/Jarvis7717, of course you can write in twitter about this!) Nice text for disclose. Thanks!
- **2019-01-22** @jarvis0x1: ██████
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
