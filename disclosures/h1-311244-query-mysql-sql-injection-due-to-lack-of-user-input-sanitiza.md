---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2018-05-19
submitted: 2018-02-01T00:58:42.031Z
bounty_usd: null
votes: 14
cve: "CVE-2018-3754"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/311244"
title: "[query-mysql] SQL Injection due to lack of user input sanitization allows to run arbitrary SQL queries when fetching data from database"
---
# [query-mysql] SQL Injection due to lack of user input sanitization allows to run arbitrary SQL queries when fetching data from database

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 14 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-19

- Report: [https://hackerone.com/reports/311244](https://hackerone.com/reports/311244)
- CWE: SQL Injection | CVE: CVE-2018-3754
- Submitted: 2018-02-01T00:58:42.031Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-02-01** @cjihrig: Email sent to torresestradadaniel@gmail.com.
- **2018-02-11** @cjihrig: My previous email did not receive a response. An issue has been opened at https://github.com/cenidetiot/query-mysql/issues/1.
- **2018-05-08** @bl4de: Hi @cjihrig 

Any update on this?

Regards,

bl4de
- **2018-05-09** @cjihrig: Hi @bl4de,

Sorry for the delay. A CVE has been requested. It looks like this project is also no longer available on GitHub.
- **2018-05-09** @bl4de: Hi @cjihrig ,

No worries, thanks for the update!
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
