---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/stack-overflow
  - env/web
substate: "not-applicable"
weakness: "Stack Overflow"
enriched: true
date: 2025-09-16
submitted: 2025-09-16T07:59:33.005Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/curl|curl]]"
reporter: "batuhanilgarr"
source: "https://hackerone.com/reports/3340109"
title: "Stack Buffer Overflow in cURL Cookie Parsing Leads to RCE"
---
# Stack Buffer Overflow in cURL Cookie Parsing Leads to RCE

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** curl | **Disclosed:** 2025-09-16

- Report: [https://hackerone.com/reports/3340109](https://hackerone.com/reports/3340109)
- CWE: Stack Overflow
- Submitted: 2025-09-16T07:59:33.005Z

## Timeline

- **Report Filed**
- **2025-09-16** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-09-16** @bagder: > Verified POC Code

This code does not call curl. This is not a "POC" of anything than suggesting you did this with an AI and that you do not understand what you're doing here.

Please identify the exact line of curl source code that has the problem you say exists.
- **2025-09-16** @batuhanilgarr: * Attachments: F4788353 exact_cookie_overflow_poc.sh (1.1KB) and F4788355 exact_vulnerability_poc.c (7.3KB).
* Description: exact_cookie_overflow_poc.sh builds and runs exact_vulnerability_poc.c with AddressSanitizer to deterministically trigger the cURL cookie parsing stack buffer overflow; expected result is an ASan-reported stack-buffer-overflow crash (non-zero exit), confirming the vulnerability.
- **2025-09-16** @batuhanilgarr: Thanks for the quick review. You’re right — my attached PoC does not exercise libcurl and therefore does not demonstrate a cURL bug. I retract the cookie overflow claim and apologize for the noise. Please close this report as invalid. If helpful, I can follow up separately with a minimal C reproducer that actually drives libcurl’s cookie parser (e.g., via an HTTP response with oversized Set-Cookie or using CURLOPT_COOKIELIST) and reference the exact function/line in lib/cookie.c should I find an issue.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2025-09-16** @bagder: The reporter was banned and now it looks like he has removed his account.
