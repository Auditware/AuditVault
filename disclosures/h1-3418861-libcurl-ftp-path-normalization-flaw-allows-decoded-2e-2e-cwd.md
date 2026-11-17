---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "not-applicable"
weakness: "Path Traversal"
enriched: true
date: 2025-11-11
submitted: 2025-11-10T19:43:52.136Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/curl|curl]]"
reporter: "ahn0x"
source: "https://hackerone.com/reports/3418861"
title: "libcurl FTP path normalization flaw allows decoded %2e%2e → CWD .. and directory escape (Path Traversal, CWE-22)"
---
# libcurl FTP path normalization flaw allows decoded %2e%2e → CWD .. and directory escape (Path Traversal, CWE-22)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** curl | **Disclosed:** 2025-11-11

- Report: [https://hackerone.com/reports/3418861](https://hackerone.com/reports/3418861)
- CWE: Path Traversal
- Submitted: 2025-11-10T19:43:52.136Z

## Timeline

- **Report Filed**
- **2025-11-10** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-11-10** @bagder: 1. You're using an old curl version. This problem does not exist in curl 8.13.0 or later.
2. An attacker who controls a URL can do a lot of harm probably worse than this. Allowing an attacker to control the URL is a lost battle.
3. Since FTP clients very well can change directory to ".." on demand, proper directory protection has to be implemented server-side. It cannot rely on client-side protections.

As a side-note, with `--path-as-is` curl can be asked to allow this.
- **2025-11-10** @ahn0x: Thank you, Daniel, for the clarification and for taking the time to review it personally.
I really appreciate your feedback and the insights.
I’ve confirmed that it’s fixed in 8.13.0, so I’ll close the report from my side.
Thanks again for your work and for maintaining such a great project!
- **2025-11-11** @bagder: @ahn0x Please close this
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
