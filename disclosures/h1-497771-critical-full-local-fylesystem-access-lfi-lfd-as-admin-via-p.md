---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/java
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2019-10-04
submitted: 2019-02-19T01:01:16.591Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/497771"
title: "[Critical] Full local fylesystem access (LFI/LFD) as admin via Path Traversal in the misconfigured Java servlet on the https://███/"
---
# [Critical] Full local fylesystem access (LFI/LFD) as admin via Path Traversal in the misconfigured Java servlet on the https://███/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-04

- Report: [https://hackerone.com/reports/497771](https://hackerone.com/reports/497771)
- CWE: Path Traversal
- Submitted: 2019-02-19T01:01:16.591Z

## Timeline

- **Report Filed**
- **2019-02-19** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-02-19** @sp1d3rs: The vulnerable servlet is seems to be `GwtCssServlet` (used to serve static css files), but I'm not 100% sure.

P.S. IP used for tests (for tracking purposes): `██████████`
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-07-11** @sp1d3rs: If this will pass disclosure procedure, please hide my IP address from the report:) just in case.
- **2019-07-11** @ag3nt-j1: So first thing you want us to do is send your IP out on twitter? :P 

Then disclose?
- **2019-07-11** @sp1d3rs: {F527051}
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
