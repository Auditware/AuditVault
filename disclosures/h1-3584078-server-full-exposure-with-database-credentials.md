---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-exposure-through-directory-listing
  - env/web
substate: "resolved"
weakness: "Information Exposure Through Directory Listing"
enriched: true
body: true
date: 2026-06-10
submitted: 2026-03-03T23:29:56.940Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/essity|Essity]]"
reporter: "lazyar"
source: "https://hackerone.com/reports/3584078"
title: "████████ ████████ Server Full Exposure with Database Credentials"
---
# ████████ ████████ Server Full Exposure with Database Credentials

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Essity | **Disclosed:** 2026-06-10

- Report: [https://hackerone.com/reports/3584078](https://hackerone.com/reports/3584078)
- CWE: Information Exposure Through Directory Listing
- Submitted: 2026-03-03T23:29:56.940Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I discovered that the ████████ ████████ web server (████████) has directory listing enabled, exposing the entire file structure including database credentials, full website backups, and sensitive internal documents.
https://████████/
████████
████████

## Impact

Database compromise - Working credentials grant full read/write access to ████████'s database containing customer PII
Complete source code theft - 69MB backup file contains entire website code
Customer data exposure - Uploads directory may contain sensitive user information
Admin panel accessible - Attackers can target admin.php for brute force
Business logic/IP theft - Internal documents and source code exposed
Regulatory violations - GDPR/CCPA non-compliance due to exposed PII

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
