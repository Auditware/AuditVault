---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
body: true
date: 2021-01-12
submitted: 2019-08-30T04:33:53.534Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/684838"
title: "Directory Indexing on the ████ (https://████/) leads to the backups disclosure and credentials leak"
---
# Directory Indexing on the ████ (https://████/) leads to the backups disclosure and credentials leak

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-01-12

- Report: [https://hackerone.com/reports/684838](https://hackerone.com/reports/684838)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2019-08-30T04:33:53.534Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Description
During poking around `█████████/24` range -  █████ looking for the Cisco devices, I came across `█████` which resolved to the https://██████/
While it's a not `.mil` host, it's likely related to the DoD since it hosted in the DoD-controlled ASN.

I discovered few critical vulnerabilities here, one of them is exposed backup files via directory listing.

##POC
https://███/obj/Debug/
█████
The source code can be found here:
https://█████████/obj/Debug/Package/GLOSS2.zip
It's zipped backup.

The DB credentials exposed here:
https://█████/obj/Debug/Package/GLOSS2.SetParameters.xml
███

##Suggested fix
Disable directory indexing, restrict access to the sensitive files, and change credentials as defense-in-depth measure.

## Impact

Source code & DB credentials leakage. Attacker can use it to compromise the resource.

## Timeline

- **Report Filed**
- **2019-08-30** @sp1d3rs: This is different from #684836 (there was a vuln in the `file.ashx` script) but having similar or equal consequences. In this case attacker doesn't need to guess the directory/file structure of the resource)
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
