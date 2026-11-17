---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/memory-corruption-generic
  - env/network
substate: "not-applicable"
weakness: "Memory Corruption - Generic"
enriched: true
date: 2025-06-28
submitted: 2025-04-19T20:20:07.321Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/curl|curl]]"
reporter: "drdee-hackerone"
source: "https://hackerone.com/reports/3101127"
title: "Buffer Overflow in curl MQTT Test Server (tests/server/mqttd.c) via Malicious CONNECT Packet"
---
# Buffer Overflow in curl MQTT Test Server (tests/server/mqttd.c) via Malicious CONNECT Packet

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 11 | **Program:** curl | **Disclosed:** 2025-06-28

- Report: [https://hackerone.com/reports/3101127](https://hackerone.com/reports/3101127)
- CWE: Memory Corruption - Generic
- Submitted: 2025-04-19T20:20:07.321Z

## Timeline

- **Report Filed**
- **2025-04-19** @bagder: Thanks, but the test server is just a test server. It is not for production and therefore any problems with it are not considered security vulnerabilities.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
