---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-reflected
  - env/web
substate: "duplicate"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
date: 2017-12-26
submitted: 2017-12-22T18:58:40.337Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/uber|Uber]]"
reporter: "gregoryvperry"
source: "https://hackerone.com/reports/300101"
title: "lite:sess Query Parameter Can Generate SSL-protected Reflected XSS in https://m.uber.com/0-dfffb25d2cf6ceeb0a27.js Endpoint"
---
# lite:sess Query Parameter Can Generate SSL-protected Reflected XSS in https://m.uber.com/0-dfffb25d2cf6ceeb0a27.js Endpoint

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Uber | **Disclosed:** 2017-12-26

- Report: [https://hackerone.com/reports/300101](https://hackerone.com/reports/300101)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2017-12-22T18:58:40.337Z

## Timeline

- **Report Filed**
- **2017-12-22** @lindsey-uber: We're looking into this, but our preliminary investigation suggests that all of these behaviors are related.
- **Report Duplicate**
- **Comments Closed**
- **Agreed On Going Public**
- **Manually Disclosed**
