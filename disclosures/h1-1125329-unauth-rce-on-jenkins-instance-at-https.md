---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
  - stack/java
  - vuln/command-injection
  - impact/rce
  - trigger/unauthenticated
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2021-03-24
submitted: 2021-03-14T09:03:46.814Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "brbsainath"
source: "https://hackerone.com/reports/1125329"
title: "Unauth RCE on Jenkins Instance at https://█████████/"
---
# Unauth RCE on Jenkins Instance at https://█████████/

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 15 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-03-24

- Report: [https://hackerone.com/reports/1125329](https://hackerone.com/reports/1125329)
- CWE: OS Command Injection
- Submitted: 2021-03-14T09:03:46.814Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
Hi Team,

While Doing Recon on U.s Government Sites, I Found below asset Belongs to U.S Government (Please Check its SSL certificate to confirm or Please check attached  POC Video)
 █████████

https://███/

Attacker can execute Command Injection without Authentication.

## Impact

Unauth RCE

## System Host(s)
███

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Navigate to https://███████/_script
2. Please execute below commands to confirm Unauth RCE.

             Commands:  println "ls".execute().text
                                         println "whoami".execute().text
#POC

Please check Attached POC Video to follow steps (If Required)

██████

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2021-03-14** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
