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
date: 2019-10-08
submitted: 2018-07-14T23:01:00.139Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "modam3r5"
source: "https://hackerone.com/reports/381758"
title: "sql injection on  /messagecenter/messagingcenter at https://www.███████/"
---
# sql injection on  /messagecenter/messagingcenter at https://www.███████/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/381758](https://hackerone.com/reports/381758)
- CWE: SQL Injection
- Submitted: 2018-07-14T23:01:00.139Z

## Timeline

- **Report Filed**
- **2018-07-14** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2018-07-27** @ag3nt-z3: @modam3r5 it looks like they removed the box. Do you still have a copy of the request in burp that you could test with or send me to make sure it's still not validating the request still?
- **2018-07-27** @modam3r5: Hi @ag3nt-z3 , 
:\ Unfortunately I deleted all files a few days ago , but i retest the site again and look like the team has remove the effect script/path and i can confirm that look good and fixed now .
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
