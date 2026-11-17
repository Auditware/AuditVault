---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/node
  - os/windows
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2019-12-04
submitted: 2019-09-28T09:22:28.392Z
bounty_usd: null
votes: 4
cve: "CVE-2019-15598"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mik317"
source: "https://hackerone.com/reports/703415"
title: "[treekill] RCE via insecure command concatenation (only Windows)"
---
# [treekill] RCE via insecure command concatenation (only Windows)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2019-12-04

- Report: [https://hackerone.com/reports/703415](https://hackerone.com/reports/703415)
- CWE: Code Injection | CVE: CVE-2019-15598
- Submitted: 2019-09-28T09:22:28.392Z

## Timeline

- **Report Filed**
- **2019-09-28** @mik317: Excuse me, the first command to run in the `terminal` is 

```bash
npm i treekill
```
:)

Best, Mik
- **2019-09-29** @nochnoidozor: Hi @mik317,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Severity Updated**
- **Report Triaged**
- **2019-09-29** @mik317: Thank you :)

Best, Mik
- **Report Severity Updated**
- **2019-10-07** @lirantal: Thanks for your report @mik317 
Looks like it is a valid issue indeed and I invited the maintainer to join. It is possible that there will be no response as the last release was 5 years ago. Let's see how it works out and disclose early if necessary.
- **2019-10-08** @mik317: Thank you :)

Best, Mik
- **Changed Scope**
- **2019-12-04** @lirantal: Will disclose since there is no answer from the maintainer. Thank you @mik317 for reporting the issue and looking forward to work with you again.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
