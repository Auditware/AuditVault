---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/mobile
  - os/android
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2021-06-03
submitted: 2021-03-03T15:12:39.784Z
bounty_usd: null
votes: 67
cve: []
program: "[[programs/mattermost|Mattermost]]"
reporter: "hulkvision_"
source: "https://hackerone.com/reports/1115864"
title: "Persistant Arbitrary code execution in mattermost android"
---
# Persistant Arbitrary code execution in mattermost android

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 67 | **Program:** Mattermost | **Disclosed:** 2021-06-03

- Report: [https://hackerone.com/reports/1115864](https://hackerone.com/reports/1115864)
- CWE: Code Injection
- Submitted: 2021-03-03T15:12:39.784Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2021-03-03** @hulkvision_: I tried to escalate this to remote attack vector but the server santize the filename while uploading file so remote code execution not possible in this case. Yeah fixing the path transversal issue will mitigate this vulnerability.
- **Bounty Awarded**
- **Swag Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Report Became Public**
