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
date: 2018-04-24
submitted: 2018-02-06T15:43:16.553Z
bounty_usd: null
votes: 6
cve: "CVE-2018-3730"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/312907"
title: "[mcstatic] Path Traversal allows to read content of arbitrary files"
---
# [mcstatic] Path Traversal allows to read content of arbitrary files

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-04-24

- Report: [https://hackerone.com/reports/312907](https://hackerone.com/reports/312907)
- CWE: Path Traversal | CVE: CVE-2018-3730
- Submitted: 2018-02-06T15:43:16.553Z

## Timeline

- **Report Filed**
- **Changed Scope**
- **Report Severity Updated**
- **Report Triaged**
- **2018-02-07** @lirantal: Hi @bl4de ,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Cve Id Added**
- **2018-02-14** @lirantal: Since the author didn't join the report I opened a security issue in the repo.
- **2018-04-24** @lirantal: Disclosing the report due to no activity from the author.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
