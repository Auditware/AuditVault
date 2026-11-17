---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/apache
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2022-11-08
submitted: 2021-12-07T12:24:33.484Z
bounty_usd: 6000
votes: 134
cve: []
program: "[[programs/aiven_ltd|Aiven Ltd]]"
reporter: "jarij"
source: "https://hackerone.com/reports/1418891"
title: "Apache Flink RCE via GET jar/plan API Endpoint"
---
# Apache Flink RCE via GET jar/plan API Endpoint

> **Severity:** Critical | **Bounty:** 6,000 USD | **Votes:** 134 | **Program:** Aiven Ltd | **Disclosed:** 2022-11-08

- Report: [https://hackerone.com/reports/1418891](https://hackerone.com/reports/1418891)
- CWE: Command Injection - Generic
- Submitted: 2021-12-07T12:24:33.484Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-12-09** @jarij: Thanks! I began researching Apache Flink security and potential attack vectors on Monday and noticed that the attacker can specify which java class `public static main` method is executed as the planner method. When grepping the Java SDK  and Flink source code for good gadgets, I found the `com.sun.tools.script.shell.Main`. This is the entrypoint for the jrunscript cli tool: <https://gtfobins.github.io/gtfobins/jrunscript/>
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
