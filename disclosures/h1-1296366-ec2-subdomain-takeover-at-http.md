---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2022-02-14
submitted: 2021-08-09T16:26:45.976Z
bounty_usd: null
votes: 33
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "dreyand_"
source: "https://hackerone.com/reports/1296366"
title: "EC2 subdomain takeover at http://████████/"
---
# EC2 subdomain takeover at http://████████/

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 33 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-02-14

- Report: [https://hackerone.com/reports/1296366](https://hackerone.com/reports/1296366)
- CWE: Privilege Escalation
- Submitted: 2021-08-09T16:26:45.976Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

There is a dangling DNS A record that points to an EC2 instance that no longer exists, I was able to claim the EC2 instance and host content on http://███████/.

## Steps To Reproduce:

  1. Visit http://█████████/██████████.html and view the PoC:  ██████


## Suggested Remediation Steps

  Remove the A record pointing to the current ec2 instance. 

## Impact

Hosting content on http://█████/ and potentionally fully bypassing web protections like CORS (in cases of `████████`) or redirecting users to malicious pages.

## Impact

Hosting content on http://██████/ and potentionally fully bypassing web protections like CORS (in cases of `██████████`) or redirecting users to malicious pages,

## System Host(s)
██████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Visit http://██████████/█████.html and view the PoC:  █████

## Suggested Mitigation/Remediation Actions
Remove the A record pointing to the current ec2 instance.

## Timeline

- **Report Filed**
- **2021-08-09** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2021-08-09** @dreyand_: Hey, any reason for the low severity? These are usually valued at high/medium :)
- **Report Severity Updated**
- **2022-01-18** @agent-l8: Sorry this got dropped- still an issue, severity is adjusted. Thank you!
- **2022-01-18** @dreyand_: Sounds good! @agent-l8
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
