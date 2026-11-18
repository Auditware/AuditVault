---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2019-10-08
submitted: 2018-06-29T19:49:16.494Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "alyssa_herrera"
source: "https://hackerone.com/reports/374007"
title: "PII leakage due to caching of Order/Contract ID's on █████████"
---
# PII leakage due to caching of Order/Contract ID's on █████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/374007](https://hackerone.com/reports/374007)
- CWE: Information Disclosure
- Submitted: 2018-06-29T19:49:16.494Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
I was able to discover contract numbers which leak out user names/emails/phone numbers nd other sensitive information. I took the time to assure that these contract id's wouldn't/shouldn't be easy guessable or known.
**Description:**
I discovered through google search query that I was able to access several Order/contract id's that revealed a trove of sensitive data that shouldn't of been easily accessible or cached by google search results.
## Impact
High
## Step-by-step Reproduction Instructions
https://███/CMT_View/CMT_View_List.cfm?StartRow=31&OrderBy=Email&OrderByCol=4&Sort=DESC&SearchType=CONTRACT&ContractNumber=███&Cage=

https://██████████/CMT_View/CMT_View_List.cfm?OrderBy=FormatedRoleCode&OrderByCol=2&StartRow=1&Sort=ASC&SearchType=CONTRACT&ContractNumber=██████&Cage=

███████, ██████ D.	ACO	1102	██████████.█████@█████████	█████████
████, ████ J.	CA	1102	███████.███@█████	█████
████, ███ M.	DRPM	0801	████.████████@██████	██████
██████,███████ R.	IS	1150	████.█████@████	██████
████, ███████ R.	PA	1103	████.████@█████████	████████
███████, ██████████ S.	PT	1106	████.████████@███	██████
████████, ███ E.	QAR	1910	██████████.████████@████████	█████████
██████████, ████ M.	SUP	0344	█████.█████@█████	██████
████████,███ R.	SUP	1150	██████████.███@███████	████
█████, ██████ D.	SUP	1150	██████.████@█████████	█████████

Additionally verified that these aren't test data entries by googling one of the emails and resulting found the owner's linkedin account.
## Product, Version, and Configuration (If applicable)
N/A
## Suggested Mitigation/Remediation Actions

## Impact

An attacker can gather high priority PII.

## Timeline

- **Report Filed**
- **2018-06-29** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2018-06-29** @alyssa_herrera: I found several instances of this and estimate around 155 emails/names/phone numbers along with positions were found.
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
