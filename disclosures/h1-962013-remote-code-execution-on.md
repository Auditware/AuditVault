---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2020-09-03
submitted: 2020-08-19T04:07:49.260Z
bounty_usd: null
votes: 19
cve: "CVE-2019-0192", "CVE-2019-0193"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "xy_"
source: "https://hackerone.com/reports/962013"
title: "Remote Code Execution on █████████"
---
# Remote Code Execution on █████████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 19 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-09-03

- Report: [https://hackerone.com/reports/962013](https://hackerone.com/reports/962013)
- CWE: Code Injection | CVE: CVE-2019-0192, CVE-2019-0193
- Submitted: 2020-08-19T04:07:49.260Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
An unauth solr lead to RCE on ██████████

**Description:**
Hello, I found a solr unauth at https://██████/solr/

This version is 5.5.1, vulnerable with CVE-2019-0192 and CVE-2019-0193, i have try CVE-2019-0193 and successful RCE.

## Impact
Attacker can get shell on server.

## Step-by-step Reproduction Instructions

1. First go to Core Admin and copy path.
██████
2. Update the config.
███████
3. Execute code.
██████████

## Product, Version, and Configuration (If applicable)
Apache Sole 5.5.1
## Suggested Mitigation/Remediation Actions
Update to the latest version and set auth.

## Impact

Attacker can get shell on server.

## Timeline

- **Report Filed**
- **2020-08-19** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2020-08-31** @xy_: Can we disclosure it?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
