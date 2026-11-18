---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2024-09-20
submitted: 2023-03-12T00:36:18.041Z
bounty_usd: null
votes: 75
cve: []
program: "[[programs/drugs_com|Drugs.com]]"
reporter: "vidaamuyarchi"
source: "https://hackerone.com/reports/1901706"
title: "Stored Xss On 'https://www.question.com/'"
---
# Stored Xss On "https://www.question.com/"

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 75 | **Program:** Drugs.com | **Disclosed:** 2024-09-20

- Report: [https://hackerone.com/reports/1901706](https://hackerone.com/reports/1901706)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2023-03-12T00:36:18.041Z

## Report summary

POC Video :- https://youtu.be/HLshcsX1GwU?si=BM0VLLNjbM8ZwBbi

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Team I'm Find the Stored Xss On your Site

Stored XSS, also known as persistent XSS, is the more damaging than non-persistent XSS. It occurs when a malicious script is injected directly into a vulnerable web application.

Steps To Reproduce:

1.  Go To Your Site https://www.question.com/
2. Nave https://www.question.com/ask/
5. Ask a Question Enter the Payload ```<iframe onload=alert(document.domail)>```
3.  Click to Sumit Question & Redirect to https://www.question.com/iframe-onload-alert-9-1631390.html
4. XSS was Tigred you See the Popup

POC

████

Tested on Firefox and chrome.

## Impact

The attacker can steal data from whoever checks the report.

## Timeline

- **Report Filed**
- **2023-03-12** @vidaamuyarchi: {F2222145}
- **2023-03-12** @vidaamuyarchi: █████
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **2023-03-13** @vidaamuyarchi: Bounty ??
- **2023-03-13** @vidaamuyarchi: ##Ok thanks. What about bounty?@asenci
- **2023-03-15** @asenci: Hi @th3n00bb0y, unfortunately we are unable to offer bounties at the moment.
We can publish your details to our "Security Researcher Hall of Fame" if you like? https://www.drugs.com/support/security-hall-of-fame.html
- **2023-03-15** @vidaamuyarchi: Hi @asenci 
I'm Accepted to  Hall of Fame, My Name```Ranjithkumar S.Pachiyappaan```  & You Can Publicly disclose this Report? 

Please You Can Send Minimum Bounty !!!!

Thank you again.
 @th3n00bb0y
- **2023-03-17** @vidaamuyarchi: Any update????
- **2023-03-21** @asenci: We have included your name in our security hall of fame as requested: https://www.drugs.com/support/security-hall-of-fame.html
Unfortunately we are unable to disclose the report at this time.
- **2023-06-18** @vidaamuyarchi: Hello team,

I'm waiting for bounty

Your truthfully
@th3n00bb0y
- **Agreed On Going Public**
- **Report Became Public**
- **2024-09-21** @vidaamuyarchi: POC Video  :-

https://youtu.be/HLshcsX1GwU?si=eHjDHdEKCOIP1tar
