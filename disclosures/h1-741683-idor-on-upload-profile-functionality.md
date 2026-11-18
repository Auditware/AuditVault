---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/idor
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2020-05-14
submitted: 2019-11-20T08:50:00.444Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "risinghunter"
source: "https://hackerone.com/reports/741683"
title: "idor on upload profile functionality "
---
# idor on upload profile functionality 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-14

- Report: [https://hackerone.com/reports/741683](https://hackerone.com/reports/741683)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2019-11-20T08:50:00.444Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Vulnerable URL: https://██████████/███████ID/#Common/EditOne/Person/{account_id}
steps to reproduce:
1).browse the image and click on the upload button
2).capture this request in burp suite 
3). change the value 'personId' parameter to account2 account_id 
(please see screenshot1)
4).then goes to account2, then you will see the uploaded image is successfully goes to the approved tab 

please see video attach below you will understand completely

## Impact

an attacker is able to change profile image of any user

## Timeline

- **Report Filed**
- **2019-11-20** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-11-20** @risinghunter: after some time image gets successfully change of another account (please see screenshot)
- **Report Severity Updated**
- **Report Triaged**
- **2019-12-06** @risinghunter: any update
- **2019-12-06** @agent-0g: @risinghunter Not at this time
- **Report Needs More Info**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-01-27** @agent-l8: @risinghunter we are currently in a process change for how/what we disclose. Once the process change has occurred we will go through and disclose all requested reports after redaction, based on severity. Thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
