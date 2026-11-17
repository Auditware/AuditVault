---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-after-free
  - env/web
substate: "resolved"
weakness: "Use After Free"
enriched: true
date: 2026-10-07
submitted: 2026-08-04T14:50:13.979Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/mariadb|MariaDB]]"
reporter: "akkoul"
source: "https://hackerone.com/reports/3915935"
title: "Heap Use-After-Free in Materialized_cursor::open via SYS_REFCURSOR Array Reallocation"
---
# Heap Use-After-Free in Materialized_cursor::open via SYS_REFCURSOR Array Reallocation

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** MariaDB | **Disclosed:** 2026-10-07

- Report: [https://hackerone.com/reports/3915935](https://hackerone.com/reports/3915935)
- CWE: Use After Free
- Submitted: 2026-08-04T14:50:13.979Z

## Timeline

- **Report Filed**
- **External User Joined**
- **Report Triaged**
- **2026-08-05** @vuvova: Do you have a github account? guthub advisories have a dedicated field for that. If not — no problem, I'll do the credit in text form anyway (Reported by Akhil Koul), but I can additionally do it in a dedicated field, if you have a github account.
- **2026-08-05** @akkoul: Thank you! My GitHub account is akoul (https://github.com/akoul)

Will you be requesting a CVE for this, or should I?
- **2026-08-10** @akkoul: @vuvova gentle nudge for an update. Thanks!
- **2026-08-10** @vuvova: There is no update, nothing new has happened. It's confirmed, there will be an advisory and a CVE id. That's it. We'll publish the advisory and the CVE id after the release. Release dates are at jira.mariadb.org.
- **2026-08-10** @akkoul: Thank you, I appreciate it.
- **Report Resolved**
- **Agreed On Going Public**
- **2026-09-09** @akkoul: thank you
- **Report Became Public**
