---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
  - stack/php
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2021-01-01
submitted: 2020-11-24T22:49:14.934Z
bounty_usd: null
votes: 80
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "fuzzme"
source: "https://hackerone.com/reports/1042746"
title: "[intensedebate.com] SQL Injection Time Based on /changeReplaceOpt.php"
---
# [intensedebate.com] SQL Injection Time Based on /changeReplaceOpt.php

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 80 | **Program:** Automattic | **Disclosed:** 2021-01-01

- Report: [https://hackerone.com/reports/1042746](https://hackerone.com/reports/1042746)
- CWE: SQL Injection
- Submitted: 2020-11-24T22:49:14.934Z

## Timeline

- **Report Filed**
- **2020-11-25** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **2020-11-25** @xknown: Hi @fuzzme, thanks again for the report. We deployed a patch to address this issue. Before marking it as resolved, we are still looking for other places that might need a similar hardening patch.
- **Report Triaged**
- **2020-11-25** @fuzzme: Hello, many thanks @xknown ! :) Ok i going to try find others vulnerables endpoints.
- **2020-11-26** @fuzzme: Hi, a other SQL Injection time based.

Vulnerable Url : `https://intensedebate.com/js/commentAction/?data={}`
Vulnerable Parameter (GET) : `data['params']['acctid']` 
POC : Attachments file > `sqli2.mp4` , `sleep7_2.png` and `sleep15_2.png`
- **Report Resolved**
- **Bounty Awarded**
- **2020-12-04** @fuzzme: Hi @xknown, thank you for the bounty.
- **Agreed On Going Public**
- **2020-12-21** @fuzzme: @xknown, @Automattic  update ?
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
