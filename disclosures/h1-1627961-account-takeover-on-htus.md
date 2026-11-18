---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2022-10-14
submitted: 2022-07-06T14:00:54.350Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "nightm4re"
source: "https://hackerone.com/reports/1627961"
title: "Account takeover on ███████ [HtUS]"
---
# Account takeover on ███████ [HtUS]

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-10-14

- Report: [https://hackerone.com/reports/1627961](https://hackerone.com/reports/1627961)
- CWE: Improper Authentication - Generic
- Submitted: 2022-07-06T14:00:54.350Z

## Report summary

By changing the attacker's email and ID to the existing victim's email, it can be abused and taken over the victim's account.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,
I have found an endpoint in ████████ is vulnerable to Account takeover

Steps to reproduce:
1. Create 2 accounts ( Attacker ( A ) and vicitm ( B ) )
2. Log in to all of them and go to https://███████/███████/EditUserProfile with attacker's account
3. Now fill out the password with your password 
4. Change the attacker's attacker@gmail.com email with victim's email victim@gmail.com
5. Click Submit button and forward the request to repeater
6. Now if the vicim tried to log into his account, he will facing an error
7. Back to the request go to repeater and change the User id of the attacker with the vicim's user ID ( You probley need to brute-force it )
8. Forward the request and you will see 302 code response
9. Stay in the request and change back all changes ( EMAIL and USER ID of Attacker ) and send the request again
9. Now try to log into the victim's victim@gmail.com account with your password
10. You will be logged in



POC:
	████

## Impact

An attacker can takeover accounts

## Timeline

- **Report Filed**
- **2022-07-06** @h1_mediation_neal: Hi @nightm4re,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@fuzzface
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **2022-10-12** @nightm4re: Hello,

I'm still waiting to disclose this report.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
