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
date: 2023-06-23
submitted: 2023-04-18T16:46:58.558Z
bounty_usd: null
votes: 32
cve: []
program: "[[programs/mars|Mars]]"
reporter: "0xs4m"
source: "https://hackerone.com/reports/1952771"
title: "████ ' can change any account email and cannot retrieve his account and access it ' at ███"
---
# ████ ' can change any account email and cannot retrieve his account and access it ' at ███

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 32 | **Program:** Mars | **Disclosed:** 2023-06-23

- Report: [https://hackerone.com/reports/1952771](https://hackerone.com/reports/1952771)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2023-04-18T16:46:58.558Z

## Report summary

An Insecure Direct Object Reference (IDOR) vulnerability was present in the user profile update functionality on the  ██████████ website. The vulnerability allows an authenticated attacker to modify the email associated with any user account by manipulating the ' ██████████ ' parameter in the POST request sent to the ' ██████████ ' endpoint. The attacker can leverage this vulnerability to potentially take control of victim accounts by changing the email and initiating a password reset.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Report Retesting**
- **2023-04-27** @0xs4m: hi ███████████  
i retested , it's fixed, he show me error message 
```
<script>alert('BAD FORMAT REQUEST');history.back();</script>
```
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
