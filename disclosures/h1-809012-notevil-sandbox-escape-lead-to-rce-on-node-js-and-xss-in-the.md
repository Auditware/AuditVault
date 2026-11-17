---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2020-08-27
submitted: 2020-03-03T00:07:44.820Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "phra"
source: "https://hackerone.com/reports/809012"
title: "[notevil] - Sandbox Escape Lead to RCE on Node.js and XSS in the Browser"
---
# [notevil] - Sandbox Escape Lead to RCE on Node.js and XSS in the Browser

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-27

- Report: [https://hackerone.com/reports/809012](https://hackerone.com/reports/809012)
- CWE: Code Injection
- Submitted: 2020-03-03T00:07:44.820Z

## Timeline

- **Report Filed**
- **2020-03-03** @nochnoidozor: Hi @phra,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **2020-03-04** @phra: the issue seems the have been fixed: https://github.com/mmckegg/notevil/pull/34
- **2020-03-17** @phra: the issue was fixed 13 days ago.. can we close as resolved and disclose it?
- **2020-03-18** @nochnoidozor: Hi @phra - we are still waiting a response from the team. Thanks for your patience!
- **2020-03-18** @phra: no worries :)
- **2020-05-09** @phra: any update?
- **2020-05-11** @nochnoidozor: Hi @phra - Unfortunately we haven't received any updates yet.

Best,
@nochnoidozor
- **2020-07-22** @phra: the report is now 5 months old while the vulnerability was fixed in 24 hours after i contacted the developer. can we declare the bug solved and proceed to disclosure? thanks.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Title Updated**
