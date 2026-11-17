---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "informative"
weakness: "Improper Authentication - Generic"
enriched: true
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

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
