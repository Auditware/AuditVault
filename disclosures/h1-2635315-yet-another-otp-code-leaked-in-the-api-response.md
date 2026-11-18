---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2025-01-08
submitted: 2024-08-01T16:12:48.721Z
bounty_usd: null
votes: 135
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "tinopreter"
source: "https://hackerone.com/reports/2635315"
title: "Yet Another OTP code Leaked in the API Response"
---
# Yet Another OTP code Leaked in the API Response

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 135 | **Program:** MTN Group | **Disclosed:** 2025-01-08

- Report: [https://hackerone.com/reports/2635315](https://hackerone.com/reports/2635315)
- CWE: Improper Authentication - Generic
- Submitted: 2024-08-01T16:12:48.721Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
This is much similar to my report here(https://hackerone.com/reports/2633888) , except it affects a different domain. The application requests a phone number for authentication, then sends an OTP code to the user. But the OTP is leaked in the response which defeats the whole purpose of it's implementation.



## Steps To Reproduce:

{F3486534}

## Supporting Material/References:
https://hackerone.com/reports/2633888

##Recommendation
Don't return the OTP code in the API's response

## Impact

It's possible to sign up with other users accounts. It's possible to log into other users accounts as well. Another thing I noticed is that, you can sign up with any 10-digit phone number since the OTP is in the response for you to use, makes creating junk accounts easily possible.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
