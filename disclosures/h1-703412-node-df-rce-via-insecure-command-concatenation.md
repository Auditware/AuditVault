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
date: 2019-12-04
submitted: 2019-09-28T09:11:41.085Z
bounty_usd: null
votes: 5
cve: "CVE-2019-15597"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mik317"
source: "https://hackerone.com/reports/703412"
title: "[node-df] RCE via insecure command concatenation"
---
# [node-df] RCE via insecure command concatenation

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2019-12-04

- Report: [https://hackerone.com/reports/703412](https://hackerone.com/reports/703412)
- CWE: Code Injection | CVE: CVE-2019-15597
- Submitted: 2019-09-28T09:11:41.085Z

## Timeline

- **Report Filed**
- **2019-09-28** @mik317: PS: THe issue arises in the following code-line: https://github.com/adriano-di-giovanni/node-df/blob/master/lib/index.js#L36

Best, Mik
- **2019-09-29** @nochnoidozor: Hi @mik317,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Severity Updated**
- **Report Triaged**
- **2019-10-07** @lirantal: thanks for the report @mik317, I invited the package maintainer to review this
- **2019-10-08** @mik317: Thank you :)

Best, Mik
- **2019-12-04** @lirantal: Will disclose due to no reply from maintainer
- **Changed Scope**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **External User Joined**
