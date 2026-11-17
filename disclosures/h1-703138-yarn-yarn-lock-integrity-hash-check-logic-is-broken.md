---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/business-logic-errors
  - env/web
  - stack/node
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
date: 2020-02-26
submitted: 2019-09-27T19:51:27.138Z
bounty_usd: null
votes: 6
cve: "CVE-2019-15608"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/703138"
title: "[yarn] yarn.lock integrity & hash check logic is broken"
---
# [yarn] yarn.lock integrity & hash check logic is broken

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2020-02-26

- Report: [https://hackerone.com/reports/703138](https://hackerone.com/reports/703138)
- CWE: Business Logic Errors | CVE: CVE-2019-15608
- Submitted: 2019-09-27T19:51:27.138Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2019-09-28** @chalker: Can @arcanis be added here?
- **2019-09-28** @vdeturckheim: Added @arcanis
- **Report Triaged**
- **External User Joined**
- **2019-09-28** @arcanis: Thanks - I have a mitigation in progress (validating that both the hash and integrity are correct before storing them in the cache), I hope to release it today or tomorrow.
- **2019-09-28** @chalker: @arcanis I think that both recommended steps are important for the fix, i.e.
1. > validating that both the hash and integrity are correct before storing them in the cache
2. Validating both hash and integrity when taking the package out of cache. To simplify the fix, it could be stored separately to map dirs to hash/integrity, I think?
- **2019-09-28** @arcanis: Yep - I also have a prototype for this: https://github.com/yarnpkg/yarn/commit/0474b8c66a8ea298f5e4dedc67b2de464297ad1c
Currently running the tests to make sure it doesn't cause unforeseen regressions elsewhere.
- **2019-09-28** @arcanis: The fix has been released in the 1.19 which just reached stable.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
