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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
There is sqli in the form █████████ on the "CME DateTime" parameter.

I'm also fairly sure ████████ has similar SQLis but its somehow protected by a WAF.

**Description:**

## Impact
The impact is probably quite low but I have not checked to see what other data is accessible via the sqli (loadfile, other databases etc. )

## Step-by-step Reproduction Instructions

1.  Go to ████████. Enter ```' and 1 or 1 GROUP BY CONCAT_WS(0x3a,VERSION(),FLOOR(RAND(0)*2)) HAVING MIN(0) OR 1 -- -``` in CME DateTime field
3. It will print out the MySQL server version

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
