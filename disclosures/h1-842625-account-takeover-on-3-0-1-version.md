---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2020-06-14
submitted: 2020-04-07T15:36:39.138Z
bounty_usd: null
votes: 65
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "elfiman"
source: "https://hackerone.com/reports/842625"
title: "account takeover on 3.0.1 version"
---
# account takeover on 3.0.1 version

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 65 | **Program:** Rocket.Chat | **Disclosed:** 2020-06-14

- Report: [https://hackerone.com/reports/842625](https://hackerone.com/reports/842625)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2020-04-07T15:36:39.138Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I find user reset password hash info and other security info on "/api/v1/[users.info](http://users.info)"  
note : I login on rocketchat with ldap account (my role : user)  
note: in request "[https://target/api/v1/users.info?username=[x]](https://target/api/v1/users.info?username=%5Bx%5D)" you should change usrname to userId

1- please login with user ldap account (role user)  
2- send a request to&nbsp;[https://target/api/v1/users.list](https://target/api/v1/users.list)&nbsp;and copy \_id value  
3- send a request to&nbsp;[https://target/api/v1/users.info?userId=[userId]](https://target/api/v1/users.info?userId=%5BuserId%5D)&nbsp;and copy email value (in response you can see important security information )  
4- logout and click "forget your password" link on&nbsp;[https://target/home](https://target/home)&nbsp;and send an email to above email address that you copied  
4- login with Your account and send a request to&nbsp;[https://target/api/v1/users.list](https://target/api/v1/users.list)&nbsp;and search the same email in response and copy \_id value  
5- send a request to&nbsp;[https://target/api/v1/users.info?userId=[userId]](https://target/api/v1/users.info?userId=%5BuserId%5D)&nbsp;and copy reset hash value  
6- logout your account and send a request to&nbsp;[https://target/reset-password/[reset\_hash]](https://target/reset-password/%5Breset_hash%5D)  
7- set new password  
8- login and enjoy

## Impact

account takeover

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2020-04-21** @elfiman: hi @markus-rocketchat 
You made me happy
Would you let me publish this bug in Hacker One?

best
Samira
- **Agreed On Going Public**
- **2020-05-12** @markus-rocketchat: Hi @elfiman 

would you be okay to delay the disclosure for a bit of time? Our admins are often not so quick to update and it would be great to give them a bit more time to patch.

You could just click "cancel disclosure" and then click request to disclose again, so we get the counter started again. OK with you?

Thank you for understanding.

Best
Markus
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **2020-05-22** @elfiman: Hi @markus-rocketchat

How can I register a cve for this bug? 
Can you help me?
Is Hacker One itself a way out?

Best
Samira
- **Report Became Public**
