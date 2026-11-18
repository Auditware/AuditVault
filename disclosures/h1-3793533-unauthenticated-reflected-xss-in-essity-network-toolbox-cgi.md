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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

Legacy Perl "Network Toolbox" CGI at `████████` reflects `packet_size` into the HTML response without output encoding. When `packet_size` is non-integer, the script echoes the raw value inside an `<h3>` error element, allowing arbitrary HTML/JS injection. No auth required; no CSP on the response.

## Steps to reproduce

Unauthenticated URL (browser or curl):

```
████████?action=Run_Cmd&ip=1.1.1.1&packet_size=%3Cscript%3Ealert(document.domain)%3C%2Fscript%3E&cmd=+Ping+
```

curl:

```bash
curl -sk '████████?action=Run_Cmd&ip=1.1.1.1&packet_size=%3Cscript%3Ealert(document.domain)%3C%2Fscript%3E&cmd=+Ping+' \
  -H 'X-HackerOne-Research: larocas'
```

Reflection gated on `action=Run_Cmd` + non-integer `packet_size`; GET and POST both work.

████████
Encoding proof:
- `packet_size=<i>RAWTEST</i>` reflected literally as `<i>RAWTEST</i>` (no `&lt;i&gt;`).
- `packet_size=<img src=x onerror=console.log('XSS-larocas')>` reflected raw inside `<h3>`.

## Impact

Arbitrary JS in the Essity-owned origin `████████` against any visitor following a crafted link (no auth, no cookie). Enables phishing under an Essity domain, content injection/defacement, theft of anything scriptable from the origin. Absent CSP + legacy internet-facing mirror of internal SCA/SGN tool compound exposure.

## Secondary info disclosure on same page (low on its own)

Public page source leaks internal infra (non-qualifying alone, worth remediating with the XSS): internal host `████████`, internal mgmt IP `████████`, SNMP read-only community `████████`, server path `████████`, internal contact `████████`.

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
