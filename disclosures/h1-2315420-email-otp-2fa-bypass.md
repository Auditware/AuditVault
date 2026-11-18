---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
  - vuln/authentication-bypass
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2024-06-16
submitted: 2024-01-14T19:44:28.986Z
bounty_usd: null
votes: 100
cve: []
program: "[[programs/drugs_com|Drugs.com]]"
reporter: "akhan8041"
source: "https://hackerone.com/reports/2315420"
title: "Email OTP/2FA Bypass"
---
# Email OTP/2FA Bypass

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 100 | **Program:** Drugs.com | **Disclosed:** 2024-06-16

- Report: [https://hackerone.com/reports/2315420](https://hackerone.com/reports/2315420)
- CWE: Improper Authentication - Generic
- Submitted: 2024-01-14T19:44:28.986Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The application has a functionality of 2FA by email OTP so i can bypass that 2FA and got the access of application without having any access of victim account. when a user try to login in the application and enter username and password, the 2FA page is available and application generate all the cookies like "PHPSESSID" or "bb_sessionhash"  at same time at 2FA page that is responsible for the user session but there is a cookie named "bb_refresh" if i delete that cookie and refresh the page again then i can successfully login to the application without 2FA. 

## POC:
1. Login with correct username and password
2. Right click and open inspect element and go to application tab 
3. Select Cookie form the left panel and select drugs.com
4. Delete the cookie named "bb_refresh"
5. Now refresh the page again and Boom !  You Logged In !

████████

## Impact

A 2FA bypass in a web application compromises user security, allowing unauthorized access. Attackers can exploit this vulnerability to gain control over accounts, leading to potential data breaches, privacy violations, and unauthorized actions.

## Timeline

- **Report Filed**
- **Report Resolved**
- **2024-01-15** @akhan8041: Hello @wsmaz thank you for your response please check and respond for my other findings in your critical domains also, that is pending form a very long.
- **2024-04-04** @akhan8041: Hello i am on 1st rank on your program so can i get Hall of Fame for it ?
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
