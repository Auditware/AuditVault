---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
body: true
date: 2019-10-08
submitted: 2019-08-13T19:48:08.714Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "scraps"
source: "https://hackerone.com/reports/672629"
title: "Online training material disclosing username and password"
---
# Online training material disclosing username and password

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/672629](https://hackerone.com/reports/672629)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2019-08-13T19:48:08.714Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
A training document is revealing username and password details for what appears to be a DoD training system

**Description:**
Using the google dork ``site:*.mil ext:ppt intext:password``, I was able to find a number of powerpoint documents on .mil websites that include username and passwords.

This document appears to be some old training materials

Slide 39 of www.███████/█████████ 

See: █████████

In this instance, the document relates to an online training platform at https://████████/, so if the credentials are still valid, anyone who reads that presentation could potentially access that system and any data it holds. Training databases often have elements of sensitive data left over from old production databases, so this may expose sensitive information.

**Please note that I did not attempt to login using the credentials, as I didn't want to violate any terms of your policy.**

If you would like me to attempt to login to test this vulnerbility, please let me know. 

## Step-by-step Reproduction Instructions

Using the google dork ``site:*.mil ext:ppt intext:password``, examine any results which appear to include usernames or passwords

See: ███

## Impact

Attackers may be able to access the contents of either system, which could include sensitive data.

## Timeline

- **Report Filed**
- **2019-08-13** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
