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
date: 2018-08-30
submitted: 2018-05-24T17:10:48.144Z
bounty_usd: null
votes: 11
cve: "CVE-2018-3787"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "n0n4me"
source: "https://hackerone.com/reports/357109"
title: "[simplehttpserver] List any file in the folder by using path traversal."
---
# [simplehttpserver] List any file in the folder by using path traversal.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Node.js third-party modules | **Disclosed:** 2018-08-30

- Report: [https://hackerone.com/reports/357109](https://hackerone.com/reports/357109)
- CWE: Path Traversal | CVE: CVE-2018-3787
- Submitted: 2018-05-24T17:10:48.144Z

## Report summary

Vulnerability was reported and the package maintainer fixed the issue.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **2018-07-10** @n0n4me: any update ?
- **2018-07-11** @e_lexy: I have tried your Curl command and am able to reproduce. I will try to contact the author.
- **2018-08-11** @e_lexy: Opened this issue in the GH repo https://github.com/tikonen/blog/issues/4 since the author did not respond to my email.
- **2018-08-13** @e_lexy: Response received on GH issue!
- **2018-08-14** @n0n4me: Thanks for the update.
- **2018-08-14** @e_lexy: I invited the author of the module.
- **External User Joined**
- **2018-08-14** @tikonen: I'm the author of this module, I'll see if the fix is straightforward. The simplehttpserver is purposed for testing and development use and was never indented to be secure in any way. This case is however also a clear bug, http server should not behave this way even in the dev use.
- **2018-08-15** @tikonen: I've published version 0.2.1 that should cover the path traversal vulnerability issue
- **2018-08-15** @e_lexy: @tikonen thanks for the quick fix!
@n0n4me can you verify 0.2.1 fixes the issue?
- **2018-08-16** @n0n4me: hello @e_lexy @tikonen,

I confirm it is fixed.
- **Report Resolved**
- **Agreed On Going Public**
- **2018-08-29** @e_lexy: CVE ID requested
- **Agreed On Going Public**
- **Report Became Public**
