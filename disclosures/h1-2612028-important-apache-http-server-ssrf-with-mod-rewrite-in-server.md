---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - stack/apache
  - os/windows
substate: "resolved"
weakness: null
enriched: true
date: 2024-08-27
submitted: 2024-07-19T03:02:55.252Z
bounty_usd: 4263
votes: 19
cve: "CVE-2024-40898"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "xi4o7unj1e"
source: "https://hackerone.com/reports/2612028"
title: "important: Apache HTTP Server: SSRF with mod_rewrite in server/vhost context on Windows (CVE-2024-40898)"
---
# important: Apache HTTP Server: SSRF with mod_rewrite in server/vhost context on Windows (CVE-2024-40898)

> **Severity:** High | **Bounty:** 4,263 USD | **Votes:** 19 | **Program:** Internet Bug Bounty | **Disclosed:** 2024-08-27

- Report: [https://hackerone.com/reports/2612028](https://hackerone.com/reports/2612028)
- CWE: N/A | CVE: CVE-2024-40898
- Submitted: 2024-07-19T03:02:55.252Z

## Report summary

important: Apache HTTP Server: SSRF with mod_rewrite in server/vhost context on Windows (CVE-2024-40898)
SSRF in Apache HTTP Server on Windows with mod_rewrite in server/vhost context, allows to potentially leak NTLM hashes to a malicious server via SSRF and malicious requests.

Users are recommended to upgrade to version 2.4.62 which fixes this issue.

Acknowledgements:

finder: Smi1e (DBAPPSecurity Ltd.)
finder: xiaojunjie (DBAPPSecurity Ltd.)

Security Advisory: https://httpd.apache.org/security/vulnerabilities_24.html

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2024-07-24** @xi4o7unj1e: @kunderkoffler   Is there anything else I should submit ?
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
