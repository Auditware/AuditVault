---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-after-free
  - env/web
substate: "duplicate"
weakness: "Use After Free"
enriched: true
date: 2026-04-29
submitted: 2026-03-08T11:47:20.112Z
bounty_usd: null
votes: 58
cve: []
program: "[[programs/curl|curl]]"
reporter: "nadsec42"
source: "https://hackerone.com/reports/3591956"
title: "Use-After-Free in SMB connection reuse (req->path dangling pointer after needle destruction)"
---
# Use-After-Free in SMB connection reuse (req->path dangling pointer after needle destruction)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 58 | **Program:** curl | **Disclosed:** 2026-04-29

- Report: [https://hackerone.com/reports/3591956](https://hackerone.com/reports/3591956)
- CWE: Use After Free
- Submitted: 2026-03-08T11:47:20.112Z

## Timeline

- **Report Filed**
- **2026-03-08** @bagder: How come the exact same report is reported by two separate users?
- **2026-03-08** @nadsec42: Oh I reported earlier but after I reported there was a network error message that displayed. I cannot find the report on my other account and I am unable issue reports to curl on that account.

Sorry this one can be closed. My appologies :)
- **2026-03-08** @nadsec42: The report has now shown up on my other account. Sorry again.
- **Report Duplicate**
- **2026-03-08** @nadsec42: _This comment was deleted by the author._
- **Agreed On Going Public**
- **Manually Disclosed**
