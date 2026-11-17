---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/modification-of-assumed-immutable-data-maid
  - env/web
  - stack/node
substate: "resolved"
weakness: "Modification of Assumed-Immutable Data (MAID)"
enriched: true
date: 2021-04-26
submitted: 2020-08-27T09:16:19.390Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "0b5cur17y"
source: "https://hackerone.com/reports/968355"
title: "[i18next] Prototype pollution attack"
---
# [i18next] Prototype pollution attack

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Node.js third-party modules | **Disclosed:** 2021-04-26

- Report: [https://hackerone.com/reports/968355](https://hackerone.com/reports/968355)
- CWE: Modification of Assumed-Immutable Data (MAID)
- Submitted: 2020-08-27T09:16:19.390Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Changed Scope**
- **2021-03-27** @0b5cur17y: not sure if anything happened, but it was fixed a while ago: https://github.com/i18next/i18next/commit/ed6169fa21b67d8e73b20d82579aff6f9b808a69

should be fixed since v19.8.3
- **2021-03-27** @bbe8482aecd24374d13c5de15a0a6: Thanks for letting us know @0b5cur17y.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
