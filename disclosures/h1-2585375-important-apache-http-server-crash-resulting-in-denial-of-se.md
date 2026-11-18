---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/null-pointer-dereference
  - env/web
  - stack/apache
substate: "resolved"
weakness: "NULL Pointer Dereference"
enriched: true
body: true
date: 2024-07-13
submitted: 2024-07-03T07:09:44.828Z
bounty_usd: 4920
votes: 27
cve: "CVE-2024-38477"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "orange"
source: "https://hackerone.com/reports/2585375"
title: "important: Apache HTTP Server: Crash resulting in Denial of Service in mod_proxy via a malicious request (CVE-2024-38477)"
---
# important: Apache HTTP Server: Crash resulting in Denial of Service in mod_proxy via a malicious request (CVE-2024-38477)

> **Severity:** High | **Bounty:** 4,920 USD | **Votes:** 27 | **Program:** Internet Bug Bounty | **Disclosed:** 2024-07-13

- Report: [https://hackerone.com/reports/2585375](https://hackerone.com/reports/2585375)
- CWE: NULL Pointer Dereference | CVE: CVE-2024-38477
- Submitted: 2024-07-03T07:09:44.828Z

## Report summary

###important: Apache HTTP Server: Crash resulting in Denial of Service in mod_proxy via a malicious request (CVE-2024-38477)

null pointer dereference in mod_proxy in Apache HTTP Server 2.4.59 and earlier allows an attacker to crash the server via a malicious request.

Users are recommended to upgrade to version 2.4.60, which fixes this issue.

Acknowledgements: finder: Orange Tsai (@orange_8361) from DEVCORE

Reported: 2024-04-01
fixed by r1918607 in 2.4.x: 2024-07-01
Update 2.4.60 released: 2024-07-01
Affects: 2.4.0 through 2.4.59

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I reported this vulnerability through the official Apache HTTP Server security email on April 1, 2024, and received a fix along with a CVE number on July 1, 2024. You can check detailed information from there:
> https://httpd.apache.org/security/vulnerabilities_24.html

## Impact

null pointer dereference in mod_proxy in Apache HTTP Server 2.4.59 and earlier allows an attacker to crash the server via a malicious request.

Users are recommended to upgrade to version 2.4.60, which fixes this issue.

## Timeline

- **Draft Started**
- **Report Filed**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
