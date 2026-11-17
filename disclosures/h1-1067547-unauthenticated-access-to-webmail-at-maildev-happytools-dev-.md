---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2021-02-01
submitted: 2020-12-28T17:39:22.701Z
bounty_usd: null
votes: 71
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "superman85"
source: "https://hackerone.com/reports/1067547"
title: "Unauthenticated access to webmail at maildev.happytools.dev leading to compromised wordpress site api.happytools.dev [RCE]"
---
# Unauthenticated access to webmail at maildev.happytools.dev leading to compromised wordpress site api.happytools.dev [RCE]

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 71 | **Program:** Automattic | **Disclosed:** 2021-02-01

- Report: [https://hackerone.com/reports/1067547](https://hackerone.com/reports/1067547)
- CWE: Information Disclosure
- Submitted: 2020-12-28T17:39:22.701Z

## Timeline

- **Report Filed**
- **2020-12-28** @superman85: Hi to make this report PoC more confident, I was changed the password for user `api` and logged wordpress dashboard as an admin user. I stopped here so please fix this issue as soon as possible. Brgs
██████████
- **2020-12-28** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **Report Resolved**
- **Bounty Awarded**
- **2020-12-30** @superman85: Thank you for the bounty and Happy New Year!
- **Agreed On Going Public**
- **Report Became Public**
