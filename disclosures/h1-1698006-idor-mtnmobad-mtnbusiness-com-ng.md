---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2022-10-13
submitted: 2022-09-12T13:25:43.161Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "insomnia_hax"
source: "https://hackerone.com/reports/1698006"
title: "IDOR  [mtnmobad.mtnbusiness.com.ng]"
---
# IDOR  [mtnmobad.mtnbusiness.com.ng]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 28 | **Program:** MTN Group | **Disclosed:** 2022-10-13

- Report: [https://hackerone.com/reports/1698006](https://hackerone.com/reports/1698006)
- CWE: N/A
- Submitted: 2022-09-12T13:25:43.161Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Steps To Reproduce:

  1.  Go to https://mtnmobad.mtnbusiness.com.ng/#/dashboard/home with burp proxy
  1. Intercept a POST request to /app/dashboardData and review its response you will see emails and ids 
  1. Go to https://mtnmobad.mtnbusiness.com.ng/#/userProfile
  1. change name, mobile, address etc. and intercept with burp proxy
  1. change the id and the email with victim's and forward the request
  1. The changes will be saved in the victim's account


# Note:

If you already know account's email and id you can skip step 1 and 2

## Supporting Material/References:

  {F1922714}

## Impact

An attacker can change every user's account information

## Timeline

- **Report Filed**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
