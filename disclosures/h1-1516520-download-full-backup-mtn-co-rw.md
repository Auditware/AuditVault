---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2022-05-14
submitted: 2022-03-19T14:54:17.726Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "ibrahimatix0x01"
source: "https://hackerone.com/reports/1516520"
title: "Download full backup  [Mtn.co.rw]"
---
# Download full backup  [Mtn.co.rw]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 21 | **Program:** MTN Group | **Disclosed:** 2022-05-14

- Report: [https://hackerone.com/reports/1516520](https://hackerone.com/reports/1516520)
- CWE: N/A
- Submitted: 2022-03-19T14:54:17.726Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
I discovered few critical vulnerabilities here, one of them is exposed backup files via directory listing.


## Steps To Reproduce:

go to https://mtn.co.rw/mtn.zip and download the file
extract the file and open
you will see the full backup of the website

## Similar report:
https://hackerone.com/reports/684838

## Impact

Source code & DB credentials leakage. Attacker can use it to compromise the resource.

## Timeline

- **Report Filed**
- **2022-03-20** @ibrahimatix0x01: @incognito4
- **2022-03-20** @ibrahimatix0x01: @kendad0122
- **2022-03-29** @ibrahimatix0x01: Any update regarding this please?
- **2022-03-31** @ibrahimatix0x01: @incognito4 can you please check this one?
- **2022-04-01** @incognito4: Hi @ibrahimatix_  this is a duplicate report #1507648
- **2022-04-01** @ibrahimatix0x01: Ok
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **2024-05-22** @msiza_a: Good day @ibrahimatix0x01 

We have noted that this report has been exposed without our approval

https://github.com/ramosslyz/hackerone_reports_downloader/blob/1f2fbf9a03da53492785d8224077834994d1d1a6/json_reports/report_1516520.json

Kindly assist us in taking it down or remove it from GITHUB
- **2024-05-22** @ibrahimatix0x01: Why will I expose a report without your approval?


You disclosed the report on HackerOne yourself, and I don't have access to the github you are talking about.
- **2024-05-22** @ibrahimatix0x01: If you don't want people to have access to your reports you should not disclose it.
I don't have access to that github resource
- **2024-05-22** @ibrahimatix0x01: So, it is your fault that disclosed it not me that just reported it to you.
- **2024-06-06** @oxxo: thanks for the feedback ibrahimatix0x01, please continue the work from your end. it is highly appreciated.
