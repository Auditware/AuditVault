---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2017-06-17
submitted: 2017-01-22T14:42:55.144Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/eternal|Eternal]]"
reporter: "madrobot"
source: "https://hackerone.com/reports/200355"
title: "MailPoet Newsletters <= 2.7.2 - Authenticated Reflected Cross-Site Scripting (XSS)"
---
# MailPoet Newsletters <= 2.7.2 - Authenticated Reflected Cross-Site Scripting (XSS)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Eternal | **Disclosed:** 2017-06-17

- Report: [https://hackerone.com/reports/200355](https://hackerone.com/reports/200355)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2017-01-22T14:42:55.144Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello __Team__

__Abstract__:-
A Cross-Site Scripting vulnerability was found in the MailPoet Newsletters plugin. This issue allows an attacker to perform a wide variety of actions, such as stealing Administrators' session tokens, or performing arbitrary actions on their behalf. In order to exploit this issue, the attacker has to lure/force a logged on WordPress Administrator into opening a URL provided by an attacker.

__Introduction__:-
The MailPoet Newsletters plugin allows a WordPress administrator to create newsletters, automated emails, post notifications and autoresponders. A Cross-Site Scripting vulnerability was found in the MailPoet Newsletters plugin. This issue allows an attacker to perform a wide variety of actions, such as stealing Administrators' session tokens, or performing arbitrary actions on their behalf. In order to exploit this issue, the attacker has to lure/force a logged on WordPress Administrator into opening a URL provided by an attacker.

__Proof of concept__:-
Have an authenticated admin visit the URL:-

https://business-blog.zomato.com//?wysija-page=1&controller=subscribers&action=wysija_outter&encodedForm=eyJmb3JtIjoiUHduIiwiYWZ0ZXJfd2lkZ2V0IjoiPHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4ifQ==
The encodedForm parameter is the base64 encoded string:
{"form":"Pwn","after_widget":"<script>alert('XSS)</script>"}

A pop-up box should appear, meaning the JavaScript contained in the request_id request parameter was executed by the browser.

{F154227}

__Fix__:-
This issue is resolved in MailPoet Newsletters version 2.7.3.

__Regards__,
Santhosh

## Timeline

- **Report Filed**
- **2017-01-22** @madrobot: Same plugin allows sqli
> https://wpvulndb.com/vulnerabilities/8618
- **Report Severity Updated**
- **2017-03-24** @madrobot: Hello @zomato 
Any updates
- **2017-05-17** @madrobot: Hello @zomato 
 Its been 4 months 
Any updates on this
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **Not Eligible For Bounty**
