---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "duplicate"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2017-07-10
submitted: 2017-07-08T15:42:40.205Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/wakatime|WakaTime]]"
reporter: "anurag98"
source: "https://hackerone.com/reports/247225"
title: "Session Duplication due to Broken Access Control"
---
# Session Duplication due to Broken Access Control

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** WakaTime | **Disclosed:** 2017-07-10

- Report: [https://hackerone.com/reports/247225](https://hackerone.com/reports/247225)
- CWE: Improper Access Control - Generic
- Submitted: 2017-07-08T15:42:40.205Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Due to improper validation of user before generating an API-KEY and improper measures taken at the time of password reset, it is possible to generate a parallel session at the attacker's end.

Proof of concept video is attached to confirm the vulnerability and to demonstrate the Impact of this _logical_ bug.

Steps to Reproduce
=============
Attacker
---------
- Create an account with victims email.
- Download the coding platforms and get API-KEY.
- He can code from the platforms using the victims API-key.

Victim
-------
- User fails to create an account, due to email already registered and does a password reset.
- Downloads the coding platform and get API-KEY.
- He codes using API-KEY.

It is possible for the Attacker and Victim, for coding at the same time, which will be shown at the dashboard. Attacker can reduce the difficulty and can damage the reputation of the coder.

 Impact
=====

__Attacker can brute-force email and register multiple account on wakatime to get API-Key of many users.__
 
Improper rank calculation.

Session duplication by the attacker

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Informative**
- **Report Reopened**
- **Report Duplicate**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
