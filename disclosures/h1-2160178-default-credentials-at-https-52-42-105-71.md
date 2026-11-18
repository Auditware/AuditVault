---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2024-02-01
submitted: 2023-09-16T09:13:33.676Z
bounty_usd: null
votes: 77
cve: []
program: "[[programs/trellix|Trellix]]"
reporter: "forcedrofes"
source: "https://hackerone.com/reports/2160178"
title: "default credentials at https://52.42.105.71/"
---
# default credentials at https://52.42.105.71/

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 77 | **Program:** Trellix | **Disclosed:** 2024-02-01

- Report: [https://hackerone.com/reports/2160178](https://hackerone.com/reports/2160178)
- CWE: Improper Authentication - Generic
- Submitted: 2023-09-16T09:13:33.676Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

hi team i able to login in one of your servers by default credentials

## Steps to reproduce:
1.go to link : https://52.42.105.71/
1.enter this credentials
```
password=admin
username=admin
```

## PoC

{F2703747}

{F2703748}

## How to remediate the vulnerability

Change the password of the user or disable the account

## Impact

the website was misconfigured in a manner that may have allowed a malicious user to login with administrator for the default organization account credentials.

## Timeline

- **Report Filed**
- **2023-09-18** @h1_analyst_andrew: Hi @forcedrofes ,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_andrew
- **Report Triaged**
- **2023-12-31** @forcedrofes: hi @h1_analyst_andrew 

it's same fixed
- **2024-01-02** @yps: Hi @forcedrofes,

The issue have been fixed.
Thanks again for reporting this to us.

Regards,
@yps
- **Report Resolved**
- **2024-01-02** @forcedrofes: hi  @yps can we disclose this report ?
- **Agreed On Going Public**
- **2024-01-03** @doxley: Hi @forcedrofes 
Now that this issue is fixed you are able to disclose the report.  It was a misconfiguration on our side which has been corrected since you reported it.
Regards,
@doxley
- **2024-01-03** @forcedrofes: Hi @doxley ,

Thank for response .

can you agree to disclose the report ?
- **2024-01-04** @doxley: Hi @forcedrofes 
We're discussing your request internally early next week and I'll get back to you afterwards.
@doxley
- **Report Became Public**
