---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2021-01-01
submitted: 2020-06-16T21:43:42.695Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "fabianfreyer"
source: "https://hackerone.com/reports/899964"
title: "XSS leads to RCE on the RocketChat desktop client."
---
# XSS leads to RCE on the RocketChat desktop client.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 31 | **Program:** Rocket.Chat | **Disclosed:** 2021-01-01

- Report: [https://hackerone.com/reports/899964](https://hackerone.com/reports/899964)
- CWE: OS Command Injection
- Submitted: 2020-06-16T21:43:42.695Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Triaged**
- **2020-09-22** @markus-rocketchat: Hi Fabian

we have had a try at this, please see: https://github.com/RocketChat/Rocket.Chat.Electron/pull/1710
- **Report Resolved**
- **Agreed On Going Public**
- **2020-12-02** @fabianfreyer: I can verify that context isolation prevents prototype pollution from reaching into the checks for allowed protocol schemes.
- **Report Became Public**
