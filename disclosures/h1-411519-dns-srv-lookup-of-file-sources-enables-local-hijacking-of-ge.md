---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/network
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2018-12-11
submitted: 2018-09-19T18:10:29.578Z
bounty_usd: 500
votes: 22
cve: []
program: "[[programs/rubygems|RubyGems]]"
reporter: "b9629eebd06fb8f0680ecbdef829e"
source: "https://hackerone.com/reports/411519"
title: "DNS SRV lookup of file:// sources enables local hijacking of gems"
---
# DNS SRV lookup of file:// sources enables local hijacking of gems

> **Severity:** High | **Bounty:** 500 USD | **Votes:** 22 | **Program:** RubyGems | **Disclosed:** 2018-12-11

- Report: [https://hackerone.com/reports/411519](https://hackerone.com/reports/411519)
- CWE: Path Traversal
- Submitted: 2018-09-19T18:10:29.578Z

## Timeline

- **Report Filed**
- **2018-09-19** @RubyGems: Thanks for submitting this report to RubyGems. Our team will review and investigate the issue. Please note that only issues in the rubygems library are eligible for our bug bounty program.
- **2018-10-31** @sonalkr132: Hi plover and nmalkin,

Welcome back! Sorry about delay in response here.
We ended up removing support of SRV records[[1](https://github.com/rubygems/rubygems/pull/2433)] from rubygems, can you please verify if your report (or parts of it) is still valid?
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Became Public**
