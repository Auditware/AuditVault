---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
date: 2026-01-12
submitted: 2025-09-03T11:36:18.833Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0xoroot"
source: "https://hackerone.com/reports/3324823"
title: "Account Takeover via Unverified Email Change and Improper Session Handling"
---
# Account Takeover via Unverified Email Change and Improper Session Handling

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/3324823](https://hackerone.com/reports/3324823)
- CWE: Violation of Secure Design Principles
- Submitted: 2025-09-03T11:36:18.833Z

## Timeline

- **Report Filed**
- **2025-09-03** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Vulnerability Information Updated**
- **Report Vulnerability Information Updated**
- **Report Vulnerability Information Updated**
- **Report Informative**
- **2025-09-04** @0xoroot: Hi @marmelade321,

Thank you for your response. I believe there was a misunderstanding about my report. This is not about session expiration.

The issue here is that when an attacker changes their account email to an unregistered victim’s email, the system accepts it without verification. Later, when the victim registers with that same email, the attacker’s account session becomes linked to the victim’s new account.

This means the attacker can access the victim’s account and even continue logging in normally as if they truly owned the victim’s email. The system essentially maps attacker@example.com to victim@example.com, which results in a full account takeover scenario — not just a session persistence issue.

I wanted to clarify this so the impact is not misunderstood.

Best regards,
0xoroot
- **2025-09-04** @0xoroot: Hi @marmelade321,

I just want to kindly clarify that this issue results in Account Takeover, not only a session expiration case.
Could you please review my clarification and share your thoughts? I’d really appreciate your reply.

Best regards,
0xoroot
- **Report Reopened**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2025-10-01** @0xoroot: Hi @agent-j5 

could we disclose this report ?
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
