---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/misconfiguration
  - env/web
substate: "resolved"
weakness: "Misconfiguration"
enriched: true
body: true
date: 2022-05-16
submitted: 2022-02-20T07:42:18.460Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/lemlist|lemlist]]"
reporter: "mr23r0"
source: "https://hackerone.com/reports/1486327"
title: "Security misconfiguration "
---
# Security misconfiguration 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** lemlist | **Disclosed:** 2022-05-16

- Report: [https://hackerone.com/reports/1486327](https://hackerone.com/reports/1486327)
- CWE: Misconfiguration
- Submitted: 2022-02-20T07:42:18.460Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Description :
When we request a magic link to login into the application, and use that same link in multiple browsers, it working there isn't any limit on use of link.

Steps to reproduce :
1. go to app.lemilist.com
2. create a magic link 
3. use it to login 
4. now open another browser or incognito window
5. use that same magic link

And You'll be logged in in your account.

## Impact

If Attacker gets the magic link of user he can login into victim's account.
Account takeover.

Mitigation :
1. Add a limit to magic link and remove the magic link from database after 1 use.
2. only allow the Requester IP to login using the magic link.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-02-28** @mr23r0: Hello @alban75 
Is there any updates regarding the fix?
- **2022-03-01** @alban75: Hello @mr23r0,
First, thanks for the report ! And sorry  for the delay.
Task is created on our side, a developer should take the issue soon.
- **2022-03-24** @mr23r0: After the fix can we disclose it?
- **2022-04-20** @mr23r0: Hello @alban75, 
Is there any updates on this?
- **2022-05-04** @alban75: Hello @mr23r0 sorry for the very long delay, but the fix needed some new ui & so on
Fix will be deployed on 5th of may 2022 10am CEST
I will update this issue when deployed, but wanted to update you ASAP
- **2022-05-05** @alban75: Fixed & deployed
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
