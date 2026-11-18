---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2025-01-08
submitted: 2024-07-31T20:43:55.733Z
bounty_usd: null
votes: 81
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "tinopreter"
source: "https://hackerone.com/reports/2633888"
title: "OTP code Leaked in API Response "
---
# OTP code Leaked in API Response 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 81 | **Program:** MTN Group | **Disclosed:** 2025-01-08

- Report: [https://hackerone.com/reports/2633888](https://hackerone.com/reports/2633888)
- CWE: Improper Access Control - Generic
- Submitted: 2024-07-31T20:43:55.733Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
The application https://corporate.admyntec.co.za allows users to sign up for device insurance. When you Get a Quote, it requires authentication via phone number. An OTP is sent to the phone number to further validate the action was initiated by the legit user. Except this same OTP code is returned in the OTP response.

## Steps To Reproduce:

  1.Vist https://corporate.admyntec.co.za/customerInsurance and get a quote. 
  2. Have a proxy interceptor tool like burpsuite running. Now enter any valid MTN number.
   3. Notice the OTP code is also returned in the API's response

{F3484295}

## Impact

It's possible to sign up with other users accounts. It's possible to log into other users accounts as well.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2024-10-04** @tinopreter: Could you resolve this #2633959 since it affects the decommisoned https://corporate.admyntec.co.za/ domain also?
- **Agreed On Going Public**
- **Report Became Public**
