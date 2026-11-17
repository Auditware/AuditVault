---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/authentication-bypass-using-an-alternate-path-or-channel
  - env/web
substate: "resolved"
weakness: "Authentication Bypass Using an Alternate Path or Channel"
enriched: true
date: 2024-09-14
submitted: 2022-09-23T14:15:28.376Z
bounty_usd: null
votes: 109
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "reachaxis"
source: "https://hackerone.com/reports/1709881"
title: "Authentication Bypass Leads To  Complete Account TakeveOver on ██████████"
---
# Authentication Bypass Leads To  Complete Account TakeveOver on ██████████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 109 | **Program:** MTN Group | **Disclosed:** 2024-09-14

- Report: [https://hackerone.com/reports/1709881](https://hackerone.com/reports/1709881)
- CWE: Authentication Bypass Using an Alternate Path or Channel
- Submitted: 2022-09-23T14:15:28.376Z

## Report summary

**The application's backend logic placed too much trust on the login information submitted by the user which allowed a remote attacker to bypass authentication and perform account takeover for all users with the wrong password. More details can 
be found here**
https://medium.com/@reachaxis/how-i-took-over-100-000-user-account-without-knowing-their-password-part-one-7d965ae9e47a

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-09-27** @reachaxis: Many thanks.
- **2023-01-12** @reachaxis: Hi @incognito4,
I hope you are doing well. I know your team is a busy working on other reports. But is there any updates in the meantime, since this report has been queued more than 90 days.
Including these #1707720, #1711864

Kind regards!
@v3rvain0001
- **Report Resolved**
- **2023-02-02** @reachaxis: @kendad0122 
Thanks for resolving this issue.
- **2023-02-02** @reachaxis: @kendad0122, please, kindly justify redactions for any information that is deemed sensitive on this report including #1707720, #1709881, #1711864, #1714638, #1746638 .

Best Regards!
@v3rvain0001
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **2024-02-29** @reachaxis: Hello @vsekay,

Seeing this type of vulnerability which is rather common and quite critical, I am currently working on an article / blog post about my recent findings related to **Broken Object Level Authorization + Authentication Failures**. You can consider this an early warning for public disclosure, but I assure you that I will not be publishing anything before a full fix is confirmed from your side. 

Thanks!
@reachaxis
- **Agreed On Going Public**
- **Report Became Public**
