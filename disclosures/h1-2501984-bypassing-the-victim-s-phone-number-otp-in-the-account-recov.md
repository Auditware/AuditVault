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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Hi Team,
Hope everyone is doing well on your end. :)

- While conducting research on hackerone.com, I uncovered a critical vulnerability related to account recovery via phone number. 
- I found that I could add any phone number without verifying the SMS OTP. 
- To confirm the vulnerability, I enabled 2FA and observed that the OTP was successfully sent to someone else's phone number. 
- Allow me to explain the details step by step.
- I halted my exploration at this point without delving into the 2FA OTP process and other aspects. My reason being, I wanted to ensure that I am the first to report this issue.

### Proof of concept:

- I have created a video demonstration of the vulnerability and uploaded it to the report and image too.
- You can review it once.

█████


### Steps To Reproduce

1. First, create an account recovery request using your own phone number and successfully enable account recovery with that same number.

███████

2. Now, click on 'Change' and replace the phone number with that of another person. Click 'Next' to initiate the verification process. However, do not verify the OTP, instead, either refresh the page or navigate back to the account recovery page.

██████

3. I was surprised to find that another person's number was now stored, and the recovery OTP was being sent to that individual's number, even though it had been modified by me. And I do not have access to that number.

4. To confirm the issue, I implemented 2FA (Two-Factor Authentication) and attempted to use the account recovery process via my phone number. Unfortunately, the attempt was unsuccessful. However, I did not let this setback deter me.

5. I logged in once more and attempted to change account recovery and got it. Now, the system prompted me to enter an SMS OTP (One-Time Password) sent to the phone number set by the attacker, which happens to be a victim's number I don't have access to.

████████

- Finally, we identified the issue, which involves exploiting the victim's phone number in the account recovery process without verifying the OTP sent to the victim's phone number.

## Impact

- The attacker can exploit the victim's phone number in the account recovery process without verifying the victim's phone number OTP, potentially flooding the victim's inbox with spam messages and overwhelming their communication channels.


### Solution:

- Accurately verifying the phone number OTP is crucial to ensuring the security of account recovery processes and preventing unauthorized access by attackers.

### Cheers!
TheWhiteEvil

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
