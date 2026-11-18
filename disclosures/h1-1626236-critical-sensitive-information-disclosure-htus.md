---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - vuln/info-disclosure
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2023-01-13
submitted: 2022-07-05T14:04:33.153Z
bounty_usd: 500
votes: 36
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "ghostkernalbbt"
source: "https://hackerone.com/reports/1626236"
title: "Critical sensitive information Disclosure. [HtUS]"
---
# Critical sensitive information Disclosure. [HtUS]

> **Severity:** High | **Bounty:** 500 USD | **Votes:** 36 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-01-13

- Report: [https://hackerone.com/reports/1626236](https://hackerone.com/reports/1626236)
- CWE: Information Disclosure
- Submitted: 2022-07-05T14:04:33.153Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

(Database user,Database password,Database name) 
on https://██████.edu/

I got sensitive information:
view-source:https://██████████.edu/database.php.orig


Database information (Database user,Database password,Database name)
$hostname     = '████████.edu';
$db         = '█████████';
$username     = '████_user';
$password     = '████';

## Impact

Bug impact:
Sensitive information disclosed and possible for an attacker can access into the system.

## Timeline

- **Report Filed**
- **2022-07-05** @ghostkernalbbt: Remember. If you normally visit the url, it won't show anything. You have to add view-source:

view-source:https://█████.edu/database.php.orig
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2022-07-05** @ghostkernalbbt: Hi, I found another additional endpoint where I guess it is possible to takeover the domain by updating the database.

Vulnerable Endpoint - https://███.edu/install.php?step=1

Any chances to increase the bounty and severity?
- **Report Resolved**
- **2022-12-18** @ghostkernalbbt: Hi! Can you disclose the report? Thanks.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
