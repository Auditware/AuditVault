---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-generic
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2020-09-03
submitted: 2020-07-08T14:05:14.708Z
bounty_usd: null
votes: 22
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "pdbx"
source: "https://hackerone.com/reports/918946"
title: "Subdomain takeover due to an unclaimed Amazon S3 bucket on ███"
---
# Subdomain takeover due to an unclaimed Amazon S3 bucket on ███

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 22 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-09-03

- Report: [https://hackerone.com/reports/918946](https://hackerone.com/reports/918946)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2020-07-08T14:05:14.708Z

## Timeline

- **Report Filed**
- **2020-07-08** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2020-07-08** @agent-l8: '
- **Report Triaged**
- **2020-07-08** @pdbx: Hello, good to hear that it is in scope. 
I am attaching the `index.html` file and the `xss_poc_998877665544332211.html` file. 
I wrote the takeover message as an HTML comment to be discrete. You can view the page source through the following link:
`view-source:http://█████████/index.html`

The `begin.png` is an image of the subdomain when I discovered it. Since I took it over, it looks now according to my uploaded `index.html` file. 

I hope I could clarify the concerns.
- **Report Severity Updated**
- **2020-07-27** @agent-l8: @chron0x can you go ahead and release the domain? thanks!
- **2020-07-28** @pdbx: @agent-l8 Domain is released.
- **Report Resolved**
- **Agreed On Going Public**
- **2020-08-24** @agent-l8: added to queue for review
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
