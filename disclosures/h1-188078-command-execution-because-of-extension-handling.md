---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
substate: "duplicate"
weakness: "Command Injection - Generic"
enriched: true
date: 2017-08-10
submitted: 2016-12-03T20:49:12.765Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "paulos__"
source: "https://hackerone.com/reports/188078"
title: "Command Execution because of extension handling"
---
# Command Execution because of extension handling

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Brave Software | **Disclosed:** 2017-08-10

- Report: [https://hackerone.com/reports/188078](https://hackerone.com/reports/188078)
- CWE: Command Injection - Generic
- Submitted: 2016-12-03T20:49:12.765Z

## Timeline

- **Report Filed**
- **2016-12-03** @paulos__: little correction on the recommended fix: other sites don't add `.html/htm` on to the page domain. I just tried it in Firefox/Chrome/Safari and they actually use the <title> of the page + .html - which completely mitigates this issue.
- **Report Duplicate**
- **2016-12-04** @paulos__: @asuka sure. I guess I am a bit late. can you add me to the report?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
