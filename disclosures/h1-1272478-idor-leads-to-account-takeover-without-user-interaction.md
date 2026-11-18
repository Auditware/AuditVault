---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/idor
  - impact/account-takeover
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2022-09-04
submitted: 2021-07-21T18:40:29.205Z
bounty_usd: null
votes: 35
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "theranger"
source: "https://hackerone.com/reports/1272478"
title: "IDOR Leads To Account Takeover Without User Interaction"
---
# IDOR Leads To Account Takeover Without User Interaction

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 35 | **Program:** MTN Group | **Disclosed:** 2022-09-04

- Report: [https://hackerone.com/reports/1272478](https://hackerone.com/reports/1272478)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2021-07-21T18:40:29.205Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hello Team,
There's IDOR Bug on this subdomain `mtnmobad.mtnbusiness.com.ng` leads to account takeover, More details check the Poc. 

## Steps To Reproduce:

  1. Create two accounts on `mtnmobad.mtnbusiness.com.ng` and both accounts verify the emails from your email inbox
  2. Login to attacker account on Browser A Go to update Profile Try to update the address for example and Capture the Request with burp send it to `Repeater`
{F1384484}
3. Login to Victim account on browser B do the same to get the victim `ID` you can Grab his ID without sending this request to `Repeater`
4. Go to the Attacker Request You sent to `Repeater` Change `/ID` with the Victim's `ID` you Grabbed From Step 3 Then change `Email` with different email, you need to change the `username` parameter not the `email` see this screenshot, Leave the email as your attacker email. the `username` Value is email and just update that one.

{F1384509} 
5.  Go Reset the Password (act like you don't know the Pass XD), login and successfully account Takeover without User Interaction

## Supporting Material/References:
--Check this Video :
{F1384553}

## Impact

Full account Takeover without user interaction

## Timeline

- **Report Filed**
- **2021-07-25** @theranger: ##A little update
The Given numeric IDs for users is also kinda weak, for example on my test accounts one of them `572` and the second one `573` which means there's definitely users on `571`, `570` and so on.
So if an attacker exploited this with +500 emails he'll change every account `Email Addresses` on the system and reset the passwords for all the accounts on that specific domain.
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
