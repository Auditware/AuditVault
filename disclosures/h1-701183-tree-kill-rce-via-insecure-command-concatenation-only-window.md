---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/node
  - os/windows
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2019-12-04
submitted: 2019-09-24T19:40:58.828Z
bounty_usd: null
votes: 15
cve: "CVE-2019-15599"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mik317"
source: "https://hackerone.com/reports/701183"
title: "[tree-kill] RCE via insecure command concatenation (only Windows)"
---
# [tree-kill] RCE via insecure command concatenation (only Windows)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Node.js third-party modules | **Disclosed:** 2019-12-04

- Report: [https://hackerone.com/reports/701183](https://hackerone.com/reports/701183)
- CWE: Code Injection | CVE: CVE-2019-15599
- Submitted: 2019-09-24T19:40:58.828Z

## Timeline

- **Report Filed**
- **2019-09-25** @nochnoidozor: Hi @mik317,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Severity Updated**
- **Report Triaged**
- **2019-09-25** @mik317: Thank you :)
This is my record report :)

Best, Mik
- **2019-10-07** @lirantal: @mik317 thanks for sending this report!
I invited the package maintainer to jump in and review the issue so we can work on a fix.
- **2019-10-08** @mik317: Thank you :)

Best, Mik
- **2019-11-08** @mik317: Hi :)
Any news regarding the fixes?

Best, Mik
- **2019-12-04** @lirantal: I'll move forward with disclosing due to no reply from maintainer
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
