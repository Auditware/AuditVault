---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cleartext-storage-of-sensitive-information
  - env/web
  - vuln/info-disclosure
  - impact/sensitive-data
substate: "resolved"
weakness: "Cleartext Storage of Sensitive Information"
enriched: true
body: true
date: 2020-06-25
submitted: 2020-05-18T23:11:21.209Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "pvm"
source: "https://hackerone.com/reports/877598"
title: "PII/PHI data available on web https://████████Portals/22/Documents/Meetings"
---
# PII/PHI data available on web https://████████Portals/22/Documents/Meetings

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-06-25

- Report: [https://hackerone.com/reports/877598](https://hackerone.com/reports/877598)
- CWE: Cleartext Storage of Sensitive Information
- Submitted: 2020-05-18T23:11:21.209Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
https://███Portals/22/Documents/Meetings contains many internal documents which likely were reviewed on meeting/meetings preparations which should not be available for public but searchable via google/bing.  Documents include: resumes, bio data form, emails (including history of medical conditions), mails, letters. 
PII/PHI exposed: name, emails, phones, medical history/condition.

**Description:**
https://███████Portals/22/Documents/Meetings contains many internal documents which likely were reviewed on meeting/meetings preparations which should not be available for public but searchable via google/bing.  Documents include: resumes, bio data form, emails (including history of medical conditions), mails. 
PII exposed: name, emails, phones, medical history/condition.
Here you can see some examples:
- Detailed resume: https://█████████Portals/22/Documents/Meetings/m14/█████████.pdf
- long email thread including official letters (name, email, medical conditions, phone): https://█████Portals/22/Documents/Meetings/m18/████████.pdf
- Internal emails (names, emails, phones): https://██████████Portals/22/Documents/Meetings/m11/██████████.pdf
- email (name, email, medical conditions, phone): https://██████████Portals/22/Documents/Meetings/m11/█████████.pdf
- email (name, email, medical conditions, phone): https://█████████Portals/22/Documents/Meetings/m19/██████████.pdf
- an attorney email (name, email, medical conditions): https://████████Portals/22/Documents/Meetings/m13/█████████.pdf
- letter (name, medical condition): https://█████████Portals/22/Documents/Meetings/m17/████.pdf
- email/letter with medical condition: https://████████Portals/22/Documents/Meetings/m18/██████████.pdf
- statement: https://████████Portals/22/Documents/Meetings/m19/█████.pdf 
- memorandum: https://███████Portals/22/Documents/Meetings/m11/██████████.pdf
- biographic data form: https://██████████Portals/22/Documents/Meetings/m18/██████████.pdf
- biographic data form: https://█████████Portals/22/Documents/Meetings/m19/███████.pdf

Also here I've found many biographies of medical officers  with different level of details. Some of them are very detailed.

## Impact
High or Critical. 
Because of PII/PHI exposed: name, emails, phones, medical history/condition. 

## Step-by-step Reproduction Instructions

- Perform a search on Bing: site: ███ AND "https://██████████Portals/22/Documents/Meetings/" 
- OR navigate to the provided links:
  - Detailed resume: https://███████Portals/22/Documents/Meetings/m14/█████.pdf
  - long email thread including official letters (name, email, medical conditions, phone): https://███Portals/22/Documents/Meetings/m18/█████.pdf
  - Internal emails (names, emails, phones): https://███████Portals/22/Documents/Meetings/m11/██████.pdf
  - email (name, email, medical conditions, phone): https://████Portals/22/Documents/Meetings/m11/███████.pdf
  - email (name, email, medical conditions, phone): https://█████████Portals/22/Documents/Meetings/m19/███.pdf
  - an attorney email (name, email, medical conditions): https://██████Portals/22/Documents/Meetings/m13/███████.pdf
  - letter (name, medical condition): https://██████Portals/22/Documents/Meetings/m17/████.pdf
  - email/letter with medical condition: https://█████████Portals/22/Documents/Meetings/m18/███.pdf
  - statement: https://████████Portals/22/Documents/Meetings/m19/██████████.pdf 
  - memorandum: https://█████████Portals/22/Documents/Meetings/m11/██████.pdf
  - biographic data form: https://██████Portals/22/Documents/Meetings/m18/██████.pdf
  - biographic data form: https://███████Portals/22/Documents/Meetings/m19/█████████.pdf
## Product, Version, and Configuration (If applicable)
N/A
## Suggested Mitigation/Remediation Actions
Remove thee files or restrict access to them. Other files in the folders should be evaluated.

## Impact

High or Critical. 
Because of PII/PHI exposed: name, emails, phones, medical history/condition.

## Timeline

- **Report Filed**
- **2020-05-18** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Reopened**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
