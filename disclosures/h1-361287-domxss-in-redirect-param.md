---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-dom
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
body: true
date: 2019-03-20
submitted: 2018-06-03T10:03:13.734Z
bounty_usd: null
votes: 81
cve: []
program: "[[programs/semmle|Semmle]]"
reporter: "flamezzz"
source: "https://hackerone.com/reports/361287"
title: "DOMXSS in redirect param"
---
# DOMXSS in redirect param

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 81 | **Program:** Semmle | **Disclosed:** 2019-03-20

- Report: [https://hackerone.com/reports/361287](https://hackerone.com/reports/361287)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2018-06-03T10:03:13.734Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Summary
The **redirect** param can consist of a ``javascript:`` url, which results in XSS. If a victim visits a malicious URL and logs in, the attacker can perform actions on behalf of the victim.

#Steps to reproduce
1) Logout
2) Visit `` https://lgtm-com.pentesting.semmle.net/?redirect=javascript:prompt(document.domain)%2f%2f
 ``
3) Log in through email

## Impact

If a victim visits a malicious URL and logs in, the attacker can perform actions on behalf of the victim.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **Report Resolved**
- **Bounty Awarded**
- **2018-06-04** @flamezzz: Thanks for the bounty!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
