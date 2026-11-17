---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
date: 2021-02-18
submitted: 2020-05-03T17:56:05.173Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "z32"
source: "https://hackerone.com/reports/865354"
title: "Arbitrary file upload and stored XSS via ███ support request"
---
# Arbitrary file upload and stored XSS via ███ support request

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-02-18

- Report: [https://hackerone.com/reports/865354](https://hackerone.com/reports/865354)
- CWE: Violation of Secure Design Principles
- Submitted: 2020-05-03T17:56:05.173Z

## Timeline

- **Report Filed**
- **2020-05-03** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2020-05-03** @z32: Just an update, it appears this also effects the other form submissions as well:

### ████████ IT Request
███████

### ██████████ CIS Support
██████

### Office 365 Support
██████████

### Surface HUB Support
██████████

I assume this will effect all of the forms in the other categories within the service catalog as well, but do not want to continue to generate requests.
- **2020-05-04** @z32: It looks like I got some hits on my weblog from this as well, not sure if this was a blind stored XSS firing from one of the form fields or if it was rendered as a hyperlink and someone clicked it. One of the hits look like it was from slackbot..
█████
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
