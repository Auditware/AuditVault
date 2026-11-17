---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/off-by-one-error
  - env/web
substate: "informative"
weakness: "Off-by-one Error"
enriched: true
date: 2026-03-12
submitted: 2026-03-11T15:02:03.190Z
bounty_usd: null
votes: 38
cve: []
program: "[[programs/curl|curl]]"
reporter: "otiscui"
source: "https://hackerone.com/reports/3598358"
title: "urlapi: off-by-one in custom scheme validation skips last character"
---
# urlapi: off-by-one in custom scheme validation skips last character

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 38 | **Program:** curl | **Disclosed:** 2026-03-12

- Report: [https://hackerone.com/reports/3598358](https://hackerone.com/reports/3598358)
- CWE: Off-by-one Error
- Submitted: 2026-03-11T15:02:03.190Z

## Timeline

- **Report Filed**
- **2026-03-11** @bagder: Thanks. This sounds like a bug, not a security problem.
- **2026-03-11** @otiscui: Thanks for the quick review. I understand the direct security impact is limited since it only affects the CURLUPART_SCHEME API path with CURLU_NON_SUPPORT_SCHEME. I flagged it as a potential concern for applications using libcurl's URL parser as a security filter (scheme validation bypass), but I respect your assessment. Happy to have it treated as a regular bug fix either way.
- **2026-03-11** @bagder: We explicitly do not consider different handling of URLs security problems because there is no proper URL standard, making URL parsers unlikely to treat URL specifics identically.

Proposed fix: https://github.com/curl/curl/pull/20893
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
