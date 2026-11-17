---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/untrusted-search-path
  - env/web
  - stack/node
  - os/windows
substate: "resolved"
weakness: "Untrusted Search Path"
enriched: true
date: 2022-07-25
submitted: 2022-07-14T08:46:21.726Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "yakirka"
source: "https://hackerone.com/reports/1636566"
title: "Node.js - DLL Hijacking on Windows"
---
# Node.js - DLL Hijacking on Windows

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 17 | **Program:** Internet Bug Bounty | **Disclosed:** 2022-07-25

- Report: [https://hackerone.com/reports/1636566](https://hackerone.com/reports/1636566)
- CWE: Untrusted Search Path
- Submitted: 2022-07-14T08:46:21.726Z

## Report summary

DLL Hijacking on Windows (High)(CVE-2022-32223)
This vulnerability can be exploited if the victim has the following dependencies on Windows machine:

OpenSSL has been installed and “C:\Program Files\Common Files\SSL\openssl.cnf” exists.
Whenever the above conditions are present, node.exe will search for providers.dll in the current user directory. After that, node.exe will try to search for providers.dll by the DLL Search Order in Windows.

It is possible for an attacker to place the malicious file providers.dll under a variety of paths and exploit this vulnerability.

More details will be available at CVE-2022-32223 after publication.

Thank you to Yakir Kadkoda from Aqua Security for reporting this vulnerability.

Impacts:

All versions of the 16.x, and 14.x releases lines.

Full Security Advisory: https://nodejs.org/en/blog/vulnerability/july-2022-security-releases/

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2022-07-26** @yakirka: More information is available at: https://blog.aquasec.com/cve-2022-32223-dll-hijacking/
