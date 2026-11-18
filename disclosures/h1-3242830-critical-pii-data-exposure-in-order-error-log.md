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
date: 2026-01-12
submitted: 2025-07-09T13:50:23.790Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "xenion_"
source: "https://hackerone.com/reports/3242830"
title: "Critical PII Data Exposure in ORDER_ERROR_LOG"
---
# Critical PII Data Exposure in ORDER_ERROR_LOG

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/3242830](https://hackerone.com/reports/3242830)
- CWE: Cleartext Storage of Sensitive Information
- Submitted: 2025-07-09T13:50:23.790Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

A critical security vulnerability has been identified in the application's error logging system where the ORDER_ERROR_LOG file contains complete database insertion statements that expose Personally Identifiable Information (PII) of customers in plain text format.

#### Root Cause

The application's error handling mechanism is logging full SQL INSERT statements when database operations fail. These statements contain complete customer records including sensitive personal information that should never be stored in log files.

What Data is ExposedThe logs contain complete customer records including:
Full names
Email addresses
Phone numbers
Home addresses
Customer IDs
Transaction amounts
....

simple of data 
```
INSERT INTO dli.dli_customer_data VALUES (
                dli_customer_data_sequence.NEXTVAL,
                SYSDATE,
                ████████,
                ███,
                ██████████,
                ████,
                ██████,
                ██████,
                █████████,
                █████████,
                ███████,
                █████,
                ███,
                █████,
                ███,
                ████████,
                ████,
                ██████████,
                'Surface',
                '14.00',
                '15.4',
                '17.5')

```
███████
████

## Impact

Unintended Data Persistence: Customer PII persists in log files beyond intended retention periods
Expanded Attack Surface: Log files become high-value targets containing concentrated PII
Compliance Violations: Direct violation of data minimization principles required by privacy regulations
Audit Trail Contamination: Security logs contain sensitive data that complicates forensic analysis

## System Host(s)
dlielc.edu

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Access the ORDER_ERROR_LOG file   ███████
2. Review the contents for database INSERT statements.  `INSERT INTO dli.dli_customer_data VALUES (`
3. Observe exposed customer data
```
  INSERT INTO dli.dli_customer_data VALUES (
                dli_customer_data_sequence.NEXTVAL,
                SYSDATE,
                █████████,
                ██████,
                ███████,
                'FPO',
                'AP',
                ██████████,
                ████████,
                ███,
                ██████████,
                'FPO',
                'AP',
                ███████,
                ████████,
                █████,
                ██████,
                ██████,
                'Air',
                '480.00',
                ████████,
                '600')

```

## Suggested Mitigation/Remediation Actions
Implement data sanitization in error logging to prevent PII exposure.

## Timeline

- **Draft Started**
- **Report Filed**
- **2025-07-09** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
