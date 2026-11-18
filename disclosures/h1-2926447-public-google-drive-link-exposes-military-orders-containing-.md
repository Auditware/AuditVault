---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2025-01-24
submitted: 2025-01-07T22:44:07.557Z
bounty_usd: null
votes: 99
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "theubermensch"
source: "https://hackerone.com/reports/2926447"
title: "Public google drive link Exposes Military Orders Containing PII (Name, SSN etc..) and Operational Details"
---
# Public google drive link Exposes Military Orders Containing PII (Name, SSN etc..) and Operational Details

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 99 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2025-01-24

- Report: [https://hackerone.com/reports/2926447](https://hackerone.com/reports/2926447)
- CWE: Information Disclosure
- Submitted: 2025-01-07T22:44:07.557Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
I found google drive link `https://drive.google.com/drive/folders/█████████`  at `https://████████.aspx?Mode=ReadOnly&Id=90dd0d3b-0ed1-e76b-128f-11ebc799ba55` contains pdfs at '/████ Internal/Orders' that discloses the following PII:

Full Name: ███████
Social Security Number (SSN): ███████
Home Address: ████, ██████
Marital Status: Married, 3 dependents (M03 in January 2021 orders; S00 in earlier orders)
Security Clearance Level: ███

## How to reproduce 

1. Navigate to `https://██████.aspx?Mode=ReadOnly&Id=90dd0d3b-0ed1-e76b-128f-11ebc799ba55`.
2. Below the page you will find `https://drive.google.com/drive/folders/█████████`.
3. Go to `https://drive.google.com/drive/folders/███████`.
4. Open folder named `███████ Internal`.
5.Navigate to folder named `Orders`.
6. You will find the pdfs that discloses PII data as shown below in screen shots.

██████████

██████

## Impact

1. Privacy Violation: Exposes PII of personnel, violating privacy laws such as the U.S. Privacy Act of 1974.
2. Identity Theft and Fraud: Information like SSNs and home addresses can be used for malicious purposes.

## System Host(s)
██████

## Affected Product(s) and Version(s)
https://█████████.aspx?Mode=ReadOnly&Id=90dd0d3b-0ed1-e76b-128f-11ebc799ba55

## CVE Numbers


## Steps to Reproduce
1. Navigate to `https://██████.aspx?Mode=ReadOnly&Id=90dd0d3b-0ed1-e76b-128f-11ebc799ba55`.
2. Below the page you will find `https://drive.google.com/drive/folders/█████`.
3. Go to `https://drive.google.com/drive/folders/███`.
4. Open folder named `███ Internal`.
5.Navigate to folder named `Orders`.
6. You will find the pdfs that discloses PII data as shown below in screen shots.

█████

██████

## Suggested Mitigation/Remediation Actions
Remove the folder or make it private at least

## Timeline

- **Report Filed**
- **2025-01-07** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Vulnerability Information Updated**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2025-01-08** @theubermensch: Thanks for the triage
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
