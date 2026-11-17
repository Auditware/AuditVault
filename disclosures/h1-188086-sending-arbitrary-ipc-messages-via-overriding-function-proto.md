---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2018-09-18
submitted: 2016-12-03T21:36:17.831Z
bounty_usd: null
votes: 53
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "masatokinugawa"
source: "https://hackerone.com/reports/188086"
title: "Sending arbitrary IPC messages via overriding Function.prototype.apply"
---
# Sending arbitrary IPC messages via overriding Function.prototype.apply

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 53 | **Program:** Brave Software | **Disclosed:** 2018-09-18

- Report: [https://hackerone.com/reports/188086](https://hackerone.com/reports/188086)
- CWE: Command Injection - Generic
- Submitted: 2016-12-03T21:36:17.831Z

## Timeline

- **Report Filed**
- **2016-12-03** @masatokinugawa: BTW, I think this bug and #187542 are a quite fatal problem among bugs that occur on the browser. The proper rewards is important to me and also future reporters. Could you reconsider whether $300 bounties is the really proper amount by comparing the reported other bugs?
Thanks!
- **2016-12-04** @diracdeltas: @masatokinugawa I agree that your bugs are quite serious and would warrant higher bounties if reported in Chrome/FF. However, given that we are a small seed-funded company with a handful of engineers, it's difficult for us to award much higher. Our typical bounties are: $50 for low-sev issues, $100 for medium, $150 for high, and $200+ for critical. Your $300 bounty was the highest that we've given out so far, by a factor of 2.

We will be increasing bounties after our next funding round.
- **Report Triaged**
- **2016-12-04** @masatokinugawa: I understand it. Thank you for the clear explanation!
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
