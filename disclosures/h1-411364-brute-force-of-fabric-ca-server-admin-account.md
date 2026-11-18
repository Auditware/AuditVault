---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-restriction-of-authentication-attempts
  - env/web
  - os/linux
  - vuln/misconfiguration
  - trigger/admin-required
  - trigger/brute-force
substate: "resolved"
weakness: "Improper Restriction of Authentication Attempts"
enriched: true
body: true
date: 2022-08-06
submitted: 2018-09-19T07:34:01.745Z
bounty_usd: null
votes: 61
cve: []
program: "[[programs/hyperledger|Linux Foundation Decentralized Trust]]"
reporter: "xiaoc"
source: "https://hackerone.com/reports/411364"
title: "Brute Force of fabric-ca server admin account"
---
# Brute Force of fabric-ca server admin account

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 61 | **Program:** Linux Foundation Decentralized Trust | **Disclosed:** 2022-08-06

- Report: [https://hackerone.com/reports/411364](https://hackerone.com/reports/411364)
- CWE: Improper Restriction of Authentication Attempts
- Submitted: 2018-09-19T07:34:01.745Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## fabric-ca server
- Default configuration maxenrollments value -1(enable outside enrollment)
- Listening 0.0.0.0:7054(easily discoved and can be reached)
- No limit to wrong password try
Above conditions result in brute force to CA server admin account

## Impact

## Attack gain a high-level permissioned account to permissioned network and can add\delete\update\query

## Timeline

- **Report Filed**
- **2018-09-20** @dwhuseby: Hi @xiaoc! 

Thank you for your report and we acknowledge it. We will triage and attempt to confirm the issue and get back to you with our initial conclusion soon.

Cheer!
Dave
- **2018-09-20** @xiaoc: ok
- **2018-09-27** @dwhuseby: Hi @xiaoc,

We are done triaging the bug and confirm that it is valid.  We are deciding on the severity and bounty amount now. I will update this once we have come to consensus.

Thank you again for your report.

Dave
- **Report Triaged**
- **2018-09-27** @xiaoc: Hi @dwhuseby ,
Can this bug be assigned a cve in name of my team. As a return, we are willing to give up the bounty.
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2018-09-29** @xiaoc: OK，thanks for your bounty.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
