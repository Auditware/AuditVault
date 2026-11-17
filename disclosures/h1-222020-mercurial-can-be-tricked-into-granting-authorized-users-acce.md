---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/python
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2017-07-12
submitted: 2017-04-18T21:08:41.575Z
bounty_usd: null
votes: 3
cve: "CVE-2017-9462"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "claudijd"
source: "https://hackerone.com/reports/222020"
title: "Mercurial can be tricked into granting authorized users access to the Python debugger"
---
# Mercurial can be tricked into granting authorized users access to the Python debugger

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Internet Bug Bounty | **Disclosed:** 2017-07-12

- Report: [https://hackerone.com/reports/222020](https://hackerone.com/reports/222020)
- CWE: Code Injection | CVE: CVE-2017-9462
- Submitted: 2017-04-18T21:08:41.575Z

## Report summary

### Mercurial 4.1.3 (2017-4-18)

- `hg serve --stdio` could be tricked into granting authorized users access to the Python debugger. Thanks to Jonathan Claudius of Mozilla for reporting this issue. This issue is only a security issue for repositories served using --stdio, which includes ssh but *not* http.

## Timeline

- **Report Filed**
- **Cve Id Added**
- **Bounty Awarded**
- **Report Resolved**
- **2017-07-12** @claudijd: @arice can we make this public?
- **Agreed On Going Public**
- **Manually Disclosed**
