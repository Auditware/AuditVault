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
date: 2018-02-17
submitted: 2018-02-06T16:12:58.503Z
bounty_usd: null
votes: 4
cve: "CVE-2018-3731"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/312918"
title: "[public] Path Traversal allows to read content of arbitrary files"
---
# [public] Path Traversal allows to read content of arbitrary files

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-17

- Report: [https://hackerone.com/reports/312918](https://hackerone.com/reports/312918)
- CWE: Path Traversal | CVE: CVE-2018-3731
- Submitted: 2018-02-06T16:12:58.503Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-02-07** @lirantal: Hi @bl4de ,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Severity Updated**
- **Changed Scope**
- **Cve Id Added**
- **2018-02-14** @lirantal: Since the author didn't join the report I opened a security issue in the repo.
- **External User Joined**
- **2018-02-15** @tnantoka: Thanks for reporting. I'm a author.
I fixed the issue with [this commit](https://github.com/tnantoka/public/commit/eae8ad8017b260f8667ded5e12801bd72b877af2).
- **2018-02-15** @bl4de: Hi @tnantoka, 

Thanks for the fix, it looks like issue is not reproducible anymore.

However, during testing your fix, I've found yet another issue and will open new report for it.
- **Report Resolved**
- **Agreed On Going Public**
- **2018-02-15** @bl4de: @lirantal I am always fine with public disclosures :)
- **2018-02-15** @lirantal: Cool :-)

@tnantoka can we go ahead with it?
- **2018-02-16** @tnantoka: @lirantal No problem!
- **2018-02-17** @lirantal: Great, I disclosed it.
- **Manually Disclosed**
