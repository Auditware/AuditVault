---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/null-pointer-dereference
  - env/web
  - stack/node
substate: "resolved"
weakness: "NULL Pointer Dereference"
enriched: true
body: true
date: 2020-02-13
submitted: 2018-04-10T18:46:30.736Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/nodejs|Node.js]]"
reporter: "jasnell"
source: "https://hackerone.com/reports/335608"
title: "Denial of Service: nghttp2 use of uninitialized pointer"
---
# Denial of Service: nghttp2 use of uninitialized pointer

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js | **Disclosed:** 2020-02-13

- Report: [https://hackerone.com/reports/335608](https://hackerone.com/reports/335608)
- CWE: NULL Pointer Dereference
- Submitted: 2018-04-10T18:46:30.736Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

While investigating https://hackerone.com/reports/335533 and while following the same reproduction steps, I uncovered a bug in nghttp2 that causes use of an uninitialized pointer for an altsvc frameresulting in crash. The error can be easily triggered by a remote attacker by sending malformed ALTSVC and GOAWAY frames to the server, or by a malicious server sending same to the client. For Node.js, the result is a crashed process. The report has been submitted to the nghttp2 author who is working on a fix and is working on a fixed release.

## Impact

Crashing the Node.js process causing a Denial of Service

## Timeline

- **Report Filed**
- **Report Triaged**
- **Not Eligible For Bounty**
- **2018-04-14** @jasnell: Fix is ready to go, just waiting on scheduling for the release.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
