---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/network
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2020-10-16
submitted: 2020-07-27T11:47:22.360Z
bounty_usd: null
votes: 4
cve: "CVE-2020-3452"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "arm4nd0"
source: "https://hackerone.com/reports/943717"
title: "[██████████.mil] Cisco VPN Service Path Traversal"
---
# [██████████.mil] Cisco VPN Service Path Traversal

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-10-16

- Report: [https://hackerone.com/reports/943717](https://hackerone.com/reports/943717)
- CWE: Path Traversal | CVE: CVE-2020-3452
- Submitted: 2020-07-27T11:47:22.360Z

## Report summary

The target server was using Cisco VPN Service, which was vulnerable to CVE-2020-3452 allowing an unauthenticated, remote attacker to conduct directory traversal attacks and read sensitive files within the web services file system.

## Timeline

- **Report Filed**
- **2020-07-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-10-07** @agent-l8: added to queue- we can add this as a summary at the top of the report, but the only thing limited will be our redactions. If you do not wish to proceed, please cancel the disclosure request. Thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
