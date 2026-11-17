---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/memory-corruption-generic
  - env/web
substate: "resolved"
weakness: "Memory Corruption - Generic"
enriched: true
date: 2018-05-16
submitted: 2017-03-12T20:54:30.887Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "geeknik"
source: "https://hackerone.com/reports/212931"
title: "heap-buffer-overflow (buffer read overrun) in curl: ourWriteOut() src/tool_writeout.c:115"
---
# heap-buffer-overflow (buffer read overrun) in curl: ourWriteOut() src/tool_writeout.c:115

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Internet Bug Bounty | **Disclosed:** 2018-05-16

- Report: [https://hackerone.com/reports/212931](https://hackerone.com/reports/212931)
- CWE: Memory Corruption - Generic
- Submitted: 2017-03-12T20:54:30.887Z

## Timeline

- **Report Filed**
- **2017-04-03** @geeknik: FYI, this flaw has been assigned CVE-2017-7407 by Mitre. Their rationale:

>This specific case has a CVE because "theoretically, it could write out a password or secret key or something" was raised on the vendor's security mailing list, that possibility (apparently) could not be dismissed, and the commit message is consistent with that possibility.
- **2017-04-03** @geeknik: The actual CVE description is `The ourWriteOut function in tool_writeout.c in curl 7.53.1 might allow physically proximate attackers to obtain sensitive information from process memory in opportunistic circumstances by reading a workstation screen during use of a --write-out argument ending in a '%' character, which leads to a heap-based buffer over-read.`
- **Reassigned To Team**
- **Not Eligible For Bounty**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
