---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/network
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
date: 2026-06-23
submitted: 2026-06-10T08:26:20.313Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/essity|Essity]]"
reporter: "deivizzzz"
source: "https://hackerone.com/reports/3793533"
title: " Unauthenticated reflected XSS in Essity 'Network Toolbox' CGI (████████ ████████"
---
#  Unauthenticated reflected XSS in Essity "Network Toolbox" CGI (████████ ████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Essity | **Disclosed:** 2026-06-23

- Report: [https://hackerone.com/reports/3793533](https://hackerone.com/reports/3793533)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2026-06-10T08:26:20.313Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **2026-06-23** @hugolevisse: Hello @larocas 
We have implemented a fix and the issue has been remediated.
Could you please verify that the vulnerability is no longer exploitable on your end? Once confirmed, we will proceed with resolving this report.
We appreciate your contribution to improving our security posture.
Best regards,
Essity AppSec Team
- **2026-06-23** @ariannac: _This comment was deleted by the author._
- **2026-06-23** @deivizzzz: Hi @hugolevisse and @ariannac nice to talk with you again!

Confirmed remediated.████████ now returns HTTP 404 (Apache "Not Found") and the packet_size payload no longer reflects, so I can no longer reproduce the XSS. Looks good on my end 

 Happy for you to resolve,have a nice day guys !!
- **Report Resolved**
- **2026-06-23** @deivizzzz: Just wondering @hugolevisse  and @ariannac 

Can this report be disclosed guys? 

Either the response is yes or no have a great day!
- **Agreed On Going Public**
- **Manually Disclosed**
