---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/heap-overflow
  - env/web
substate: "informative"
weakness: "Heap Overflow"
enriched: true
date: 2019-10-05
submitted: 2017-04-15T07:27:46.047Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/libsass|LibSass]]"
reporter: "geeknik"
source: "https://hackerone.com/reports/221163"
title: "heap-buffer-overflow (read outside of buffer) in Sass::Prelexer::exactly<(char)92>(char const*) - libsass/src/lexer.hpp:92"
---
# heap-buffer-overflow (read outside of buffer) in Sass::Prelexer::exactly<(char)92>(char const*) - libsass/src/lexer.hpp:92

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** LibSass | **Disclosed:** 2019-10-05

- Report: [https://hackerone.com/reports/221163](https://hackerone.com/reports/221163)
- CWE: Heap Overflow
- Submitted: 2017-04-15T07:27:46.047Z

## Timeline

- **Report Filed**
- **Report Informative**
- **2017-05-09** @geeknik: I can no longer repro this with `bdb7be026f4a9aec24e997649ae88d1addfc29e6`. Thank you.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
