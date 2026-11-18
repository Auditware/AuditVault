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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi team,

During testing on ███
, I noticed an issue with session handling after changing the account email. When I update the email to an unregistered one, the system accepts it without proper verification. If the victim later registers on the website using that email, my existing session does not expire. Instead, I am able to access the victim’s newly created account data.

I also attempted to end the session and log in again, but the system still redirected me into the victim’s account, indicating improper session invalidation and account takeover risk.

## Steps to Reproduce
##steps_Reproduce
1.Register a new account using Google authentication.
2.Change the account email to the victim’s email address (note: the victim’s email is not yet registered).
3.The victim registers on the website using that same email.
4.Observe that the attacker’s existing session is not expired, and the attacker now has access to the victim’s account data, even though the email is associated with the victim.
5.Log out from the attacker’s account.
6.Log in again with the attacker’s credentials.
7.You will notice that you are automatically logged into the victim’s account instead of your own, confirming account takeover.

##POC
█████████

## Impact

An attacker can fully take over any user account by exploiting weak email change and session handling logic. When the attacker changes their email to an unregistered victim email, the system does not verify ownership of that email nor invalidate active sessions. If the victim later registers with that email, the attacker’s session automatically maps to the victim’s account.

## System Host(s)
████

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
