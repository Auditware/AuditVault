---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/incorrect-authorization
  - env/web
  - vuln/idor
  - trigger/auth-required
substate: "resolved"
weakness: "Incorrect Authorization"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Hello Team,
https://mtnmobad.mtnbusiness.com.ng/app/updateUser allows authenticated users to alter their account profile. But, however, there is no authorization check when updating another user's profile thus, allowing attacker to modify  anyone's profile info such as `Username, Address,  Mobile Number,  Company Name and Company Size`

## Steps To Reproduce:

## Requirements:
Create two Test Accounts (Attacker & Victim)
Login into attacker's account In Mozilla Firefox at https://mtnmobad.mtnbusiness.com.ng/#/login1.   

1. Visit https://mtnmobad.mtnbusiness.com.ng/#/userProfile 
2. Goto to Burp and turn Intercept is on to capture request.
3. Locate this endpoint `POST /app/updateUser HTTP/1.1` while still proxying traffic through Burp. Notice, json blob data being presented.
3. Record `"id":"/###", "email":"redacted+attacker@wearehackerone.com"` for attacker's account and Logout.
4. Now, Login into victim's account and repeat step [1, 2 & 3] and Logout.

## Attack Steps
Login into attacker's account in Mozilla Firefox and Victim's Account in Google Chrome.

1. Using attacker's account in Firefox, visit https://mtnmobad.mtnbusiness.com.ng/#/userProfile and capture request with Burp. 
2. Switch attacker's "id":"/redacted", "email":"redacted+attacker@wearehackerone.com" to victim "id":"/redacted" "email":"redacted+victim@wearehackerone.com" and forward request.
3. Go to victim's account in google chrome and refresh the page.
4. Visit victim's profile and notice, attacker has successfully updated the user's Profile without their knowledge.

## Recommendation/Remediation:
Implement stringent authorization controls to make sure a user has the necessary rights before allowing them to make such a harmful request on another account.
Generate random `userIds`  to prevent attacker from predicting such `userIds`.

## Supporting Material/References:

Video: 
{F1957836}

## Screenshots:
Before:
{F1957817}

## After:
{F1957834}


  * [attachment / reference]

## Tools
BurpSuite Community Edition: [v2022.8.4]
Morzila Firefox: 105.0.1 (64-bit)
Google Chrome: Version 105.0.5195.127 (Official Build) (64-bit)
OS:  Microsoft Windows [Version 10.0.22000.856]

## Impact

An attacker will be able to use this technique to change any user's (advertiser's) profile, for example, a company name and  phone number under the attacker's control to commit a crime entirely in the victim's name.

Regards!
@v3rvain0001

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
