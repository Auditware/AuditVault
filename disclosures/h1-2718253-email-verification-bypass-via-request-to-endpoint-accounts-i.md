---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authorization
  - env/web
  - impact/account-takeover
substate: "resolved"
weakness: "Improper Authorization"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Summary:
The vulnerability occurs in the "EmailAddress" parameter in the member creation area and affects all users.

##Steps To Reproduce:
Before proceeding with the steps of the vulnerability, have a previously created account or open it now to scenario the attack against existing accounts.

  1-to become a member 
First, go to the address below and type a different e-mail address, then go to the link and fill in the name, surname and password fields. 
*https://accounts.insightly.com/signup*
2. And before you sign up, catch the outgoing requests on burp and change the "EmailAddress" parameter in the request, which I will leave below as image poc.
3.If we are trying to open a new membership to an existing account, we need to write that email in the "EmailAddress" parameter or write the e-mail address of your test account as any other e-mail address.Leave the request and you will be automatically redirected to the account

## Supporting Material/References:
[list any additional material (e.g. screenshots, logs, etc.)]

  * [attachment / reference]

## Impact

The vulnerability concerns all users on Insightly, so even if no account has been opened or an account has been created before, it creates that account again.We can also take over the account.Additionally, when we open a membership to an existing account, we open a new instance and the trial version starts again for 15 days, which causes such a security vulnerability.

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
