---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2022-07-11
submitted: 2021-02-16T11:32:40.012Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/glovo|Glovo]]"
reporter: "battle_angel"
source: "https://hackerone.com/reports/1104349"
title: "Server Side Template Injection on Name parameter during Sign Up process"
---
# Server Side Template Injection on Name parameter during Sign Up process

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Glovo | **Disclosed:** 2022-07-11

- Report: [https://hackerone.com/reports/1104349](https://hackerone.com/reports/1104349)
- CWE: Code Injection
- Submitted: 2021-02-16T11:32:40.012Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Server-side template injection is when an attacker is able to use native template syntax to inject a malicious payload into a template, which is then executed server-side. 
In this scenario, when an attacker signs up on the platform and uses a payload in the **First Name** field, the payload is rendered server side and it gets executed in the promotional/welcome emails sent to the user

## Steps To Reproduce:
Step 1: Navigate to [Glovoapp] (https://www.glovoapp.com/kg/en/bishkek/) and click on **Register**
Step 2: Now, in the ```First Name``` field, enter the value ```{{7*7}}```

{F1197322}


Step 3: Fill in the rest of the values on the Register page and register your account.

{F1197320}


Step 4: We have used the payload ```{{7*7}}``` here to verify that it is being evaluated at the backend
Step 5: Now, wait for the welcome/promotional email to arrive in your Inbox
Step 6: Notice that the email arrives with the Subject as ```49, welcome to Glovo!```

{F1197321}


Step 7: The attacker can now further exploit this issue by injecting malicious payloads in the Name field and gathering sensitive information from the application.


Note- After carrying out this attack, I didn't receive any welcome email for my other account maybe because the code broke.

## Impact

Template engines are widely used by web applications to present dynamic data via web pages and emails. Unsafely embedding user input in templates enables Server-Side Template Injection, which can be used to directly attack web servers' internals and often obtain Remote Code Execution (RCE), turning every vulnerable application into a potential pivot point.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2021-02-17** @h1_analyst_dhaval: Hi @battle_angel,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@saffron
- **Report Needs More Info**
- **Report New**
- **2021-02-23** @h1_analyst_dhaval: Hi @battle_angel

Thanks for the additional information, I'm discussing this submission internally with the Glovo team for additional inputs. You will be updated as soon as there is additional information to share.

Thanks
@saffron
- **2021-03-03** @battle_angel: Hi @saffron ,

Any updates?
- **2021-03-08** @h1_analyst_dhaval: Hi @battle_angel,

Thanks for reaching out, so far there are no new updates to share but keep an eye on this ticket for any changes. Thank you for your patience!

Kind regards,
@saffron
- **Report Resolved**
- **Agreed On Going Public**
- **2021-09-21** @battle_angel: Hi @madaga ,

Thank you for the testimonial. 
Requesting full disclosure for this report. Thanks!

Kind regards,
@battle_angel
- **Agreed On Going Public**
- **Report Became Public**
