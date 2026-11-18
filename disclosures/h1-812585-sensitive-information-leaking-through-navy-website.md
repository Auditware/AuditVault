---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cleartext-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Cleartext Storage of Sensitive Information"
enriched: true
body: true
date: 2020-05-14
submitted: 2020-03-07T03:32:51.234Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "rootuser"
source: "https://hackerone.com/reports/812585"
title: "Sensitive Information Leaking Through Navy Website. [█████]"
---
# Sensitive Information Leaking Through Navy Website. [█████]

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-14

- Report: [https://hackerone.com/reports/812585](https://hackerone.com/reports/812585)
- CWE: Cleartext Storage of Sensitive Information
- Submitted: 2020-03-07T03:32:51.234Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
 While performing recon work on websites owned by DoD i came up with a Navy website which is leaking sensitive information.

**Description:**
The website is leaking information such as- first name and last name, email address, phone number, location, rank, and other information of trainees in a clear readable pdf document. This is a high severity issue and requires immediate fixation. It is also a clear privacy violation and insufficient protection mechanism involved in data storage.
 
## Step-by-step Reproduction Instructions

1. Open a web browser of your choice.
2. Now open this URL: https://███████/sites/██████/Documents/health-promotion-wellness/reproductive-and-sexual-health/██████████

## Suggested Mitigation/Remediation Actions
Remove document from the internet or put applicable authorization mechanism(s) in order to access sensitive documents.

## Impact

Any person can access this document and cause:
1. Information leakage.
2. Impersonation a person.
3. Commit crimes under a fake identity.

## Timeline

- **Report Filed**
- **2020-03-07** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Severity Updated**
- **2020-03-12** @agent-r5: To answer question from other report, still waiting on system owner response.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
