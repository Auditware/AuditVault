---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/buffer-over-read
  - env/web
substate: "resolved"
weakness: "Buffer Over-read"
enriched: true
body: true
date: 2020-10-10
submitted: 2019-03-15T08:45:38.365Z
bounty_usd: null
votes: 6
cve: "CVE-2019-9640"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "chamal"
source: "https://hackerone.com/reports/510025"
title: "Invalid Read on exif_process_SOFn"
---
# Invalid Read on exif_process_SOFn

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Internet Bug Bounty | **Disclosed:** 2020-10-10

- Report: [https://hackerone.com/reports/510025](https://hackerone.com/reports/510025)
- CWE: Buffer Over-read | CVE: CVE-2019-9640
- Submitted: 2019-03-15T08:45:38.365Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

This  bug is present in exif_scan_thumbnail method of ext/exif/exif.c file.

Detailed description and steps to reproduce for this bug is present in bug report submitted to php.net.
Bug Report : https://bugs.php.net/bug.php?id=77540
PHP version : 7.1.26
CVE-ID : 2019-9640

## Impact

This bug may allow an attacker to read unintended data from memory.

## Timeline

- **Report Filed**
- **2019-03-18** @h1_analyst_leon: Hey @chamal - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
- **2019-05-06** @chamal: Hi @tuxedo, Is there any updates on this report?
- **Cve Id Added**
- **Report Severity Updated**
- **Report Triaged**
- **2019-10-02** @chamal: Hi @tuxedo, It has been 7 months. But this issue is not reviewed yet. I have submitted 3 more PHP issues to Hackerone and they too are not reviewed.
- **2020-03-16** @chamal: Hi @tuxedo,
Today is 16th March, 2020. I reported this bug on 15th, March, 2020. One year has passed.
But this report is not resolved. At least I don't get an update on when this report will be resolved.
This is an extremely bad way to treat a user.
- **2020-03-16** @h1_analyst_leon: Hi @chamal - Sorry for the delayed response. Unfortunately, I do not have any updates for you at this time, but you will be updated as soon as there is additional information to share. Thanks for your patience!
- **Hacker Requested Mediation**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
