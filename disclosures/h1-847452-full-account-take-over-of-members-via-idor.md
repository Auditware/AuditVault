---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
date: 2020-05-14
submitted: 2020-04-11T16:43:50.478Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "r00tpgp"
source: "https://hackerone.com/reports/847452"
title: "Full Account Take-Over of ████████ Members via IDOR"
---
# Full Account Take-Over of ████████ Members via IDOR

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-14

- Report: [https://hackerone.com/reports/847452](https://hackerone.com/reports/847452)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2020-04-11T16:43:50.478Z

## Timeline

- **Report Filed**
- **2020-04-11** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2020-04-11** @r00tpgp: Video embedded for easy viewing:

███
- **Report Title Updated**
- **2020-04-12** @r00tpgp: Hi, I would also like you to also consider #847185 as as valid bug. One of the end-point mentioned in that report was used  to  identify the victims login id  used to exploit the account takeover bug. I self closed it earlier was because I wasn't sure if it was a vulnerability but now that I had discovered this bug I feel it is a bug in its own right and can be used to harvest personal information for further damage.  Cheers.
- **Report Triaged**
- **Report Severity Updated**
- **2020-04-13** @r00tpgp: @agent-l8 Thanks for the quick response. I'm glad to be able to assist, have a great day ahead of you!
- **2020-04-13** @agent-l8: Thanks @r00tpgp we will let you know if we need anything further and update you as we are able. Appreciate it!
- **Report Resolved**
- **Agreed On Going Public**
- **2020-04-22** @agent-l8: @r00tpgp we do minor redaction's and disclose high/crit reports but are in the process of changing a few things in how it is done. That said- you can request disclosure and it will be added to the queue to be pushed out once we are able.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
