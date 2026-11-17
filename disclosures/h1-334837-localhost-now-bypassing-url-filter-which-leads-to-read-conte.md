---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2018-05-30
submitted: 2018-04-09T09:23:56.500Z
bounty_usd: null
votes: 4
cve: "CVE-2019-5416"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "dienpv"
source: "https://hackerone.com/reports/334837"
title: "[localhost-now] bypassing url filter which leads to read content of arbitrary file"
---
# [localhost-now] bypassing url filter which leads to read content of arbitrary file

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-30

- Report: [https://hackerone.com/reports/334837](https://hackerone.com/reports/334837)
- CWE: Path Traversal | CVE: CVE-2019-5416
- Submitted: 2018-04-09T09:23:56.500Z

## Timeline

- **Report Filed**
- **2018-04-09** @dienpv: please ask me if you need more information
- **Report Severity Updated**
- **Report Triaged**
- **2018-04-11** @dienpv: any update ?
- **2018-04-11** @marcinhoppe: @dienpv I am trying to get in touch with the maintainer of this package to coordinate the fix. As I previously mentioned, I managed to reproduce and triage the report so we will be working towards a responsible disclosure.
- **2018-05-08** @dienpv: i tried to contact the maintainer via github and twitter but it seems that he hasn't joined for the fix
- **2018-05-24** @dienpv: @marcinhoppe
can we disclose this issue ?
- **2018-05-28** @marcinhoppe: @dienpv I made a last attempt to contact the maintainer. If he does not respond within 2-3 days, I will disclose.
- **2018-05-30** @dienpv: Let's disclose !
- **2018-05-30** @marcinhoppe: @dienpv That's what I'm going to do!
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
