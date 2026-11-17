---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
  - stack/php
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
date: 2020-11-18
submitted: 2020-09-08T10:12:34.981Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "bugra"
source: "https://hackerone.com/reports/976657"
title: "Reflected XSS on a Atavist theme at external_import.php"
---
# Reflected XSS on a Atavist theme at external_import.php

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** Automattic | **Disclosed:** 2020-11-18

- Report: [https://hackerone.com/reports/976657](https://hackerone.com/reports/976657)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2020-09-08T10:12:34.981Z

## Timeline

- **Report Filed**
- **2020-09-09** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **2020-09-09** @xknown: Hi @bugra, we deployed a fix for this issue. Can you please test to see if you are able to bypass it? Thanks
- **Report Triaged**
- **2020-09-09** @bugra: Hi @xknown, I can confirm the fix. The `scripts` parameter doesn't work anymore. You can close the report as Resolved.
- **Report Resolved**
- **Bounty Awarded**
- **2020-09-16** @bugra: Thanks!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
