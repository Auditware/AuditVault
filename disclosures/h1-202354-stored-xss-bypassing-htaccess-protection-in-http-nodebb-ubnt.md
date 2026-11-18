---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - impact/rce
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2017-09-28
submitted: 2017-01-31T13:34:43.035Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/ui|Ubiquiti Inc.]]"
reporter: "inhibitor181"
source: "https://hackerone.com/reports/202354"
title: "Stored XSS / Bypassing .htaccess protection in http://nodebb.ubnt.com/"
---
# Stored XSS / Bypassing .htaccess protection in http://nodebb.ubnt.com/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Ubiquiti Inc. | **Disclosed:** 2017-09-28

- Report: [https://hackerone.com/reports/202354](https://hackerone.com/reports/202354)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2017-01-31T13:34:43.035Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,

While I was looking at your renewn SSL certificated, I have noticed the following link : http://nodebb.ubnt.com/

I have seen that this link was protected by htaccess password, but I have decided to run a nmap scan. By running the following :

```
sudo nmap -sSV -p- 104.131.159.88 -oA stage_ph -T4
```

one of the open ports was this : `4567/tcp open   tram?`

And, to my surprise the ip `104.131.159.88:4567`, as well as `http://nodebb.ubnt.com:4567/` were available from internet and unprotected.

Here, I have found a nodeBB instance and I have managed to create a persisted XSS by using the  upload API, that does not properly sanitize the file names and automatically sets wrong mime types. 

Normally, it seems that the user is allowed to upload only images, but the stored XSS was possible by injecting malicious html in the exif data and changing the file name to .html.

I have attached a video with the POC, as well as the exif image.

I have not managed to RCE, but it is also worth noting that uploading the file with the .php extension and writing php content using exif IS possible.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2017-02-01** @ubnt-rubens: Hi @inhibitor181,

The site nodebb.ubnt.com isn't in the scope of this program, and normally would not receive rewards because is beta and is 3rd party hosted, but because this XSS could affect a user that receive a link to this page, we decided to give you a reward anyway.

Thanks
- **Bounty Awarded**
- **Report Resolved**
- **2017-02-01** @inhibitor181: Hi @ubnt-rubens . Thanks for the bounty.

I did not realized this was not hosted by ubnt.com as nslookup just answered with `Address: 104.131.159.88`. And true, beta applications are out of scope, but there wasn't any proper identification that this was beta :P (no stg, dev or testing identification in URL).

Anyway, thanks and best of luck
- **Agreed On Going Public**
- **Report Became Public**
