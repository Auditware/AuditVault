---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2025-03-02
submitted: 2024-10-24T16:17:34.689Z
bounty_usd: null
votes: 81
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "tinopreter"
source: "https://hackerone.com/reports/2801787"
title: "Admin Dashboard Access Leads to Updating Merchant Info"
---
# Admin Dashboard Access Leads to Updating Merchant Info

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 81 | **Program:** MTN Group | **Disclosed:** 2025-03-02

- Report: [https://hackerone.com/reports/2801787](https://hackerone.com/reports/2801787)
- CWE: Improper Access Control - Generic
- Submitted: 2024-10-24T16:17:34.689Z

## Report summary

A hidden registration endpoint allowed an attacker to sign up for an admin portal, granting access to all registered merchant information. With administrative control over this data, the attack possibilities were endless. The MTN team quickly responded and restricted access to internal users only.

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **Report Vulnerability Information Updated**
- **Report Vulnerability Information Updated**
- **Report Severity Updated**
- **Report Pending Program Review**
- **2024-12-09** @tinopreter: Hi ████████ 

Any update so far? This is the main vulnerability, a subsidiary of it #2833942 has already been triaged. Have they responded to this? At least it can be in the triage state.
- **2024-12-09** @h1_analyst_bjorn: Hi ███,

Unfortunately I have not heard from the MTN Group team yet. Hope to have an update for you soon.

Kind regards,
████████
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
