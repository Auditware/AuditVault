---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/classic-buffer-overflow
  - env/network
  - vuln/code-injection
  - vuln/dos
  - impact/rce
substate: "resolved"
weakness: "Classic Buffer Overflow"
enriched: true
body: true
date: 2021-08-22
submitted: 2020-02-20T06:27:05.183Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "bags"
source: "https://hackerone.com/reports/800324"
title: "Several protocol parsers in before 4.9.2 could cause a buffer overflow in util-print.c:bittok2str_internal()"
---
# Several protocol parsers in before 4.9.2 could cause a buffer overflow in util-print.c:bittok2str_internal()

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Internet Bug Bounty | **Disclosed:** 2021-08-22

- Report: [https://hackerone.com/reports/800324](https://hackerone.com/reports/800324)
- CWE: Classic Buffer Overflow
- Submitted: 2020-02-20T06:27:05.183Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Length of a local buffer used to parse network packets was not validated against actual payload size leading to a classic buffer overflow.

P.S. I was not aware of this bounty program at the time of reporting. Is this report in scope? I have a few more reports that were originally sent to the tcpdump security mailing list, I could file a report for each of them here if that qualifies. I may have also helped fix some issues in 4.9.3 as well.

## Impact

I believe remote DoS is possible. Remote code execution remains a possibility but I have not checked this myself.

## Timeline

- **Report Filed**
- **2020-02-20** @bags: Here's the CVE: https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-13011

Here's the fix acknowledging my report: https://github.com/the-tcpdump-group/tcpdump/commit/9f0730bee3eb65d07b49fd468bc2f269173352fe (please see commit log)
- **Report Needs More Info**
- **Report New**
- **2021-04-09** @bags: Hello, any updates on this and other reports of mine for tcpdump :-)
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
