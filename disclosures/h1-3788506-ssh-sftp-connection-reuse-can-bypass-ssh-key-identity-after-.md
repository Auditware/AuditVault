---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/authentication-bypass-by-primary-weakness
  - env/web
substate: "informative"
weakness: "Authentication Bypass by Primary Weakness"
enriched: true
date: 2026-06-09
submitted: 2026-06-08T03:11:00.746Z
bounty_usd: null
votes: 30
cve: "CVE-2022-27782", "CVE-2023-27538"
program: "[[programs/curl|curl]]"
reporter: "byteray_ltd"
source: "https://hackerone.com/reports/3788506"
title: "SSH/SFTP connection reuse can bypass SSH key identity after ssh_config_matches removal"
---
# SSH/SFTP connection reuse can bypass SSH key identity after ssh_config_matches removal

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** curl | **Disclosed:** 2026-06-09

- Report: [https://hackerone.com/reports/3788506](https://hackerone.com/reports/3788506)
- CWE: Authentication Bypass by Primary Weakness | CVE: CVE-2022-27782, CVE-2023-27538
- Submitted: 2026-06-08T03:11:00.746Z

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **2026-06-08** @bagder: commit 3e9817cd1bb6aa53d3 has not been shipped in a release, thus this is not (yet) a security vulnerability.
- **2026-06-08** @bagder: Fix: https://github.com/curl/curl/pull/21899
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
