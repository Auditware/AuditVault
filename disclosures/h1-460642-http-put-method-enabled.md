---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "spam"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2018-12-11
submitted: 2018-12-11T19:13:25.095Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/ratelimited|RATELIMITED]]"
reporter: "hach3ro"
source: "https://hackerone.com/reports/460642"
title: "HTTP PUT method enabled"
---
# HTTP PUT method enabled

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** RATELIMITED | **Disclosed:** 2018-12-11

- Report: [https://hackerone.com/reports/460642](https://hackerone.com/reports/460642)
- CWE: Improper Access Control - Generic
- Submitted: 2018-12-11T19:13:25.095Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi security team,

Summary: It is possible to upload files to the server using the PUT method

Steps To Reproduce:
I used the following request:
PUT /emitrani.txt HTTP/1.1
Host: ratelimited.me
Content-Length: 10
Connection: close

Now a file exists at https://ratelimited.me/emitrani.txt
with contents of the put request.

## Impact

impact

## Timeline

- **Report Filed**
- **Report Spam**
- **Agreed On Going Public**
- **Manually Disclosed**
