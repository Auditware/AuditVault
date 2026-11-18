---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/out-of-bounds-read
  - env/web
substate: "resolved"
weakness: "Out-of-bounds Read"
enriched: true
body: true
date: 2020-11-09
submitted: 2019-08-17T16:36:43.625Z
bounty_usd: 1500
votes: 3
cve: "CVE-2019-11042"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "sediruoksitsero"
source: "https://hackerone.com/reports/675580"
title: "Out of Bounds Memory Read in exif_process_user_comment"
---
# Out of Bounds Memory Read in exif_process_user_comment

> **Severity:** High | **Bounty:** 1,500 USD | **Votes:** 3 | **Program:** Internet Bug Bounty | **Disclosed:** 2020-11-09

- Report: [https://hackerone.com/reports/675580](https://hackerone.com/reports/675580)
- CWE: Out-of-bounds Read | CVE: CVE-2019-11042
- Submitted: 2019-08-17T16:36:43.625Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I have found and reported an out of bounds memory read in PHP [exif_process_user_comment]
When PHP EXIF extension is parsing EXIF information from an image, e.g. via exif_read_data() function, in PHP versions 7.1.x below 7.1.31, 7.2.x below 7.2.21 and 7.3.x below 7.3.8 it is possible to supply it with data what will cause it to read past the allocated buffer.
This has been fixed and assigned CVE-2019-11042
The bug report is here: https://bugs.php.net/bug.php?id=78256
https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-11042
https://nvd.nist.gov/vuln/detail/CVE-2019-11042

## Impact

This may lead to information disclosure or crash.

## Timeline

- **Report Filed**
- **2019-08-19** @antenna: Hi @sediruoksitsero,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@antenna
- **Report Vulnerability Types Updated**
- **Cve Id Added**
- **Report Triaged**
- **2019-08-19** @antenna: Hello @sediruoksitsero,

Thank you for your submission! We were able to validate your report, and have submitted it to the appropriate remediation team for review. They will let us know the final ruling on this report, and when/if a fix will be implemented. Please note that the status and severity are subject to change.

Regards,
@antenna
- **2019-12-14** @sediruoksitsero: Any update on this report? Isn't it taking too long?
- **2020-01-10** @h1_analyst_oceana: Hello  @sediruoksitsero,

Thanks for your patience! The PHP (IBB) team is still working on this internally, and you will be updated once there is more information to share.

Regards,

@magicmouse
- **Hacker Requested Mediation**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
