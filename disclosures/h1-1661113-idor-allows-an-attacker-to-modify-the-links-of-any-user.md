---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
date: 2022-09-30
submitted: 2022-08-06T05:00:00.232Z
bounty_usd: null
votes: 208
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "criptex"
source: "https://hackerone.com/reports/1661113"
title: "IDOR allows an attacker to modify the links of any user"
---
# IDOR allows an attacker to modify the links of any user

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 208 | **Program:** Reddit | **Disclosed:** 2022-09-30

- Report: [https://hackerone.com/reports/1661113](https://hackerone.com/reports/1661113)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2022-08-06T05:00:00.232Z

## Timeline

- **Report Filed**
- **2022-08-08** @h1_analyst_ava: Hello,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@sodacan
- **Report Needs More Info**
- **Report New**
- **2022-08-09** @criptex: Social links should appear in your profile as in this photo:  

{F1855366}

 Let me know when you can put them so I can modify them :)
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **2022-08-09** @les_oeufs: Started a discussion with the product team and notified them right away about this. This could have some bad image impact for Reddit users. Will keep you posted :)
- **Bounty Awarded**
- **2022-08-10** @criptex: @sodacan  @les_oeufs   Thank you very much for the great bounty and the speed of the update :) 

Best regards!!!
- **2022-08-11** @les_oeufs: This looks to have been fixed, mind double checking? Then we close as resolved :)
- **2022-08-12** @criptex: Hey @les_oeufs  I checked many times, and the implemented fix works correctly, however I tell you that the function of modifying social links does not work, perhaps this is an expected behavior.

Please tell me if you need me to check this again.

Best regards!!!
- **2022-09-27** @criptex: Hi @les_oeufs  I have taken a look at this bug again, and the implemented fix works correctly!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
