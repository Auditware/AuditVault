---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/out-of-bounds-read
  - env/web
substate: "not-applicable"
weakness: "Out-of-bounds Read"
enriched: true
date: 2026-04-29
submitted: 2026-04-20T06:46:01.662Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/curl|curl]]"
reporter: "h3zh3z"
source: "https://hackerone.com/reports/3684614"
title: "Heap-buffer-overflow in `Curl_ssl_push_certinfo_len()` — sole bounds check is `DEBUGASSERT`"
---
# Heap-buffer-overflow in `Curl_ssl_push_certinfo_len()` — sole bounds check is `DEBUGASSERT`

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** curl | **Disclosed:** 2026-04-29

- Report: [https://hackerone.com/reports/3684614](https://hackerone.com/reports/3684614)
- CWE: Out-of-bounds Read
- Submitted: 2026-04-20T06:46:01.662Z

## Timeline

- **Report Filed**
- **2026-04-20** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.

Beware that there are **no** monetary rewards for curl vulnerabilities, no matter which severity.
- **2026-04-20** @bagder: Your POC is not a valid POC.

If should be able to show a problem using nothing but a small application using the lbcurl API  and a mock server. This problem is just artificially created by yourself in the POC code.
- **2026-04-20** @h3zh3z: Thank you, and I apologize for the confusion in the script. I rewrote the poc to use only public API and the vuln still exists. {F5765410}
The PoC opens a loopback socket, connects curl to it, and calls curl_easy_perform(). During the transfer, libcurl's internal MIME read chain recurses once per nesting level with no depth limit, exhausting the 8 MB stack at ~9500 levels.

Build:                                                                                                                        
clang -fsanitize=address -fno-omit-frame-pointer -g -O1 \
  -I./include \                                                                                                                                                 
  poc_v2.c ./lib/.libs/libcurl.a \                            
   -lssl -lcrypto -lz -lpthread -ldl -o poc_v2                                                                                                                   
  ASAN_OPTIONS='halt_on_error=1:print_stacktrace=1:detect_leaks=0' ./poc 20000

This is denial-of-service, an attacker who controls the nesting depth can crash the application. The simplest fix on the library side would be to add a depth counter through read_part_content and return READ_ERROR beyond a reasonable limit.
- **2026-04-20** @bagder: So now you posted a MIME poc in a report about Curl_ssl_push_certinfo_len ... Clearly you confuse your different accounts.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
