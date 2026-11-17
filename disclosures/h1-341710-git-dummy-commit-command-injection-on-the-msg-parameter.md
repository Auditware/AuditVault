---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2018-06-15
submitted: 2018-04-22T03:26:03.610Z
bounty_usd: null
votes: 5
cve: "CVE-2018-3785"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "caioluders"
source: "https://hackerone.com/reports/341710"
title: "[git-dummy-commit] Command injection on the msg parameter"
---
# [git-dummy-commit] Command injection on the msg parameter

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-06-15

- Report: [https://hackerone.com/reports/341710](https://hackerone.com/reports/341710)
- CWE: OS Command Injection | CVE: CVE-2018-3785
- Submitted: 2018-04-22T03:26:03.610Z

## Timeline

- **Report Filed**
- **2018-04-23** @lirantal: Hi @caioluders i,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **2018-05-11** @lirantal: Since the author didn't join the report I opened a security issue in the repo.
- **External User Joined**
- **2018-05-13** @stevemao: Sorry for the late reply. I just opened a PR:
https://github.com/stevemao/git-dummy-commit/pull/2
- **Report Severity Updated**
- **2018-05-31** @lirantal: @stevemao I commented on that PR and I think you still need to resolve it.
@caioluders could you also review and add any comments?
- **2018-06-01** @caioluders: Just made a comment there. Just isolate the parameters
- **Changed Scope**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
