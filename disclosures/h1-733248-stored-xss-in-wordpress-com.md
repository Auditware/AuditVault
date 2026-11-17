---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2020-02-17
submitted: 2019-11-09T22:04:23.291Z
bounty_usd: null
votes: 356
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "adhamsadaqah"
source: "https://hackerone.com/reports/733248"
title: "Stored XSS in wordpress.com"
---
# Stored XSS in wordpress.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 356 | **Program:** Automattic | **Disclosed:** 2020-02-17

- Report: [https://hackerone.com/reports/733248](https://hackerone.com/reports/733248)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-11-09T22:04:23.291Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2019-11-11** @xknown: Hi. Thanks for the report. We are going to take a look.
- **Report Triaged**
- **2019-11-14** @xknown: Hi. We deployed a mitigation patch to address this issue. We are still looking into a more comprehensive solution.
- **2019-11-14** @adhamsadaqah: I've checked the vulnerability again and I can confirm now it's fixed.
- **2019-11-18** @kraft: Hi! We're planning on releasing a new version of Jetpack to resolve this for impacted Jetpack sites. In the release notes, how would you like to be credited for the responsible disclosure and discovery? "Adham Sadaqah" or would you prefer something else?
- **2019-11-18** @adhamsadaqah: Hi Kraft,
Thanks for your reply
I'd like to be credited as "Adham Sadaqah"
- **2019-11-19** @kraft: Thank you again. The fix has gone out in impacted versions ( https://jetpack.com/2019/11/19/jetpack-7-9-1-maintenance-security/ ). The security folks on the team will follow-up with processing this report.
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
