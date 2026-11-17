---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-certificate-validation
  - env/web
substate: "resolved"
weakness: "Improper Certificate Validation"
enriched: true
date: 2026-08-05
submitted: 2026-04-21T03:05:35.579Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/monero|Monero]]"
reporter: "benisprlh"
source: "https://hackerone.com/reports/3686259"
title: "`set_daemon` wallet-rpc silently ignores `ssl_allowed_fingerprints` → pinning bypassed, wallet↔daemon MITM"
---
# `set_daemon` wallet-rpc silently ignores `ssl_allowed_fingerprints` → pinning bypassed, wallet↔daemon MITM

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Monero | **Disclosed:** 2026-08-05

- Report: [https://hackerone.com/reports/3686259](https://hackerone.com/reports/3686259)
- CWE: Improper Certificate Validation
- Submitted: 2026-04-21T03:05:35.579Z

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **Report Vulnerability Information Updated**
- **Report Vulnerability Information Updated**
- **Report Triaged**
- **2026-04-22** @benisprlh: Thank you for triaging the report and for the swift action on PR #10432 — I appreciate the transparency throughout the process.

I wanted to ask about the bounty pool status. The forum page (forum.getmonero.org/8/funding-required/87597) appears blank when I visit it, so I was unable to verify whether funds are currently available. Could you confirm the current status of the pool?

Thank you for your time.
- **2026-04-22** @selsta: The forum had to be taken down due to the forum software being unmaintained and full of vulnerabilities. I don't know the current pool, I'd guess around 700 XMR.

I classified this report as "low severity" due to it being "is not easily exploitable or is low impact". Programmatically setting daemon connection is rarely used with wallet rpc, and fingerprint is even more rare. The impact of MITM wallet <-> daemon connection is also limited.
- **External User Joined**
- **2026-05-08** @luigi1111w: Sent 0.5 XMR: 0fee1d0484f80327f6ba919d244ccac30f5385ba82050ef90cc309c60e2544ee
- **2026-05-08** @benisprlh: Thanks for the bounty!
- **Swag Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
