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
date: 2024-07-19
submitted: 2024-07-06T12:38:35.355Z
bounty_usd: null
votes: 26
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "prakhar0x01"
source: "https://hackerone.com/reports/2587953"
title: "Email Takeover leads to permanent account deletion"
---
# Email Takeover leads to permanent account deletion

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 26 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-07-19

- Report: [https://hackerone.com/reports/2587953](https://hackerone.com/reports/2587953)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2024-07-06T12:38:35.355Z

## Timeline

- **Report Filed**
- **2024-07-06** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2024-07-06** @prakhar0x01: Hii,

As DoD mentioned RateLimit/Bruteforcing is OOS. However, I found an **IDOR vulnerability that can be CHAINED with RATE-LIMIT** and leads to 0-Click Account Takeover, can I report it?

Regards,
@prakhar0x01
- **Report Needs More Info**
- **Report New**
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2024-07-08** @prakhar0x01: Hii @redwingreaper 

Can you please also look into #2587844

Thanks
@prakhar0x01
- **Report Severity Updated**
- **2024-07-08** @prakhar0x01: Hii @redwingreaper 

Could you please provide a specific reason for reducing the severity?

Regards,
@prakhar0x01
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
