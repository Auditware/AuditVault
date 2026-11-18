---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/memory-corruption-generic
  - env/web
  - vuln/code-injection
  - vuln/dos
  - impact/rce
substate: "resolved"
weakness: "Memory Corruption - Generic"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Bug report and exploit: https://github.com/zeromq/libzmq/issues/3351
Fix by me: https://github.com/zeromq/libzmq/pull/3353

My motive for full disclosure is as follows:

```
Is it true that it is not safe to use ZeroMQ over the internet because it will crash?

Earlier versions of the ZeroMQ library (before 2.1) were not very resilient against "fuzzing" attacks. A malformed packet or garbage data could cause an old version of the library to assert and exit. Since the release of 2.1, all reported cases of assertions caused by bad data have been fixed. If your testing uncovers a problem in this area, please file a bug report.
```
Source: http://zeromq.org/area:faq

The issue reporting page (http://zeromq.org/docs:issue-tracking) instructs to open a Github issue, with no special procedure for security issues, so I went ahead and did just that.

libzmq appears to be widely used and has wrapper implementations for Go, Python, Java, Node.js, etc.

## Impact

Running arbitrary code on the victim's system.

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
