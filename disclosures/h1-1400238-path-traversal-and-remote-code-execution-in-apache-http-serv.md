---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/web
  - stack/apache
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2021-11-19
submitted: 2021-11-14T23:54:06.729Z
bounty_usd: 1000
votes: 29
cve: "CVE-2021-41773", "CVE-2021-42013"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "fms"
source: "https://hackerone.com/reports/1400238"
title: "Path Traversal and Remote Code Execution in Apache HTTP Server 2.4.49 and 2.4.50 (incomplete fix of CVE-2021-41773) (CVE-2021-42013)"
---
# Path Traversal and Remote Code Execution in Apache HTTP Server 2.4.49 and 2.4.50 (incomplete fix of CVE-2021-41773) (CVE-2021-42013)

> **Severity:** Critical | **Bounty:** 1,000 USD | **Votes:** 29 | **Program:** Internet Bug Bounty | **Disclosed:** 2021-11-19

- Report: [https://hackerone.com/reports/1400238](https://hackerone.com/reports/1400238)
- CWE: Path Traversal | CVE: CVE-2021-41773, CVE-2021-42013
- Submitted: 2021-11-14T23:54:06.729Z

## Report summary

It was found that the fix for CVE-2021-41773 in Apache HTTP Server 2.4.50 was insufficient. An attacker could use a path traversal attack to map URLs to files outside the directories configured by Alias-like directives.

If files outside of these directories are not protected by the usual default configuration "require all denied", these requests can succeed. If CGI scripts are also enabled for these aliased pathes, this could allow for remote code execution.

This issue only affects Apache 2.4.49 and Apache 2.4.50 and not earlier versions.

Acknowledgements:

Reported by Juan Escobar from Dreamlab Technologies
Reported by Fernando Muñoz from NULL Life CTF Team
Reported by Shungo Kumasaka
Reported by Nattapon Jongcharoen

Reported to security team: 2021-10-06
fixed by r1893977, r1893980, r1893982 in 2.4.x: 2021-10-07
Update 2.4.51 released: 2021-10-07
Affects: 2.4.50, 2.4.49

https://httpd.apache.org/security/vulnerabilities_24.html

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
