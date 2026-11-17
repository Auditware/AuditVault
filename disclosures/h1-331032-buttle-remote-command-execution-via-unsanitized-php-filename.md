---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
  - stack/node
  - stack/php
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2018-05-11
submitted: 2018-03-29T10:43:09.761Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/331032"
title: "[buttle] Remote Command Execution via unsanitized PHP filename when it's run with --php-bin flag"
---
# [buttle] Remote Command Execution via unsanitized PHP filename when it's run with --php-bin flag

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-11

- Report: [https://hackerone.com/reports/331032](https://hackerone.com/reports/331032)
- CWE: OS Command Injection
- Submitted: 2018-03-29T10:43:09.761Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-04-11** @lirantal: Hi @bl4de,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Severity Updated**
- **Changed Scope**
- **2018-04-24** @lirantal: No response yet from the author. The repository too has stale issues dating back to 2017 and the project is largely unmaintained. 

Will disclose the report if no progress made by the author to join this conversation.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Report Severity Updated**
