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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Summary
I came across an open SonarQube instance which can be found here: http://34.238.92.229:9000/
In this, there are 10 projects with a total of around 100k lines of code
To identify the owner, I went to the Issues tab and expanded the list of authors. There were 29 people there, and many of them were Equifax employees (I reached this conclusion because they have @equifax.com email id). 
Some of the projects there in the instance are related to authentication and APIs. One of the largest projects there is called zoomv2
Owing to the sensitive nature of the leakage, I did not dig deeper through the source code, however, I believe that this much information is enough for a POC. However, if you need more information, then I will be happy to dig through the source code there and give specific examples of how the information can be misused.

# Steps to recreate:
1. Go to http://34.238.92.229:9000/
2. There you can click on the issues tab, and then on the bottom left corner, click on Author
3. You will see a list of people who have contributed to the projects and can confirm that many of the people are Equifax employees
4. Go to Projects tab and see all the projects and their source code that are leaked 

# Fix
Put the instance behind a login screen, and check if unauthorised users have accessed this instance. If possible revoke access to any API keys or other credentials that were exposed in this instance

*I understand that there were other people from other companies in this instance too, and that this might not be an instance owned by Equifax. However, even though Equifax was not the owner, it still is involved with this particular instance, and thus I decided to report it to you.

## Impact

SonarQube is used to automate finding issues and vulnerabilities in source code. By leaving this instance open, an attacker can get access to all the source code, the issues, and the vulnerabilities that the particular code has. If this code is in a production environment, then this information is extremely dangerous. And even if the project is not in production, this kind of information can have internal APIs, IPs and other sensitive data that can be taken advantage of in other ways.

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
