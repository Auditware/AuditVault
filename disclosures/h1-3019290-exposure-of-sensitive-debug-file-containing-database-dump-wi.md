---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - vuln/broken-access-control
  - vuln/privilege-escalation
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2026-01-12
submitted: 2025-03-01T03:38:34.833Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "jonasdiasrebelo"
source: "https://hackerone.com/reports/3019290"
title: "Exposure of Sensitive Debug File Containing database dump with passwords in plain text"
---
# Exposure of Sensitive Debug File Containing database dump with passwords in plain text

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/3019290](https://hackerone.com/reports/3019290)
- CWE: Information Disclosure
- Submitted: 2025-03-01T03:38:34.833Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
A publicly accessible debug file (debug.txt) was discovered on the target web application, exposing sensitive database credentials, including usernames and passwords. This issue poses a severe security risk as it allows unauthorized access to the database, potentially leading to data breaches, privilege escalation, or further exploitation of the system.

Link: ████████

## References

███

## Impact

Data Breach: Confidential data could be extracted or modified.
Privilege Escalation: If the credentials belong to a privileged account, attackers may gain further control over the system.

## System Host(s)
██████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Open a web browser or use curl/wget to access the following URL:

████

The file contains plaintext user credentials, such as:

```
                    [user] => orgpri
                    [passwd] => 12!@QWasz
                    [dbname] => org_priority
                    [dbtype] => mysql
                    [server] => mysql
```

These credentials could allow an attacker to directly connect to the database and manipulate sensitive data.

## Suggested Mitigation/Remediation Actions
Remove the debug.txt file.

## Timeline

- **Report Filed**
- **2025-03-01** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **2025-03-03** @jonasdiasrebelo: Hi @redwingreaper. I really think this vulnerability should be considered critical. These are plain text passwords for ALL users, and apparently it has the password for the database itself.

███████
- **2025-03-04** @jonasdiasrebelo: @redwingreaper
- **2025-03-11** @jonasdiasrebelo: @redwingreaper
- **Report Resolved**
- **2025-03-31** @agent-p1: Greetings!
███████  Because of this report you have been selected as our Researcher of the Month. Would you like your name to be on the certificate that is tweeted out? If so, would you provide me your name for that? Do you have a twitter handle for us to tag you in? If you do not, or would not like to, then we would use you Hackerone username. Thank you!
Regards,
The DoD VDP team
- **2025-03-31** @jonasdiasrebelo: Hi! Yes, my name: █████

I don't use Twitter. Is there any possibility of sharing my LinkedIn instead? If not, I can create a Twitter account.

My LinkedIn: ██████████
- **2025-04-01** @agent-p1: Greetings, 

We do not tag linkedin accounts. IF you would like to create a twitter we can add it or we can just use your H1 handle. 

Regards,
The VDP Team
- **2025-04-01** @jonasdiasrebelo: Hi!
You can use:

█████
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
