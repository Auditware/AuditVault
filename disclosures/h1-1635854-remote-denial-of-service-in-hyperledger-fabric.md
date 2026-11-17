---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - os/linux
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2022-09-01
submitted: 2022-07-13T14:39:08.019Z
bounty_usd: null
votes: 12
cve: "CVE-2022-36023"
program: "[[programs/hyperledger|Linux Foundation Decentralized Trust]]"
reporter: "zqgnd"
source: "https://hackerone.com/reports/1635854"
title: "Remote denial of service in HyperLedger Fabric"
---
# Remote denial of service in HyperLedger Fabric

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Linux Foundation Decentralized Trust | **Disclosed:** 2022-09-01

- Report: [https://hackerone.com/reports/1635854](https://hackerone.com/reports/1635854)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2022-36023
- Submitted: 2022-07-13T14:39:08.019Z

## Timeline

- **Report Filed**
- **2022-07-15** @denyeart: Thank you, a Fabric developer is triaging...
- **2022-07-26** @zqgnd: Hi @denyeart , any follow up on this issue ？
- **2022-08-05** @c0rwin: The fix is provided: https://github.com/hyperledger/fabric/pull/3570
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2022-08-08** @ryjones: Hi, @fatal0 . Does this change address the issue?
https://github.com/hyperledger/fabric/pull/3572
Ry
- **2022-08-09** @zqgnd: Hi, @ryjones
It has been fixed.
- **Report Resolved**
- **Agreed On Going Public**
- **2022-08-16** @denyeart: I've published the advisory and requested CVE:
https://github.com/hyperledger/fabric/security/advisories/GHSA-qj6r-fhrc-jj5r
- **Cve Id Added**
- **Manually Disclosed**
- **2022-10-13** @denyeart: @ryjones 

The Github advisory I created got published in August as https://nvd.nist.gov/vuln/detail/CVE-2022-36023.

A duplicate also got created from the HackerOne activity in September as https://nvd.nist.gov/vuln/detail/CVE-2022-35253. The duplicate has incorrect information, it indicates it affects Fabric <2.4, whereas it really affects Fabric 2.4.0-2.4.5. Is there a way to retract the duplicate https://nvd.nist.gov/vuln/detail/CVE-2022-35253?
- **Cve Id Added**
