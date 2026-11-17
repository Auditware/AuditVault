---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/use-after-free
  - env/web
substate: "not-applicable"
weakness: "Use After Free"
enriched: true
date: 2026-10-19
submitted: 2026-10-17T10:44:26.537Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/curl|curl]]"
reporter: "alicangonullu"
source: "https://hackerone.com/reports/4122039"
title: "libcurl shared-HSTS-cache race leads to use-after-free with attacker-controlled function-pointer call"
---
# libcurl shared-HSTS-cache race leads to use-after-free with attacker-controlled function-pointer call

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** curl | **Disclosed:** 2026-10-19

- Report: [https://hackerone.com/reports/4122039](https://hackerone.com/reports/4122039)
- CWE: Use After Free
- Submitted: 2026-10-17T10:44:26.537Z

## Timeline

- **Draft Started**
- **Report Filed**
- **2026-10-17** @bagder: Thank you for your report!

The curl security team will now take some time and investigate your report and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.

If your report did not already mention how to reproduce this vulnerability, please consider providing this information to us.

Beware that there are **no** monetary rewards for curl vulnerabilities, no matter which severity.
- **2026-10-17** @bagder: Let me quote the CURLSHOPT_SHARE(3) man page:

> It is not supported to share the HSTS between multiple concurrent threads.
- **2026-10-17** @jimfuller2024: ya we also mention in:

https://github.com/curl/curl/blob/master/docs/libcurl/libcurl-thread.md

this is documented unsupported API usage and the RCE chain seems to be built by the test harness not by libcurl ... not a vuln.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
