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
submitted: 2020-05-01T19:55:01.641Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/864354"
title: "[diskstats] Command Injection via insecure command concatenation"
---
# [diskstats] Command Injection via insecure command concatenation

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Node.js third-party modules | **Disclosed:** 2020-07-23

- Report: [https://hackerone.com/reports/864354](https://hackerone.com/reports/864354)
- CWE: Command Injection - Generic
- Submitted: 2020-05-01T19:55:01.641Z

## Timeline

- **Report Filed**
- **2020-05-01** @nochnoidozor: Hi @d3lla,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **External User Joined**
- **2020-07-23** @philipskinner: Hello,

Many thanks for the excellent write up.

I have published version 0.1.0 of diskstats which corrects this (latest code here https://github.com/PhilipSkinner/diskstats) plus I have deprecated all versions previous to this with a warning that a critical issue was corrected in version 0.1.0.

I have added a unit test with your example that proves that it now throws an error instead of executing your injected code.

Apologies for the delay, I was only alerted to this issue yesterday.

Many thanks,

Philip.
- **2020-07-23** @bbe8482aecd24374d13c5de15a0a6: @philipskinner thanks for providing a new version with the fix.

@d3lla can you confirm that this fixes the reported issue and are you both ok with the disclosure of the report?
- **2020-07-23** @d3lla: Hi everybody,

@philipskinner Thank you for your prompt reply and for your fix.
Your changes seems to fix the problem. 

I run the previous poc:
```javascript
const diskstats = require('diskstats');
diskstats.check('; touch HACKED', (err, results) => {});

```

and I was not able to reproduce the previous reported result.



@danielruf From my side it's fine to disclose the report.

Thank you for your time and have a nice day,
d3lla

I tested using the following configurations:

- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.2.0
- NPM VERSION: 6.14.4
- **Report Resolved**
- **Agreed On Going Public**
- **2020-07-23** @bbe8482aecd24374d13c5de15a0a6: Small additional feedback that I forgot because I was distracted.

> I have added a unit test with your example that proves that it now throws an error instead of executing your injected code.

That is really awesome and I really like that, we rarely see that projects have (regression) tests for vulnerabilities =)
- **Agreed On Going Public**
- **Report Became Public**
