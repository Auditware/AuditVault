---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - vuln/info-disclosure
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2023-02-24
submitted: 2022-07-09T08:25:15.908Z
bounty_usd: null
votes: 23
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "syarif07"
source: "https://hackerone.com/reports/1632104"
title: "Sensitive information disclosure [HtUS]"
---
# Sensitive information disclosure [HtUS]

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 23 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-02-24

- Report: [https://hackerone.com/reports/1632104](https://hackerone.com/reports/1632104)
- CWE: Information Disclosure
- Submitted: 2022-07-09T08:25:15.908Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi Team :)
I found that the server status directory on your system is open, it displays server status and sensitive information by server

## Steps To Reproduce:
[add details for how we can reproduce the issue]

  1. visit: https://█████████/server-status/

## Supporting Material/References:
███

  * [attachment / reference]

## Impact

sensitive information is clearly displayed, that is, server status, attackers can find sensitive information from the server (server logs)

## Timeline

- **Report Filed**
- **Report Informative**
- **2022-09-27** @ag3nt-j1: @syarifmsajjad while this report was closed as out of scope and is still out of scope we were able to inform the system owner and they look to have fixed the issue. We're going to reopen this report and triage it and close as resolved to give you credit on the find. Thanks for participating in the "Hack the US" challenge.
- **Report Reopened**
- **Report Triaged**
- **Report Resolved**
- **2022-09-28** @syarif07: Hi thanks for the response. you did well. can we disclose this report?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
