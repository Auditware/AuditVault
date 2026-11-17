---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "not-applicable"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2025-07-01
submitted: 2025-07-01T12:47:44.062Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/curl|curl]]"
reporter: "alphox"
source: "https://hackerone.com/reports/3231321"
title: "HTTP Proxy Bypass via `CURLOPT_CUSTOMREQUEST` Verb Tunneling"
---
# HTTP Proxy Bypass via `CURLOPT_CUSTOMREQUEST` Verb Tunneling

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 21 | **Program:** curl | **Disclosed:** 2025-07-01

- Report: [https://hackerone.com/reports/3231321](https://hackerone.com/reports/3231321)
- CWE: Improper Access Control - Generic
- Submitted: 2025-07-01T12:47:44.062Z

## Timeline

- **Report Filed**
- **2025-07-01** @jimfuller2024: thx for the report - I was unable to reproduce forbidden server emitting payload (on curl 8.14.0) with always the Verdict:  BLOCKED. result  ... I wonder what I might be missing ....
- **2025-07-01** @bagder: I see a description of valid curl functionality, not an attack nor a security problem.

> It allows an attacker who can control libcurl's options

That's not an attacker, that's a libcurl using application and they are free to use the API as they please to do what they think is the right operation.

Did you use an AI to produce this report?
- **2025-07-01** @alphox: Yes, I used an AI tool for the initial code analysis to help identify complex interactions that might warrant a closer look.
However, I did not want to rely on its output alone. I proceeded to build a manual Proof-of-Concept myself based on its hypothesis. My PoC—where the proxy script accepted the CONNECT verb and the internal server received the data—seemed to confirm the bypass, which is why I submitted the report with confidence.
Your explanation makes the crucial distinction clear: my PoC was actually demonstrating libcurl's intended feature set, not a flaw. The responsibility for preventing insecure use of these powerful options lies with the calling application.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
