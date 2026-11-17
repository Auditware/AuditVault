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
date: 2024-01-20
submitted: 2023-11-17T17:45:17.441Z
bounty_usd: 3495
votes: 44
cve: "CVE-2023-39332"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "tniessen"
source: "https://hackerone.com/reports/2256167"
title: "Path traversal through path stored in Uint8Array in Node.js 20"
---
# Path traversal through path stored in Uint8Array in Node.js 20

> **Severity:** High | **Bounty:** 3,495 USD | **Votes:** 44 | **Program:** Internet Bug Bounty | **Disclosed:** 2024-01-20

- Report: [https://hackerone.com/reports/2256167](https://hackerone.com/reports/2256167)
- CWE: Path Traversal | CVE: CVE-2023-39332
- Submitted: 2023-11-17T17:45:17.441Z

## Report summary

Path traversal through path stored in Uint8Array (High) - (CVE-2023-39332)

Full Security Advisory: https://nodejs.org/en/blog/vulnerability/october-2023-security-releases

## Timeline

- **Report Filed**
- **Report Triaged**
- **Cve Id Added**
- **2023-11-29** @kunderkoffler: Reached out to the project for modifier validation.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2023-12-21** @tniessen: Thank you very much @kunderkoffler, I appreciate it!

> Node.js does have modifiers in place on their IBB submissions, so in this case this submission was awarded at 75% of the standard reward amount.

As in my previous report, I am a bit unsure about the modifier that applied here - the only 25% modifier, according to the [project page](https://hackerone.com/nodejs), applies if "a proposed patch was not provided for the issue", but as mentioned and referenced in the description above, I wrote a patch which was released as part of a Node.js security release. I'd appreciate clarification since I've now repeatedly run into uncertainty w.r.t. IBB modifiers.
- **2024-01-13** @tniessen: ping @kunderkoffler :)
- **Report Became Public**
