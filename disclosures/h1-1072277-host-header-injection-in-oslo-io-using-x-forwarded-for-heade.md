---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2021-01-07
submitted: 2021-01-05T21:03:32.486Z
bounty_usd: null
votes: 37
cve: []
program: "[[programs/logitech|Logitech]]"
reporter: "hammodmt"
source: "https://hackerone.com/reports/1072277"
title: "Host Header injection in oslo.io (using X-Forwarded-For header) leading to email spoofing"
---
# Host Header injection in oslo.io (using X-Forwarded-For header) leading to email spoofing

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 37 | **Program:** Logitech | **Disclosed:** 2021-01-07

- Report: [https://hackerone.com/reports/1072277](https://hackerone.com/reports/1072277)
- CWE: Business Logic Errors
- Submitted: 2021-01-05T21:03:32.486Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Hello team
##I hope it will be a happy year for you and for me 😇 
## Summary:

I found Host Header injection in oslo.io  
I tried to use it to show the security effect on users And I found this

## Steps To Reproduce:

 1. Well, first of all, enter your project 
2.Make an invitation by email 
3.Now through the burpsuite 
If we try to change the host, 403 will appear
  {F1145857}

So we will use  ```X-Forwarded-Host:  example.com```
 
PoC : 
{F1145858}

## Impact

Many things can be done, including deceiving the user and referring to something else or a login page and stealing their account
>>There is a lot of information about it here : 

 https://portswigger.net/web-security/host-header

## Timeline

- **Report Filed**
- **2021-01-06** @h1_analyst_leevi: Hi @hammodmt,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@tsukuyomix
- **Report Not Applicable**
- **2021-01-06** @hammodmt: Please look again. I never expected it to close as n / a
- **2021-01-06** @hammodmt: Hope to see the video again knowing the danger
- **Report Reopened**
- **Report Needs More Info**
- **Report New**
- **2021-01-06** @hammodmt: #Thank you @tsukuyomix

I have seen and read many reports on this subject
The least that can be exploited in this way is the following

#Simple scenario

I do my own server
I direct the victim to this link on my site
I make a login interface and this way I can access his account

Some risks
>Password Reset Poisoning-Exploiting password reset emails and tricking them to deliver poisoned content directly to the target.
- **Report Severity Updated**
- **Report Triaged**
- **Report Title Updated**
- **2021-01-07** @hammodmt: Thank you
- **Report Title Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
