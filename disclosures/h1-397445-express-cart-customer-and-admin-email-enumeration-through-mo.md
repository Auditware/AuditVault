---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2018-09-10
submitted: 2018-08-20T20:07:16.367Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "becojo"
source: "https://hackerone.com/reports/397445"
title: "[express-cart] Customer and admin email enumeration through MongoDB injection"
---
# [express-cart] Customer and admin email enumeration through MongoDB injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-09-10

- Report: [https://hackerone.com/reports/397445](https://hackerone.com/reports/397445)
- CWE: SQL Injection
- Submitted: 2018-08-20T20:07:16.367Z

## Timeline

- **Report Filed**
- **2018-08-20** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Triaged**
- **2018-08-22** @dagonza: Thanks for reporting it! I will have a look and come back to you.
- **2018-08-30** @dagonza: @mrvautin I have invited you to this report as it is quite related to your work on #343726. I can confirm the vulnerability (after few tries as I am not too familiar with Mongo). Thanks
- **External User Joined**
- **2018-08-31** @mrvautin: Thanks for reporting. This vuln has been fixed in the latest version.
- **2018-08-31** @mrvautin: https://github.com/mrvautin/expressCart/commit/b2234ef4f28225bb42f74bf6cf33759048aba518
- **2018-08-31** @becojo: The fix works 👍
- **2018-09-10** @dagonza: I can confirm it. Thanks everyone for the quick response on this one. I will close the report.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Severity Updated**
