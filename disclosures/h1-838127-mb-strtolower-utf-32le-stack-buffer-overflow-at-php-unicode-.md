---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/stack-overflow
  - env/web
substate: "resolved"
weakness: "Stack Overflow"
enriched: true
body: true
date: 2020-10-21
submitted: 2020-04-03T12:14:40.349Z
bounty_usd: null
votes: 40
cve: "CVE-2020-7065"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "anatoliq"
source: "https://hackerone.com/reports/838127"
title: "mb_strtolower (UTF-32LE): stack-buffer-overflow at php_unicode_tolower_full (CVE-2020-7065)"
---
# mb_strtolower (UTF-32LE): stack-buffer-overflow at php_unicode_tolower_full (CVE-2020-7065)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 40 | **Program:** Internet Bug Bounty | **Disclosed:** 2020-10-21

- Report: [https://hackerone.com/reports/838127](https://hackerone.com/reports/838127)
- CWE: Stack Overflow | CVE: CVE-2020-7065
- Submitted: 2020-04-03T12:14:40.349Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

PHP bug report (made public by the maintainers at the time of writing): https://bugs.php.net/bug.php?id=79371
Mitre CVE page: https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-7065
Link to the release notes: https://www.php.net/ChangeLog-7.php#7.4.4

## Impact

One of impacts is that the issue allows an attacker to straightforwardly crash the PHP interpreter provided a specific UTF character can be passed to `mb_strtolower` function dealing with UTF-32LE encoding. 

Original summary from the bug report:
> A call to `mb_strtolower` allows overwriting of a stack-allocated buffer with an overflown array from .rodata.

Description as provided by CVE database entry:
> In PHP versions 7.3.x below 7.3.16 and 7.4.x below 7.4.34, while using mb_strtolower() function with UTF-32LE encoding, certain invalid strings could cause PHP to overwrite stack-allocated buffer. This could lead to memory corruption, crashes and potentially code execution.

## Timeline

- **Report Filed**
- **2020-04-03** @celt: Hi @anatoliq,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@celt
- **Report Severity Updated**
- **Report Triaged**
- **2020-09-30** @anatoliq: Ping.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
