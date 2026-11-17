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
date: 2020-09-03
submitted: 2020-07-30T16:07:19.572Z
bounty_usd: null
votes: 20
cve: []
program: "[[programs/equifax|Equifax-vdp]]"
reporter: "aksquare"
source: "https://hackerone.com/reports/947946"
title: "Open SonarQube instance leaking internal source code"
---
# Open SonarQube instance leaking internal source code

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 20 | **Program:** Equifax-vdp | **Disclosed:** 2020-09-03

- Report: [https://hackerone.com/reports/947946](https://hackerone.com/reports/947946)
- CWE: Information Disclosure
- Submitted: 2020-07-30T16:07:19.572Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2020-07-30** @h1_analyst_andrew: Hi @aksquare,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@retina
- **Report Severity Updated**
- **2020-07-30** @h1_analyst_andrew: Hi @aksquare - I'm discussing this submission internally with the Equifax team. You will be updated as soon as there is additional information to share. Thanks for your patience!
- **2020-07-30** @aksquare: Sure, thank you @retina!
- **Report Severity Updated**
- **Report Triaged**
- **2020-07-31** @5ly: Thank you @retina for your help
Hi @aksquare , thank you so much for your amazing finding !!! We are currently fixing this asap, I will be increasing the severity of this to Critical. Thank you very much for keeping an eye for us, please stay around for any updates we make.
- **Report Severity Updated**
- **2020-08-01** @aksquare: @retina Thanks for the triage!
@5ly Looking forward to any updates

Cheers!
- **2020-08-03** @5ly: Hi @aksquare , as you may have noticed we have closed out the access to this server, could you give us the IP you used to discover this for our threat investigation team?

Thank you !
- **2020-08-03** @aksquare: Hello!
Yes, I can confirm that I am no longer able to access the SonarQube instance. 
Regarding the IP, I am afraid I won't be able to give you that since I was traveling when I reported the issue. 
These are my IP right now - 
2409:4042:209b:10f3:b856:5940:f093:9c5c 
169.254.174.32

I might have used it for accessing the instance, but I can't be sure

If it helps, I was in Pune - Nashik region of Maharashtra, India when I accessed and reported the issue and that might be reflective in the IP address too. 

Let me know if there is anything else I can do
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
