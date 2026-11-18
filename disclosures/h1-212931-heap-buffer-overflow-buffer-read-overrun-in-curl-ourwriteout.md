---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/memory-corruption-generic
  - env/web
substate: "resolved"
weakness: "Memory Corruption - Generic"
enriched: true
body: true
date: 2018-05-16
submitted: 2017-03-12T20:54:30.887Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "geeknik"
source: "https://hackerone.com/reports/212931"
title: "heap-buffer-overflow (buffer read overrun) in curl: ourWriteOut() src/tool_writeout.c:115"
---
# heap-buffer-overflow (buffer read overrun) in curl: ourWriteOut() src/tool_writeout.c:115

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Internet Bug Bounty | **Disclosed:** 2018-05-16

- Report: [https://hackerone.com/reports/212931](https://hackerone.com/reports/212931)
- CWE: Memory Corruption - Generic
- Submitted: 2017-03-12T20:54:30.887Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Curl is a ubiquitous tool in use by millions of people around the world. I reported this flaw to the curl security mailing list on 10 March 2017:

```
./curl -q -K test000
==21754==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x60200000dbb2 at pc 0x0000004fcd39 bp 0x7ffcd27dc250 sp 0x7ffcd27dc248
READ of size 1 at 0x60200000dbb2 thread T0
    #0 0x4fcd38 in ourWriteOut /root/curl/src/tool_writeout.c:115:3
    #1 0x4ec947 in operate_do /root/curl/src/tool_operate.c:1669:11
    #2 0x4e053e in operate /root/curl/src/tool_operate.c:2024:20
    #3 0x4de5a6 in main /root/curl/src/tool_main.c:252:14
    #4 0x7fad0a96fb44 in __libc_start_main /build/glibc-qK83Be/glibc-2.19/csu/libc-start.c:287
    #5 0x4c407c in _start (/root/curl/src/curl+0x4c407c)

0x60200000dbb2 is located 0 bytes to the right of 2-byte region [0x60200000dbb0,0x60200000dbb2)
allocated by thread T0 here:
    #0 0x4a69fb in malloc (/root/curl/src/curl+0x4a69fb)
    #1 0x7fad0a9cf989 in __strdup /build/glibc-qK83Be/glibc-2.19/string/strdup.c:42

SUMMARY: AddressSanitizer: heap-buffer-overflow /root/curl/src/tool_writeout.c:115 ourWriteOut
```

Fixed by the developers on 12 March 2017:
https://github.com/curl/curl/commit/1890d59905414ab84a35892b2e45833654aa5c13

From the git commit:
```
If a % ended the statement, the string's trailing NUL would be skipped
and memory past the end of the buffer would be accessed and potentially
displayed as part of the --write-out output.
```
From the curl security mailing list:
```
It's possible that the data past the end of the buffer could get displayed as
part of the --write-out output (up to the first nul character, anyway), so
theoretically, it could write out a password or secret key or something.
```

## Timeline

- **Report Filed**
- **2017-04-03** @geeknik: FYI, this flaw has been assigned CVE-2017-7407 by Mitre. Their rationale:

>This specific case has a CVE because "theoretically, it could write out a password or secret key or something" was raised on the vendor's security mailing list, that possibility (apparently) could not be dismissed, and the commit message is consistent with that possibility.
- **2017-04-03** @geeknik: The actual CVE description is `The ourWriteOut function in tool_writeout.c in curl 7.53.1 might allow physically proximate attackers to obtain sensitive information from process memory in opportunistic circumstances by reading a workstation screen during use of a --write-out argument ending in a '%' character, which leads to a heap-based buffer over-read.`
- **Reassigned To Team**
- **Not Eligible For Bounty**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
