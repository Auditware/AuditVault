---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/allocation-of-resources-without-limits-or-throttling
  - env/web
substate: "spam"
weakness: "Allocation of Resources Without Limits or Throttling"
enriched: true
date: 2025-05-22
submitted: 2025-05-22T01:15:44.803Z
bounty_usd: null
votes: 55
cve: []
program: "[[programs/curl|curl]]"
reporter: "senseijohnmed"
source: "https://hackerone.com/reports/3158093"
title: "Memory Leak in libcurl via Location Header Handling (CWE-770)"
---
# Memory Leak in libcurl via Location Header Handling (CWE-770)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 55 | **Program:** curl | **Disclosed:** 2025-05-22

- Report: [https://hackerone.com/reports/3158093](https://hackerone.com/reports/3158093)
- CWE: Allocation of Resources Without Limits or Throttling
- Submitted: 2025-05-22T01:15:44.803Z

## Timeline

- **Report Filed**
- **2025-05-22** @jimfuller2024: thx for the report - taking a look
- **2025-05-22** @bagder: So the claim here is that there is a leak but valgrind does not show it? The only proof of the leak is sweeping statements?

I tested the claimed command line with the provided server code and I double-checked with our internal memory tracer and the results were exactly as expected: no leak detected.

So, @darkroomdragon how exactly do you come to the conclusion there is a leak?
- **2025-05-22** @bagder: The attached valgrind report shows a few memory blocks that are "still reachable". They are not leaks  and they amount to only 1,500 bytes.
- **2025-05-22** @jimfuller2024: I did not try to build and repro specifically on kali linux (which is debian testing branch) - I do not think it matters ... looking at src not sure  I see anything wrong - I was unable to repro this and running valgrind reports no leaks ... I do not think there is a problem here - unless OP can demonstrate clearly how to reproduce.
- **2025-05-22** @bagder: This report is 100% AI slop. A waste of our time. You used an AI against our strong recommendation and even though **the problem cannot be reproduced** you decided to still submit it here.

This is a violation of our terms. Consider yourself banned from future interaction with our program.
- **Report Spam**
- **Agreed On Going Public**
- **Manually Disclosed**
