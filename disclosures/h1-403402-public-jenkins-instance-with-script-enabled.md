---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - stack/java
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2018-09-10
submitted: 2018-08-31T12:05:04.584Z
bounty_usd: null
votes: 74
cve: []
program: "[[programs/ui|Ubiquiti Inc.]]"
reporter: "smiegles"
source: "https://hackerone.com/reports/403402"
title: "Public Jenkins instance with /script enabled"
---
# Public Jenkins instance with /script enabled

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 74 | **Program:** Ubiquiti Inc. | **Disclosed:** 2018-09-10

- Report: [https://hackerone.com/reports/403402](https://hackerone.com/reports/403402)
- CWE: Code Injection
- Submitted: 2018-08-31T12:05:04.584Z

## Report summary

Ubiquiti exposed a Jenkins server on the internet without any authentication, this allowed me to reach the AWS metadata service and execute code on the server itself. They resolved the issue and rewarded a bounty within 30 minutes of reporting, really impressive.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **2018-08-31** @smiegles: Thank you for the ridiculous fast response and bounty!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
