---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-request-smuggling
  - env/web
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
date: 2023-12-22
submitted: 2023-12-11T03:45:40.874Z
bounty_usd: 4660
votes: 93
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "aimotonorihito"
source: "https://hackerone.com/reports/2280391"
title: "Possibility of Request smuggling attack"
---
# Possibility of Request smuggling attack

> **Severity:** High | **Bounty:** 4,660 USD | **Votes:** 93 | **Program:** Internet Bug Bounty | **Disclosed:** 2023-12-22

- Report: [https://hackerone.com/reports/2280391](https://hackerone.com/reports/2280391)
- CWE: HTTP Request Smuggling
- Submitted: 2023-12-11T03:45:40.874Z

## Report summary

CVE-2023-46589 Apache Tomcat - Request Smuggling
Severity: Important

Description:
Tomcat did not correctly parse HTTP trailer headers. A specially crafted
trailer header that exceeded the header size limit could cause Tomcat to
treat a single request as multiple requests leading to the possibility
of request smuggling when behind a reverse proxy.

Credit:
This vulnerability was reported responsibly to the Tomcat security team
by Norihito Aimoto (OSSTech Corporation).

Full Security Advisory: https://lists.apache.org/thread/0rqq6ktozqc42ro8hhxdmmdjm1k1tpxr

## Timeline

- **Draft Started**
- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
