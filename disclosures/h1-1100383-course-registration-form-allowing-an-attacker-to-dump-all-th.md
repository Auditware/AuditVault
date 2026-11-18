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
date: 2024-08-16
submitted: 2021-02-10T21:40:09.137Z
bounty_usd: null
votes: 36
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "abhinavawasthi_1"
source: "https://hackerone.com/reports/1100383"
title: "Course Registration Form Allowing an attacker to dump all the candidate name who had enrolled for the course"
---
# Course Registration Form Allowing an attacker to dump all the candidate name who had enrolled for the course

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 36 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-08-16

- Report: [https://hackerone.com/reports/1100383](https://hackerone.com/reports/1100383)
- CWE: Information Disclosure
- Submitted: 2021-02-10T21:40:09.137Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 

The given application has a form to fill in the details of the candidates in order to seek admission to various courses. The application has the functionality to submit the given form and provide a registration confirmation to the candidate with their name on the page. By cycling the parameter we can enumerate all the applicant's names who had applied for the specific courses.

**Description:**
We can cycle the numeric value after the registration process and enumerate all the candidate names.

## Impact
The attacker might carry out targeted attacks against the given organization by exfiltrating details from the candidates. The attacker can also find the candidates easily on social media sites to carry out further attacks.

## Step-by-step Reproduction Instructions

1. Fill in the form in order to apply/register for the courses online  https://www2.█████████/asops/CESET/DotNet/(S(zxfdh3222tuxim4qkyddqkc4))/Register.aspx?s=1&c=SOC-E
2. After the form is filled, the confirmation messaged is displayed in a URL as https://www2.████████/asops/CESET/DotNet/(S(y4xw2rqkzk1zzzej0mu2atng))/RegistrationConfirmation.aspx?stu=490504
3. The attacker can cycle the stu value from the beginning and enumerate thousand of candidates enrolled for the courses. 
4. Here we have automated the attack in order to get user details in a short period of time. Please refer to the screenshot below having the results.


## Suggested Mitigation/Remediation Actions
The application shall generate hashed values instead of numeric values so that the attacker cannot guess the user details.

## Impact

The attacker might carry out targeted attacks against the given organization by exfiltrating details from the candidates. The attacker can also find the candidates easily on social media sites to carry out further attacks.

## System Host(s)
www2.██████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Fill in the form in order to apply/register for the courses online  https://www2.███████/asops/CESET/DotNet/(S(zxfdh3222tuxim4qkyddqkc4))/Register.aspx?s=1&c=SOC-E
2. After the form is filled, the confirmation messaged is displayed in a URL as https://www2.██████/asops/CESET/DotNet/(S(y4xw2rqkzk1zzzej0mu2atng))/RegistrationConfirmation.aspx?stu=490504
3. The attacker can cycle the stu value from the beginning and enumerate thousand of candidates enrolled for the courses. 
4. Here we have automated the attack in order to get user details in a short period of time. Please refer to the screenshot below having the results.

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2021-02-10** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2021-02-10** @abhinavawasthi_1: Amazing response rate. Thank you.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
