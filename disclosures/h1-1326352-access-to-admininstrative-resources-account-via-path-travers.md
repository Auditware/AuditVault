---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/web
  - vuln/path-traversal
  - vuln/dos
  - impact/rce
  - trigger/auth-required
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2022-09-06
submitted: 2021-08-31T21:38:19.831Z
bounty_usd: null
votes: 0
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "j4k3d"
source: "https://hackerone.com/reports/1326352"
title: "Access to admininstrative resources/account via path traversal"
---
# Access to admininstrative resources/account via path traversal

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 0 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-09-06

- Report: [https://hackerone.com/reports/1326352](https://hackerone.com/reports/1326352)
- CWE: Path Traversal
- Submitted: 2021-08-31T21:38:19.831Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
A user can login as an administrator without the need of an ██████████ account, or an authenticated user can access and manipulate administrative resources without needing to login as an administrator. An ████████ (███████) account is required.
## References

## Impact

Exfiltration of sensitive data (IPs, system configurations, passwords, usernames, email addresses, names), website defacing, denial of service, potential rce, deletion of data.

## System Host(s)
████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
If you do not have an ██████(██████████) account:

Navigate to https://██████/
Login using your ████████ account. 
When you login you should be at the page https://██████/Saba/██████/CustomLogin.jsp with the error "There was an error while processing your request.  Please try again. If the problem persists, please contact the help desk at ████████".
Navigate to https://█████████/home
Your account name should say "Samba administrator"

If you do have an █████████(███████) account:

Navigate to https://█████/
Login using your ███████ account. 
Navigate to a page in the admin directory i.e. https://███████/Saba/Web_wdk/████████/platform/system/admin/systemMain.rdf  or https://██████████/Saba/Web_wdk/███████/Platform/system/admin/usersStatistics.rdf

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2021-09-01** @j4k3d: The administrative account name is "Saba Administrator". Instead of navigating to "https://████████/home", navigate to "https://█████████/Saba/Web/███/" when accessing the site without a user account.
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
