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
submitted: 2018-01-25T22:02:33.743Z
bounty_usd: null
votes: 6
cve: "CVE-2018-3717"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/309394"
title: "[anywhere] An iframe element with url to malicious HTML file (with eg. JavaScript malware) can be used as filename and served via anywhere"
---
# [anywhere] An iframe element with url to malicious HTML file (with eg. JavaScript malware) can be used as filename and served via anywhere

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-26

- Report: [https://hackerone.com/reports/309394](https://hackerone.com/reports/309394)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2018-3717
- Submitted: 2018-01-25T22:02:33.743Z

## Timeline

- **Report Filed**
- **2018-01-26** @vdeturckheim: Hey @bl4de , thanks for reporting this. We will look shortly at this report!
- **2018-01-30** @lirantal: Thanks for reporting this issue to us.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **Changed Scope**
- **Cve Id Added**
- **Cve Id Added**
- **2018-02-14** @lirantal: Since the author didn't join the report I opened a security issue in the repo.
- **2018-02-18** @lirantal: Author commented on a fix but I invited to take part in the conversation: https://github.com/JacksonTian/anywhere/issues/33#issuecomment-366527448
- **2018-02-19** @bl4de: Looks like changes Author introduced resolved an issue as I can't reproduce one.
- **2018-02-26** @lirantal: So if release 1.5.0 fixes it and we don't have the author joining us I'll go ahead and disclose publicly
- **2018-02-26** @bl4de: @lirantal Sounds good to me. Issue is fixed, so there's no reason not to do so.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Report Severity Updated**
- **Report Severity Updated**
