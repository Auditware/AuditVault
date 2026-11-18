---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-after-free
  - env/web
  - stack/node
substate: "resolved"
weakness: "Use After Free"
enriched: true
body: none
date: 2026-08-28
submitted: 2026-06-30T07:51:55.046Z
bounty_usd: null
votes: 17
cve: "CVE-2026-56848"
program: "[[programs/nodejs|Node.js]]"
reporter: "hahahkim"
source: "https://hackerone.com/reports/3833629"
title: "Re-entrant `nghttp2_session_mem_send()` during `nghttp2_session_mem_recv()` causes heap-use-after-free in Node.js HTTP/2"
---
# Re-entrant `nghttp2_session_mem_send()` during `nghttp2_session_mem_recv()` causes heap-use-after-free in Node.js HTTP/2

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 17 | **Program:** Node.js | **Disclosed:** 2026-08-28

- Report: [https://hackerone.com/reports/3833629](https://hackerone.com/reports/3833629)
- CWE: Use After Free | CVE: CVE-2026-56848
- Submitted: 2026-06-30T07:51:55.046Z

## Timeline

- **Report Filed**
- **Report Informative**
- **2026-06-30** @hahahkim: 
- **Report Reopened**
- **Report Triaged**
- **Report Severity Updated**
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **2026-07-29** @hahahkim: 
- **Report Became Public**
