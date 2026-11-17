---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2020-05-14
submitted: 2020-02-19T16:44:42.418Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "daehee"
source: "https://hackerone.com/reports/799898"
title: "Admin Login Credential Leak for DoD Gitlab EE instance"
---
# Admin Login Credential Leak for DoD Gitlab EE instance

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-14

- Report: [https://hackerone.com/reports/799898](https://hackerone.com/reports/799898)
- CWE: Information Disclosure
- Submitted: 2020-02-19T16:44:42.418Z

## Timeline

- **Report Filed**
- **2020-02-19** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2020-02-20** @daehee: Thanks. I just checked, and confirming that the Github commit, where credential has been leaked, is now private/deleted and cannot be viewed.
- **Report Resolved**
- **2020-02-21** @agent-l8: Also, thanks for following up for us @daehee!
- **Agreed On Going Public**
- **2020-02-24** @agent-r5: We will add it to the queue. Just as a note may be awhile.
- **2020-02-24** @daehee: Ok!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
