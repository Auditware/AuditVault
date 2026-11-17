---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2021-04-15
submitted: 2020-09-08T08:23:34.039Z
bounty_usd: 10500
votes: 260
cve: []
program: "[[programs/superhuman|Superhuman (formerly Grammarly)]]"
reporter: "cache-money"
source: "https://hackerone.com/reports/976603"
title: "Ability to DOS any organization's SSO and open up the door to account takeovers"
---
# Ability to DOS any organization's SSO and open up the door to account takeovers

> **Severity:** High | **Bounty:** 10,500 USD | **Votes:** 260 | **Program:** Superhuman (formerly Grammarly) | **Disclosed:** 2021-04-15

- Report: [https://hackerone.com/reports/976603](https://hackerone.com/reports/976603)
- CWE: Improper Authentication - Generic
- Submitted: 2020-09-08T08:23:34.039Z

## Report summary

The vulnerability was fixed before SSO became available to Grammarly customers.

## Timeline

- **Report Filed**
- **2020-09-08** @h1_analyst_oceana: Hi @cache-money,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@magicmouse
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **2020-09-08** @gr_triage: Thanks for your valuable contribution, @cache-money!

The fix should now be on production env. Can you please verify it?
- **2020-09-08** @cache-money: Thanks! Yes this is fixed. The duplicate `entityId` check does a trim before comparison now.

-- Tanner
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
