---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/weak-password-recovery-mechanism-for-forgotten-password
  - env/web
substate: "resolved"
weakness: "Weak Password Recovery Mechanism for Forgotten Password"
enriched: true
body: true
date: 2017-10-30
submitted: 2017-10-27T15:01:43.544Z
bounty_usd: null
votes: 20
cve: []
program: "[[programs/infogram|Infogram]]"
reporter: "geekninja"
source: "https://hackerone.com/reports/283550"
title: "Password Reset Token Not Expired "
---
# Password Reset Token Not Expired 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 20 | **Program:** Infogram | **Disclosed:** 2017-10-30

- Report: [https://hackerone.com/reports/283550](https://hackerone.com/reports/283550)
- CWE: Weak Password Recovery Mechanism for Forgotten Password
- Submitted: 2017-10-27T15:01:43.544Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Team,

Here in this scenario, I've found that the there's a kind of server side invalidation of Password Reset tokens. Like if I've requested for password reset token (token1) and I don't use it, after I will make another request for password reset token (token2). This time I'll use the token2 means the link that I requested for the second time, so the first token (token1) should explicitly expire by the server. But here I can use the token1 also after password change by token2, this is unusual behavior of web application.

Exploit Scenario:
If victim's email account is still logged into his/her Office Computers or any public Internet Cafe. Then any external attacker can use the unused token to reset victims token.

Proof of Concept:

1)Go to https://infogram.com/forgot and ask for password reset link.
2)Don't use the link keep it in Email inbox.
3)After some time repeat the step 1.
4)This time use the password reset link which was asked in step 3. means the 2nd link.
5)After changing the password, use the password reset link that was captured in step 1.
6)You'll see the password reset link is not expired even after password change.
7)I've also explained you the Exploit Scenario, now its all upto you.

Regards,
Ali Razzaq

## Timeline

- **Report Filed**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
