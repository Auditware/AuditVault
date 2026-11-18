---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cleartext-storage-of-sensitive-information
  - env/web
  - vuln/secrets-leak
  - impact/account-takeover
substate: "resolved"
weakness: "Cleartext Storage of Sensitive Information"
enriched: true
body: true
date: 2025-05-07
submitted: 2025-04-07T12:55:43.790Z
bounty_usd: null
votes: 107
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "firec4t"
source: "https://hackerone.com/reports/3080597"
title: "Unauthorized Account Access via Leaked Credentials in URL Format (Account Takeover )"
---
# Unauthorized Account Access via Leaked Credentials in URL Format (Account Takeover )

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 107 | **Program:** Khan Academy | **Disclosed:** 2025-05-07

- Report: [https://hackerone.com/reports/3080597](https://hackerone.com/reports/3080597)
- CWE: Cleartext Storage of Sensitive Information
- Submitted: 2025-04-07T12:55:43.790Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I discovered a critical vulnerability that allows attackers to access user accounts on khanAcademy.com using credentials publicly available on VirusTotal., an attacker can directly authenticate into a user’s account without any secondary verification or alert to the user.
i have reported a similar issue , here's the report ( 2981324 ) 

this time the email and password of the victim is archived in clear text ( https://en.khanacademy.org/login,██████,,█████████,,,█████████,██████████,Personal )

by entering the mail ( ██████████ ) and password ( ███████ ) in the login , the attacker can easily perform account takeover

Please Enforce 2FA: Make two-factor authentication mandatory, especially for accounts with detected exposure.

## Impact

Full account takeover: Unauthorized access to user accounts with no user awareness.

Exposure of personal data: Private information such as learning progress, messages, and linked accounts may be compromised.

Potential financial or reputational damage: If linked to other services, this access may lead to wider exploitation.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Resolved**
- **2025-04-07** @firec4t: At least reward me 5$ or something, it'll motivate me :)
- **Agreed On Going Public**
- **Report Became Public**
