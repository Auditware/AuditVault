---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authorization
  - env/web
substate: "resolved"
weakness: "Improper Authorization"
enriched: true
date: 2025-08-18
submitted: 2024-09-15T00:06:39.294Z
bounty_usd: null
votes: 148
cve: []
program: "[[programs/insightly|Insightly]]"
reporter: "akostak"
source: "https://hackerone.com/reports/2718253"
title: "Email verification bypass via request  to endpoint 'accounts.insightly.com/signup/provisionuser'"
---
# Email verification bypass via request  to endpoint "accounts.insightly.com/signup/provisionuser"

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 148 | **Program:** Insightly | **Disclosed:** 2025-08-18

- Report: [https://hackerone.com/reports/2718253](https://hackerone.com/reports/2718253)
- CWE: Improper Authorization
- Submitted: 2024-09-15T00:06:39.294Z

## Timeline

- **Report Filed**
- **2024-09-20** @akostak: Hello, is there an update for the report?
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2024-09-25** @akostak: Thank you for your interest, good work @h1_analyst_mikhail
- **Bounty Awarded**
- **2024-09-27** @akostak: Thanks for the reward
- **2024-09-27** @akostak: There is something I want to mention. In the program, there is Multi-tenant (Vulnerabilities reported that affect multi-tenant services, for example, Account Takeover, Privilege Escalation, Insecure Direct Object Reference (IDOR)), in fact, there is account takeover in my report.
- **2024-10-04** @akostak: @h1_analyst_mikhail  What does hackerone think about this?
- **2024-10-14** @akostak: @h1_analyst_mikhail  Or what do you think about the report?
- **2024-12-02** @akostak: @h1_analyst_mikhail  ?
- **2024-12-04** @h1_analyst_mikhail: Hello @akostak,

Thanks for following up. The program made its decision when it awarded the bounty prior. I'm pleased to inform you that the fix for your reported issue is currently being worked on and, if not already fully implemented. Your contribution has been valuable in improving Insightly's security.

Kind Regards,
@h1_analyst_mikhail
- **2024-12-04** @akostak: @h1_analyst_mikhail Thank you very much for your feedback.
What I mean is that Insightly can add a bonus or payment if they think like me.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
