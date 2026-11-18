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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Original report: https://hackerone.com/reports/2140554
Advisory: https://github.com/rails/rails/security/advisories/GHSA-8h22-8cf7-hq6g

## Impact

Active Storage, when serving files (blobs), incorrectly sends the Set-Cookie header containing the user's session cookie along with a Cache-Control: public header.
Some certain caching proxies may cache this response, including the Set-Cookie header.
This allows unrelated users accessing the cached content to obtain the original user's session cookie.

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
