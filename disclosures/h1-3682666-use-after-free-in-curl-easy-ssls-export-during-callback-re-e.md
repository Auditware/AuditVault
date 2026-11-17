---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-after-free
  - env/web
substate: "not-applicable"
weakness: "Use After Free"
enriched: true
date: 2026-04-29
submitted: 2026-04-18T23:22:33.485Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/curl|curl]]"
reporter: "m1llie"
source: "https://hackerone.com/reports/3682666"
title: "Use-after-free in `curl_easy_ssls_export()` during callback re-entrancy"
---
# Use-after-free in `curl_easy_ssls_export()` during callback re-entrancy

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** curl | **Disclosed:** 2026-04-29

- Report: [https://hackerone.com/reports/3682666](https://hackerone.com/reports/3682666)
- CWE: Use After Free
- Submitted: 2026-04-18T23:22:33.485Z

## Timeline

- **Draft Started**
- **Report Filed**
- **2026-04-19** @jimfuller2024: thx for the report - please review https://curl.se/dev/vuln-disclosure.html ... unless I missed something this seems like api misuse (it is relatively easy to make ASan scream if one wants to) ... will dig in a bit more.
- **2026-04-19** @jimfuller2024: maybe a bug at worst - will wait for others to comment.
- **2026-04-19** @bagder: Considered not to be a security issue. This functionality is labeled experimental and is explicitly not for production use.

We should probably make the function return error when called from within a callback.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
