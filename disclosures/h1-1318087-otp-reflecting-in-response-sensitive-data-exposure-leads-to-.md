---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
  - vuln/info-disclosure
  - impact/account-takeover
substate: "not-applicable"
weakness: null
enriched: true
body: true
date: 2022-03-26
submitted: 2021-08-24T17:10:12.801Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/upchieve|UPchieve]]"
reporter: "rupachandransangothi"
source: "https://hackerone.com/reports/1318087"
title: "OTP reflecting in response sensitive data exposure leads to account take over"
---
# OTP reflecting in response sensitive data exposure leads to account take over

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** UPchieve | **Disclosed:** 2022-03-26

- Report: [https://hackerone.com/reports/1318087](https://hackerone.com/reports/1318087)
- CWE: N/A
- Submitted: 2021-08-24T17:10:12.801Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Sensitive data that is otp is reflecting in the response of phone number otp verification in https://app.upchieve.org 

## Steps To Reproduce:


  1. Signin with a account
  2.After signin it will ask for phone number for otp verification.
3.Capture the request using burpsuite and see the response 
4.Now otp is exposing in the response.
5.Account take over is happening.

## Impact

Any attacker can login into user account with his/her otp verification which is a high impact of this website.sensitive data is exposing here

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report Inactive**
- **Agreed On Going Public**
- **Manually Disclosed**
