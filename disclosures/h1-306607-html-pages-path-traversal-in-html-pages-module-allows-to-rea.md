---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2018-05-19
submitted: 2018-01-19T00:52:41.776Z
bounty_usd: null
votes: 13
cve: "CVE-2018-3744"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/306607"
title: "[html-pages] Path Traversal in html-pages module allows to read any file from the server with curl"
---
# [html-pages] Path Traversal in html-pages module allows to read any file from the server with curl

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-19

- Report: [https://hackerone.com/reports/306607](https://hackerone.com/reports/306607)
- CWE: Path Traversal | CVE: CVE-2018-3744
- Submitted: 2018-01-19T00:52:41.776Z

## Timeline

- **Report Filed**
- **2018-01-19** @cjihrig: I was able to reproduce the issue described and I consider this as a security issue.

I will triage this report as vulnerability. Have you already tried to contact the module maintainer?
- **Report Triaged**
- **Changed Scope**
- **2018-01-19** @bl4de: Hi @cjihrig ,

Thank you for verifying my report.

I haven't contacted project maintainer as my intention was to keep the whole process consistent through Node.js third-party modules program on the platform, also didn't want to open issue on its GitHub repository to not cause any security issues to this module users before it will be fixed and patch will be available.

Feel free to inform Daniel about this vulnerability and invite him as a participant to this report.

Regards,
bl4de
- **2018-01-19** @cjihrig: An email has been sent to npm@danielcardoso.net.
- **2018-01-30** @cjihrig: My previous email did not receive a response. An issue has been opened at https://github.com/danielcardoso/html-pages/issues/2.
- **2018-05-08** @bl4de: Hi @cjihrig 

Any update on this?

Regards,

bl4de
- **Cve Id Added**
- **Report Triaged**
- **Report Resolved**
- **Report Severity Updated**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Manually Disclosed**
