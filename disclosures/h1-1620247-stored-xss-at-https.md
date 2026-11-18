---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - fix/csp
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2022-09-06
submitted: 2022-06-30T11:47:10.088Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "roxorz"
source: "https://hackerone.com/reports/1620247"
title: "Stored XSS at https://█████"
---
# Stored XSS at https://█████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-09-06

- Report: [https://hackerone.com/reports/1620247](https://hackerone.com/reports/1620247)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2022-06-30T11:47:10.088Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
In registeration page ( https://████ ) , first name and last name field are vulnerable to Stored Cross Site Scripting.

## Proof of concept
For the fastly test, use this credentials to login (my test account)
> email: █████████
password: ██████

After login , alert document.cookie will triggered

## Impact

Stored Cross Site Scripting which attacker can execute malicious javascript payload.

## System Host(s)
████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Go to registration page ( https://████ ), insert `<svg/onload=confirm(document.cookie)>` payload in firstname and lastname fields and create account.
2. Verified your account.
3. Go to login page and login your account.
4. And XSS will triggered ( XSS also triggered in `My Profile` page) .

## Suggested Mitigation/Remediation Actions
1. Filter input on arrival.
2. Encode data on output.
3. Content Security Policy

## Timeline

- **Report Filed**
- **2022-06-30** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
