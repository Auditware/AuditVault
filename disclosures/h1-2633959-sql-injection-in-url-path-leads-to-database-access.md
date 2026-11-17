---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2025-01-08
submitted: 2024-07-31T22:39:36.605Z
bounty_usd: null
votes: 115
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "tinopreter"
source: "https://hackerone.com/reports/2633959"
title: "SQL injection in URL path leads to Database Access"
---
# SQL injection in URL path leads to Database Access

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 115 | **Program:** MTN Group | **Disclosed:** 2025-01-08

- Report: [https://hackerone.com/reports/2633959](https://hackerone.com/reports/2633959)
- CWE: SQL Injection
- Submitted: 2024-07-31T22:39:36.605Z

## Timeline

- **Report Filed**
- **2024-08-01** @slydingdong1: Hi @tinopreter 

How did you find this domain because it does not appear on the list of our assets.

Regards
- **Report Triaged**
- **2024-08-01** @tinopreter: Hi @slydingdong1 

I usually pick one country and decide to enumerate all MTN asset that exist for that country. 

So I performed some intensive asset discovery over the internet to discover assets that belonged to MTN ZA. My bad if it's out of scope. Due to the nature of the vulnerability, I just couldn't ignore it so I decided to report it. 

Moving forward, I'll strictly stick to the defined scope.
- **Report Triaged**
- **Report Resolved**
- **2024-10-04** @tinopreter: Hi @slydingdong1,

Thanks for resolving this. Can you please resolve this one too #2633941 as it affects the same domain.
- **2024-12-09** @tinopreter: Hello @slydingdong1 

Since this has been resolved, can you please allow disclosure?
- **Agreed On Going Public**
- **Report Became Public**
