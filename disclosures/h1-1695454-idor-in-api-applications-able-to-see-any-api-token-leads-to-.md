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
date: 2022-11-01
submitted: 2022-09-08T16:11:11.001Z
bounty_usd: null
votes: 58
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "bugra"
source: "https://hackerone.com/reports/1695454"
title: "IDOR in API applications (able to see any API token, leads to account takeover)"
---
# IDOR in API applications (able to see any API token, leads to account takeover)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 58 | **Program:** Automattic | **Disclosed:** 2022-11-01

- Report: [https://hackerone.com/reports/1695454](https://hackerone.com/reports/1695454)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2022-09-08T16:11:11.001Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-09-09** @bugra: Hi @vortfu, I confirm that it's fixed. ✔️
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2022-11-01** @bugra: kindly reminder, for the disclosure :) @ehtis @vortfu
- **Agreed On Going Public**
- **Report Became Public**
