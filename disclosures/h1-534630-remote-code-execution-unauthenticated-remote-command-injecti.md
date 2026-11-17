---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/os-command-injection
  - env/web
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2020-05-11
submitted: 2019-04-10T19:54:33.580Z
bounty_usd: null
votes: 13
cve: "CVE-2019-0604"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "l00ph0le"
source: "https://hackerone.com/reports/534630"
title: "Remote Code Execution - Unauthenticated Remote Command Injection (via Microsoft SharePoint CVE-2019-0604)"
---
# Remote Code Execution - Unauthenticated Remote Command Injection (via Microsoft SharePoint CVE-2019-0604)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-11

- Report: [https://hackerone.com/reports/534630](https://hackerone.com/reports/534630)
- CWE: OS Command Injection | CVE: CVE-2019-0604
- Submitted: 2019-04-10T19:54:33.580Z

## Timeline

- **Report Filed**
- **2019-04-10** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **2019-04-25** @l00ph0le: @ag3nt-z3 Also to follow-up.

In the other bug bounty programs they have talked about restricting access to the /_layouts/15/picker.aspx file as a mitigation until they can figure out what is going on with the Microsoft update. This might be something the asset owner will want to consider.
- **2019-05-13** @ag3nt-z3: @l00ph0le Could you test again? The system owner has applied a new fix.
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-12-04** @agent-r5: We will put it in the queue for disclosure.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
