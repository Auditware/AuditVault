---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-initialization
  - env/web
  - stack/node
substate: "resolved"
weakness: "Improper Initialization"
enriched: true
date: 2026-02-12
submitted: 2025-10-30T13:39:56.819Z
bounty_usd: null
votes: 43
cve: "CVE-2025-55131"
program: "[[programs/nodejs|Node.js]]"
reporter: "chalker"
source: "https://hackerone.com/reports/3405778"
title: "Timeout-based race conditions make Uint8Array/Buffer.alloc non-zerofilled"
---
# Timeout-based race conditions make Uint8Array/Buffer.alloc non-zerofilled

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 43 | **Program:** Node.js | **Disclosed:** 2026-02-12

- Report: [https://hackerone.com/reports/3405778](https://hackerone.com/reports/3405778)
- CWE: Improper Initialization | CVE: CVE-2025-55131
- Submitted: 2025-10-30T13:39:56.819Z

## Timeline

- **Report Filed**
- **2025-10-30** @mcollina: 
- **Report Vulnerability Information Updated**
- **2025-10-30** @chalker: 
- **2025-10-30** @chalker: 
- **2025-10-30** @rafaelgss: 
- **2025-10-30** @chalker: 
- **2025-10-30** @chalker: 
- **Report Severity Updated**
- **Report Triaged**
- **2025-10-30** @rafaelgss: 
- **2025-10-30** @chalker: 
- **2025-10-30** @mcollina: 
- **2025-10-30** @chalker: 
- **2025-10-30** @chalker: 
- **2025-10-30** @chalker: 
- **2025-10-30** @chalker: 
- **2025-10-30** @chalker: 
- **2025-10-30** @chalker: 
- **2025-10-31** @chalker: 
- **2025-10-31** @chalker: 
- **2025-11-03** @rafaelgss: 
- **2025-11-03** @rafaelgss: 
- **2025-11-03** @chalker: 
- **2025-11-04** @chalker: 
- **2025-11-04** @mcollina: 
- **2025-11-04** @chalker: 
- **2025-11-04** @rafaelgss: 
- **2025-11-04** @chalker: 
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Cve Id Added**
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
