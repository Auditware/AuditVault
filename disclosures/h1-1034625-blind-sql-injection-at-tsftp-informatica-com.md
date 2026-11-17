---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2020-11-16
submitted: 2020-11-14T17:39:02.567Z
bounty_usd: null
votes: 68
cve: []
program: "[[programs/informatica|Informatica]]"
reporter: "r1pley"
source: "https://hackerone.com/reports/1034625"
title: "Blind SQL injection at tsftp.informatica.com"
---
# Blind SQL injection at tsftp.informatica.com

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 68 | **Program:** Informatica | **Disclosed:** 2020-11-16

- Report: [https://hackerone.com/reports/1034625](https://hackerone.com/reports/1034625)
- CWE: SQL Injection
- Submitted: 2020-11-14T17:39:02.567Z

## Report summary

Researcher identified a time based/blind SQL injection in an Informatica TSFTP website and responsibly disclosed via this report. 

Informatica's incident response team engaged within minutes of the report being received, bringing the site offline for maintenance as the issue was resolved. Following resolution of the issue and confirmation from our security team the site was brought back online. Additionally web server access logs and database logs from before the issue existed were reviewed, showing the issue had not been exploited by any malicious attackers.

## Timeline

- **Report Filed**
- **2020-11-14** @nheffernan: Hi @r1pley  - thanks for your report. We are investigating and will be in touch.
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2021-02-28** @aks_infa: Hi @r1pley  We have updated our "Hall of Fame" page.
You can find your name here: https://www.informatica.com/trust-center/security-researcher-hall-of-fame.html
Thank you again for your effort.
