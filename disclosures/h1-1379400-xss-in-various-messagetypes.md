---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2024-08-10
submitted: 2021-10-23T19:43:08.122Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "gronke"
source: "https://hackerone.com/reports/1379400"
title: "XSS in various MessageTypes"
---
# XSS in various MessageTypes

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Rocket.Chat | **Disclosed:** 2024-08-10

- Report: [https://hackerone.com/reports/1379400](https://hackerone.com/reports/1379400)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-10-23T19:43:08.122Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-10-27** @gronke: Addition: The `role` parameter of the `subscription-role-added` Message Type is also affected by XSS.
- **Report Resolved**
- **2023-08-21** @gronke: This vulnerability still appears to exist or have been re-introduced.
- **Agreed On Going Public**
- **Report Became Public**
