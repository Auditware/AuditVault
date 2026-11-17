---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2019-11-12
submitted: 2019-10-22T12:37:27.836Z
bounty_usd: null
votes: 47
cve: []
program: "[[programs/infogram|Infogram]]"
reporter: "muon4"
source: "https://hackerone.com/reports/719875"
title: "LFI through the MySQL connection"
---
# LFI through the MySQL connection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 47 | **Program:** Infogram | **Disclosed:** 2019-11-12

- Report: [https://hackerone.com/reports/719875](https://hackerone.com/reports/719875)
- CWE: Information Disclosure
- Submitted: 2019-10-22T12:37:27.836Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2019-10-29** @gelzis: thank you for your report. It should be fixed. Can you confirm? Also do you have any insight if oracle/mssql clients could be affected with similar issues?
- **2019-10-29** @muon4: Hello @gelzis 

I am pretty sure this is issue only with MySQL client, I am not 100% sure.
I got an error `Failed to create connector. Error: The used command is not allowed with this MySQL version` so everything looked just fine.

Cheers!
- **Report Resolved**
- **Agreed On Going Public**
- **2019-10-30** @muon4: @gelzis @infogram Are you ok with disclosure?
- **Agreed On Going Public**
- **Report Became Public**
