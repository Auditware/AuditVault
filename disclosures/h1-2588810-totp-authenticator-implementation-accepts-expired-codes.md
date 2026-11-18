---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - vuln/authentication-bypass
  - impact/financial
substate: "informative"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2024-07-11
submitted: 2024-07-07T19:01:24.901Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "noob_but_cut3"
source: "https://hackerone.com/reports/2588810"
title: "TOTP Authenticator implementation Accepts Expired Codes"
---
# TOTP Authenticator implementation Accepts Expired Codes

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** HackerOne | **Disclosed:** 2024-07-11

- Report: [https://hackerone.com/reports/2588810](https://hackerone.com/reports/2588810)
- CWE: Improper Authentication - Generic
- Submitted: 2024-07-07T19:01:24.901Z

## Report summary

This report describes a vulnerability in the TOTP (Time-Based One-Time Password) authenticator implementation on hackerone.com. The researcher found that the system accepts expired TOTP codes, which reduces the effectiveness of the two-factor authentication mechanism. Specifically, the system allows using TOTP codes that are over 1 minute old, which is considered an insecure window of acceptance.

By accepting expired codes, an attacker could potentially reuse old TOTP codes to bypass the 2FA authentication, leading to unauthorized access. The researcher provided steps to reproduce the issue and suggested reducing the acceptance window to 30 seconds and implementing a more robust TOTP algorithm that rejects expired codes.

While the HackerOne team acknowledged the report, they stated that there doesn't appear to be a significant security risk or impact, as an attacker would still need the user's credentials and wouldn't be able to brute force the 6-digit TOTP code within 1 minute.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Hi,

During testing hackerone.com, I discovered that the TOTP authenticator implementation accepts expired codes, allowing attackers to bypass authentication. This is a security vulnerability that reduces the effectiveness of the TOTP authentication mechanism.


**Description:**

TOTP (Time-Based One-Time Password) is a widely used authentication mechanism that generates a new password every 30 seconds. The password is valid for a short period, typically 30 seconds, before a new password is generated. This mechanism is designed to prevent attackers from using previously generated passwords.

During testing, I discovered that the TOTP authenticator implementation accepts expired codes, allowing attackers to bypass authentication. Specifically, I found that the authenticator accepts codes that are more than 1 minute old, which is considered a large window of acceptance.
This vulnerability reduces the security benefits of TOTP, allowing attackers to reuse expired codes. This can lead to unauthorized access to the system, which can result in data breaches, financial losses, and reputational damage.

### Steps To Reproduce

1. Enable TOTP authentication for the account at hackerone.com with google authenticator.
1. Log in to the tfa enabled account with correct password.
1. When it comes to tfa state, save the current totp code from authenticator app.
1. Wait for the code to expire (e.g., 1 minute).
1. Submit the expired code to the authentication endpoint.
1. Observe that the authentication is successful despite using an expired code.

### Suggest Fix 

1. Reduce the window of acceptance to a more secure value (e.g., 30 seconds).
1. Implement a more robust TOTP algorithm that rejects expired codes.

### Optional: Supporting Material/References (Screenshots)

 I have attached a POC video via google drive link cause it is over 250 mb.

https://drive.google.com/file/d/1onGsQvF-mmPXisjmxhkBbQUB4sbvoXz5/view?usp=sharing

## Impact

The attacker can bypass the two factor authentication by using expired otp code.

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
