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
date: 2019-09-12
submitted: 2019-01-09T12:16:04.570Z
bounty_usd: null
votes: 29
cve: "CVE-2019-6250"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "guido"
source: "https://hackerone.com/reports/477073"
title: "ZeroMQ libzmq remote code execution"
---
# ZeroMQ libzmq remote code execution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 29 | **Program:** Internet Bug Bounty | **Disclosed:** 2019-09-12

- Report: [https://hackerone.com/reports/477073](https://hackerone.com/reports/477073)
- CWE: Memory Corruption - Generic | CVE: CVE-2019-6250
- Submitted: 2019-01-09T12:16:04.570Z

## Timeline

- **Report Filed**
- **2019-01-15** @guido: CVE-2019-6250 has been assigned.
- **2019-01-18** @h1_analyst_leon: Hey @guido - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
- **2019-02-11** @guido: Hi, can you kindly process this report? Thank you.
- **Cve Id Added**
- **Report Severity Updated**
- **2019-04-15** @antenna: Hi @guido - Thank you for the report and sorry for the delayed response. Unfortunately, this submission doesn't meet the following criteria:

> - Have critical impact: vulnerability has extreme negative consequences for the general public.
> - Be novel: vulnerability is new or unusual in an interesting way.

For further ideas of what type of vulnerabilities are accepted, check out ImageTragick and ShellShock.

Thanks,
@antenna
- **2019-04-15** @guido: ZeroMQ is in widespread use and my finding has critical impact. I don't just present a fuzzer finding but an actual remote code execution exploit.

Even Heartbleed would be disqualified by your second criterium because buffer overreads are far from novel and have in fact existed since Richard Stallman was still buffer overflowing his diapers.

But whatever.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2019-04-30** @guido: Come on man, disclose it.
- **Report Reopened**
- **2019-08-27** @guido: Thank you very much @reed
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
