---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/integer-overflow
  - env/network
substate: "informative"
weakness: "Integer Overflow"
enriched: true
date: 2026-01-01
submitted: 2026-01-01T21:51:13.695Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/curl|curl]]"
reporter: "ssyyaa"
source: "https://hackerone.com/reports/3484319"
title: "MQTT Protocol Violation & Integer Overflow in libcurl"
---
# MQTT Protocol Violation & Integer Overflow in libcurl

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** curl | **Disclosed:** 2026-01-01

- Report: [https://hackerone.com/reports/3484319](https://hackerone.com/reports/3484319)
- CWE: Integer Overflow
- Submitted: 2026-01-01T21:51:13.695Z

## Timeline

- **Report Filed**
- **2026-01-01** @bagder: > While it does not directly result in memory corruption, it allows malformed MQTT packets to desynchronize the client’s protocol state and cause denial of service

It is not a "denial of service". It is a bug.
- **Report Informative**
- **Agreed On Going Public**
- **2026-01-01** @ssyyaa: Understood. while i viewed the protocol desynchronization as an availability issue based on strict protocol compliance, I respect the project's distinction regarding clientside impact. I'm glad the parsing logic will be fixed to align with the encoder. I have approved the disclosure request.
- **2026-01-01** @ssyyaa: Thanks for response
- **Manually Disclosed**
