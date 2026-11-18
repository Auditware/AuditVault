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
body: none
date: 2026-03-30
submitted: 2026-02-18T12:17:36.773Z
bounty_usd: null
votes: 22
cve: "CVE-2026-21710"
program: "[[programs/nodejs|Node.js]]"
reporter: "yushengchen"
source: "https://hackerone.com/reports/3560402"
title: "Denial of Service via `__proto__` header name in `req.headersDistinct` (Uncaught `TypeError` crashes Node.js process)"
---
# Denial of Service via `__proto__` header name in `req.headersDistinct` (Uncaught `TypeError` crashes Node.js process)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 22 | **Program:** Node.js | **Disclosed:** 2026-03-30

- Report: [https://hackerone.com/reports/3560402](https://hackerone.com/reports/3560402)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2026-21710
- Submitted: 2026-02-18T12:17:36.773Z

## Timeline

- **Draft Started**
- **Report Filed**
- **Report Vulnerability Information Updated**
- **2026-02-18** @rafaelgss: 
- **Report Triaged**
- **2026-02-20** @yushengchen: 
- **2026-02-20** @mcollina: 
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
