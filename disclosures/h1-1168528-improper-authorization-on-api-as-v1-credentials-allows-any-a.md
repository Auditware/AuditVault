---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2021-06-02
submitted: 2021-04-19T13:20:47.377Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/elastic|Elastic]]"
reporter: "dee-see"
source: "https://hackerone.com/reports/1168528"
title: "Improper authorization on `/api/as/v1/credentials/` allows any App Search user to access all API keys and escalate privileges"
---
# Improper authorization on `/api/as/v1/credentials/` allows any App Search user to access all API keys and escalate privileges

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Elastic | **Disclosed:** 2021-06-02

- Report: [https://hackerone.com/reports/1168528](https://hackerone.com/reports/1168528)
- CWE: Improper Access Control - Generic
- Submitted: 2021-04-19T13:20:47.377Z

## Timeline

- **Report Filed**
- **2021-04-19** @dee-see: Step 8 in the preparation section should be

> 8. In the `Username` field enter `h1-repro`

There's a typo in the username.
- **Report Triaged**
- **Bounty Awarded**
- **Bounty Awarded**
- **2021-04-19** @dee-see: Thanks! Happy with the \#1 🎉
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
