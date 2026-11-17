---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-exposure-through-directory-listing
  - env/web
  - stack/node
substate: "resolved"
weakness: "Information Exposure Through Directory Listing"
enriched: true
date: 2018-05-30
submitted: 2018-03-28T10:35:21.237Z
bounty_usd: null
votes: 2
cve: "CVE-2019-5415"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "tungpun"
source: "https://hackerone.com/reports/330724"
title: "[serve] Directory listing and File access even when they have been set to be ignored (using dot-slash)"
---
# [serve] Directory listing and File access even when they have been set to be ignored (using dot-slash)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-30

- Report: [https://hackerone.com/reports/330724](https://hackerone.com/reports/330724)
- CWE: Information Exposure Through Directory Listing | CVE: CVE-2019-5415
- Submitted: 2018-03-28T10:35:21.237Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **External User Joined**
- **2018-05-26** @tungpun: I think your 45 days SLA has been reached! May I kindly know any update?
- **2018-05-28** @marcinhoppe: Hi @tungpun,

I have been in touch with the maintainer.  They rewrote the core of serve and will release a new version this week.

If it is OK with you, I'd like to disclose when the new version (which fixes this vulnerability) is available on NPM.

Best regard,
Marcin
- **2018-05-28** @tungpun: @marcinhoppe Okay. Thanks for your update!
- **2018-05-28** @notquiteleo: 7.0.0 and 7.0.1 are out!

https://github.com/zeit/serve
- **2018-05-29** @tungpun: It should be okay now. I can't reproduce the issue anymore.
- **2018-05-30** @marcinhoppe: Thanks @tungpun. I will disclose it now.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
