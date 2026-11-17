---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/deserialization-of-untrusted-data
  - env/web
substate: "resolved"
weakness: "Deserialization of Untrusted Data"
enriched: true
date: 2019-09-18
submitted: 2018-08-19T06:05:36.037Z
bounty_usd: null
votes: 258
cve: []
program: "[[programs/rootstocklabs|Rootstock Labs]]"
reporter: "ahook"
source: "https://hackerone.com/reports/396954"
title: "Attacker can add arbitrary data to the blockchain without paying gas"
---
# Attacker can add arbitrary data to the blockchain without paying gas

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 258 | **Program:** Rootstock Labs | **Disclosed:** 2019-09-18

- Report: [https://hackerone.com/reports/396954](https://hackerone.com/reports/396954)
- CWE: Deserialization of Untrusted Data
- Submitted: 2018-08-19T06:05:36.037Z

## Timeline

- **2018-08-19** @ahook: The simple fix at this point would be to throw an exception in rlpParse if transaction.get(9).getRLPData() != null.

I have not checked the blockchain to see if anyone has exploited this. If anyone has, some additional code will be needed to make sure that any existing beefy transactions can still pass through as valid.
- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2018-08-22** @julianor: Thanks for finding and reporting this bug. A mitigation has been deployed and the RSK team is working on a definitive fix for this and other similar message parsing issues that were identified.
- **Bounty Awarded**
- **2018-09-04** @ahook: Awesome! Thanks!!
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
