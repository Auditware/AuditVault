---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
  - vuln/misconfiguration
  - trigger/social-engineering
  - fix/csp
substate: "informative"
weakness: null
enriched: true
body: true
date: 2025-04-11
submitted: 2025-03-31T15:47:12.220Z
bounty_usd: null
votes: 95
cve: []
program: "[[programs/lichess|Lichess]]"
reporter: "ryomenshuvro"
source: "https://hackerone.com/reports/3068485"
title: "Direct IP Access to Website"
---
# Direct IP Access to Website

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 95 | **Program:** Lichess | **Disclosed:** 2025-04-11

- Report: [https://hackerone.com/reports/3068485](https://hackerone.com/reports/3068485)
- CWE: N/A
- Submitted: 2025-03-31T15:47:12.220Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
The website is accessible directly via its IP address (37.187.205.99), which may bypass domain-based security policies and expose potential misconfigurations.

## Steps To Reproduce:
1. Open a web browser and enter the IP address:
http://37.187.205.99
2. Observe that it loads the main website instead of rejecting the request or redirecting it to the proper domain.

##Expected Result:
The server should block direct IP access or redirect it to the proper domain.

##Actual Result:
The website is fully accessible via its IP address.

## Impact

1. Domain-based security policies (CSP, HSTS, cookies, etc.) might not be enforced, leading to potential security bypasses.

2. Possible certificate mismatch issues if HTTPS is used, making it easier for phishing attacks.

3. Firewall/hosting misconfigurations could expose internal infrastructure.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
