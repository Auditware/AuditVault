---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2018-09-29
submitted: 2018-08-03T23:06:57.182Z
bounty_usd: null
votes: 24
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "metnew"
source: "https://hackerone.com/reports/390362"
title: "Local files reading from the 'file://' origin through `brave://`"
---
# Local files reading from the "file://" origin through `brave://`

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 24 | **Program:** Brave Software | **Disclosed:** 2018-09-29

- Report: [https://hackerone.com/reports/390362](https://hackerone.com/reports/390362)
- CWE: N/A
- Submitted: 2018-08-03T23:06:57.182Z

## Timeline

- **2018-08-03** @metnew: Brave's repo mentions the #390013 problem. 
I'm going to contact security@brave.com directly to resolve this issue more quickly.
- **2018-08-03** @metnew: > Sent @diracdeltas more info about this bug.
- **2018-08-04** @diracdeltas: thanks, noting that i've seen this. as i understand it, it's basically the same impact as 375329
- **2018-08-04** @metnew: Yeah, the same problem
- **Report Filed**
- **2018-08-08** @metnew: Fix: https://github.com/brave/muon/commit/df6ee1e7acff52b9e4317551be51bd0d2bd6463e

> removes CORS header from a response of `AsarProtocolHandler`
- **2018-08-08** @diracdeltas: this PR should fix it once merged https://github.com/brave/muon/pull/641
- **Bounty Awarded**
- **Report Resolved**
- **2018-08-08** @metnew: Great, thanks @brave for the bounty and quick fix
- **2018-09-21** @metnew: @diracdeltas Unpatched at that time #369218 (opening `file:///` URLs from the web using "open in new tab") allowed to significantly increase severity of this bug.
- **Agreed On Going Public**
- **2018-09-28** @diracdeltas: https://hackerone.com/reports/375329#activity-3402965 also applies here, except instead of simply opening a file, the user has to open it via `brave://` for the attack to work (by default clicking on a file opens it via `file://`). This attack seems more convoluted because the attacker probably has to get the user to open a special link (via phishing for instance) to get them to load it with `brave://`.
- **Bounty Awarded**
- **2018-09-28** @metnew: Actually, no, the file should be opened on file:// origin. @diracdeltas 
Additionally, navigation to brave:// leads to crash
- **2018-09-28** @diracdeltas: @metnew oops, i misread. `brave://` is the imported resource not the top-level.
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
