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
date: 2021-01-11
submitted: 2020-08-29T09:00:02.389Z
bounty_usd: null
votes: 59
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "a13h1"
source: "https://hackerone.com/reports/970157"
title: "Bypass Password Authentication to Update the Password"
---
# Bypass Password Authentication to Update the Password

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 59 | **Program:** X / xAI | **Disclosed:** 2021-01-11

- Report: [https://hackerone.com/reports/970157](https://hackerone.com/reports/970157)
- CWE: Improper Authentication - Generic
- Submitted: 2020-08-29T09:00:02.389Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**This additional security measure from twitter provides protection to the victim's account, considering that a victim's session may have been hijacked by a hacker, however, due to this additional layer of security Implemented by twitter the hacker would not be able to change the victim's Password, as they will be prompted to enter the victim's account password In order to make these changes, which will not be known to a hacker (In case of a session hijack)

This report is to bring to your attention a security vulnerability that will allow hackers that have hijacked a user's session to bypass the password screen (Without knowing the user's password) 

**Description:** For users that have had their twitter session hijacked, this security vulnerability would enable a hacker to completely take over a victim's account as they will be able to change the victim's password by bypassing the old password by the umrestricted rate limit or bruteforcing in the password

## Steps To Reproduce:

With the assumption that the victim's twitter session is 'hijacked' and in a 'logged in' state for the hacker. The below steps must be followed In order to reproduce the security vulnerability.

  Security Vulnerability #1 - Update Victim's Password - Bypass old password by unrestricted rate limiting


1.Go to Settings and Privacy -> Accounts
2.Click on Email -> Password
3.Enter any random password and Click on 'Next'
4.Intercept the request the above request and send it to intruder
5.Then select the position old password
6.Then go in payload add password list 
7.Then start the attack bcoz of no rate limit the password bruteforcing is continue and find the correct password and update the old one

**Resolution:** Apply the Rate Limitation 



## Supporting Material/References:

## Impact

This a serious security vulnerability, as It could lead to a hacker completely taking over the user's account by overriding twitter's security protocol as they could use this technique to bypass the password and it use to fully takeover the victim password

## Timeline

- **Report Filed**
- **2020-08-29** @a13h1: POC video how to reproduce the issue
- **2020-08-30** @a13h1: Any update..?
- **Report Needs More Info**
- **Report New**
- **2020-09-01** @bugtriage-christian: Thank you for your report @a13h1,

We're looking into this and will keep you updated when we have additional information.

Thank you for thinking of Twitter Security.
- **2020-09-01** @a13h1: Ok thanks @bugtriage-christian
- **2020-09-02** @a13h1: Any Update..?
- **Report Triaged**
- **2020-09-03** @a13h1: Thanks @asayler
- **2020-09-04** @a13h1: Any update....!
- **2020-09-14** @a13h1: Hey team,
I think the issue is patched did i get any update about this report or about the bounty rewards because i need some money to pay my rent of this month i m just waiting for this issue biunty
Thanks
- **Bounty Awarded**
- **2020-09-26** @a13h1: Any update about this report or resolution
- **2020-10-12** @a13h1: Hey i think the issue is patched now any update from you
- **Report Resolved**
- **Agreed On Going Public**
- **2021-01-08** @asayler: @a13h1, are you okay with the  video and screenshot included earlier in this report being disclosed, or would you like me to make those private those prior to disclosure? They appear to contain auth tokens and passwords for your test account.
- **2021-01-09** @a13h1: Hey @asayler

Make that video hide/private which I attached first to reproduce the issue only and disclose the report
- **2021-01-11** @asayler: Thanks, @a13h1. The video has been made private and this report will now be disclosed.
- **Agreed On Going Public**
- **Report Became Public**
