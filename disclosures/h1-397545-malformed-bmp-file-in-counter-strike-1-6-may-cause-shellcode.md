---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/classic-buffer-overflow
  - env/web
substate: "resolved"
weakness: "Classic Buffer Overflow"
enriched: true
date: 2020-02-27
submitted: 2018-08-21T06:33:12.777Z
bounty_usd: null
votes: 321
cve: []
program: "[[programs/valve|Valve]]"
reporter: "kohtep2010"
source: "https://hackerone.com/reports/397545"
title: "Malformed .BMP file in Counter-Strike 1.6 may cause shellcode injection"
---
# Malformed .BMP file in Counter-Strike 1.6 may cause shellcode injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 321 | **Program:** Valve | **Disclosed:** 2020-02-27

- Report: [https://hackerone.com/reports/397545](https://hackerone.com/reports/397545)
- CWE: Classic Buffer Overflow
- Submitted: 2018-08-21T06:33:12.777Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-08-21** @mikela: Hi @kohtep, thanks for the submission, this is definitely a valid RCE vector.

Were you able to force the client to download the overview files without specifying them in a RES file for the map? I was able to trigger to automatic download and loading of the bitmap but not with following your steps exactly. If I only create a nonexistant BSP file, BMP and overview description file only the BSP downloads on connection to the server. It's only once I create a RES file to accompany the BSP file and reference the BMP and overview description that those download as well. Not that this is a problem with regards to issue, just something additional I found while reproducing the bug.
- **2018-08-22** @kohtep2010: Hello! I did not use RES files to force the client to download the rest of the files other than BSP (if I understood you correctly). The way I described in the message worked for me, and it seemed to me the simplest. I think that you can also try to upload files to client using engine functions Netchan_CreateFileFragments/Netchan_CreateFileFragmentsFromBuffer, which allow you to transfer files in both directions.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
