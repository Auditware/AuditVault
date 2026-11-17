---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/security-through-obscurity
  - env/web
substate: "resolved"
weakness: "Security Through Obscurity"
enriched: true
date: 2022-09-06
submitted: 2022-01-22T10:31:04.873Z
bounty_usd: null
votes: 33
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "martinvw"
source: "https://hackerone.com/reports/1457928"
title: "Subdomain takeover of █████████"
---
# Subdomain takeover of █████████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 33 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-09-06

- Report: [https://hackerone.com/reports/1457928](https://hackerone.com/reports/1457928)
- CWE: Security Through Obscurity
- Submitted: 2022-01-22T10:31:04.873Z

## Report summary

A subdomain of ███████ was vulnerable to a subdomain takeover because it pointed to an unclaimed domain.

## Timeline

- **Report Filed**
- **2022-01-22** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2022-03-02** @agent-j5: Can you please release the domain so the system owners can claim ownership.
- **2022-03-02** @martinvw: Personally I would expect them to remove the CNAMES to resolve this issue

I did already cancelled the domain, but it will take the rest of the year before it expires :-)

But you can have the transfer code, to take over the domain: ████

So to clarify further, I registered the domain `█████` which had a CNAME pointing to and was still available. So it is not a service takeover like at azure/aws/github/fastly.
- **2022-04-21** @martinvw: Anything I can do to help resolve this issue?
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
