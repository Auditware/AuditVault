---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2023-11-30
submitted: 2023-10-25T13:58:08.992Z
bounty_usd: 2330
votes: 42
cve: "CVE-2023-39331"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "tniessen"
source: "https://hackerone.com/reports/2225660"
title: "Permission model improperly protects against path traversal in Node.js 20"
---
# Permission model improperly protects against path traversal in Node.js 20

> **Severity:** High | **Bounty:** 2,330 USD | **Votes:** 42 | **Program:** Internet Bug Bounty | **Disclosed:** 2023-11-30

- Report: [https://hackerone.com/reports/2225660](https://hackerone.com/reports/2225660)
- CWE: Path Traversal | CVE: CVE-2023-39331
- Submitted: 2023-10-25T13:58:08.992Z

## Report summary

Permission model improperly protects against path traversal (High) - (CVE-2023-39331)
A previously disclosed vulnerability (CVE-2023-30584) was patched insufficiently. The new path traversal vulnerability arises because the implementation does not protect itself against the application overwriting built-in utility functions with user-defined implementations.

Impacts:
This vulnerability affects all users using the experimental permission model in Node.js 20.x.
Please note that at the time this CVE is issued, the permission model is an experimental feature of Node.js.

Thanks to Tobias Nießen who reported and created the security patch.

Full Security Advisory: https://nodejs.org/en/blog/vulnerability/october-2023-security-releases

## Timeline

- **Report Filed**
- **2023-10-25** @tniessen: HackerOne somehow insists on associating any CVEs mentioned in the description with the report itself. For the record, even though the automatically generated metadata of this report claims CVE-2023-30584, that is _not_ the assigned CVE ID but merely a related issue. The assigned CVE ID, as correctly displayed under "Vulnerability identifier", is CVE-2023-39331.
- **Cve Id Added**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
