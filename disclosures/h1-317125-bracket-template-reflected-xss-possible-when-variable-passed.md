---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
date: 2018-04-09
submitted: 2018-02-17T14:19:09.371Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/317125"
title: "[bracket-template] Reflected XSS possible when variable passed via GET parameter is used in template"
---
# [bracket-template] Reflected XSS possible when variable passed via GET parameter is used in template

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Node.js third-party modules | **Disclosed:** 2018-04-09

- Report: [https://hackerone.com/reports/317125](https://hackerone.com/reports/317125)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2018-02-17T14:19:09.371Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-02-17** @lirantal: Hi @bl4de ,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **2018-02-17** @lirantal: I couldn't locate an e-mail address associated with the author so I opened a GitHub issue to ask to join us.
- **Changed Scope**
- **Report Resolved**
- **Agreed On Going Public**
- **2018-03-10** @lirantal: I will continue a public disclosure since there's been no activity from the maintainers on this.
- **Report Became Public**
- **Report Severity Updated**
