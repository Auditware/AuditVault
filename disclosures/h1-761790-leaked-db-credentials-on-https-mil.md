---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2020-12-03
submitted: 2019-12-19T16:19:47.238Z
bounty_usd: null
votes: 42
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "al-madjus"
source: "https://hackerone.com/reports/761790"
title: "Leaked DB credentials on https://██████████.mil/███"
---
# Leaked DB credentials on https://██████████.mil/███

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 42 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-12-03

- Report: [https://hackerone.com/reports/761790](https://hackerone.com/reports/761790)
- CWE: Information Disclosure
- Submitted: 2019-12-19T16:19:47.238Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Information disclosure with login credentials for ms-sql database exposed. 

**Description:**
I've found a PHP info file disclosed on https://█████.mil/██████ containing login credentials for a database cloud server (███████) as well as information on the host system such as hostname, username and full paths. The database server is up, but I have not tried connecting to it with the credentials, as I feel that would be going too far. 

## Impact
Possible access to database as well as disclosure of sensitive host information. 

## Step-by-step Reproduction Instructions

1. Go to https://██████████.mil/████████
2. Search for 'password', you should see this: 
    `Data Source=tcp:███,█████████;Initial Catalog=██████████;User  Id=████@██████████;Password=███████ `
3. Run `nc -vvv █████████ █████` to confirm database is running and service ms-sql-s is accepting connections: 
`(UNKNOWN) [███████] ████████ (ms-sql-s) open
^C sent 0, rcvd 0
`

## Product, Version, and Configuration (If applicable)

## Suggested Mitigation/Remediation Actions
███████ should not be available on the server.

## Impact

Possible access to database as well as disclosure of sensitive host information.

## Timeline

- **Report Filed**
- **2019-12-19** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2020-12-01** @agent-l8: Yes, we will review for disclosure this week. Thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
