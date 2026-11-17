---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2022-03-29
submitted: 2021-06-12T22:38:33.729Z
bounty_usd: 560
votes: 30
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "aymen_mansour"
source: "https://hackerone.com/reports/1225164"
title: "Identify the mobile number of a twitter user"
---
# Identify the mobile number of a twitter user

> **Severity:** Critical | **Bounty:** 560 USD | **Votes:** 30 | **Program:** X / xAI | **Disclosed:** 2022-03-29

- Report: [https://hackerone.com/reports/1225164](https://hackerone.com/reports/1225164)
- CWE: Information Disclosure
- Submitted: 2021-06-12T22:38:33.729Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2021-06-16** @aymen_mansour: Hello,

I am familiar with the password reset process. do not hesitate to ask me questions for any clarification concerning the attack scenario.

The idea is to block a user from resetting his password through his username then brute force in a list of mobile number (which contains the last two digits of victim and a determined number of digits) and to identify the mobile number blocked, it is the victim's mobile number

Regards
- **Report Needs More Info**
- **Report New**
- **2021-06-17** @aymen_mansour: Hello,

The security vulnerability reported in this report can cause a massive data leak. it is clear that the impact is critical on the confidentiality of user data.

Regards
- **2021-06-17** @bugtriage-sophia: Thank you for your response @aymen_mansour,

We are investigating the behavior you described and will get back to you when we have more information.

Thank you for thinking of Twitter security
- **Report Triaged**
- **Bounty Awarded**
- **2021-08-23** @aymen_mansour: Hello,

Please provide an update for the resolution of this security issue.

Regards
- **2021-12-02** @aymen_mansour: Hello,

Can give you the state of progress of this case ?

Regards
- **Report Resolved**
- **2022-03-12** @aymen_mansour: Hello,

I confirm that this vulnerability has been fixed and an attacker cannot obtain the mobile number associated with the user.

Regard
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
