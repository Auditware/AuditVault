---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2024-08-10
submitted: 2019-02-25T14:47:03.826Z
bounty_usd: null
votes: 59
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "gronke"
source: "https://hackerone.com/reports/501081"
title: "Guest Privilege Escalation to admin group"
---
# Guest Privilege Escalation to admin group

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 59 | **Program:** Rocket.Chat | **Disclosed:** 2024-08-10

- Report: [https://hackerone.com/reports/501081](https://hackerone.com/reports/501081)
- CWE: Improper Access Control - Generic
- Submitted: 2019-02-25T14:47:03.826Z

## Timeline

- **Report Filed**
- **2019-03-01** @marcosdefendi: @gronke Thank you for let us know about this problem. I opened [a PR](https://github.com/RocketChat/Rocket.Chat/pull/13597) that's validate if the user has the necessary(assign-roles) to be able to change the role, also I removed the manage-integrations for the bot role.
- **Report Triaged**
- **2019-03-13** @rodrigok: @gronke can you check if the PR fixed the issue?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
