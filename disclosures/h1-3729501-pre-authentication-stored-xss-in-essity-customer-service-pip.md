---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2026-08-27
submitted: 2026-05-12T12:23:22.988Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/essity|Essity]]"
reporter: "matty69v"
source: "https://hackerone.com/reports/3729501"
title: "Pre-authentication Stored XSS in Essity Customer-Service Pipeline via ContactApi (reCAPTCHA bypass + no rate limit)"
---
# Pre-authentication Stored XSS in Essity Customer-Service Pipeline via ContactApi (reCAPTCHA bypass + no rate limit)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 48 | **Program:** Essity | **Disclosed:** 2026-08-27

- Report: [https://hackerone.com/reports/3729501](https://hackerone.com/reports/3729501)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2026-05-12T12:23:22.988Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2026-05-12** @matty69v: Tell me if you need more info about the scenario @hugolevisse when a customer-service operator logs into the Umbraco back-office and opens the ticket for review, the JavaScript in any of the 12 injected fields executes in their authenticated session so we can retrieve info via the javascript
- **Report Triaged**
- **2026-07-01** @hugolevisse: Hello @matty69v 
We have implemented a fix and the issue has been remediated.
Could you please verify that the vulnerability is no longer exploitable on your end? Once confirmed, we will proceed with resolving this report.
We appreciate your contribution to improving our security posture.
Best regards,
Essity AppSec Team
- **2026-07-01** @matty69v: Hello @hugolevisse i confirm can't reproduce good fix !
- **Report Resolved**
- **Agreed On Going Public**
- **2026-07-27** @matty69v: Hi @hugolevisse any news about the disclosure ?
- **Agreed On Going Public**
- **Report Became Public**
