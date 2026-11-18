---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/network
  - vuln/path-traversal
  - vuln/broken-access-control
  - vuln/privilege-escalation
  - vuln/misconfiguration
  - impact/internal-network
substate: "not-applicable"
weakness: "Path Traversal"
enriched: true
body: true
date: 2025-07-09
submitted: 2025-07-09T05:36:47.571Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/curl|curl]]"
reporter: "0xnul1byt3"
source: "https://hackerone.com/reports/3242087"
title: "Arbitrary File Read via file:// Protocol in cURL"
---
# Arbitrary File Read via file:// Protocol in cURL

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 31 | **Program:** curl | **Disclosed:** 2025-07-09

- Report: [https://hackerone.com/reports/3242087](https://hackerone.com/reports/3242087)
- CWE: Path Traversal
- Submitted: 2025-07-09T05:36:47.571Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

cURL’s file:// protocol handler is enabled by default, allowing access to local files on the system. This behavior enables an attacker with the ability to run cURL commands to read arbitrary files on the host by specifying file paths or using directory traversal techniques.

Steps to reproduce:

1. Build cURL with default configuration (e.g., ./configure --with-ssl and make).


2. Run ./src/curl "file:///etc/passwd" to read the contents of the passwd file.


3. Run ./src/curl "file:///tmp/../../etc/passwd" to demonstrate path traversal access to the same file.


4. Run ./src/curl -s "file:///etc/shadow" | head -c20 to read partial sensitive data from the shadow file.



This confirms that arbitrary local files can be accessed via the file:// protocol, which poses a critical security risk.

## Impact

An attacker who can run cURL commands on the system can read any local file that the user running cURL has permission to access, including highly sensitive files such as /etc/shadow. This can lead to:

Theft of password hashes and credentials.

Potential privilege escalation by cracking stolen hashes.

Full system compromise through lateral movement or further exploitation.

Exposure of confidential configuration or secret files.


Overall, this vulnerability compromises system confidentiality and can lead to complete takeover of the affected host.

## Timeline

- **Report Filed**
- **2025-07-09** @bagder: This is curl working as intended
- **2025-07-09** @jimfuller2024: Not a security issue
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
