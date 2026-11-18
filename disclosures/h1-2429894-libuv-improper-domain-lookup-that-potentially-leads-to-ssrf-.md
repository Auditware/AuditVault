---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - vuln/ssrf
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2024-03-29
submitted: 2024-03-21T18:47:15.488Z
bounty_usd: 4860
votes: 74
cve: "CVE-2024-24806"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "hunt1"
source: "https://hackerone.com/reports/2429894"
title: "Libuv: Improper Domain Lookup that potentially leads to SSRF attacks"
---
# Libuv: Improper Domain Lookup that potentially leads to SSRF attacks

> **Severity:** High | **Bounty:** 4,860 USD | **Votes:** 74 | **Program:** Internet Bug Bounty | **Disclosed:** 2024-03-29

- Report: [https://hackerone.com/reports/2429894](https://hackerone.com/reports/2429894)
- CWE: Server-Side Request Forgery (SSRF) | CVE: CVE-2024-24806
- Submitted: 2024-03-21T18:47:15.488Z

## Report summary

Improper Domain Lookup that potentially leads to SSRF attacks

Summary
The uv_getaddrinfo function in src/unix/getaddrinfo.c (and its windows counterpart src/win/getaddrinfo.c), truncates hostnames to 256 characters before calling getaddrinfo. This behavior can be exploited to create addresses like 0x00007f000001, which are considered valid by getaddrinfo and could allow an attacker to craft payloads that resolve to unintended IP addresses, bypassing developer checks.

Full GHSA: https://github.com/libuv/libuv/security/advisories/GHSA-f74f-cvh7-c6q6

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I recently encountered a challenge in a CTF competition that led me to discover a vulnerability within Node.js, present in all versions after v10. Upon further investigation and code debugging, it became apparent that the vulnerability originated from its direct dependency, `libuv`.

I submitted a report to the Node.js team via HackerOne, and they subsequently connected me with the libuv team. This collaboration resulted in the identification and resolution of the vulnerability, now recorded as CVE-2024-24806.

## Impact

This vulnerability could allow an attacker to craft payloads that results in **SSRF** attacks and **Internal API Access**. Full explanation of vulnerability, PoC and sample scenarios are provided within the original report:
https://github.com/libuv/libuv/security/advisories/GHSA-f74f-cvh7-c6q6

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **Report Triaged**
- **Bounty Awarded**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
