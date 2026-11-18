---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-request-forgery-csrf
  - env/web
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2019-05-17
submitted: 2018-11-16T20:54:56.443Z
bounty_usd: null
votes: 184
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "tomoh"
source: "https://hackerone.com/reports/442901"
title: "Take over of accounts created using Google or Facebook"
---
# Take over of accounts created using Google or Facebook

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 184 | **Program:** Khan Academy | **Disclosed:** 2019-05-17

- Report: [https://hackerone.com/reports/442901](https://hackerone.com/reports/442901)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2018-11-16T20:54:56.443Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

When a user creates an account using Google or Facebook and does not set an additional password, it is possible to set their passwords via CSRF.
Since the account is created using a social media account, no existing password check is needed and the CSRF check on the endpoint is broken. 
To reproduce, create an account with Google or Facebook and make account load the attached HTML file. You should now be able to login to the account with password=ATTACKER_PASS.

## Impact

An attacker can take over of accounts created using Google or Facebook.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2018-11-27** @tomoh: Hi Dave,
This is fixed. Thanks.
- **Agreed On Going Public**
- **Report Became Public**
