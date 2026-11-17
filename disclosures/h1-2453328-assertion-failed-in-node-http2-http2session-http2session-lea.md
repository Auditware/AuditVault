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
date: 2024-04-29
submitted: 2024-04-08T20:41:07.954Z
bounty_usd: 3645
votes: 39
cve: "CVE-2024-27983"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "bart"
source: "https://hackerone.com/reports/2453328"
title: "Assertion failed in node::http2::Http2Session::~Http2Session() leads to HTTP/2 server crash"
---
# Assertion failed in node::http2::Http2Session::~Http2Session() leads to HTTP/2 server crash

> **Severity:** High | **Bounty:** 3,645 USD | **Votes:** 39 | **Program:** Internet Bug Bounty | **Disclosed:** 2024-04-29

- Report: [https://hackerone.com/reports/2453328](https://hackerone.com/reports/2453328)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2024-27983
- Submitted: 2024-04-08T20:41:07.954Z

## Report summary

Assertion failed in node::http2::Http2Session::~Http2Session() leads to HTTP/2 server crash (CVE-2024-27983) - (High)
An attacker can make the Node.js HTTP/2 server completely unavailable by sending a small amount of HTTP/2 frames packets with a few HTTP/2 frames inside. It is possible to leave some data in nghttp2 memory after reset when headers with HTTP/2 CONTINUATION frame are sent to the server and then a TCP connection is abruptly closed by the client triggering the Http2Session destructor while header frames are still being processed (and stored in memory) causing a race condition.

Impacts:

This vulnerability affects all users in all active release lines: 18.x, 20.x and, 21.x.

Thank you, to bart for reporting this vulnerability and Anna Henningsen for fixing it.

Full Security Advisory: https://nodejs.org/en/blog/vulnerability/april-2024-security-releases

## Timeline

- **Report Filed**
- **Report Triaged**
- **Cve Id Added**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
