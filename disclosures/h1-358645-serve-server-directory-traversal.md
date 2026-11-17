---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2018-07-02
submitted: 2018-05-29T06:04:10.003Z
bounty_usd: null
votes: 6
cve: "CVE-2019-5417"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "tungpun"
source: "https://hackerone.com/reports/358645"
title: "[serve] Server Directory Traversal"
---
# [serve] Server Directory Traversal

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-07-02

- Report: [https://hackerone.com/reports/358645](https://hackerone.com/reports/358645)
- CWE: Path Traversal | CVE: CVE-2019-5417
- Submitted: 2018-05-29T06:04:10.003Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **External User Joined**
- **2018-05-30** @notquiteleo: Hey! Thanks for reporting this issue.

It's now fixed as of serve 7.3.1: https://github.com/zeit/serve/releases/tag/7.1.3
- **2018-05-31** @tungpun: Great! I tried again and can't reproduce the issue anymore.
- **2018-06-23** @tungpun: Hi there,

As this one has been fixed, could you kindly close this report and assign a CVE?
- **2018-07-02** @tungpun: HI all,
May I know any update?
- **2018-07-02** @marcinhoppe: @tungpun Sorry for the delay. I will disclose it now.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Manually Disclosed**
