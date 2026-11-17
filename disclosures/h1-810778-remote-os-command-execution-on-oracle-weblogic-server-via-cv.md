---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2021-04-25
submitted: 2020-03-04T14:20:40.692Z
bounty_usd: null
votes: 25
cve: "CVE-2017-3506"
program: "[[programs/mtn_group|MTN Group]]"
reporter: "tounsi_007"
source: "https://hackerone.com/reports/810778"
title: "Remote OS Command Execution on Oracle Weblogic server via [CVE-2017-3506]"
---
# Remote OS Command Execution on Oracle Weblogic server via [CVE-2017-3506]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 25 | **Program:** MTN Group | **Disclosed:** 2021-04-25

- Report: [https://hackerone.com/reports/810778](https://hackerone.com/reports/810778)
- CWE: OS Command Injection | CVE: CVE-2017-3506
- Submitted: 2020-03-04T14:20:40.692Z

## Report summary

## CVE-2017-3506 :
>
* Vulnerability in the Oracle WebLogic Server component of Oracle Fusion Middleware (subcomponent: Web Services). Supported versions that are affected are 10.3.6.0, 12.1.3.0, 12.2.1.0, 12.2.1.1 and 12.2.1.2. Difficult to exploit vulnerability allows unauthenticated attacker with network access via HTTP to compromise Oracle WebLogic Server. Successful attacks of this vulnerability can result in unauthorized creation, deletion or modification access to critical data or all Oracle WebLogic Server accessible data as well as unauthorized access to critical data or complete access to all Oracle WebLogic Server accessible data.
>

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-04-01** @tounsi_007: Greetings,
@vancora
* Any updates.

Thank you
- **2020-04-02** @vancora: This was fixed, kindly validate on your side.
- **2020-04-02** @tounsi_007: hi @vancora,
>
**Yes, i validated that was fixed.**
>

**==POC:==** {F770967}
- **2020-04-03** @tounsi_007: Greetings,
@vancora
>
* Please can you change the status to Resolved.
>

Thank you
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
