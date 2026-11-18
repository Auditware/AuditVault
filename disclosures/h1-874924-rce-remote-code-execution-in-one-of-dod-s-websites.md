---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cryptographic-issues-generic
  - env/web
substate: "resolved"
weakness: "Cryptographic Issues - Generic"
enriched: true
body: true
date: 2020-07-30
submitted: 2020-05-15T10:01:24.258Z
bounty_usd: null
votes: 9
cve: "CVE-2017-1000486"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "pwn1um"
source: "https://hackerone.com/reports/874924"
title: "RCE (Remote code execution) in one of DoD's websites "
---
# RCE (Remote code execution) in one of DoD's websites 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 9 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-07-30

- Report: [https://hackerone.com/reports/874924](https://hackerone.com/reports/874924)
- CWE: Cryptographic Issues - Generic | CVE: CVE-2017-1000486
- Submitted: 2020-05-15T10:01:24.258Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
The targeted website is vulnerable to CVE-2017-1000486, by only running command was (whoami) to prove that the RCE exist has been run successfully on the target
**Description:**
The target uses a vulnerable version of primefaces : Primetek Primefaces 5.x, that is vulnerable to a weak encryption flaw resulting in remote code execution
## Impact
Critical
## Step-by-step Reproduction Instructions
Using the following exploit : https://github.com/pimps/CVE-2017-1000486
1. python primefaces.py████████/

## Product, Version, and Configuration (If applicable)
Primefaces 5.3.6
## Suggested Mitigation/Remediation Actions
Primefaces has to be updated to a newer version

## Impact

An attacker could execute remote codes on the target system, that could impact all of the CIA triad

## Timeline

- **Report Filed**
- **2020-05-15** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2020-07-20** @agent-l8: added to the queue. Thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
- **2021-08-02** @agent-bk1: As a previous winner of Researcher of the Month we'd like to ask some questions to give you a voice in the program. If you have time we'd love your input. Thank you.

1.      Are you happy with the current point system of DoD VDP (7 points for
triage, 2 points for duplicate)?
2.      Are there any recommendations or suggestions you have for the
Researcher of the Month tweet?
3.      Are there any items in our policy that should be better defined for
participants?
4.      As an award winner, would you like to be interviewed and tell the
story of how you got into Vulnerability Disclosures and Bug Bounties?
5.      Did you use this program to "practice" before moving on to another?
6.      Are you happy with the level of communication you get from the
validators?
7.      It's been communicated that the researchers would like educational
opportunities with regards to the program, what types of opportunities would
you implement?
8.      What is the one thing you like most about our program?
9.      What is the one thing you like least about our program?
