---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2020-07-23
submitted: 2020-05-03T10:10:58.198Z
bounty_usd: null
votes: 0
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/865168"
title: "[xps] Command Injection via insecure command concatenation"
---
# [xps] Command Injection via insecure command concatenation

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 0 | **Program:** Node.js third-party modules | **Disclosed:** 2020-07-23

- Report: [https://hackerone.com/reports/865168](https://hackerone.com/reports/865168)
- CWE: Command Injection - Generic
- Submitted: 2020-05-03T10:10:58.198Z

## Timeline

- **Report Filed**
- **2020-05-03** @nochnoidozor: Hi @d3lla,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **External User Joined**
- **2020-07-23** @bbe8482aecd24374d13c5de15a0a6: Hi @d3lla,

there is a new version released with a patch which should prevent and fix this by checking the type of the supplied input.

Can you confirm that this fixes the reported vulnerability?

https://github.com/sorellabs/xps/commit/768481146b8ead3811310eecc0f56e2d107cb740
- **2020-07-23** @d3lla: Hi everybody,
@danielruf Thanks for bringing this to my attention.

@robotlolita Thank you for the fix. 
Your changes seems to fix the problem. 
I run the previous poc:
```javascript
const ps = require('xps');
ps.kill('`touch HACKED;`').fork();
```

and I was not able to reproduce the previous reported result.

Thank you for your time and have a nice day, 
d3lla

I tested using the following configurations:
* OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
* NODEJS VERSION: v14.2.0
* NPM VERSION: 6.14.4
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
