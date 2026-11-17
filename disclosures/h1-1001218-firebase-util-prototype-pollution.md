---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - stack/node
  - stack/firebase
substate: "resolved"
weakness: null
enriched: true
date: 2020-11-17
submitted: 2020-10-07T15:00:05.559Z
bounty_usd: null
votes: 0
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/1001218"
title: "[@firebase/util] Prototype pollution"
---
# [@firebase/util] Prototype pollution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 0 | **Program:** Node.js third-party modules | **Disclosed:** 2020-11-17

- Report: [https://hackerone.com/reports/1001218](https://hackerone.com/reports/1001218)
- CWE: N/A
- Submitted: 2020-10-07T15:00:05.559Z

## Timeline

- **Report Filed**
- **2020-10-07** @d3lla: I forgot to add the weakness that should be: Modification of Assumed-Immutable Data (MAID). Could you kindly update the report description? 

Thanks and have a nice day!
d3lla
- **2020-11-15** @d3lla: Hi team,

I hope everything is going well for you.

I saw that the vulnerability seems to be fixed.
On 27th October a fix was committed (Commit: https://github.com/firebase/firebase-js-sdk/commit/9cf727fcc3d049551b16ae0698ac33dc2fe45ada and PR:https://github.com/firebase/firebase-js-sdk/pull/4001)  and recently a report was published on Snyk (https://snyk.io/vuln/SNYK-JS-FIREBASEUTIL-1038324).

What do think about closing and disclosing this report? Would it be possible?

Thank you for your time.
- **Changed Scope**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
