---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/asi05-unexpected-code-execution-rce
  - env/network
substate: "informative"
weakness: "ASI05: Unexpected Code Execution (RCE)"
enriched: true
date: 2026-05-05
submitted: 2026-05-04T13:51:28.187Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/curl|curl]]"
reporter: "orelbn7"
source: "https://hackerone.com/reports/3712343"
title: "MQTT CONNACK Packet Type Bypass leads to RCE via Malicious Broker"
---
# MQTT CONNACK Packet Type Bypass leads to RCE via Malicious Broker

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 31 | **Program:** curl | **Disclosed:** 2026-05-05

- Report: [https://hackerone.com/reports/3712343](https://hackerone.com/reports/3712343)
- CWE: ASI05: Unexpected Code Execution (RCE)
- Submitted: 2026-05-04T13:51:28.187Z

## Timeline

- **Report Filed**
- **2026-05-04** @icing: Please explain: in what way does a malicious broker not already control all bytes that curl writes to the application's output? What is changed by the unchecked conn ack?
- **2026-05-04** @bagder: Sounds like a bug. Feel free to send a PR instead of trying to make it into a security problem.
- **2026-05-04** @orelbn7: You are right, guys, it's a bug.
I'll close it. 
Thanks.
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
