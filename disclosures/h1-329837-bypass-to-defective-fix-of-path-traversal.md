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
date: 2018-05-11
submitted: 2018-03-25T23:16:51.194Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "caioluders"
source: "https://hackerone.com/reports/329837"
title: "Bypass to defective fix of Path Traversal "
---
# Bypass to defective fix of Path Traversal 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-11

- Report: [https://hackerone.com/reports/329837](https://hackerone.com/reports/329837)
- CWE: Path Traversal
- Submitted: 2018-03-25T23:16:51.194Z

## Timeline

- **Report Filed**
- **2018-03-26** @lirantal: Thanks for reporting @caioluders ,
I invited the maintainer to help us triage the report.
- **Report Triaged**
- **2018-04-18** @caioluders: Any news ?
- **2018-04-24** @lirantal: @caioluders can you check if the author's fix here is ok https://github.com/DCKT/localhost-now/issues/1#issuecomment-365914335 ?
- **2018-04-24** @caioluders: @lirantal The bypass is exactly to that fix.
- **2018-04-25** @lirantal: Ahh got it. Let's see if they're able to join the conversation to pick it up before we disclose.
- **2018-05-11** @lirantal: Continuing with public disclosure
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
