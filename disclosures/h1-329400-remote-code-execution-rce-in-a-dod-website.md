---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/deserialization-of-untrusted-data
  - env/web
substate: "resolved"
weakness: "Deserialization of Untrusted Data"
enriched: true
date: 2019-10-08
submitted: 2018-03-24T03:06:58.421Z
bounty_usd: null
votes: 4
cve: "CVE-2017-10366"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "joaomatosf"
source: "https://hackerone.com/reports/329400"
title: "Remote Code Execution (RCE) in a DoD website"
---
# Remote Code Execution (RCE) in a DoD website

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/329400](https://hackerone.com/reports/329400)
- CWE: Deserialization of Untrusted Data | CVE: CVE-2017-10366
- Submitted: 2018-03-24T03:06:58.421Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2018-04-18** @joaomatosf: Hi dear,

I was rereading the report and realized that it is necessary to make a little fix on the curl command to play the PoC. 
When running the PoC replace "/psc/" with "/monitor/" in the url exactly as shown in the attached video.

Best Regards,
- **Report Resolved**
- **Agreed On Going Public**
- **2019-01-11** @joaomatosf: Hi dear,

Happy new year to you all in DoD =].

It has been some time since I sent this report (10 months) and it was finalized as resolved (5 months). Could you, please kindly approve the partial disclosure of it? =)

This year I intend to send many reports to you =]

Thank you.
- **Agreed On Going Public**
- **Report Became Public**
