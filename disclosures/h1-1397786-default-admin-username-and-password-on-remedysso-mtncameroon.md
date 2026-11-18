---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/misconfiguration
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2022-09-01
submitted: 2021-11-10T19:00:17.419Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "dh0pe"
source: "https://hackerone.com/reports/1397786"
title: "Default Admin Username and Password on remedysso.mtncameroon.net"
---
# Default Admin Username and Password on remedysso.mtncameroon.net

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** MTN Group | **Disclosed:** 2022-09-01

- Report: [https://hackerone.com/reports/1397786](https://hackerone.com/reports/1397786)
- CWE: N/A
- Submitted: 2021-11-10T19:00:17.419Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
A Remedy Single Sign-On (Remedy SSO) Server is running at https://remedysso.mtncameroon.net/rsso/admin/#/.  
It is possible to access the application is using the default Administrator credentials.

## Steps To Reproduce:
Go to https://remedysso.mtncameroon.net/rsso/admin/#/ and login with credentials:
- Username: Admin
- Password: RSSO#Admin#

## Remediation
Change the password of the Admin user or disable the account.

## References
https://cwe.mitre.org/data/definitions/521.html

## Impact

A MNT Group Single Sign-On application was misconfigured in a manner that may have allowed a malicious user to login with the administrator user. The user is capable to perform any kind of configuration of the SSO system and retrieve sensitive information about organization users and infrastructure.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-01-19** @dh0pe: Hello, do you have an update on this issue?
- **2022-04-28** @dh0pe: Hello, do you have an update on this issue?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
