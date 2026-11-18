---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-request-smuggling
  - env/web
  - stack/apache
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
body: true
date: 2022-08-25
submitted: 2022-08-12T17:34:36.518Z
bounty_usd: 4000
votes: 75
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "albinowax"
source: "https://hackerone.com/reports/1667974"
title: "Pause-based desync in Apache HTTPD"
---
# Pause-based desync in Apache HTTPD

> **Severity:** High | **Bounty:** 4,000 USD | **Votes:** 75 | **Program:** Internet Bug Bounty | **Disclosed:** 2022-08-25

- Report: [https://hackerone.com/reports/1667974](https://hackerone.com/reports/1667974)
- CWE: HTTP Request Smuggling
- Submitted: 2022-08-12T17:34:36.518Z

## Report summary

important: HTTP request smuggling vulnerability in Apache HTTP Server 2.4.52 and earlier (CVE-2022-22720)

Apache HTTP Server 2.4.52 and earlier fails to close inbound connection when errors are encountered discarding the request body, exposing the server to HTTP Request Smuggling

Acknowledgements: James Kettle <james.kettle portswigger.net>

Reported to security team:	2021-12-17
fixed by r1898692 in 2.4.x:	2022-03-07
Update 2.4.53 released:	 2022-03-14
Affects:	<=2.4.52

Link to Security Advisory: https://httpd.apache.org/security/vulnerabilities_24.html#CVE-2022-22720

While researching browser-powered desync attacks, I discovered that Apache was vulnerable to a pause-based desync.

This vulnerability is detailed in full in the whitepaper: https://portswigger.net/research/browser-powered-desync-attacks#pause

We've also published a vulnerable lab based on the finding: https://portswigger.net/web-security/request-smuggling/browser/pause-based-desync

The bounty will be donated to charity.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Apache was vulnerable to a pause-based desync. This vulnerability is described in detail in my whitepaper here: https://portswigger.net/research/browser-powered-desync-attacks#pause

## Impact

This enables server-side HTTP Request Smuggling when Apache is deployed as a back-end server, and it also enables MITM attackers to inject arbitrary JavaScript in spite of TLS.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
