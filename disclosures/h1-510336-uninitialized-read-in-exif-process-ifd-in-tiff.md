---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/classic-buffer-overflow
  - env/web
substate: "resolved"
weakness: "Classic Buffer Overflow"
enriched: true
body: true
date: 2020-10-10
submitted: 2019-03-15T14:21:28.872Z
bounty_usd: null
votes: 0
cve: "CVE-2019-9641"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "chamal"
source: "https://hackerone.com/reports/510336"
title: "Uninitialized read in exif_process_IFD_in_TIFF"
---
# Uninitialized read in exif_process_IFD_in_TIFF

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 0 | **Program:** Internet Bug Bounty | **Disclosed:** 2020-10-10

- Report: [https://hackerone.com/reports/510336](https://hackerone.com/reports/510336)
- CWE: Classic Buffer Overflow | CVE: CVE-2019-9641
- Submitted: 2019-03-15T14:21:28.872Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

This bug can be reproduced only in 32 bit PHP builds.
This bug is present in exif_process_IFD_in_TIFF method of ext/exif/exif.c file.

Detailed description and steps to reproduce for this bug is present in bug report submitted to php.net.
Bug Report : https://bugs.php.net/bug.php?id=77509
PHP version : 7.1.26
CVE-ID : 2019-9641

## Impact

Uninitialized variables may leak data from memory.

## Timeline

- **Report Filed**
- **2019-03-18** @h1_analyst_leon: Hey @chamal - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Cve Id Added**
- **2019-06-21** @chamal: Hi @tuxedo, Is there a update on this report?
- **2019-06-21** @h1_analyst_leon: Hi @chamal - Thanks for checking in! Unfortunately, I do not have any new updates on the status of this report at this time, but you will be updated as soon as there is additional information to share. Thanks for your patience!
- **2019-08-30** @chamal: Hi @tuxedo I am sorry for reminding again. But it has been 6 months, since I reported this issue. Is there any update on this report?
- **2019-10-08** @chamal: This report is not resolved even after 7 months. I also don't know when this report will be resolved. 
I am extremely disappointed at how I am being treated.
- **Hacker Requested Mediation**
- **2019-11-23** @chamal: Dear Sir/Madam,

It has been a long time since I reported this bug. If you are unable to resolve this report due to high workload, I can understand. But please at least provide me with a rough time frame, when this report will be resolved.

Thanking you,
Chamal De Silva.
- **2019-12-30** @h1_analyst_leon: Hi @chamal - Thanks for the follow-up. The PHP (IBB) program is volunteer-run. Unfortunately, I do not have any updates for you at this time, but you will be updated as soon as there is additional information to share. Thanks for your patience!
- **2020-03-03** @chamal: Hi @tuxedo,

What is happening with PHP(IBB) program? It has been a long time now.

Thanking you,
Chamal De Silva.
- **2020-03-09** @h1_analyst_ava: Hi @chamal,
Let me see what I can find out for you. 
@sodacan
- **2020-03-16** @chamal: Hi @tuxedo  , @sodacan  ,
Today is 16th March, 2020. I reported this bug on 15th, March, 2020. One year has passed.
But this report is not resolved. At least I don't get an update on when this report will be resolved.
This is an extremely bad way to treat a user.
- **2020-03-16** @h1_analyst_leon: Hi @chamal - Sorry for the delayed response. Unfortunately, I do not have any updates for you at this time, but you will be updated as soon as there is additional information to share. Thanks for your patience!
- **2020-05-05** @chamal: Hi @sodacan, @tuxedo,

When will this issue be resolved?
- **2020-06-11** @chamal: Hi @sodacan, @tuxedo,

More than one year has passed since I reported this issue. When will this issue be resolved?
Kindly reply.

Thanks.
- **2020-09-10** @chamal: Hi @sodacan, @tuxedo,

When will this issue be resolved?

Thanks.
- **2020-09-10** @h1_analyst_leon: Hi @chamal,

Thank you for your patience! Unfortunately, I do not have any new updates for you at this time, but you will be updated on the status of this report as soon as there is additional information to share! 

Kind regards,
@tuxedo
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
