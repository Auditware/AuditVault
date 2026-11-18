---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
  - vuln/dos
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2022-09-05
submitted: 2021-07-31T21:13:32.807Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "aliyugombe"
source: "https://hackerone.com/reports/1285694"
title: "No password length restriction in reset password endpoint at http://suppliers.mtn.cm"
---
# No password length restriction in reset password endpoint at http://suppliers.mtn.cm

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** MTN Group | **Disclosed:** 2022-09-05

- Report: [https://hackerone.com/reports/1285694](https://hackerone.com/reports/1285694)
- CWE: N/A
- Submitted: 2021-07-31T21:13:32.807Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello

## Summary:
I found no password length restriction in reset password endpoint at http://suppliers.mtn.cm when resetting new password

## Steps To Reproduce:
1. Visit https://suppliers.mtn.cm/ and register.
2. logout and reset your password
3. go to your email and click on reset password link
4. enter 150 characters as a password and confirm the characters
5. you will successfully logged in.

## Impact

Attacker can do denial of service to your server since there is no restriction in the length of password.
Example when he enter like 2500 character, your server will crash for some time,

I did not attempt to ddos your server,  because you exclude any activity related to denial of service to your assets, I only test for 150 character and its working.

##Mitigation :
Restrict user to use less than 40 character as a password, while the restriction should be both on back-end and front-end (with javascript ).

##Thank you

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2022-04-30** @aliyugombe: Any update?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
