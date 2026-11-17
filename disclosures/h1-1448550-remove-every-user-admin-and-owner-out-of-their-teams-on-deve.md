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
date: 2022-12-01
submitted: 2022-01-13T06:01:56.649Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "wallotry"
source: "https://hackerone.com/reports/1448550"
title: "Remove Every User, Admin, And Owner Out Of Their Teams on developers.mtn.com via IDOR + Information Disclosure"
---
# Remove Every User, Admin, And Owner Out Of Their Teams on developers.mtn.com via IDOR + Information Disclosure

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 28 | **Program:** MTN Group | **Disclosed:** 2022-12-01

- Report: [https://hackerone.com/reports/1448550](https://hackerone.com/reports/1448550)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2022-01-13T06:01:56.649Z

## Timeline

- **Report Filed**
- **2022-02-02** @wallotry: Any updates?
- **2022-02-28** @wallotry: Hi, It's been two months, any updates?
- **Report Triaged**
- **2022-03-24** @kdrmtn: Please retest
- **2022-03-25** @wallotry: @kendad0122 It has not been resolved.
The patch seems buggy too.
- **2022-03-25** @wallotry: I'm automatically removed from my teams as soon as I log in(it's like a CSRF Attack but the application itself is doing the actions on my behalf), I tested this with different accounts and I get the same results.
For patching/resolving - You can store "team_id" and "user_id" as random_token(s)/hashes that only one user has access to, and could possibly know.
- **2022-08-01** @wallotry: Hi, the vulnerability has been fixed. but the problem is that private information is still being disclosed.
{F1847736}
- **2022-08-01** @wallotry: {F1847741}
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
