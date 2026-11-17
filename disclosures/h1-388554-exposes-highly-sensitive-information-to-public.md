---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
date: 2020-05-11
submitted: 2018-07-30T17:57:24.019Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "cablej_dds"
source: "https://hackerone.com/reports/388554"
title: "████ █████ exposes highly sensitive information to public"
---
# ████ █████ exposes highly sensitive information to public

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-11

- Report: [https://hackerone.com/reports/388554](https://hackerone.com/reports/388554)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2018-07-30T17:57:24.019Z

## Timeline

- **Report Filed**
- **2018-07-30** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2018-07-30** @ag3nt-j1: @cablej_dds, do you have a link to one of the documents with an FOUO header on it?  I can keep poking but kind of hoping you might already have something.
- **2018-07-30** @ag3nt-z3: @cablej_dds @ag3nt-j1 I was able to enumerate one, we're good.
- **Report Severity Updated**
- **Report Triaged**
- **2018-07-30** @cablej_dds: @ag3nt-j1,

ITAR restricted: https://www.██████/api/document/17159

Image of technology used in foreign country: https://www.██████████/api/document/17437

Inmate call history / surveillance technology brief: https://www.████████/api/document/12119, https://www.██████████/api/document/12120
- **Report Informative**
- **2018-07-31** @cablej_dds: Hi @ag3nt-j7,

What is the reasoning for this not being in scope? It is a public ██████-operated website which should be in scope for the VDP. We will escalate ourselves with ████, but in the future it seems these should be handled by the VDP.

Thanks,
████
- **2018-07-31** @ag3nt-j7: @cablej_dds We are happy to take the discussion offline with additional details.  Additional RFIs should flow through our Director.  Talk to you soon.
- **Report Reopened**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-12-09** @agent-r5: We will put it in the queue for disclosure.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
