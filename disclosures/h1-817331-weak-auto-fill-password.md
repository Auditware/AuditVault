---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insufficiently-protected-credentials
  - env/web
substate: "resolved"
weakness: "Insufficiently Protected Credentials"
enriched: true
date: 2022-09-03
submitted: 2020-03-12T05:33:51.742Z
bounty_usd: null
votes: 53
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "harris0ft"
source: "https://hackerone.com/reports/817331"
title: "Weak/Auto Fill Password"
---
# Weak/Auto Fill Password

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 53 | **Program:** MTN Group | **Disclosed:** 2022-09-03

- Report: [https://hackerone.com/reports/817331](https://hackerone.com/reports/817331)
- CWE: Insufficiently Protected Credentials
- Submitted: 2020-03-12T05:33:51.742Z

## Report summary

Pure luck!!!  - admin/admin
All login page ==MUST== be tested with admin/admin & root/root.

## Timeline

- **Report Filed**
- **2020-03-12** @harris0ft: The username and password are auto-filled. Just Checked on another system. Went in directly.
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
