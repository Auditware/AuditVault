---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - vuln/authentication-bypass
  - vuln/info-disclosure
substate: "duplicate"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2024-07-11
submitted: 2024-05-01T21:22:03.302Z
bounty_usd: null
votes: 37
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "bob004x"
source: "https://hackerone.com/reports/2486086"
title: "Two-factor authentication bypass lead to information disclosure about the program and all hackers participate"
---
# Two-factor authentication bypass lead to information disclosure about the program and all hackers participate

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 37 | **Program:** HackerOne | **Disclosed:** 2024-07-11

- Report: [https://hackerone.com/reports/2486086](https://hackerone.com/reports/2486086)
- CWE: Information Disclosure
- Submitted: 2024-05-01T21:22:03.302Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Two-factor authentication bypass lead to information disclosure about the program and all hackers participate  

**Description:**
Hi dear
 when you have an invitation from a program and to accept that invitation to see the program content you need to have Two-factor authentication turned on , 
try to use google app ==without an account== to turn on the tow factor in that way you can access the apps and accept the invitation and see all the program details and all hacker participate 
if you back to turn off the tow factor and set it again with your email from google app  you will find that you have been emailed again with invitations to accept it   
 like you didn't see that before

### Steps To Reproduce

1. Turn on the tow factor with any mobile with option  ==without an account==

2. Try to access your invitation for any program  

3. Accept the invitation to see all the program data and all participate

4-Back to turn off  the  tow factor

5-Turn on again and connect it that time==with your email== from google app 

6-You will notice that you have been invited again to the same programs via email 
████

███████

7- Accept the invitation that time to see all the data you have seen before    



██████████
==In the video you will notice that i have accept the invitation for mondoo  program two times with the two factor time setup==

## Impact

information disclosure for all the private programs data without being accepting the invitation

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Duplicate**
- **2024-05-05** @bob004x: Thanks dear @h1_analyst_pablo, can you please add me to the original report?
- **2024-05-05** @bob004x: Hi dear 
Truly  i don't know why its been informative its a misconfiguration in  2fa ,  if you see its info can you please explain why the hackerone program make that function to make the researcher cant see the program details without verified the 2fa and accepting the invitation  that's the logic the designer wanted to perform for all researchers and here we have bypassed it in a way or another  
please take another look for it . 
thanks dear @h1_analyst_pablo
- **Hacker Requested Mediation**
- **2024-05-06** @h1_analyst_pablo: Hi @bob004x,

Thank you for your response.

For transparency, I am including an excerpt here from the original report:

>  This is not something that can be leveraged to cause any security risk and/or impact and shall not be tracked internally as a security vulnerability.

All the best for your next find! 

Cheers,
@h1_analyst_pablo
- **Agreed On Going Public**
- **Report Collaborator Invited**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **Report Collaborator Invited**
- **Report Collaborator Invited**
- **Agreed On Going Public**
- **Report Became Public**
