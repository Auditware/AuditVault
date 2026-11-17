---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
date: 2022-09-04
submitted: 2021-07-21T18:40:29.205Z
bounty_usd: null
votes: 35
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "theranger"
source: "https://hackerone.com/reports/1272478"
title: "IDOR Leads To Account Takeover Without User Interaction"
---
# IDOR Leads To Account Takeover Without User Interaction

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 35 | **Program:** MTN Group | **Disclosed:** 2022-09-04

- Report: [https://hackerone.com/reports/1272478](https://hackerone.com/reports/1272478)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2021-07-21T18:40:29.205Z

## Timeline

- **Report Filed**
- **2021-07-25** @theranger: ##A little update
The Given numeric IDs for users is also kinda weak, for example on my test accounts one of them `572` and the second one `573` which means there's definitely users on `571`, `570` and so on.
So if an attacker exploited this with +500 emails he'll change every account `Email Addresses` on the system and reset the passwords for all the accounts on that specific domain.
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
