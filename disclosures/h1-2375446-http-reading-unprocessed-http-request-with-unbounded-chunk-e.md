---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2024-03-05
submitted: 2024-02-15T18:19:30.150Z
bounty_usd: 3495
votes: 40
cve: "CVE-2024-22019"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "bart"
source: "https://hackerone.com/reports/2375446"
title: "http: Reading unprocessed HTTP request with unbounded chunk extension allows DoS attacks"
---
# http: Reading unprocessed HTTP request with unbounded chunk extension allows DoS attacks

> **Severity:** High | **Bounty:** 3,495 USD | **Votes:** 40 | **Program:** Internet Bug Bounty | **Disclosed:** 2024-03-05

- Report: [https://hackerone.com/reports/2375446](https://hackerone.com/reports/2375446)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2024-22019
- Submitted: 2024-02-15T18:19:30.150Z

## Report summary

Reading unprocessed HTTP request with unbounded chunk extension allows DoS attacks (CVE-2024-22019) - (High)
A vulnerability in Node.js HTTP servers allows an attacker to send a specially crafted HTTP request with chunked encoding, leading to resource exhaustion and denial of service (DoS).

The server reads an unbounded number of bytes from a single connection, exploiting the lack of limitations on chunk extension bytes.

The issue can cause CPU and network bandwidth exhaustion, bypassing standard safeguards like timeouts and body size limits.

Impacts:

This vulnerability affects all users in all active release lines: 18.x, 20.x, and 21.x.
Thank you, to Bartek Nowotarski for reporting this vulnerability and thank you Paolo Insogna for fixing it.

Full Security Advisory: https://nodejs.org/en/blog/vulnerability/february-2024-security-releases

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I'd like to report Node.js vulnerability (CVE-2024-22019) that was recently fixed:
- HackerOne report: https://hackerone.com/reports/2233486
- Release notes: https://nodejs.org/en/blog/vulnerability/february-2024-security-releases

## Impact

This is a major issue because it allows unbounded resource (CPU, network bandwidth) consumption of the standard Node.js http server. The standard methods which could help blocking a malicious requests like timeouts and limiting request body size do not seem to work.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2024-02-28** @bart: Hey, it's been two weeks. Any news on the check process?
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2024-03-05** @bart: Thank you @kunderkoffler!
