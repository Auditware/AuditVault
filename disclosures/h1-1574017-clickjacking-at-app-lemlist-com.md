---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/ui-redressing-clickjacking
  - env/web
substate: "resolved"
weakness: "UI Redressing (Clickjacking)"
enriched: true
date: 2022-05-20
submitted: 2022-05-18T01:43:11.809Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/lemlist|lemlist]]"
reporter: "scriptsavvy"
source: "https://hackerone.com/reports/1574017"
title: "Clickjacking at  app.lemlist.com"
---
# Clickjacking at  app.lemlist.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** lemlist | **Disclosed:** 2022-05-20

- Report: [https://hackerone.com/reports/1574017](https://hackerone.com/reports/1574017)
- CWE: UI Redressing (Clickjacking)
- Submitted: 2022-05-18T01:43:11.809Z

## Report summary

Clickjacking at app.lemlist.com
Account Takeover, Account Deletion and Password Change

## Timeline

- **2022-05-18** @scriptsavvy: Reproducible: My report contains clear, concise steps to reproduce the vulnerability.
Impact: My report describes exactly what outcome an attacker would reasonably achieve.
In Scope: I have carefully reviewed the lemlist security page
- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **Report Severity Updated**
- **2022-05-20** @alban75: X-Frame-Options was already set, see https://geekflare.com/tools/tests/bi5y7ifec
Issue is only valid for file:// path
Fix for file:// in progress
- **Report Resolved**
- **Agreed On Going Public**
- **2022-05-20** @scriptsavvy: not important :)
- **Agreed On Going Public**
- **Report Became Public**
- **2023-06-17** @scriptsavvy: Hi , can you hide sensitive information (undisclosed bounty amount) from the report ??
