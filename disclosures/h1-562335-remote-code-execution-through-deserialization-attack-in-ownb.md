---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/deserialization-of-untrusted-data
  - env/web
substate: "informative"
weakness: "Deserialization of Untrusted Data"
enriched: true
date: 2019-07-01
submitted: 2019-05-02T21:35:03.162Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/owncloud|ownCloud]]"
reporter: "q3rv0"
source: "https://hackerone.com/reports/562335"
title: "Remote Code Execution through Deserialization Attack in OwnBackup app."
---
# Remote Code Execution through Deserialization Attack in OwnBackup app.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 16 | **Program:** ownCloud | **Disclosed:** 2019-07-01

- Report: [https://hackerone.com/reports/562335](https://hackerone.com/reports/562335)
- CWE: Deserialization of Untrusted Data
- Submitted: 2019-05-02T21:35:03.162Z

## Timeline

- **Report Filed**
- **2019-05-02** @ownCloud: Thanks a lot for reporting this potential issue back to us. We take security very seriously and would appreciate if you would not share any information about this bug until we have determined a potential patch.
 
Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster.
- **Report Informative**
- **Agreed On Going Public**
- **2019-06-14** @ocsec: @q3rv0 Did you submit the issue to https://github.com/pbek/ownbackup ?
- **2019-06-25** @q3rv0: Yes, the bug is already fixed
- **Agreed On Going Public**
- **Report Became Public**
