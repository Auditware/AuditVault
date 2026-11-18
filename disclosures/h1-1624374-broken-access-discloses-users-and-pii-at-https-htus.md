---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - vuln/info-disclosure
  - impact/sensitive-data
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2022-10-14
submitted: 2022-07-04T14:10:27.202Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "g4mb4"
source: "https://hackerone.com/reports/1624374"
title: "Broken access discloses users and PII at https://███████ [HtUS]"
---
# Broken access discloses users and PII at https://███████ [HtUS]

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-10-14

- Report: [https://hackerone.com/reports/1624374](https://hackerone.com/reports/1624374)
- CWE: Improper Access Control - Generic
- Submitted: 2022-07-04T14:10:27.202Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Good morning,

I was able to register at https://████/ and get the list of users.
1- Go to https://██████████/OA_HTML/ibeCAcpSSOReg.jsp and register.
2- Go to https://███/OA_HTML/AppsLocalLogin.jsp with the created user and login.
3- On the homepage, click on vacations rules, create, and search users.
4- User are disclosed.

██████

Regards,

G4MB4

## Impact

An attacker is able to access users information.

## Timeline

- **Report Filed**
- **Report Pending Program Review**
- **2022-07-08** @g4mb4: Good Morning,

Any update?

Regards!
- **2022-07-08** @8thwonder: @g4mb4 I'm having difficulty reaching the registration page. Are you able to still register new accounts? If not, would you be willing to share the credentials you registered?
- **2022-07-08** @g4mb4: @8thwonder 

I can't access to the registration page anymore. This are my credentials, they are still working and i still have access:

 https://██████████/OA_HTML/AppsLocalLogin.jsp 
████████
███████

Have a good night!
- **2022-07-28** @nutellatte: Hi @g4mb4,

Due to a large volume of submissions during the Hack U.S. Challenge, your submission fell through the cracks and was later identified as valid and eligible for bounty award. HackerOne has awarded you for it in the backend. 

Thank you again for your time on this challenge and apologies for the delay.
- **2022-07-28** @g4mb4: Oh! Thank you so much!

Have a great day :)
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
