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
date: 2018-02-26
submitted: 2018-01-31T23:06:35.622Z
bounty_usd: null
votes: 6
cve: "CVE-2018-3727"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/311216"
title: "[626] Path Traversal allows to read arbitrary file from remote server"
---
# [626] Path Traversal allows to read arbitrary file from remote server

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-26

- Report: [https://hackerone.com/reports/311216](https://hackerone.com/reports/311216)
- CWE: Path Traversal | CVE: CVE-2018-3727
- Submitted: 2018-01-31T23:06:35.622Z

## Timeline

- **Report Filed**
- **2018-02-02** @lirantal: Hi @bl4de,

Thanks for reporting this issue to us.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **Changed Scope**
- **Report Severity Updated**
- **Cve Id Added**
- **2018-02-14** @lirantal: Since the author didn't join the report I opened a security issue in the repo.
- **2018-02-26** @lirantal: @bl4de it seems like the author of this module removed the github repository, likely not going to address this issue. Can you confirm? I'm pretty sure I opened the issue there :-)
- **2018-02-26** @bl4de: @lirantal - yes, I can confirm GitHub repo does not exist. 
Issue is still reproducible though.
- **2018-02-26** @lirantal: Ok, I'll proceed with a forced public disclosure then.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
