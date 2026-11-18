---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2025-03-06
submitted: 2025-01-26T07:59:46.766Z
bounty_usd: null
votes: 149
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "almuntadhar0x01"
source: "https://hackerone.com/reports/2958619"
title: "SQLi | in URL paths"
---
# SQLi | in URL paths

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 149 | **Program:** MTN Group | **Disclosed:** 2025-03-06

- Report: [https://hackerone.com/reports/2958619](https://hackerone.com/reports/2958619)
- CWE: SQL Injection
- Submitted: 2025-01-26T07:59:46.766Z

## Report summary

## How is this in scope?

--> https://www.mtn.co.za/insurance/device-cover/
{F4301195}

```bash
site:admyntec.co.za intitle:"MTN"
```

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
A SQL Injection vulnerability was discovered in the customerId parameter of the URL path:
`███████`
We can observe this by adding a little quote in the customerId:
█████████
which will show the following error, indicating that its vulnerable to SQL Commands Injection:
███████

## Steps To Reproduce:
We can use any SQL Commend here, by just closing the Statement ( putting `')` and then use a command and also we make sure to make the rest as a comment, here is a basic SQL command i used:
███████
or we can use tools like SQLmap to get access to the database, here is the command i used:
```
sqlmap -u "██████
```
██████

## Impact

## Summary:

An attacker can exploit this to dump and download the database, Which will give them access to user informations.

## Timeline

- **Report Filed**
- **2025-01-26** @almuntadhar0x01: Similar to #2633959
- **Report Pending Program Review**
- **2025-01-29** @almuntadhar0x01: Hello @██████████ , i would like to ask if there is any update?

█████
- **Hacker Requested Mediation**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
