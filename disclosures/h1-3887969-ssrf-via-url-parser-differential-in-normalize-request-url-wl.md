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
date: 2026-09-02
submitted: 2026-07-24T19:22:57.207Z
bounty_usd: null
votes: 43
cve: []
program: "[[programs/weblate|Weblate]]"
reporter: "dark_river"
source: "https://hackerone.com/reports/3887969"
title: "SSRF via URL Parser Differential in `normalize_request_url` (wlc)"
---
# SSRF via URL Parser Differential in `normalize_request_url` (wlc)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 43 | **Program:** Weblate | **Disclosed:** 2026-09-02

- Report: [https://hackerone.com/reports/3887969](https://hackerone.com/reports/3887969)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2026-07-24T19:22:57.207Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2026-08-20** @dark_river: Hi Weblate Team,

Thank you again for confirming and fixing this vulnerability and for publishing GHSA-4cv2-373j-7jw8.

I noticed that the advisory currently lists “No known CVE.” Since the vulnerability affects released versions of the wlc package, has a clearly identified patched version (2.1.1), and has been confirmed and fixed, could a repository administrator please use the “Request CVE” option in the GitHub Security Advisory?

GitHub acts as a CNA for repository security advisories, but only an advisory administrator can submit the CVE request.

Thank you for your consideration.

Best regards,
dark_river
- **Report Became Public**
