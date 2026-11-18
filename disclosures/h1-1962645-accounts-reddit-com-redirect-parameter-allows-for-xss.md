---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2023-05-18
submitted: 2023-04-26T16:43:39.352Z
bounty_usd: 5000
votes: 394
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "dvorakxl"
source: "https://hackerone.com/reports/1962645"
title: "[accounts.reddit.com] Redirect parameter allows for XSS"
---
# [accounts.reddit.com] Redirect parameter allows for XSS

> **Severity:** High | **Bounty:** 5,000 USD | **Votes:** 394 | **Program:** Reddit | **Disclosed:** 2023-05-18

- Report: [https://hackerone.com/reports/1962645](https://hackerone.com/reports/1962645)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2023-04-26T16:43:39.352Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hello team! I was tampering with the dest parameter in accounts.reddit.com and found out it is vulnerable to Cross Site Scripting once the victim performs the log in.

## Steps To Reproduce:
  1. Enter to the following link: ```https://accounts.reddit.com/?dest=javascript:alert(document.domain)```
  - If not signed in, the user will be promped to log in and after doing so XSS will excecute

{F2315850}
  - If user is logged into his account, following the link will also make the XSS pop up

{F2315847}

## Impact

An attacker could trick users into executing XSS, executing code and stealing their cookies only by them logging in.

## Timeline

- **Report Filed**
- **2023-04-26** @effervescent_phantom: Thanks for the report @dvorakxl, looks legit. 

Will update you soon on severity and bounty award!
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **2023-04-28** @dvorakxl: Great job team! That was a fast fix. Thanks for the bounty :)
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
