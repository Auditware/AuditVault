---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/open-redirect
  - env/web
substate: "not-applicable"
weakness: "Open Redirect"
enriched: true
body: true
date: 2021-07-30
submitted: 2021-07-29T14:12:20.695Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/upchieve|UPchieve]]"
reporter: "ben_lay"
source: "https://hackerone.com/reports/1283200"
title: "url redirection"
---
# url redirection

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** UPchieve | **Disclosed:** 2021-07-30

- Report: [https://hackerone.com/reports/1283200](https://hackerone.com/reports/1283200)
- CWE: Open Redirect
- Submitted: 2021-07-29T14:12:20.695Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
[the following url is vulnerable to redirect]

https://app.upchieve.org

## Steps To Reproduce:
when you add @evil.com the user will be directed to evil.com
https://app.upchieve.org@evil.com

## Impact

Users could get redirected to malicious domain

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2021-07-30** @ben_lay: Ok thanks,,give me swag
- **Comments Closed**
