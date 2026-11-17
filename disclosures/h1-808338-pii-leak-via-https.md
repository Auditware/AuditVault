---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
date: 2020-05-11
submitted: 2020-03-02T06:06:48.435Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "z32"
source: "https://hackerone.com/reports/808338"
title: "PII Leak via https://████████"
---
# PII Leak via https://████████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 9 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-11

- Report: [https://hackerone.com/reports/808338](https://hackerone.com/reports/808338)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2020-03-02T06:06:48.435Z

## Timeline

- **Report Filed**
- **2020-03-02** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2020-03-02** @z32: Additionally, an adversary conveniently has access to export this data as a pdf, csv, or xls file which makes for easy exfil of this data:
███████

With all things considered, I believe this is a critical on the CVSS scale.
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **2020-03-13** @z32: Hey @agent-l8 @agent-r5,

Is there any way you could provide me with the number of users this effected? Or a point of contact I can reach out to from my ██████ address  if the system owner would prefer to send the number over those channels. If they would rather not disclose that information, it is no big deal. 

Thank you in advance!
- **2020-03-16** @agent-r5: So send this to████ so we can respond with our ███████s (hackerone does not need to be in the loop). In the past we have put together █████████.
- **2020-03-16** @z32: Will do, thanks @agent-r5
- **2020-03-16** @agent-r5: So you have a picture (back when i triage this) for looks like salted passwords for █████████.
- **Agreed On Going Public**
- **2020-05-11** @agent-r5: We will add it to the disclosure queue. ██████
- **2020-05-11** @ag3nt-j1: Hey @un4gi, we fully redact any identity info on sites reported and would rather do full disclosure rather than summary.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
