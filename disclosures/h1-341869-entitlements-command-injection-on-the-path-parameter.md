---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2018-07-18
submitted: 2018-04-22T22:32:14.171Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "caioluders"
source: "https://hackerone.com/reports/341869"
title: "[entitlements] Command injection on the 'path' parameter"
---
# [entitlements] Command injection on the 'path' parameter

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-07-18

- Report: [https://hackerone.com/reports/341869](https://hackerone.com/reports/341869)
- CWE: Command Injection - Generic
- Submitted: 2018-04-22T22:32:14.171Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **2018-05-28** @marcinhoppe: I opened up an issue on GitHub: https://github.com/matiassingers/entitlements/issues/2.
- **External User Joined**
- **2018-07-15** @matiassingers2: This issue has been fixed in v1.3.0 (published to NPM as well)
- **2018-07-18** @marcinhoppe: I can confirm that this problem has been fixed in 1.3.0. I will proceed with the disclosure.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
