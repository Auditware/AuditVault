---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2019-10-04
submitted: 2017-09-21T01:10:27.957Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "geeknik"
source: "https://hackerone.com/reports/270059"
title: "Denial of service in libxml2, using malicious lzma file to consume available system memory"
---
# Denial of service in libxml2, using malicious lzma file to consume available system memory

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Internet Bug Bounty | **Disclosed:** 2019-10-04

- Report: [https://hackerone.com/reports/270059](https://hackerone.com/reports/270059)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2017-09-21T01:10:27.957Z

## Timeline

- **Report Filed**
- **Not Eligible For Bounty**
- **Report Resolved**
- **2018-04-08** @geeknik: @arice, FYI this was assigned [CVE-2017-18528](https://nvd.nist.gov/vuln/detail/CVE-2017-18258) because it was exploitable remotely: `allows remote attackers to cause a denial of service (memory consumption) via a crafted LZMA file, because the decoder functionality does not restrict memory usage to what is required for a legitimate file.`
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
