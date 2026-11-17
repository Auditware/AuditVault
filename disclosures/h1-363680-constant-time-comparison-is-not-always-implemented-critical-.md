---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/missing-required-cryptographic-step
  - env/web
substate: "resolved"
weakness: "Missing Required Cryptographic Step"
enriched: true
date: 2018-08-06
submitted: 2018-06-09T08:51:57.047Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/monero|Monero]]"
reporter: "anonimal"
source: "https://hackerone.com/reports/363680"
title: "Constant-time comparison is not always implemented; critical areas are vulnerable to key-timing attacks"
---
# Constant-time comparison is not always implemented; critical areas are vulnerable to key-timing attacks

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Monero | **Disclosed:** 2018-08-06

- Report: [https://hackerone.com/reports/363680](https://hackerone.com/reports/363680)
- CWE: Missing Required Cryptographic Step
- Submitted: 2018-06-09T08:51:57.047Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-06-18** @moneromooo: There's a patch in https://github.com/monero-project/monero/pull/3999, though it's a bit overeager maybe, I'm not sure checking all these types is really required. It might also have non negligible effect on performance. Additionally, performance tests don't show much effect in comparing equal or unequal-on-every-byte keys with memcmp.
- **2018-06-23** @anonimal: >Additionally, performance tests don't show much effect in comparing equal or unequal-on-every-byte keys with memcmp

The environment may need to be specialized, meaning something that wouldn't be detected with either the current performance tests or with the hardware that you are using with said tests. I don't know, TBD.

Either way, thanks for patching.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
