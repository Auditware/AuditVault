---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - vuln/info-disclosure
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2023-05-15
submitted: 2023-04-06T18:14:09.423Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0xmaruf"
source: "https://hackerone.com/reports/1937235"
title: "LDAP Server NULL Bind Connection Information Disclosure"
---
# LDAP Server NULL Bind Connection Information Disclosure

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-05-15

- Report: [https://hackerone.com/reports/1937235](https://hackerone.com/reports/1937235)
- CWE: Improper Access Control - Generic
- Submitted: 2023-04-06T18:14:09.423Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
The remote LDAP server allows anonymous access

## References
  - https://www.tenable.com/plugins/nessus/10723
  - https://ldap.com/ldapv3-wire-protocol-reference-bind

## Impact

information  disclosure

## System Host(s)
████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. run $ `nmap -n -sV --script "ldap* and not brute" -p 389 ██████████`

check the response
## POC
██████

## Suggested Mitigation/Remediation Actions
Configure the service to disallow NULL BINDs.

## Timeline

- **Report Filed**
- **2023-04-06** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **2023-04-20** @billthomas6789: hi @0xmaruf  .  After further review these ldap hosts all appear to be CRL distribution points. The CRL distribution points are intended to be accessed anonymously by applications and services to receive the latest revoked certifications. There are no current government restrictions preventing anonymous read rights for these services. 

https://www.rfc-editor.org/rfc/rfc5280

Thanks again for supporting the DoD Vulnerability Disclosure Program.
Regards,
The VDP Team
- **Agreed On Going Public**
- **2023-04-24** @0xmaruf: disclose this report,  i have sent the request?
- **2023-04-24** @agent-j5: Greetings @0xmaruf the report is in the queue for being released for disclosure.  When it has been approved for disclosure you will be notified.  Thank you for supporting the DoD.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
