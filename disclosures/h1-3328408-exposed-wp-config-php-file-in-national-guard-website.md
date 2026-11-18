---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - stack/php
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2026-01-12
submitted: 2025-09-05T14:16:29.163Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "jonasdiasrebelo"
source: "https://hackerone.com/reports/3328408"
title: "Exposed wp-config.php file in ███ National Guard website"
---
# Exposed wp-config.php file in ███ National Guard website

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/3328408](https://hackerone.com/reports/3328408)
- CWE: Information Disclosure
- Submitted: 2025-09-05T14:16:29.163Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**

Hi, team! 
I found a ██████████ National Guard website with the subdomain/domain `████████`. I know, it is strange they use the azurewebsites.us domain, but apparently it's an official website.
I noticed that some official websites from Department of Defense have versions with the exact same website in azurewebsites.us, however I didn't find the original website with the original domain, but I really think this finding is valid.

████
███████
█████████

A copy of the WordPress config file wp-config.php has been found at `█████████` endpoint. It contains sensitive information, such as MySQL  and various keys.

## Impact

The page provides sensitive information, for example, the database password in plain text.

## System Host(s)
████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Open the link: ██████████

████

Note this detail: 'DB_HOST', '████████'

## Suggested Mitigation/Remediation Actions
Implement access control.

## Timeline

- **Report Filed**
- **2025-09-05** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
