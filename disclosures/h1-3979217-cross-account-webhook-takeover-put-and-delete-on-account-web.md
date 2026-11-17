---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2026-10-30
submitted: 2026-08-29T22:14:12.439Z
bounty_usd: null
votes: 34
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "deivizzzz"
source: "https://hackerone.com/reports/3979217"
title: " Cross-account webhook takeover: PUT and DELETE on /<account>/webhooks/<id>.json reach another account's webhook"
---
#  Cross-account webhook takeover: PUT and DELETE on /<account>/webhooks/<id>.json reach another account's webhook

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 34 | **Program:** Basecamp | **Disclosed:** 2026-10-30

- Report: [https://hackerone.com/reports/3979217](https://hackerone.com/reports/3979217)
- CWE: Improper Authentication - Generic
- Submitted: 2026-08-29T22:14:12.439Z

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2026-10-30** @jeremy: Hi @deivizzzz, a heads-up after disclosure: for a couple of hours the report's attachments were public, and two of the scripts (`poc_(2).py` and `exfil.py`) contained the passwords of your two Basecamp test accounts and what looks like your test integration's credentials. We've since made all the attachments internal. Please change those passwords (or delete the test accounts) and delete or rotate the test integration. Thanks!
- **2026-10-30** @deivizzzz: Hey @jeremy  thanks!! 

Those are test accounts I don't care too much but yeah I will delete them 

Thanks an have a nice weekend!!!
