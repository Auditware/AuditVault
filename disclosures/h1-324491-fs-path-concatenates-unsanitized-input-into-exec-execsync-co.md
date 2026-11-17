---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2018-05-11
submitted: 2018-03-11T20:19:23.918Z
bounty_usd: null
votes: 2
cve: "CVE-2020-8298"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/324491"
title: "`fs-path` concatenates unsanitized input into exec()/execSync() commands"
---
# `fs-path` concatenates unsanitized input into exec()/execSync() commands

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-11

- Report: [https://hackerone.com/reports/324491](https://hackerone.com/reports/324491)
- CWE: Command Injection - Generic | CVE: CVE-2020-8298
- Submitted: 2018-03-11T20:19:23.918Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-03-12** @lirantal: Hi,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **2018-04-24** @lirantal: @chalker due to no activity from the maintainer, how do you feel about disclosing this report?
- **2018-05-11** @chalker: I'm fine with the disclosure.

Depsdb output:
```
Query: "fs-path@
10211   fs-path
2343    gulp-version-number
1200    gulp-axe-webdriver
886     font-plugins-plus
645     jdfx
…
```
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
