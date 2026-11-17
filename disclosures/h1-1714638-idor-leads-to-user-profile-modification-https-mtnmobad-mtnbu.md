---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/incorrect-authorization
  - env/web
substate: "resolved"
weakness: "Incorrect Authorization"
enriched: true
date: 2024-09-18
submitted: 2022-09-27T19:26:20.006Z
bounty_usd: null
votes: 96
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "reachaxis"
source: "https://hackerone.com/reports/1714638"
title: "IDOR Leads To  User Profile Modification https://mtnmobad.mtnbusiness.com.ng/app/updateUser"
---
# IDOR Leads To  User Profile Modification https://mtnmobad.mtnbusiness.com.ng/app/updateUser

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 96 | **Program:** MTN Group | **Disclosed:** 2024-09-18

- Report: [https://hackerone.com/reports/1714638](https://hackerone.com/reports/1714638)
- CWE: Incorrect Authorization
- Submitted: 2022-09-27T19:26:20.006Z

## Report summary

It was possible for a remote authenticated attacker to update the profile details of all users due to insufficient authorization check. The profile details include `Mobile Number`,`Residential Address`,`Username`

## Timeline

- **Draft Started**
- **Report Filed**
- **Report Triaged**
- **2022-09-28** @reachaxis: Many thanks!
- **2022-10-10** @reachaxis: Hello Team,
Please, point of correction. I forgot to include one extra step for **Attack Step**.
>**5.**  ...repeat step [1, 2, 3 & 4] and Logout.
- **Report Resolved**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Report Became Public**
