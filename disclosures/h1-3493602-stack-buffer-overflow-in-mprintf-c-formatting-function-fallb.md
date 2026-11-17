---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/classic-buffer-overflow
  - env/web
substate: "informative"
weakness: "Classic Buffer Overflow"
enriched: true
date: 2026-01-08
submitted: 2026-01-07T22:12:52.714Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/curl|curl]]"
reporter: "ankitsingh015"
source: "https://hackerone.com/reports/3493602"
title: "Stack Buffer Overflow in mprintf.c formatting function (fallback path)"
---
# Stack Buffer Overflow in mprintf.c formatting function (fallback path)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** curl | **Disclosed:** 2026-01-08

- Report: [https://hackerone.com/reports/3493602](https://hackerone.com/reports/3493602)
- CWE: Classic Buffer Overflow
- Submitted: 2026-01-07T22:12:52.714Z

## Timeline

- **Report Filed**
- **2026-01-07** @bagder: @han_ank please mention a platform where this happens with unaltered source code
- **2026-01-08** @jimfuller2024: which platforms ... maybe really old linuxes (I remember some older bsd variants, of course System V!) ... maybe some embedded systems (TinyOS or FreeRTOS) ... there is virtually no 'surface area' here which might indicate we can deprecate this all together.
- **2026-01-08** @jimfuller2024: forgot to mention - but I am not even certain TinyOS can build curl ... maybe someone has done it with FreeRTOS
- **2026-01-08** @bagder: There were some systems in the 90s that lacked snprintf. Even really old Windows back in those days I believe might had lacked it.

In the last twenty or so years even embedded systems have been made with *proper* libc implementations that offer snprintf. I have not been able to find anything done in the last decades that do not offer snprintf.

snprintf() is mandated by the C99 standard, which as the name suggests, came around 1999. libc implementations intended to work with C99 then need to offer the function.

As we cannot find any system that is not a legacy end of life one, we cannot consider this a valid vulnerability - but a bug.

To completely avoid this discussion from happening again, we remove the sprintf() fallback from the code: https://github.com/curl/curl/pull/20218
- **2026-01-08** @ankitsingh015: Thanks for the clarification. I understand the classification as a bug rather than a security vulnerability given the lack of supported platforms without snprintf. I appreciate the decision to remove the fallback path entirely to avoid future issues.
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
