---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/network
  - os/linux
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2022-10-20
submitted: 2022-09-20T07:39:34.383Z
bounty_usd: 2000
votes: 39
cve: "CVE-2022-31020"
program: "[[programs/hyperledger|Linux Foundation Decentralized Trust]]"
reporter: "shakedreiner"
source: "https://hackerone.com/reports/1705717"
title: "POOL_UPGRADE request handler may allow an unauthenticated attacker to remotely execute code on every node in the network. "
---
# POOL_UPGRADE request handler may allow an unauthenticated attacker to remotely execute code on every node in the network. 

> **Severity:** Critical | **Bounty:** 2,000 USD | **Votes:** 39 | **Program:** Linux Foundation Decentralized Trust | **Disclosed:** 2022-10-20

- Report: [https://hackerone.com/reports/1705717](https://hackerone.com/reports/1705717)
- CWE: Command Injection - Generic | CVE: CVE-2022-31020
- Submitted: 2022-09-20T07:39:34.383Z

## Timeline

- **Report Filed**
- **Changed Scope**
- **Report Severity Updated**
- **2022-09-20** @swcurran: The person reporting here also reported this the issue as GitHub Advisory: https://github.com/hyperledger/indy-node/security/advisories/GHSA-r6v9-p59m-gj2p, which we processed and for which we released a patch. Added here to be eligible for a hackerone reward.

This report can be marked as resolved, and I recommend a reward be given.
- **Cve Id Added**
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
