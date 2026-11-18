---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
body: true
date: 2024-06-27
submitted: 2019-08-30T04:27:15.076Z
bounty_usd: null
votes: 51
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/684836"
title: "Local File Disclosure on the █████ (https://████████.edu/) leads to the full source code disclosure and credentials leak"
---
# Local File Disclosure on the █████ (https://████████.edu/) leads to the full source code disclosure and credentials leak

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 51 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-06-27

- Report: [https://hackerone.com/reports/684836](https://hackerone.com/reports/684836)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2019-08-30T04:27:15.076Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Description
During poking around `██████.00/24` range -  ██████████ looking for the Cisco devices, I came across `███` which resolved to the https://███████.edu/
While it's a not `.mil` host, it's likely related to the DoD since it hosted in the DoD-controlled ASN.

I discovered few critical vulnerabilities here, one of them is LFD (local file disclosure).

##POC
https://██████.edu/file.ashx?path=web.config
will download the website configuration file.
It exposes the DB credentials:
███

Similarly, attacker able to get content of any server-side resource, such as source code of application:
https://███.edu/file.ashx?path=UserAccountJSON.aspx.cs

## Impact

Source code & DB credentials leakage. Attacker can use it to compromise the resource.

## Timeline

- **Report Filed**
- **2019-08-30** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
