---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2021-11-29
submitted: 2021-11-08T21:24:16.560Z
bounty_usd: null
votes: 47
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "palaziv"
source: "https://hackerone.com/reports/1394910"
title: "Unauthenticated Access to Admin Panel Functions at https://██████████/████████"
---
# Unauthenticated Access to Admin Panel Functions at https://██████████/████████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 47 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-11-29

- Report: [https://hackerone.com/reports/1394910](https://hackerone.com/reports/1394910)
- CWE: Improper Access Control - Generic
- Submitted: 2021-11-08T21:24:16.560Z

## Timeline

- **Report Filed**
- **2021-11-08** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2021-11-08** @agent-l8: @palaziv, Great find!
- **2021-11-10** @palaziv: @agent-l8 Thanks :)

I noticed that files being uploaded through https://██████/████p/██████████/███████████████████ can be downloaded again on https://████████.████████.██████/███p/█████████/█████████.php (click on the "█████████ ██████████" link on that page (https://█████.███████.██████/█████p/████████/███?file=█████p%2F███████SiteContent%2F█████████████.zip)). This may be abused to attack users of latter page. Just wanted to let you know.
- **Report Resolved**
- **Agreed On Going Public**
- **2021-11-24** @agent-l8: Both of these are in the queue- likely for next week. Because of how redactions work, we have to go line by line for anything involving the system host or owner- so these will take a bit. Just wanted to update you. Thank you!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
