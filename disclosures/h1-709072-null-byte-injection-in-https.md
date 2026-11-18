---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-null-termination
  - env/web
substate: "resolved"
weakness: "Improper Null Termination"
enriched: true
body: true
date: 2020-05-14
submitted: 2019-10-07T15:36:44.075Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "mohammedadam24"
source: "https://hackerone.com/reports/709072"
title: "Null byte Injection in https://████/"
---
# Null byte Injection in https://████/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-14

- Report: [https://hackerone.com/reports/709072](https://hackerone.com/reports/709072)
- CWE: Improper Null Termination
- Submitted: 2019-10-07T15:36:44.075Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Description:
Microsoft .NET Framework is prone to multiple NULL-byte injection vulnerabilities because it fails to adequately sanitize user-supplied data.

#Vulnerable URL: https://████/%2F%20This%20website%20is%20vulnerable%20to%20NULL%20BYTE%20INJECTION/

#Steps to Reproduce:
1) An attacker can exploit this issue via a browser.

The following example URI request is available:
https://███████/%2F%20This%20website%20is%20vulnerable%20to%20NULL%20BYTE%20INJECTION%00

#Mitigation: https://www.securityfocus.com/bid/24791/solution

#See Also: https://www.exploit-db.com/exploits/30281

#Proof of Concept: Screenshots attached.

## Impact

An attacker can exploit these issues to access sensitive information that may aid in further attacks; other attacks are also possible.

## Timeline

- **Report Filed**
- **2019-10-07** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2020-02-12** @agent-r5: We will add it to the queue.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
