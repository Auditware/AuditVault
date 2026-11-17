---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
date: 2024-10-21
submitted: 2022-11-20T10:23:27.636Z
bounty_usd: null
votes: 63
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "vidaamuyarchi"
source: "https://hackerone.com/reports/1779447"
title: "Reflected - XSS"
---
# Reflected - XSS

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 63 | **Program:** MTN Group | **Disclosed:** 2024-10-21

- Report: [https://hackerone.com/reports/1779447](https://hackerone.com/reports/1779447)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2022-11-20T10:23:27.636Z

## Report summary

POC Video :- https://youtu.be/HLshcsX1GwU?si=BM0VLLNjbM8ZwBbi

* https://youtu.be/gT-0RwW0mRM?si=yUhC-N1Hk33pcBwj

## Timeline

- **Report Filed**
- **2022-11-20** @vidaamuyarchi: {F2041016}
- **2022-11-20** @vidaamuyarchi: Mouse Right Click button Click to popup the XSS
- **2022-11-20** @vidaamuyarchi: More Payloads :- 

* <img src=xss onerror=prompt('XSS')>
* "><img/src="x"/onerror=prompt(1)>
- **Report Triaged**
- **2022-12-19** @kdrmtn: @avathar101 please retest
- **Report Resolved**
- **2023-02-09** @vidaamuyarchi: send Payment
- **2023-03-14** @vidaamuyarchi: ## Sorry For The Late Retest 
* Fixed This Bug

{F2226545}
- **2023-03-14** @vidaamuyarchi: Ok thanks. What about bounty?@kendad0122
- **2023-03-14** @vidaamuyarchi: Please Publicly Disclosed this Report
- **2023-03-15** @vidaamuyarchi: Are you able to reproduce the vulnerability report?

>No, the fix works.

Please provide a short summary with the results of your retest


>Yes, this vulnerability has been fixed now
Nice work
- **2023-06-18** @vidaamuyarchi: Hello team,

I'm waiting for bounty

Your truthfully
@th3n00bb0y
- **Agreed On Going Public**
- **Report Became Public**
