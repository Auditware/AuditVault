---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
  - vuln/xss
  - impact/credential-theft
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2022-09-27
submitted: 2020-12-05T21:47:05.097Z
bounty_usd: null
votes: 157
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "criptex"
source: "https://hackerone.com/reports/1051373"
title: "XSS Reflected on reddit.com via url path"
---
# XSS Reflected on reddit.com via url path

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 157 | **Program:** Reddit | **Disclosed:** 2022-09-27

- Report: [https://hackerone.com/reports/1051373](https://hackerone.com/reports/1051373)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2020-12-05T21:47:05.097Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi I found a XSS-R

To reproduce the issue please click the poc link and then press the "verify email" button

PoC:

https://www.reddit.com/verification/asd',%20alert(document.location),%20%27

## Impact

With the help of XSS an attacker can steal your cookies, in many cases steal sessions, download malware onto your system and send a custom request.
Users can be socially engineered by the attacker by redirecting them from the real website to a fake one and there are many more attack scenarios that an expert attacker can perform with XSS.
It is also possible to inject html thus modifying the original page

## Timeline

- **Report Filed**
- **2020-12-05** @criptex: please copy the poc link and paste it into your browser, for some reason it doesn't work from the hackerone links
- **Report Severity Updated**
- **Report Triaged**
- **2020-12-09** @criptex: Hi @gunther_reddit I re-analyzed the Issue and saw that it has been resolved, now I can't inject the xss.

kind regards
- **Bounty Awarded**
- **Report Resolved**
- **2020-12-12** @criptex: Hi @gunther_reddit  thank you very much for the BIG bounty, it is very motivating for me!!!sorry for the delay in answering you. In these next few days I will dedicate all my time to reddit !!!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
