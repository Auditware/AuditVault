---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-restriction-of-authentication-attempts
  - env/web
substate: "resolved"
weakness: "Improper Restriction of Authentication Attempts"
enriched: true
body: true
date: 2021-08-16
submitted: 2020-12-17T00:00:13.436Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "aliyugombe"
source: "https://hackerone.com/reports/1060541"
title: "No rate limit lead to otp brute forcing"
---
# No rate limit lead to otp brute forcing

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** MTN Group | **Disclosed:** 2021-08-16

- Report: [https://hackerone.com/reports/1060541](https://hackerone.com/reports/1060541)
- CWE: Improper Restriction of Authentication Attempts
- Submitted: 2020-12-17T00:00:13.436Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hello.
There is no rate limit protection in the endpoint https://mtnonline.com/nim/submit , Which could lead to brute force otp code.

## How To Reproduce:
Visit https://mtnonline.com/nim and complete all the required field and submit.
when next page load, user will be ask otp code.
Enter any five digit number and intercept the request using burp suit.
Send the request to intruder and clear all the payload except for otp.
Select brute forcer in payload type and clear the alphabetic character in character set and leave only digit.
In the min. length and max. length enter 5.
Click on attact button.

In the attached image, all the response code where  303 which means see other, that is means try again.
If rate limit is working, from 3 to 4 request, their response should be 429 means too many request.

## Supporting Material/References:

  * [attachment / reference]


##Thanks

## Impact

Attacker can send unlimited request before code the code to expire and guess the correct otp since it can be 5 minutes to expire.

## Timeline

- **Report Filed**
- **2020-12-20** @aliyugombe: Hello There is change in the current url now, but the bug is still there.
The old url is `https://mtnonline.com/nim` ,now it becomes `https://mtnonline.com/nin`

Regard
- **2020-12-23** @aliyugombe: Any update?
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
