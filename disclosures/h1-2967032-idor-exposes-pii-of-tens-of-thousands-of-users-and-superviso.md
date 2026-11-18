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
body: true
date: 2026-01-12
submitted: 2025-01-30T16:28:18.711Z
bounty_usd: null
votes: 23
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "tacnull"
source: "https://hackerone.com/reports/2967032"
title: "IDOR Exposes PII of Tens of Thousands of Users and Supervisors"
---
# IDOR Exposes PII of Tens of Thousands of Users and Supervisors

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 23 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/2967032](https://hackerone.com/reports/2967032)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2025-01-30T16:28:18.711Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
While using the system as intended (submitting a SAAR), I noticed there is an insure direct object Reference vulnerability in the application. Users can modify the URL parameter `saarnId` to view and possibly edit other user's SAARs.
**CAC Required**

## References
https://cwe.mitre.org/data/definitions/639.html
https://cwe.mitre.org/data/definitions/284.html

## Impact

This vulnerability leaks the following information on tens of thousands of users:
* Address
* Full Name
* Email
* Phone Number
* DoB
* Supervisor
* DODID Number
* Controlled Unclassified Information
* Clearance Level
* User ID

## System Host(s)
███████

## Affected Product(s) and Version(s)
N/A

## CVE Numbers


## Steps to Reproduce
1. Navigate to the following endpoint: █████
2. Change the parameter value: saarnid to a lower number. 
3. View the information associated with the SAAR another user's SAAR.

## Suggested Mitigation/Remediation Actions
You can prevent Insecure Direct Object References (IDOR) by using secure identifiers (e.g., UUIDs) and verifying permissions.

## Timeline

- **Report Filed**
- **2025-01-30** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2025-01-30** @tacnull: Great! Sounds good. Glad to help if they have any questions. 
Curious though, is the CVSS score/severity automatically set? If verified, I'd suggest a higher score. 
Respectfully,
- **2025-01-30** @terminalnode: @turbul3nce 

Thanks for your concerns and reply. The score is not something that is automatically set, but based on the severity and that some of that information is not considered PII since it falls under the rolodex exception (these elements encompass the full name, DoD ID, DoD benefits number, pay grade or rank, office phone number, office address, and office email address). I do see, however, the EDIPI/user id is visible for some of these and have adjusted it accordingly.

Regards,
The VDP Team
- **Report Severity Updated**
- **2025-01-31** @tacnull: Thank you for your prompt response. And correct. I didn't mention in the report, but yes. Once you navigate to another object, if you click through the tabs up top (user, supervisor, review, etc), a lot more information can be obtained. As you said, EDIPNIDs, userIDs, emails, addresses, numbers, signed documents pertaining to each request, which may contain socials (depending on the type of request), etc for around 37k users.
- **Report Resolved**
- **Agreed On Going Public**
- **2025-08-19** @tacnull: Any word on this one?
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
