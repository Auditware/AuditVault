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
date: 2018-06-27
submitted: 2018-05-27T14:40:36.614Z
bounty_usd: null
votes: 12
cve: "CVE-2018-3766"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "n0n4me"
source: "https://hackerone.com/reports/358112"
title: "[buttle] Path traversal in mid-buttle module allows to read any file in the server."
---
# [buttle] Path traversal in mid-buttle module allows to read any file in the server.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Node.js third-party modules | **Disclosed:** 2018-06-27

- Report: [https://hackerone.com/reports/358112](https://hackerone.com/reports/358112)
- CWE: Path Traversal | CVE: CVE-2018-3766
- Submitted: 2018-05-27T14:40:36.614Z

## Timeline

- **Report Filed**
- **2018-05-27** @n0n4me: I found another bug is information disclosure in the module "mid-php.js". When you execute a exist file php append '/' the server will reveal the absolute path to that file.

{F302396}

link in github: https://github.com/jtrussell/buttle/blob/master/lib/mid-php.js#L26
- **Report Triaged**
- **2018-06-16** @lirantal: Hi @n0n4me,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **2018-06-16** @n0n4me: Thanks.
- **Report Severity Updated**
- **2018-06-26** @lirantal: @n0n4me I will disclose it as the author isn't responsive and we had have already other reports with the same problem.
- **2018-06-27** @n0n4me: Will I have a CVE ?
- **2018-06-27** @lirantal: Yes of course, I'm going to request it now and disclose the report.
- **2018-06-27** @n0n4me: Thank you.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
