---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2018-06-12
submitted: 2018-03-27T13:52:58.486Z
bounty_usd: null
votes: 5
cve: "CVE-2018-16481"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "tungpun"
source: "https://hackerone.com/reports/330356"
title: "[html-pages] Stored XSS in the filename when directories listing"
---
# [html-pages] Stored XSS in the filename when directories listing

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-06-12

- Report: [https://hackerone.com/reports/330356](https://hackerone.com/reports/330356)
- CWE: Cross-site Scripting (XSS) - Generic | CVE: CVE-2018-16481
- Submitted: 2018-03-27T13:52:58.486Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-04-05** @lirantal: @dagonza I set to triaged status so it won't mess up the SLA
- **2018-04-08** @dagonza: Thanks @lirantal . I can also confirm this vulnerability. Chrome blocks it but other browsers are affected by this. I am inviting the author to the discussion.
- **2018-05-26** @tungpun: I think your 45 days SLA has been reached! May I kindly know any update?
- **Report Resolved**
- **2018-05-29** @dagonza: You are right. Author did not respond to emails.
- **Report Severity Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
