---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-input-validation
  - env/web
  - stack/node
substate: "resolved"
weakness: "Improper Input Validation"
enriched: true
date: 2020-01-27
submitted: 2019-02-14T22:41:05.962Z
bounty_usd: null
votes: 6
cve: "CVE-2020-8124"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "ronperris"
source: "https://hackerone.com/reports/496293"
title: "[url-parse] Improper Validation and Sanitization"
---
# [url-parse] Improper Validation and Sanitization

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2020-01-27

- Report: [https://hackerone.com/reports/496293](https://hackerone.com/reports/496293)
- CWE: Improper Input Validation | CVE: CVE-2020-8124
- Submitted: 2019-02-14T22:41:05.962Z

## Timeline

- **Report Filed**
- **2019-02-14** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Changed Scope**
- **Changed Scope**
- **Report Triaged**
- **Report Title Updated**
- **External User Joined**
- **2019-04-03** @3rdeden: I have a patch working for this, which basically just trims() all input before it's parsed but it's breaking one of the existing tests that explicity wants unicode whitespace at the end of the URL. An alternate fix would just do a trim left so the whitespace infront of the protocol would be trimmed creating the desired result again.
- **2019-04-03** @ronperris: @3rdeden That sounds good. That will patch the exploit path I reported.
- **2019-04-11** @3rdeden: Should be resolved in url-parse@1.4.5

- Referenced git commit: https://github.com/unshiftio/url-parse/commit/3ecd256f127c3ada36a84d9b8dd3ebd14316274b with the fix.
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
