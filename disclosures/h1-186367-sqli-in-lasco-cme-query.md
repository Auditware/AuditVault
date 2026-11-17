---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2026-01-12
submitted: 2016-11-29T13:29:55.990Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0daystolive"
source: "https://hackerone.com/reports/186367"
title: "SQLi in LASCO CME Query"
---
# SQLi in LASCO CME Query

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/186367](https://hackerone.com/reports/186367)
- CWE: SQL Injection
- Submitted: 2016-11-29T13:29:55.990Z

## Timeline

- **Report Filed**
- **2016-11-29** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Thank you,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2016-11-30** @0daystolive: I forgot to mention, it isnt just the "CME DateTime" parametr thats vulnerable, most of the parameters are vulnerable to SQLi.
- **2016-12-31** @0daystolive: Hey, the bug appears to have been fixed but there's been no response on here? Just thought I'd mention it.
- **2017-02-07** @dwarren: Hi @0daystolive, the server now times out for me when submitting the PoC. Do you also see this behavior?
- **2017-02-07** @0daystolive: Yeah, server timed out when I tried the POC just now. It wasn't timing out when I tested it in December it was patched (seemingly), maybe something has changed between now and December?
- **Report Resolved**
- **2017-02-07** @0daystolive: Ok cool :D
- **2018-03-23** @ag3nt-j7: Greetings @0daystolive!  It has been a long time since we received a report from you and you're work from so impressive we hope to hear from you soon!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
