---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-storage-of-sensitive-information
  - env/web
  - vuln/info-disclosure
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
body: true
date: 2022-04-09
submitted: 2022-02-16T22:46:45.247Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "q9m"
source: "https://hackerone.com/reports/1482830"
title: "Insecure Storage of Sensitive Information on lonestarcell.com server"
---
# Insecure Storage of Sensitive Information on lonestarcell.com server

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 14 | **Program:** MTN Group | **Disclosed:** 2022-04-09

- Report: [https://hackerone.com/reports/1482830](https://hackerone.com/reports/1482830)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2022-02-16T22:46:45.247Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello , i hope your doing well 

i found some sensitive information disclosure at those endpoint
it is disclosure server status and some other stuff 

https://simregistration.lonestarcell.com//monitoring/DB02/DB02.html#System
https://simregistration.lonestarcell.com//monitoring/DB01/index.html
https://simregistration.lonestarcell.com//monitoring

## Impact

Sensitive Information disclosure on lonestarcell server

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2022-03-03** @q9m: Hello any update ?
- **Report Triaged**
- **2022-03-07** @incognito4: Hi @muhnad what is the recommended actions for this report?
- **2022-03-07** @q9m: I suggest to you change permission of the whole website make it 403.
- **2022-03-08** @incognito4: @muhnad thanks a lot.
- **2022-03-08** @q9m: Your welcome and i think now its resolved ..
can you disclose this report ??
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
