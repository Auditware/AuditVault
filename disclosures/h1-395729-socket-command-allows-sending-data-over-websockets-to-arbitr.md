---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2019-07-15
submitted: 2018-08-16T04:25:52.208Z
bounty_usd: null
votes: 140
cve: []
program: "[[programs/superhuman|Superhuman (formerly Grammarly)]]"
reporter: "metnew"
source: "https://hackerone.com/reports/395729"
title: "`socket` command allows sending data over WebSockets to arbitrary origins from Grammarly Extension"
---
# `socket` command allows sending data over WebSockets to arbitrary origins from Grammarly Extension

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 140 | **Program:** Superhuman (formerly Grammarly) | **Disclosed:** 2019-07-15

- Report: [https://hackerone.com/reports/395729](https://hackerone.com/reports/395729)
- CWE: N/A
- Submitted: 2018-08-16T04:25:52.208Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **2018-08-17** @metnew: Thanks, Grammarly ❤️
- **2018-09-04** @metnew: I guess, Grammarly team started deploying the fix:

## Content script

Content scripts disallows `connect` method:
``` js
d.emitBackground(y.MessageTypes.client, e)) : n.error("'connect' method call not allowed on remote socket, ignoring", e)),
```

## Background:

Grammarly made a whitelist of URLs the extension is allowed to connect.

Good job, @grammarly, the fixes are robust.
- **2018-09-07** @metnew: @andriy_derevyanko resolved?
- **2018-09-07** @andriy_derevyanko: @metnew per my records – yes. I can definitely say only in the afternoon, but please, feel free to validate.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Title Updated**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
