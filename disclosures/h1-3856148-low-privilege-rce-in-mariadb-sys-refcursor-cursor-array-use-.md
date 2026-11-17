---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/use-after-free
  - env/web
substate: "resolved"
weakness: "Use After Free"
enriched: true
date: 2026-10-07
submitted: 2026-07-10T20:10:23.286Z
bounty_usd: null
votes: 14
cve: "CVE-2026-85748"
program: "[[programs/mariadb|MariaDB]]"
reporter: "rdjgr"
source: "https://hackerone.com/reports/3856148"
title: "Low-privilege RCE in MariaDB: SYS_REFCURSOR cursor-array use-after-free chained with an ST_Area heap over-read"
---
# Low-privilege RCE in MariaDB: SYS_REFCURSOR cursor-array use-after-free chained with an ST_Area heap over-read

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 14 | **Program:** MariaDB | **Disclosed:** 2026-10-07

- Report: [https://hackerone.com/reports/3856148](https://hackerone.com/reports/3856148)
- CWE: Use After Free | CVE: CVE-2026-85748
- Submitted: 2026-07-10T20:10:23.286Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **External User Joined**
- **2026-07-17** @rdjgr: Thanks for the triage. If it's possible to attribute to an org, please use https://github.com/v12-security/ , Otherwise my own account is also fine https://github.com/RickdeJager/
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **2026-10-21** @vuvova: https://jira.mariadb.org/browse/MDEV-40396
https://github.com/MariaDB/server/security/advisories/GHSA-mv8g-9f7q-hprm
- **Cve Id Added**
