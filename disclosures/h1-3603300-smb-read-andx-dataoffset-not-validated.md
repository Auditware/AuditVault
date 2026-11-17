---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "not-applicable"
weakness: null
enriched: true
date: 2026-03-16
submitted: 2026-03-13T16:59:27.491Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/curl|curl]]"
reporter: "x2048"
source: "https://hackerone.com/reports/3603300"
title: "SMB READ_ANDX DataOffset not validated"
---
# SMB READ_ANDX DataOffset not validated

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** curl | **Disclosed:** 2026-03-16

- Report: [https://hackerone.com/reports/3603300](https://hackerone.com/reports/3603300)
- CWE: N/A
- Submitted: 2026-03-13T16:59:27.491Z

## Timeline

- **Report Filed**
- **2026-03-13** @bagder: > the application receives attacker controlled bytes instead of the requested file

Explain to us how a malicious server cannot already provide exactly the bytes it thinks curl should get.
- **2026-03-14** @x2048: fair point. the security concern i was considering was whether recv_buf could contain client side state from previous operations that was not overwritten by the current response. if the buffer is not zeroed between uses and a previous response was larger. DataOffset=0 could potentially expose stale data the server did not send in this response. even if that angle does not hold this might be worth fixing as a robustness issue rather than a security bug. i did not mean to waste your time, sorry about that. :-)
- **2026-03-14** @bagder: > DataOffset=0 could potentially expose stale data the server did not send in this response

I cannot see how that can happen. so I cannot see how this is a security problem.
- **2026-03-14** @x2048: i re-read the code and smb_pop_message() sets smbc->got = 0 and smb_recv_message() always fills the buffer from offset 0 for each new message, you are right, sorry for the confusion. i still stand by that curl silently accepts "malformed" responses but it is not a security vulnerability, so we can probably drop this report. i should have reasoned through the buffer lifecycle before filing. thank you for your patience, i will be more careful before submitting next time.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
