---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2018-02-26
submitted: 2018-01-26T22:06:10.553Z
bounty_usd: null
votes: 8
cve: "CVE-2018-3716"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/309648"
title: "[simplehttpserver] Stored XSS in file names leads to malicious JavaScript code execution when directory listing is output in HTML"
---
# [simplehttpserver] Stored XSS in file names leads to malicious JavaScript code execution when directory listing is output in HTML

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-26

- Report: [https://hackerone.com/reports/309648](https://hackerone.com/reports/309648)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2018-3716
- Submitted: 2018-01-26T22:06:10.553Z

## Timeline

- **Report Filed**
- **2018-01-29** @vdeturckheim: Hey @bl4de thanks you for this report! We will shortly look at it!
- **2018-01-30** @lirantal: Hi @bl4de,

Thanks for reporting this issue to us.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **Cve Id Added**
- **Report Title Updated**
- **Report Severity Updated**
- **Changed Scope**
- **2018-02-26** @lirantal: @bl4de it seems that the author removed this package from npm. Can you also confirm?
If so I'll go ahead and publish a full disclosure.
- **2018-02-26** @bl4de: @lirantal Yes, I can confirm that. 
A little bit weird way to fix an issue, but 100% efficient - can't reproduce anymore :D
- **2018-02-26** @lirantal: :-)
I'll force a public disclosure then.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Report Severity Updated**
