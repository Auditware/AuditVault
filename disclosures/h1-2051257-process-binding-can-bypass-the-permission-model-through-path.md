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
date: 2023-09-10
submitted: 2023-07-05T15:54:29.775Z
bounty_usd: null
votes: 8
cve: "CVE-2023-32558"
program: "[[programs/nodejs|Node.js]]"
reporter: "rafaelgss"
source: "https://hackerone.com/reports/2051257"
title: "process.binding() can bypass the permission model through path traversal"
---
# process.binding() can bypass the permission model through path traversal

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js | **Disclosed:** 2023-09-10

- Report: [https://hackerone.com/reports/2051257](https://hackerone.com/reports/2051257)
- CWE: Path Traversal | CVE: CVE-2023-32558
- Submitted: 2023-07-05T15:54:29.775Z

## Report summary

The use of the deprecated API `process.binding()` can bypass the permission model through path traversal. 

This vulnerability affects all users using the experimental permission model in Node.js 20.x.

Please note that at the time this CVE was issued, the permission model is an experimental feature of Node.js.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
