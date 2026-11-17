---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2024-01-16
submitted: 2023-12-31T13:31:17.102Z
bounty_usd: null
votes: 141
cve: []
program: "[[programs/indrive|inDrive]]"
reporter: "cypher-28"
source: "https://hackerone.com/reports/2300358"
title: "SSRF in https://couriers.indrive.com/api/file-storage"
---
# SSRF in https://couriers.indrive.com/api/file-storage

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 141 | **Program:** inDrive | **Disclosed:** 2024-01-16

- Report: [https://hackerone.com/reports/2300358](https://hackerone.com/reports/2300358)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2023-12-31T13:31:17.102Z

## Report summary

Subscribe to our telegram channel with updates https://t.me/indrive_bbp

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **2024-01-08** @majesttic: @cypher-28 Nice finding! Very great job, thanks!
- **2024-01-08** @majesttic: Also subscribe to our telegram channel with updates https://t.me/indrive_bbp
- **2024-01-09** @cypher-28: Thanks
- **Report Resolved**
- **2024-01-09** @cypher-28: ### The bug is fixed
I can confirm that the bug is fixed, I can't able to access the vulnerable endpoint https://couriers.indrive.com/api/file-storage
█████████
- **Agreed On Going Public**
- **2024-01-16** @cypher-28: Hi,
We can disclose this report
- **Agreed On Going Public**
- **Report Became Public**
