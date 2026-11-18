---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "duplicate"
weakness: null
enriched: true
body: true
date: 2021-12-07
submitted: 2021-11-21T12:51:08.871Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/upchieve|UPchieve]]"
reporter: "anas_44"
source: "https://hackerone.com/reports/1406471"
title: "Authentication Bypass - Email Verification code bypass in account registration process."
---
# Authentication Bypass - Email Verification code bypass in account registration process.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** UPchieve | **Disclosed:** 2021-12-07

- Report: [https://hackerone.com/reports/1406471](https://hackerone.com/reports/1406471)
- CWE: N/A
- Submitted: 2021-11-21T12:51:08.871Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Team,

I was able to bypass Email Verification code in account registration process.

Summary :
Authentication Bypass is a dangerous vulnerability, which is found in Web-Applications. An Attackers can bypass the control mechanisms which are used by the underlying web application like Email verification, OTP, Captcha, 2FA, etc. An Attacker can perform a  complete Account takeover of Victim.

Severity :   High / Critical

Complexity : Easy 

From : Remote / External

Steps to Reproduce:

1- First visit your website "https://hackers.upchieve.org" and request for the sign up.
2- In the second step, choose either you want to register as an academic coach or need an academic coach.
3- In the third step, enter your email and create a password.
4- In the fourth step, enter name and mobile phone, then sign up.
5- Then request for verification code on email.
6- Enter wrong verification code and intercept request using Burp suite.
7- After intercepting the request, I changed the status from "False" to "True".
          {"status":false to "status":true}
8- Boom!! Verification code bypassed.
9- Finally, the account was created with the wrong verification code.


Proof of Concept : 
For better understanding, I have attached screenshots and videos after intercepting the request from Burp Suite.

Recommendations :
The application should protect the sensitive actions and validate the verification process of the web application. Restrict the user for any malicious behavior. 

References:
https://hackerone.com/reports/1040047
https://hackerone.com/reports/57764
https://medium.com/@AGNIHACKERS/otp-bypass-through-response-manipulation-beeb467359d8

## Impact

An Adversary can carry out Auth Bypass attack and perform an Account Take Over. An attacker can succeed in the account takeover of any user without any privileges.

## Timeline

- **2021-11-21** @anas_44: My report is reproducible, it contains clear steps to reproduce the vulnerability.
My report explains exactly what outcome an attacker would achieve.
I have carefully reviewed the UPachieve security page.
- **2021-11-22** @anas_44: Any updates?
- **Report Filed**
- **Report Duplicate**
- **2021-11-25** @anas_44: Acknowledged. 
Thanks for your response.
- **Agreed On Going Public**
- **2021-12-03** @anas_44: Requesting disclosure so fellow hackers wont report similar findings.
- **2021-12-07** @anas_44: Any update?
- **2021-12-07** @thedevelopnik: Hi, thanks for your patience. I was trying to test this with a dev tool we use, and then ran into a bug with the dev tool, and it ended up taking longer than anticipated. I have a fix up for testing at hackers.upchieve.org. Can you please test it there and confirm I got it right? If I did, we'll put it into prod asap, thank you!
- **2021-12-07** @thedevelopnik: Argh, I'm sorry, I posted that in the wrong issue. I'll start a disclosure process.
- **Agreed On Going Public**
- **Report Became Public**
