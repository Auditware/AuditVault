---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/buffer-underflow
  - env/web
substate: "resolved"
weakness: "Buffer Underflow"
enriched: true
body: true
date: 2020-11-09
submitted: 2019-01-07T20:25:48.915Z
bounty_usd: 1500
votes: 2
cve: "CVE-2019-9025"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "haquaman"
source: "https://hackerone.com/reports/476178"
title: "Negative size parameter in mb_split"
---
# Negative size parameter in mb_split

> **Severity:** Critical | **Bounty:** 1,500 USD | **Votes:** 2 | **Program:** Internet Bug Bounty | **Disclosed:** 2020-11-09

- Report: [https://hackerone.com/reports/476178](https://hackerone.com/reports/476178)
- CWE: Buffer Underflow | CVE: CVE-2019-9025
- Submitted: 2019-01-07T20:25:48.915Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

https://bugs.php.net/bug.php?id=77367

mb_split doesn't correctly detect the length when the $string has an unfinished multibyte character at the end of the string. This causes a crash due to a negative parameter to add_next_index_stringl, which calls zend_string_init and memcpy.

Could reproduce on master.

## Impact

This could be used to cause memory corruption/leakage.

## Timeline

- **Report Filed**
- **2019-01-18** @h1_analyst_leon: Hey @haquaman - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share. Thank you for your patience!
- **Cve Id Added**
- **Report Severity Updated**
- **Report Triaged**
- **Hacker Requested Mediation**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
