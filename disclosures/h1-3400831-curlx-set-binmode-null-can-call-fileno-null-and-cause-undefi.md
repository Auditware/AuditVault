---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "not-applicable"
weakness: null
enriched: true
date: 2025-10-27
submitted: 2025-10-27T06:55:04.184Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/curl|curl]]"
reporter: "sippysir"
source: "https://hackerone.com/reports/3400831"
title: "CURLX_SET_BINMODE(NULL) can call fileno(NULL) and cause undefined behavior / crash"
---
# CURLX_SET_BINMODE(NULL) can call fileno(NULL) and cause undefined behavior / crash

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** curl | **Disclosed:** 2025-10-27

- Report: [https://hackerone.com/reports/3400831](https://hackerone.com/reports/3400831)
- CWE: N/A
- Submitted: 2025-10-27T06:55:04.184Z

## Timeline

- **Report Filed**
- **2025-10-27** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-10-27** @bagder: > an unguarded call to fileno(NULL) in tool_binmode.h

There is no `tool_binmode.h` in curl. It seems impossible to have a flaw in a file that does not exist.

> A minimal test program is included below to demonstrate the issue

No, that's your program showing a bug in YOUR code. Please point out the exact point in the curl source code where the flaw is and tell us how to trigger the bug.

Then remains the question if it is a security problem  at all in begin with, but I don't think we will get there...
- **2025-10-27** @bagder: Ah you're looking at non-master code. `src/tool_binmode.h` was renamed `lib/curlx/binmode.h` in commit 916f241f2f in June 2025.
- **2025-10-27** @bagder: You created this issue with the help of an AI, right?
- **2025-10-27** @sippysir: yes.
- **2025-10-27** @bagder: *Please point out the exact point in the curl source code where the flaw is and tell us how to trigger the bug.*
- **2025-10-27** @jimfuller2024: this report  confuses me ... as @bagder sez pls provide place in curl source
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
