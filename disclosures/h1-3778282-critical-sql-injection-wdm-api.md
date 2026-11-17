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
date: 2026-08-27
submitted: 2026-06-02T20:07:45.682Z
bounty_usd: null
votes: 40
cve: []
program: "[[programs/essity|Essity]]"
reporter: "matty69v"
source: "https://hackerone.com/reports/3778282"
title: "Critical SQL Injection WDM API (████████)"
---
# Critical SQL Injection WDM API (████████)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 40 | **Program:** Essity | **Disclosed:** 2026-08-27

- Report: [https://hackerone.com/reports/3778282](https://hackerone.com/reports/3778282)
- CWE: SQL Injection
- Submitted: 2026-06-02T20:07:45.682Z

## Timeline

- **Report Filed**
- **2026-06-03** @matty69v: I stopped from here but :

[*] Extracting table [1/10]...
  [1] vw_WDM_searchData
[+] Table 1: vw_WDM_searchData
[*] Extracting table [2/10]...
  [2] WDM_CountryMaster
[+] Table 2: WDM_CountryMaster


here the python script : ████████
- **Report Triaged**
- **2026-06-03** @matty69v: Thanks @hugolevisse ^^
- **2026-06-11** @matty69v: Hello @hugolevisse do you have news regarding this critical bug...
- **2026-08-12** @hugolevisse: Hello @matty69v 
We have implemented a fix and the issue has been remediated.
Could you please verify that the vulnerability is no longer exploitable on your end? Once confirmed, we will proceed with resolving this report.
We appreciate your contribution to improving our security posture.
Best regards,
Essity AppSec Team
- **2026-08-12** @matty69v: _This comment was deleted by the author._
- **2026-08-12** @matty69v: The fix works @hugolevisse
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
