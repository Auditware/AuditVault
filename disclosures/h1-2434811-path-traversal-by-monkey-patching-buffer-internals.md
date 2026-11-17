---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2024-05-29
submitted: 2024-03-26T14:50:29.613Z
bounty_usd: 2430
votes: 67
cve: "CVE-2024-21896"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "tniessen"
source: "https://hackerone.com/reports/2434811"
title: "Path traversal by monkey-patching Buffer internals"
---
# Path traversal by monkey-patching Buffer internals

> **Severity:** High | **Bounty:** 2,430 USD | **Votes:** 67 | **Program:** Internet Bug Bounty | **Disclosed:** 2024-05-29

- Report: [https://hackerone.com/reports/2434811](https://hackerone.com/reports/2434811)
- CWE: Path Traversal | CVE: CVE-2024-21896
- Submitted: 2024-03-26T14:50:29.613Z

## Report summary

Path traversal by monkey-patching Buffer internals (CVE-2024-21896) - (High)
The permission model protects itself against path traversal attacks by calling path.resolve() on any paths given by the user. If the path is to be treated as a Buffer, the implementation uses Buffer.from() to obtain a Buffer from the result of path.resolve().

By monkey-patching Buffer internals, namely, Buffer.prototype.utf8Write, the application can modify the result of path.resolve(), which leads to a path traversal vulnerability.

Impacts:
This vulnerability affects all users using the experimental permission model in active release lines: 20.x and 21.x.

Please note that at the time this CVE was issued, the permission model is an experimental feature of Node.js. Thank you, to Tobias Nießen for reporting this vulnerability and for fixing it.

Full Security Advisory: https://nodejs.org/en/blog/vulnerability/february-2024-security-releases

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
