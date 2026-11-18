---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2021-08-20
submitted: 2021-06-21T10:33:10.427Z
bounty_usd: null
votes: 33
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "zero_or_1"
source: "https://hackerone.com/reports/1239633"
title: "information discloure via logs files at ==> https://ihelp.mtnbusiness.com/logfiles/Log_21-06-2021.txt"
---
# information discloure via logs files at ==> https://ihelp.mtnbusiness.com/logfiles/Log_21-06-2021.txt

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 33 | **Program:** MTN Group | **Disclosed:** 2021-08-20

- Report: [https://hackerone.com/reports/1239633](https://hackerone.com/reports/1239633)
- CWE: Information Disclosure
- Submitted: 2021-06-21T10:33:10.427Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi MTN team ,

i got a 500 error show the full path of the windows server containing the log file of today 
i navigate to it ==> https://ihelp.mtnbusiness.com/logfiles/Log_21-06-2021.txt
i saw all logins i made with user administrator 

as u see the logs files is a date `Log_21-06-2021.txt`
you can read every day logs via manipulate the file name :)

## Impact

Ability to see login logs

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2021-07-21** @zero_or_1: can we (limited) disclose this report ?
- **Agreed On Going Public**
- **Report Became Public**
