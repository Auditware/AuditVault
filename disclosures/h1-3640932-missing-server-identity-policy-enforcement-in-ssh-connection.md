---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/authentication-bypass-by-primary-weakness
  - env/web
substate: "not-applicable"
weakness: "Authentication Bypass by Primary Weakness"
enriched: true
date: 2026-04-03
submitted: 2026-03-31T22:47:17.893Z
bounty_usd: null
votes: 16
cve: "CVE-2022-27782", "CVE-2023-27538"
program: "[[programs/curl|curl]]"
reporter: "intrax71"
source: "https://hackerone.com/reports/3640932"
title: "Missing server identity policy enforcement in SSH connection reuse allows host key verification bypass via pool poisoning"
---
# Missing server identity policy enforcement in SSH connection reuse allows host key verification bypass via pool poisoning

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** curl | **Disclosed:** 2026-04-03

- Report: [https://hackerone.com/reports/3640932](https://hackerone.com/reports/3640932)
- CWE: Authentication Bypass by Primary Weakness | CVE: CVE-2022-27782, CVE-2023-27538
- Submitted: 2026-03-31T22:47:17.893Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2026-03-31** @intrax71: Hi Curl Team, i have an additional finding, since I can't get a signal and I don't have one, I can't make another report, so I'll just give you a brief overview of what it's about. If you're interested, let me know and I'll send you the proof of concept and everything.

# Additional finding: Security regression in cookie TAB validation

 I found that commit `a78a07d3a9` (2025-12-07, *"cookie: cleanups and improvements"*) regressed the TAB character validation fix originally introduced in `bfe9b59be4` (2022-10-05, reported by Trail of Bits).

The refactoring moved the TAB check from a position where it validated all `name=value` pairs (including cookie attributes like `path=` and `domain=`) into the first-pair block where it only validates the cookie name and value. As a result, a malicious server can inject TAB characters (`0x09`) into the `path` attribute of a `Set-Cookie` header, corrupting the Netscape cookie jar file and causing permanent cookie loss on re-read.
{F5648445}

| | |
|---|---|
| **Affected** | curl 8.18.0 through current HEAD |
| **Not affected** | curl 8.17.0 and earlier |
- **Report Not Applicable**
- **2026-04-01** @jimfuller2024: agree with @bagder (and this seems like a familiar report)
- **2026-04-01** @intrax71: hi, and how i can send you the second report, i can't create another one.
- **2026-04-01** @bagder: The point with the signal requirement is that we don't want your report if you don't have signal enough...
- **Agreed On Going Public**
- **Manually Disclosed**
