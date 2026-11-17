---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/buffer-over-read
  - env/web
substate: "not-applicable"
weakness: "Buffer Over-read"
enriched: true
date: 2025-12-28
submitted: 2025-12-27T19:17:59.302Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/curl|curl]]"
reporter: "efrsxcv"
source: "https://hackerone.com/reports/3480078"
title: "Heap Buffer Over-read in lib/http2.c (on_header) handling PUSH_PROMISE frames"
---
# Heap Buffer Over-read in lib/http2.c (on_header) handling PUSH_PROMISE frames

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** curl | **Disclosed:** 2025-12-28

- Report: [https://hackerone.com/reports/3480078](https://hackerone.com/reports/3480078)
- CWE: Buffer Over-read
- Submitted: 2025-12-27T19:17:59.302Z

## Timeline

- **Report Filed**
- **2025-12-27** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-12-27** @bagder: If this is true, how come http/2 server push doesn't always fail/trigger valgrind or asan warnings?
- **2025-12-27** @bagder: I don't understand. You show a build with ASAN and you claim curl reads the heap. Why don't you show us the details from the asan crash/stack trace when you reproduce this?
- **2025-12-27** @bagder: I believe the header callbacks are done from the nghttp2 function `nghttp2/lib/nghttp2_session.c:session_call_on_header`.

In that function it passes on the values from its `nv`variable, which is a `const nghttp2_hd_nv *`.

The typedef'ed struct `nghttp2_hd_nv` is declared in `nghttp2_hd.h` around line 120. Allow me to quote a piece of that:

~~~
typedef struct {
  /* The buffer containing header field name.  NULL-termination is
     guaranteed. */
  nghttp2_rcbuf *name;
  /* The buffer containing header field value.  NULL-termination is
     guaranteed. */
  nghttp2_rcbuf *value;
~~~

This might explain why this works...
- **2025-12-27** @efrsxcv: Thank you for the guidance, Daniel. I performed a deep dive verification using a debug build to inspect the raw memory at the nghttp2 callback boundary.

You are absolutely correct—the name and value pointers are indeed null-terminated by the underlying library before reaching this callback, making the %s usage safe. My initial assumption based on the lack of precision specifiers was a false positive.

I am closing this report as Invalid/Informative. Thank you for your time.
- **2025-12-27** @bagder: isn't it strange how you above claimed there was ASAN reports for this case and now you say there isn't?

Were  you maybe mislead by an AI that made you make up stories for us?
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
