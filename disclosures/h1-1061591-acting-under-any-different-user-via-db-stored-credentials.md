---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2021-03-01
submitted: 2020-12-18T12:53:55.658Z
bounty_usd: null
votes: 8
cve: "CVE-2021-22877"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "alexanderhofstaetter"
source: "https://hackerone.com/reports/1061591"
title: "Acting under any different user via DB-stored credentials"
---
# Acting under any different user via DB-stored credentials

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Nextcloud | **Disclosed:** 2021-03-01

- Report: [https://hackerone.com/reports/1061591](https://hackerone.com/reports/1061591)
- CWE: Improper Access Control - Generic | CVE: CVE-2021-22877
- Submitted: 2020-12-18T12:53:55.658Z

## Timeline

- **Report Filed**
- **2020-12-18** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Triaged**
- **2020-12-18** @nickvergessen: Public report from https://github.com/nextcloud/server/issues/24600
- **2021-01-15** @nickvergessen: Hi, our current patch is the attached one. Do you want to verify it?
- **2021-01-18** @alexanderhofstaetter: Hello! I tested the patch and it seems to work.
- **Bounty Awarded**
- **Report Resolved**
- **2021-02-01** @alexanderhofstaetter: thank you!

Name / Pseudonym: Alexander Hofstätter
Website (optional): https://hofstaetter.io
Company (optional): Hofstätter IT GmbH
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **2021-02-10** @nickvergessen: Pending CVE: CVE-2021-22877
Pending SA: https://nextcloud.com/security/advisory/?id=NC-SA-2021-004

Scheduled date is: 22nd februrary (4 weeks after the 20.0.6 release)
- **Agreed On Going Public**
- **Manually Disclosed**
