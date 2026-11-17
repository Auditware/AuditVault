---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2020-08-06
submitted: 2020-05-31T20:27:39.209Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "vrechson"
source: "https://hackerone.com/reports/888030"
title: "[wappalyzer] ReDoS allows an attacker to completely break Wappalyzer"
---
# [wappalyzer] ReDoS allows an attacker to completely break Wappalyzer

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-06

- Report: [https://hackerone.com/reports/888030](https://hackerone.com/reports/888030)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2020-05-31T20:27:39.209Z

## Timeline

- **Report Filed**
- **2020-05-31** @vrechson: please, also add @caioluders to this report
- **2020-05-31** @bbe8482aecd24374d13c5de15a0a6: Hi @abrasax, I have invited him as participant as requested.
- **2020-05-31** @nochnoidozor: Hi @abrasax,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **External User Joined**
- **External User Joined**
- **2020-06-02** @aliasio: Thank you. This issue has been fixed by changing the pattern from `([0-9.]{2,})+$` to `([0-9.]{2,3})`.

https://github.com/AliasIO/wappalyzer/blob/master/src/apps.json#L13207
- **2020-06-04** @bbe8482aecd24374d13c5de15a0a6: @caioluders @nochnoidozor can you both confirm, that this resolves the reported issue?
- **2020-06-04** @vrechson: I can confirm this solved the issue
- **2020-06-04** @bbe8482aecd24374d13c5de15a0a6: Thanks for the feedback @abrasax (sorry, I forgot to mention you).
- **2020-06-04** @vrechson: no problem :p
- **2020-08-06** @caioluders: Hey,

as this was already fixed, can you guys close and disclose ?
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
