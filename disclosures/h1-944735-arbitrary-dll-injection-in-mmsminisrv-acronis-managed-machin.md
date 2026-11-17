---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2020-10-20
submitted: 2020-07-28T09:14:57.895Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/acronis|Acronis]]"
reporter: "adr"
source: "https://hackerone.com/reports/944735"
title: "Arbitrary DLL injection in mmsminisrv (Acronis Managed Machine Service Mini)"
---
# Arbitrary DLL injection in mmsminisrv (Acronis Managed Machine Service Mini)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Acronis | **Disclosed:** 2020-10-20

- Report: [https://hackerone.com/reports/944735](https://hackerone.com/reports/944735)
- CWE: Privilege Escalation
- Submitted: 2020-07-28T09:14:57.895Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2020-07-28** @adr: The same vulnerability exists in another service: syncagentsrv ("C:\Program Files (x86)\Common Files\Acronis\SyncAgent\syncagentsrv.exe"). Please decide whether this belongs here or you'd prefer me to open new report. The root-cause is very likely the same, though.

This time curl.dll is vulnerable library. Proof:
{F926924}
- **2020-07-28** @adr: anti_ransomware_service.exe is also affected. I'm testing components one by one, thus the issue may still affect more components than that.
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **2020-08-04** @stushieva: @adr,
Since the root cause is the same, we consider this as single issue
Thanks for your efforts!
- **Bounty Awarded**
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
