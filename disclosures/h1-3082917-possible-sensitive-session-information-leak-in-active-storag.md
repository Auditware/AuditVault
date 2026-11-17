---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2025-04-27
submitted: 2025-04-08T13:37:49.305Z
bounty_usd: 4323
votes: 82
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "tyage"
source: "https://hackerone.com/reports/3082917"
title: "Possible Sensitive Session Information Leak in Active Storage"
---
# Possible Sensitive Session Information Leak in Active Storage

> **Severity:** High | **Bounty:** 4,323 USD | **Votes:** 82 | **Program:** Internet Bug Bounty | **Disclosed:** 2025-04-27

- Report: [https://hackerone.com/reports/3082917](https://hackerone.com/reports/3082917)
- CWE: Information Disclosure
- Submitted: 2025-04-08T13:37:49.305Z

## Report summary

Possible Sensitive Session Information Leak in Active Storage

There is a possible sensitive session information leak in Active Storage. By
default, Active Storage sends a Set-Cookie header along with the user's
session cookie when serving blobs. It also sets Cache-Control to public.
Certain proxies may cache the Set-Cookie, leading to an information leak.

This vulnerability has been assigned the CVE identifier CVE-2024-26144.

Versions Affected: >= 5.2.0, < 7.1.0
Not affected: < 5.2.0, > 7.1.0
Fixed Versions: 7.0.8.1, 6.1.7.7

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **Bounty Awarded**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
