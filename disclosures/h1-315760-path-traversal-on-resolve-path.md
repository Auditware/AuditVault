---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2018-02-22
submitted: 2018-02-13T21:48:00.573Z
bounty_usd: null
votes: 7
cve: "CVE-2018-3732"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "orange"
source: "https://hackerone.com/reports/315760"
title: "Path Traversal on Resolve-Path"
---
# Path Traversal on Resolve-Path

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-22

- Report: [https://hackerone.com/reports/315760](https://hackerone.com/reports/315760)
- CWE: Path Traversal | CVE: CVE-2018-3732
- Submitted: 2018-02-13T21:48:00.573Z

## Timeline

- **Report Filed**
- **2018-02-17** @lirantal: Hi @orange,

Thanks a lot for reporting the vulnerability.
I will invite Doug to this issue so we can quickly triage it.
- **Report Triaged**
- **2018-02-17** @lirantal: Is it correct to assume that all versions prior to 1.4.0 were vulnerable?
- **Report Severity Updated**
- **Changed Scope**
- **External User Joined**
- **2018-02-18** @dougwilson: That's correct: all versions prior to 1.4.0 are effected.
- **2018-02-18** @lirantal: Ok great. I requested a CVE to be assigned.
- **2018-02-18** @lirantal: @dougwilson @orange are you ok with a full public disclosure for this vulnerability once the CVE is assigned?
- **2018-02-18** @dougwilson: That's good, because it's already been patched & released.
- **2018-02-18** @orange: OK! BTW, if there is any acknowledgement, please credit to Orange Tsai(@orange_8361) from DEVCORE

Thanks!
- **2018-02-19** @lirantal: Will do @orange, thanks!
- **Report Resolved**
- **Agreed On Going Public**
- **Cve Id Added**
- **Manually Disclosed**
