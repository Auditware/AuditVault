---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - vuln/code-injection
  - vuln/misconfiguration
  - impact/rce
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2023-12-31
submitted: 2022-08-22T18:07:27.373Z
bounty_usd: null
votes: 59
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "zer0code"
source: "https://hackerone.com/reports/1677047"
title: "Remote code execution via crafted pentaho report uploaded using default credentials for pentaho business server"
---
# Remote code execution via crafted pentaho report uploaded using default credentials for pentaho business server

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 59 | **Program:** MTN Group | **Disclosed:** 2023-12-31

- Report: [https://hackerone.com/reports/1677047](https://hackerone.com/reports/1677047)
- CWE: Code Injection
- Submitted: 2022-08-22T18:07:27.373Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Good day,
                      While I do recon for mtn.ci domain I found  Pentaho business server at https://sm.mtn.ci:8888/pentaho with default credentials admin/password ,then I figured that I can upload  prpt reports to server which could use some beanshell,js and java to achieve RCE

## Steps To Reproduce:
1. Login to https://sm.mtn.ci:8888/pentaho admin/password  
{F1878259}
2. Use Pentaho report designer to create malicious report file  
{F1878260}
3. Upload and run the report   
{F1878261}  
{F1878262}

## Impact

The impact of an RCE vulnerability can range from malware execution to an attacker gaining full control over a compromised server.

## Timeline

- **Report Filed**
- **2022-08-22** @zer0code: * incorrect image order (01 and 02)
- **Report Triaged**
- **2022-08-26** @zer0code: Hi Team,
Any Updates on my report?
Regards,
- **2022-10-14** @zer0code: Any Updates on my report?
- **2023-01-20** @zer0code: Its been 3 months , Any updates on my report?
- **Report Resolved**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Report Became Public**
