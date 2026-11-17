---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/classic-buffer-overflow
  - env/web
substate: "not-applicable"
weakness: "Classic Buffer Overflow"
enriched: true
date: 2025-10-21
submitted: 2025-10-21T07:39:27.729Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/curl|curl]]"
reporter: "aybanda"
source: "https://hackerone.com/reports/3392174"
title: "Buffer Overflow in WebSocket Handshake (lib/ws.c:1287)"
---
# Buffer Overflow in WebSocket Handshake (lib/ws.c:1287)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** curl | **Disclosed:** 2025-10-21

- Report: [https://hackerone.com/reports/3392174](https://hackerone.com/reports/3392174)
- CWE: Classic Buffer Overflow
- Submitted: 2025-10-21T07:39:27.729Z

## Timeline

- **Report Filed**
- **2025-10-21** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-10-21** @bagder: I'm not going to read the report until we sort this out. The code you point out does this:

~~~c
  if(randlen >= sizeof(keyval)) {
    free(randstr);
    return CURLE_FAILED_INIT;
  }
  strcpy(keyval, randstr);
~~~

Can you please explain to us, preferably without an AI, how that strcpy() can copy more bytes than what fits in 'keyval' ?
- **2025-10-21** @aybanda: Hi, 
I need to withdraw this WebSocket vulnerability report. After reviewing your response, I realize my analysis was wrong - the bounds check if(randlen >= sizeof(keyval)) prevents the buffer overflow, so the strcpy() is actually safe. This is not a vulnerability. Sorry for the incorrect report I will be more thorough if I submit any in future!
- **2025-10-21** @bagder: You will not submit any more issues to us, you are banned for violating the AI slop rules.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
