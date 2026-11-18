---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insufficiently-protected-credentials
  - env/web
substate: "resolved"
weakness: "Insufficiently Protected Credentials"
enriched: true
body: true
date: 2020-05-11
submitted: 2020-02-27T15:26:02.190Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "rootuser"
source: "https://hackerone.com/reports/806213"
title: "Sensitive Information Leaking Through DoD Owned Website. [██████████]"
---
# Sensitive Information Leaking Through DoD Owned Website. [██████████]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-11

- Report: [https://hackerone.com/reports/806213](https://hackerone.com/reports/806213)
- CWE: Insufficiently Protected Credentials
- Submitted: 2020-02-27T15:26:02.190Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary**
While performing recon work on websites owned by DoD i came up with ██████████ website which is leaking sensitive information.

**Description**
The above website is leaking information such as- first name and last name, email address, phone number, house address and organization name of attendees in a clear readable pdf document. This is a high severity issue and requires immediate fixation. It is also a clear privacy violation and insufficient protection mechanism involved in data storage. I look forward for a satisfactory reply from your side.

**Step-by-step Reproduction Instructions**
1. Open a web browser of your choice.
2.  Now open this URL: https://██████/12038/MyDoD/ngb-sfpd-roster.pdf

**Suggested Mitigation/Remediation Actions**
Remove document from the internet or put applicable authorization mechanism(s) in order to access sensitive documents.

## Impact

1. Any person can access this document and cause information leakage, target specific person for crime.
2. Anyone can threaten ██████ employees to reveal secrets which aren't meant to be public by nature.

## Timeline

- **Report Filed**
- **2020-02-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2020-02-29** @rootuser: @agent-r5 Greetings, 
I think the file have been removed as i can see 400 error code (Page not found) when trying to access the above link.
- **2020-03-02** @agent-r5: That was fast for our system owners. We won't close this report until system owner tells us they fixed it.
- **Report Resolved**
- **2020-03-03** @rootuser: @agent-r5 Greetings of the day, 
I am glad that DoD resolved my report so fast. It was nice working with DoD. Hope to find more vulnerabilities in near future. May i know when can i expect report disclosure? 
Thanks again🙂
- **2020-03-03** @agent-r5: Go ahead and toggle the request for disclosure on your side so we can add it to the queue.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
