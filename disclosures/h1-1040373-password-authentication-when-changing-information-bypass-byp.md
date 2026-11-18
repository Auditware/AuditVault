---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/unverified-password-change
  - env/web
substate: "resolved"
weakness: "Unverified Password Change"
enriched: true
body: true
date: 2021-02-11
submitted: 2020-11-22T01:40:47.224Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "tomorrowisnew_"
source: "https://hackerone.com/reports/1040373"
title: "Password authentication when changing information bypass. Bypass of report #721341"
---
# Password authentication when changing information bypass. Bypass of report #721341

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Khan Academy | **Disclosed:** 2021-02-11

- Report: [https://hackerone.com/reports/1040373](https://hackerone.com/reports/1040373)
- CWE: Unverified Password Change
- Submitted: 2020-11-22T01:40:47.224Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#SUMMARY
When reading the disclosed reports of your program, i see this one report #721341 . The reporter reported a lack of password confirmation when linking accounts. A fix was applied, adding password confirmation when linking account to other services. But i found a way to bypass this, The password confirmation is only done in the client side. This is bad because such methods are vulnerable to response manipulation. I will add a video poc 

#STEPS TO REPRODUCE
1. Open a browser in which a user has previously logged into an account, but hasn't logged out.
2. Open another browser and login using your account
3. Try to link gmail using your account, it will prompt for a password confirmation, enter your password
4. Intercept the response and copy it
5. Go to the victims account and link to gmail again
6. This time enter any password and intercept response
7. Paste the copied response from the attacker account

#POC
██████████

## Impact

An attacker can take over an account and lock a user out by resetting the password.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-11-22** @tomorrowisnew_: Hi thanks for the response. But currently, i dont have an active khanacdemy account. Thanks for quickly triaging my report
- **Report Resolved**
- **2021-01-12** @tomorrowisnew_: Hi. I can confirm that it is fixed now. Thanks
- **2021-01-12** @tomorrowisnew_: Can we disclose?
- **Agreed On Going Public**
- **Report Became Public**
