---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-dom
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
date: 2026-04-14
submitted: 2026-03-16T13:56:00.066Z
bounty_usd: null
votes: 82
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "xavlimsg"
source: "https://hackerone.com/reports/3608199"
title: "DOM XSS in `fizzy.do` import filename preview enables one-click victim account takeover"
---
# DOM XSS in `fizzy.do` import filename preview enables one-click victim account takeover

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 82 | **Program:** Basecamp | **Disclosed:** 2026-04-14

- Report: [https://hackerone.com/reports/3608199](https://hackerone.com/reports/3608199)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2026-03-16T13:56:00.066Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Severity Updated**
- **2026-03-17** @xavlimsg: Hey @jeremy Thanks for the fast triage and fix. I noticed the severity was adjusted from 8.4 to 4.2. 

Could you share the reasoning behind the downgrade? The confirmed impact is full account takeover: email change, session hijack, and account access. Which I'd normally expect to land in the High range even with the user interaction requirement.

I want to make sure the severity reflects the demonstrated impact rather than just the interaction chain.
- **2026-03-25** @xavlimsg: @jeremy Any update for this?
- **Report Severity Updated**
- **Report Resolved**
- **Bounty Awarded**
- **2026-03-26** @xavlimsg: _This comment was deleted by the author._
- **2026-03-27** @xavlimsg: Thanks Basecamp team :)
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
