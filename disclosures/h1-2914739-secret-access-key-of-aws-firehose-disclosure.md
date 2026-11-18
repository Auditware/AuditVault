---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2026-01-12
submitted: 2024-12-26T15:35:04.517Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "1nsomnia1102"
source: "https://hackerone.com/reports/2914739"
title: "Secret Access Key of AWS Firehose Disclosure"
---
# Secret Access Key of AWS Firehose Disclosure

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/2914739](https://hackerone.com/reports/2914739)
- CWE: Information Disclosure
- Submitted: 2024-12-26T15:35:04.517Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The `███████ domain` has the `/error_docs/uat.js` endpoint, which contains the secret access key of AWS Firehose encoded in base64.

The secret access key has permission to put the record.

## Impact

The attacker could repeatedly send massive amounts of data to the Firehose delivery stream, causing:
- Increased costs due to higher data processing charges.
- Potential overloading of downstream systems (e.g., S3, Redshift, or Elasticsearch) if the Firehose delivery stream forwards the data to such services.

## System Host(s)
███████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Go to `█████████`.
2. Decode the base64 encoded string found in the file: `███`
3. Use the secret access key and related metadata information to put the record.

The attached image shows that I can put the record.

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2024-12-26** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
