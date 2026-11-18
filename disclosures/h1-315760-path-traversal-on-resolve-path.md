---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
  - vuln/path-traversal
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2018-02-22
submitted: 2018-02-13T21:48:00.573Z
bounty_usd: null
votes: 7
cve: "CVE-2018-3732"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "orange"
source: "https://hackerone.com/reports/315760"
title: "Path Traversal on Resolve-Path"
---
# Path Traversal on Resolve-Path

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-22

- Report: [https://hackerone.com/reports/315760](https://hackerone.com/reports/315760)
- CWE: Path Traversal | CVE: CVE-2018-3732
- Submitted: 2018-02-13T21:48:00.573Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The author of `resolve-path` told me that I can submit this to here. The vulnerability already reported to the author and got a fixed!

## Module

**module name:** resolve-path
**version:** 1.3.3
**npm page:** `https://www.npmjs.com/package/resolve-path`

### Description

Resolve a relative path against a root path with validation.

This module would protect against commons attacks like GET /../file.js which reaches outside the root folder.

### Module Stats

Stats
[8264] downloads in the last day
[48226] downloads in the last week
[210556] downloads in the last month

~[2526672] estimated downloads per year

## Description

The library failed to process path like `C:../../` on Windows

## Steps To Reproduce:

```js
require('resolve-path')("C:/windows/temp/", "C:../../")
```

## Supporting Material/References:

- Windows 10
- Node v8.9.4
- NPM 5.6.0

## Wrap up

- [Y] I contacted the maintainer to let him know
- [N] I opened an issue in the related repository

## Impact

This is a high-dependency library, for example: [KoaJS](https://github.com/koajs/koa) is suffered from this vulnerability

[21086] downloads in the last day
[113573] downloads in the last week
[462543] downloads in the last month
~[5550516] estimated downloads per year

## Timeline

- **Report Filed**
- **2018-02-17** @lirantal: Hi @orange,

Thanks a lot for reporting the vulnerability.
I will invite Doug to this issue so we can quickly triage it.
- **Report Triaged**
- **2018-02-17** @lirantal: Is it correct to assume that all versions prior to 1.4.0 were vulnerable?
- **Report Severity Updated**
- **Changed Scope**
- **External User Joined**
- **2018-02-18** @dougwilson: That's correct: all versions prior to 1.4.0 are effected.
- **2018-02-18** @lirantal: Ok great. I requested a CVE to be assigned.
- **2018-02-18** @lirantal: @dougwilson @orange are you ok with a full public disclosure for this vulnerability once the CVE is assigned?
- **2018-02-18** @dougwilson: That's good, because it's already been patched & released.
- **2018-02-18** @orange: OK! BTW, if there is any acknowledgement, please credit to Orange Tsai(@orange_8361) from DEVCORE

Thanks!
- **2018-02-19** @lirantal: Will do @orange, thanks!
- **Report Resolved**
- **Agreed On Going Public**
- **Cve Id Added**
- **Manually Disclosed**
