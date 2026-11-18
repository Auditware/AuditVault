---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - stack/php
  - vuln/info-disclosure
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2023-05-15
submitted: 2023-03-20T00:36:50.155Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0r10nh4ck"
source: "https://hackerone.com/reports/1912671"
title: "Sensitive Data Exposure via wp-config.php file"
---
# Sensitive Data Exposure via wp-config.php file

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-05-15

- Report: [https://hackerone.com/reports/1912671](https://hackerone.com/reports/1912671)
- CWE: Information Disclosure
- Submitted: 2023-03-20T00:36:50.155Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**

Hi team,
A copy of the WordPress config file wp-config.php has been found at  █████████ endpoint. It contains sensitive information, such as MySQL and AWS credentials, and various keys.

## References

https://codex.wordpress.org/WordPress_Files

## Impact

The page provides information to users who do not need it.

## System Host(s)
████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Go to: ███/wp-config.php_
2. See the information.

## Suggested Mitigation/Remediation Actions
Implement access control.

## Timeline

- **Report Filed**
- **2023-03-20** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **Report Triaged**
- **2023-03-29** @agent-p1: Greetings!
@0r10nh4ck  Because of this report  and your Blind SSRF you have been selected as our Researcher of the Month. Would you like your name to be on the certificate that is tweeted out? If so, would you provide me your name for that? Do you have a twitter handle for us to tag you in? If you do not, or would not like to, then we would use you Hackerone username. Thank you!
Regards,
The DoD VDP team
- **2023-03-30** @0r10nh4ck: Hi team,

I am very happy with this great news, I am very grateful for your recognition. My name is JAIR REIS, and my twitter is @0rionh4ck.

Thank you very much!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
