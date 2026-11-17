---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "not-applicable"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2026-10-19
submitted: 2026-10-17T05:15:14.036Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/curl|curl]]"
reporter: "noraqiu"
source: "https://hackerone.com/reports/4053116"
title: "curl CONNECT response header colon-check bypass in cf-h1-proxy single_header — proxy authentication bypass via injected HTTP/1.x status line"
---
# curl CONNECT response header colon-check bypass in cf-h1-proxy single_header — proxy authentication bypass via injected HTTP/1.x status line

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** curl | **Disclosed:** 2026-10-19

- Report: [https://hackerone.com/reports/4053116](https://hackerone.com/reports/4053116)
- CWE: Improper Authentication - Generic
- Submitted: 2026-10-17T05:15:14.036Z

## Timeline

- **Draft Started**
- **Report Filed**
- **2026-10-17** @bagder: Thank you for your report!

The curl security team will now take some time and investigate your report and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.

If your report did not already mention how to reproduce this vulnerability, please consider providing this information to us.

Beware that there are **no** monetary rewards for curl vulnerabilities, no matter which severity.
- **2026-10-17** @bagder: This is a MITM proxy you are describing; it can already read and control all data that is sent through it. How does this minor flaw  give the proxy any more powers or access?
- **2026-10-17** @bagder: Please provide a proper reproducer, not your clanker write-up that seems to be incorrect.

> 5. on_resp_header() matches the HTTP/1.x pattern and overwrites k->httpcode / data->info.httpproxycode from 407 to 200.

Exactly where in `on_resp_header` does it do this?
- **2026-10-17** @jimfuller2024: I am a little confused by this report ... and I cannot reproduce and note that https://github.com/curl/curl/commit/c1a1a2968e seems to fix something mentioned here ... not seeing anything worthy of a CVE but maybe I missed something
- **2026-10-17** @bagder: Please clarify that you found this problem using code from a current git master and not something old.
- **Report Needs More Info**
- **Report New**
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
