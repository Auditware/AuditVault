---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
substate: "informative"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2024-07-11
submitted: 2024-05-12T14:53:17.127Z
bounty_usd: null
votes: 67
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "the-white-evil"
source: "https://hackerone.com/reports/2501984"
title: "Bypassing the victim's phone number OTP in the account recovery process on the https://hackerone.com/settings/auth/setup_account_recovery"
---
# Bypassing the victim's phone number OTP in the account recovery process on the https://hackerone.com/settings/auth/setup_account_recovery

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 67 | **Program:** HackerOne | **Disclosed:** 2024-07-11

- Report: [https://hackerone.com/reports/2501984](https://hackerone.com/reports/2501984)
- CWE: Improper Authentication - Generic
- Submitted: 2024-05-12T14:53:17.127Z

## Timeline

- **Report Filed**
- **2024-05-12** @the-white-evil: - The final step involved attempting to change the recovery phone number again and noticing that the SMS OTP was sent to the victim's phone number. 
- This highlights that as an attacker, I could successfully utilize the application to store the victim's phone number as my attacker's account recovery phone number.
- The real phone number I own and have verified with OTP is ██████, whereas the victim or fake phone number, which I do not own and has not been verified with OTP, is ████.
- **2024-05-13** @the-white-evil: Hi team,

Has anyone had a chance to review the report? Are there any updates available for it?

Cheers!
- **Report Informative**
- **2024-05-13** @the-white-evil: Hi @h1_analyst_lea,

Thank you for the update. However, it seems there was a bypass of SMS OTP verification, correct? The victim's phone number was added/stored without OTP verification, while only the attacker's phone number was verified. How is it possible for the application to store the victim's phone number without verifying the OTP and then sending the SMS OTP to the victim's email? Could you please recheck this report once again? I still consider it a bug/vulnerability.

Thank you.
- **2024-05-13** @the-white-evil: @jobert
- **2024-05-14** @the-white-evil: Hi team, any review?
- **2024-07-11** @0daybookworm: Hey @the-white-evil,

The report does not seem to present a significant security risk or impact. An attacker would already need access to the account to perform the actions you described.
- **Agreed On Going Public**
- **Manually Disclosed**
