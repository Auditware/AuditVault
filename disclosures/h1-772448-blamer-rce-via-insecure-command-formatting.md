---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2020-03-10
submitted: 2020-01-11T22:55:05.419Z
bounty_usd: null
votes: 7
cve: "CVE-2020-8137"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mik317"
source: "https://hackerone.com/reports/772448"
title: "[blamer] RCE via insecure command formatting"
---
# [blamer] RCE via insecure command formatting

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2020-03-10

- Report: [https://hackerone.com/reports/772448](https://hackerone.com/reports/772448)
- CWE: Code Injection | CVE: CVE-2020-8137
- Submitted: 2020-01-11T22:55:05.419Z

## Timeline

- **Report Filed**
- **2020-01-12** @nochnoidozor: Hi @mik317,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **2020-03-09** @marcinhoppe: @mik317 `blamer` version 1.0.1 with the fix has been released. Can you confirm it addresses the issue?
- **2020-03-09** @mik317: I ran the following code:

```js
// poc.js
var Blamer = require('blamer');
var blamer = new Blamer.default('git');
blamer.blameByFile('poc.js', 'test; touch HACKED;#');

```
and the issue seems *fixed* as well :)

Thanks again,
Mik
- **2020-03-10** @marcinhoppe: Great, I will disclose it and request a CVE.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **2020-03-10** @marcinhoppe: @mik317 I made an attempt to come up with a CVSS score for this finding. Can you check and see if it looks reasonable to you?
- **2020-03-10** @mik317: Hi @marcinhoppe :),
first of all thank you for your quick response :).
I confirm it can be a good CVSS score, I set `critical` to be sure the issue would have been addressed ASAP :).
Let me know, if possible, when the CVE will be assigned :)

Best, Mik
- **2020-03-10** @marcinhoppe: I will request a CVE after this report has been disclosed.
- **Agreed On Going Public**
- **Report Became Public**
