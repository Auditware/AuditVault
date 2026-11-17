---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/plaintext-storage-of-a-password
  - env/web
substate: "resolved"
weakness: "Plaintext Storage of a Password"
enriched: true
date: 2020-03-01
submitted: 2017-06-28T19:13:38.872Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "maprambo"
source: "https://hackerone.com/reports/244092"
title: "Password of failed (2FA) login attempt is stored in log"
---
# Password of failed (2FA) login attempt is stored in log

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Nextcloud | **Disclosed:** 2020-03-01

- Report: [https://hackerone.com/reports/244092](https://hackerone.com/reports/244092)
- CWE: Plaintext Storage of a Password
- Submitted: 2017-06-28T19:13:38.872Z

## Timeline

- **Report Filed**
- **2017-06-28** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2017-06-29** @nickvergessen: Patch at https://github.com/nextcloud/server/pull/5557

Thanks for your report.
- **Swag Awarded**
- **Report Triaged**
- **Report Resolved**
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **Report Became Public**
