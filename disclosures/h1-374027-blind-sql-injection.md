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
date: 2018-11-09
submitted: 2018-06-29T20:39:25.675Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/hannob|Hanno's projects]]"
reporter: "geeknik"
source: "https://hackerone.com/reports/374027"
title: "blind sql injection"
---
# blind sql injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** Hanno's projects | **Disclosed:** 2018-11-09

- Report: [https://hackerone.com/reports/374027](https://hackerone.com/reports/374027)
- CWE: SQL Injection
- Submitted: 2018-06-29T20:39:25.675Z

## Timeline

- **Report Filed**
- **2018-06-30** @geeknik: This same flaw affects `blog.hboeck.de` as well.
- **Report Triaged**
- **2018-07-18** @hanno: This is now fixed with a patch I got from s9y's dev (as should be all other open issues).
I'd appreciate if you could check that and also look for further issues, s9y will soon release a security update.
- **2018-07-19** @geeknik: The sqli looks fixed on my end and I haven't found any additional bugs at the moment.
- **Report Resolved**
- **2018-08-16** @geeknik: Yay for the fix, boo for the lack of credit by the author.
- **2018-08-17** @hanno: Now announced on the s9y blog and with credits:
http://blog.s9y.org/archives/279-serendipity_event_freetag-Security-update.html
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
