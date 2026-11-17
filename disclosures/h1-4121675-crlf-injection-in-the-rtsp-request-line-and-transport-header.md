---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/crlf-injection
  - env/web
substate: "not-applicable"
weakness: "CRLF Injection"
enriched: true
date: 2026-10-18
submitted: 2026-10-17T06:12:22.278Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/curl|curl]]"
reporter: "noraqiu"
source: "https://hackerone.com/reports/4121675"
title: "CRLF injection in the RTSP request-line and Transport header via `CURLOPT_RTSP_STREAM_URI` and `CURLOPT_RTSP_TRANSPORT`"
---
# CRLF injection in the RTSP request-line and Transport header via `CURLOPT_RTSP_STREAM_URI` and `CURLOPT_RTSP_TRANSPORT`

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** curl | **Disclosed:** 2026-10-18

- Report: [https://hackerone.com/reports/4121675](https://hackerone.com/reports/4121675)
- CWE: CRLF Injection
- Submitted: 2026-10-17T06:12:22.278Z

## Timeline

- **Report Filed**
- **2026-10-17** @bagder: Thank you for your report!

The curl security team will now take some time and investigate your report and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.

If your report did not already mention how to reproduce this vulnerability, please consider providing this information to us.

Beware that there are **no** monetary rewards for curl vulnerabilities, no matter which severity.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
