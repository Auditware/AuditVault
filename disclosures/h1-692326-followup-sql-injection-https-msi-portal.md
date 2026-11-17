---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2020-05-14
submitted: 2019-09-11T14:11:58.088Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "arkaic"
source: "https://hackerone.com/reports/692326"
title: "Followup - SQL Injection - https://██████████/██████/MSI.portal"
---
# Followup - SQL Injection - https://██████████/██████/MSI.portal

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-14

- Report: [https://hackerone.com/reports/692326](https://hackerone.com/reports/692326)
- CWE: SQL Injection
- Submitted: 2019-09-11T14:11:58.088Z

## Timeline

- **Report Filed**
- **2019-09-11** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-09-11** @arkaic: Oops. The screenshot are in the wrong order for the text they are meant to illustrate.
- **Report Severity Updated**
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **2019-12-06** @arkaic: @agent-l8 I was able to spend some time on this, and the issue appears to be fixed. The vulnerable form POST is no longer present, and Akamai is effectively blocking other attempts at SQL injection. I feel that this can be closed. If closed, I would appreciate disclosure, redacted where necessary of course, of my finding.
- **2019-12-10** @agent-l8: Hey @arkaic , sounds good- that's why I was unable to reproduce. We are unable to close the report without a remediation notification from the system owner. Once that is done, you may request disclosure (though be aware it is taking us awhile right now as we are dealing with a process change). Thanks!
- **Report Resolved**
- **2019-12-20** @arkaic: Great! I'd still like to request disclosure for this issue.
- **2019-12-20** @agent-r5: We can add it to the queue. Just toggle the request for disclosure from your side so we can track it.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
