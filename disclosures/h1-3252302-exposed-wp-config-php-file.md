---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - stack/php
  - impact/rce
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2026-01-12
submitted: 2025-07-14T14:22:28.961Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "jonasdiasrebelo"
source: "https://hackerone.com/reports/3252302"
title: "Exposed wp-config.php file"
---
# Exposed wp-config.php file

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/3252302](https://hackerone.com/reports/3252302)
- CWE: Information Disclosure
- Submitted: 2025-07-14T14:22:28.961Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**

Hi team!
A copy of the WordPress config file wp-config.php has been found at █████████ endpoint. It contains sensitive information, such as MySQL and AWS credentials, and various keys.
This domain is in scope, I already had to reports accepted in this domain.

## References

████████

## Impact

The page provides information to any user get a RCE without any problem.

## System Host(s)
████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Open the link: 

█████████

And see the file.

## Suggested Mitigation/Remediation Actions
Implement access control.

## Timeline

- **Report Filed**
- **2025-07-14** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
