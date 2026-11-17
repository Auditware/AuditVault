---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/cloud
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2019-10-21
submitted: 2019-09-18T09:34:52.929Z
bounty_usd: 2000
votes: 178
cve: []
program: "[[programs/semmle|Semmle]]"
reporter: "testanull"
source: "https://hackerone.com/reports/697055"
title: "Worker container escape lead to arbitrary file reading in host machine [again]"
---
# Worker container escape lead to arbitrary file reading in host machine [again]

> **Severity:** Critical | **Bounty:** 2,000 USD | **Votes:** 178 | **Program:** Semmle | **Disclosed:** 2019-10-21

- Report: [https://hackerone.com/reports/697055](https://hackerone.com/reports/697055)
- CWE: Privilege Escalation
- Submitted: 2019-09-18T09:34:52.929Z

## Timeline

- **Report Filed**
- **2019-09-18** @testanull: Update:
I just set the project on github to private
The project files is attached below
- **Report Triaged**
- **Bounty Awarded**
- **2019-09-18** @chrisgavin: Thanks again @testanull.

We've deployed an initial fix for the problem you've found. We're currently in the process of fully auditing our use of symlinks before marking this report as resolved, but we hope to have this done over the next few days.

Thanks,
Chris
- **2019-09-19** @testanull: Can you make a disclosure request after closing this report?
- **2019-10-14** @testanull: It has been a while since last activity,
Have your team resolved this issues yet?
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
