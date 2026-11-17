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
