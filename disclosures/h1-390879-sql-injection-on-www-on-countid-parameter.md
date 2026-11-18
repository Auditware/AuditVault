---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - vuln/sql-injection
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2019-10-08
submitted: 2018-08-06T12:03:16.573Z
bounty_usd: null
votes: 80
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0_1vitthal"
source: "https://hackerone.com/reports/390879"
title: "SQL Injection on www.██████████ on countID parameter"
---
# SQL Injection on www.██████████ on countID parameter

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 80 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/390879](https://hackerone.com/reports/390879)
- CWE: SQL Injection
- Submitted: 2018-08-06T12:03:16.573Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
Hello Team,
I have came across a sql injection vulnerability on www.██████ on countID parameter. I was able to retrieve the banner which is

> Microsoft SQL Server 2008 R2 (SP3) - 10.50.6220.0 (X64& 
	Mar 19 2015 12:32:14 
	Copyright (c) Microsoft Corporation
	Standard Edition (64-bit) on Windows NT 6.3 <X64> (Build 9600: ) (Hypervisor)

after confirming the vulnerability i have stopped testing further.

**Vulnerable URL:**
https://www.███/public/saveCount.cfm?countID=4

**Steps to Reproduce:**
1. python sqlmap.py -u https://www.██████████/public/saveCount.cfm?countID=4 --level=3 --risk=3 

**POC**
█████████

## Impact

Attacker can take control over the database server.

## Timeline

- **Report Filed**
- **2018-08-06** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2018-08-10** @0_1vitthal: According to wiki https://en.wikipedia.org/wiki/Defense_Equal_Opportunity_Management_Institute , The ████ may be owned by DoD.
As the Severity of the bug is High I thought reporting to you directly, if it is out of scope of your program Please let me know so i can report the issues to the respective authority.

Thanks,
@0_1vitthal
- **2018-08-10** @ag3nt-j1: @0_1vitthal we're taking a look now, we have a new process here on the backend (not in H1) and we're still getting used to it.  Somehow missed your report.  The server you found is a DoD asset and is valid.
- **2018-08-10** @0_1vitthal: @ag3nt-j1 
Thanks for the information.
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
