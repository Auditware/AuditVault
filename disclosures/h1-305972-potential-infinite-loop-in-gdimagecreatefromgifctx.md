---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2019-11-12
submitted: 2018-01-17T17:27:50.375Z
bounty_usd: 500
votes: 8
cve: "CVE-2018-5711"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "orange"
source: "https://hackerone.com/reports/305972"
title: "Potential infinite loop in gdImageCreateFromGifCtx!"
---
# Potential infinite loop in gdImageCreateFromGifCtx!

> **Severity:** High | **Bounty:** 500 USD | **Votes:** 8 | **Program:** Internet Bug Bounty | **Disclosed:** 2019-11-12

- Report: [https://hackerone.com/reports/305972](https://hackerone.com/reports/305972)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2018-5711
- Submitted: 2018-01-17T17:27:50.375Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Description
-----
It is easy to trigger in web application if the web use GD as its image library.
For example, It can be triggered if a website resize the user-uploaded GIF, and **ALL** PHP version are affected!
　
## Original bug report
-----
- https://bugs.php.net/bug.php?id=75571

　
## Note
-----
- CVE-2018-5711 assigned

　
Thanks :)

## Impact

A malicious GIF can trigger an infinite loop and lead to exhausted the server resource!

## Timeline

- **Report Filed**
- **2018-01-30** @orange: Hi, is there any news?
- **Cve Id Added**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
