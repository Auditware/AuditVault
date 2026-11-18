---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
body: true
date: 2024-07-26
submitted: 2024-06-14T10:58:46.768Z
bounty_usd: null
votes: 53
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "martinvw"
source: "https://hackerone.com/reports/2552243"
title: "Subdomain takeover ██████"
---
# Subdomain takeover ██████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 53 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-07-26

- Report: [https://hackerone.com/reports/2552243](https://hackerone.com/reports/2552243)
- CWE: Violation of Secure Design Principles
- Submitted: 2024-06-14T10:58:46.768Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The subdomain `█████` is pointing to `open-elb-prod-277276106.us-east-1.elb-amazonaws.com.`, the domain `elb-amazonaws.com` was available for registration

## Impact

Using this vulnerability an attacker can:
- host unwanted/malicious content under your domain
- receive email on subdomains mentioned above
- effectively execute cross-site scripting attacks
- in some cases, steal cookie data
- in some cases, trick password managers into filling in passwords

## System Host(s)
█████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Visit http://████████/proof.e7437329-ab61-4f22-a049-df5b3685313a.txt

## Suggested Mitigation/Remediation Actions
Remove CNAME record █████

## Timeline

- **Report Filed**
- **2024-06-14** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
