---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2024-10-25
submitted: 2024-10-12T04:22:23.795Z
bounty_usd: null
votes: 69
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "todayisnew-"
source: "https://hackerone.com/reports/2778380"
title: "Unauthenticated LFI (Local File Inclusion) using the symbol `!` At the target `https://████/`"
---
# Unauthenticated LFI (Local File Inclusion) using the symbol `!` At the target `https://████/`

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 69 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-10-25

- Report: [https://hackerone.com/reports/2778380](https://hackerone.com/reports/2778380)
- CWE: Path Traversal
- Submitted: 2024-10-12T04:22:23.795Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi `DOD` Team,

# Summary:

* When accessing the endpoint on https://██████████/jolokia/exec/com.sun.management:type=DiagnosticCommand/compilerDirectivesAdd/ it is possible to path traversal on the machine and reading local files by using `!` at every new directory injected allowing an attacker to read local files with even being Unauthenticated leads to a catastrophic impact on the main server.

# Steps to reproduce:

**1. Read the listed users on the instance ---> `/etc/passwd`:**

* https://███/jolokia/exec/com.sun.management:type=DiagnosticCommand/compilerDirectivesAdd/!/etc!/passwd

**2. Read Crontab jobs on the instance ---> `/etc/crontab`:**

* https://████/jolokia/exec/com.sun.management:type=DiagnosticCommand/compilerDirectivesAdd/!/etc!/crontab


# PoC Video:

* ████


# Mitigation/Fix:

* Sanitize user input and don't trust user inputs that come for your server in a `GET` method after the endpoint `/compilerDirectivesAdd/{Attackers_Coming_From_Here_To_Read_Local_Files}`, it would be better to maintain a whitelist of acceptable filenames and use a unique corresponding identifier to access the file. Then any request containing an invalid identifier can just be rejected. Additionally, you could also sanitize any path traversal characters that may be present in any `GET` request.

## Impact

An attacker could read local files on the web server that they would normally not have access to, such as the application source code or configuration files containing sensitive information on how the website is configured, etc...

Best Regards,
Youssef

## Timeline

- **Report Filed**
- **2024-10-12** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Title Updated**
- **Report Vulnerability Information Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
