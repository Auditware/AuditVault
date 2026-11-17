---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "informative"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2026-10-21
submitted: 2026-10-20T18:52:26.824Z
bounty_usd: null
votes: 12
cve: "CVE-2016-8625", "CVE-2022-42916"
program: "[[programs/curl|curl]]"
reporter: "zefanxu"
source: "https://hackerone.com/reports/4129950"
title: "IDN decoding inserts authority delimiters and can redirect proxy CONNECT to a different host"
---
# IDN decoding inserts authority delimiters and can redirect proxy CONNECT to a different host

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** curl | **Disclosed:** 2026-10-21

- Report: [https://hackerone.com/reports/4129950](https://hackerone.com/reports/4129950)
- CWE: Server-Side Request Forgery (SSRF) | CVE: CVE-2016-8625, CVE-2022-42916
- Submitted: 2026-10-20T18:52:26.824Z

## Timeline

- **Draft Started**
- **Report Filed**
- **2026-10-20** @cmeister2: Please read the [project guidelines](https://hackerone.com/curl) again, specifically

>Keep the entire initial submission brief. Across the whole Vulnerability Information field, use no more than six prose sentences total—not six sentences per section. You may additionally include one minimal, self-contained proof-of-concept script of no more than 30 non-empty lines and up to 10 lines of essential output. Do not add root-cause analysis, suggested fixes, background, CVE comparisons, duplicate-search notes, large logs, tables, attachments, or multi-file test harnesses unless the curl team requests them in a follow-up. Headings, bullets, and sentence fragments must not be used to evade the limit. Before submitting, count the sentences and remove anything that is not necessary to understand and reproduce the issue.
- **2026-10-20** @bagder: Are there actually commonly used proxy implementations that accept that invalid CONNECT request? The  at sign is not a valid character to use in the hostname there.
- **2026-10-21** @jimfuller2024: I believe tinyproxy does tihs - but if attacker already controls url then whats the point  ... I would like to see this treated as a hardening bug and move this over to github issue.
- **2026-10-21** @bagder: Agreed. A bug, not a vulnerability
- **Report Informative**
- **Agreed On Going Public**
- **2026-10-21** @bagder: PR:  https://github.com/curl/curl/pull/23545
- **Manually Disclosed**
