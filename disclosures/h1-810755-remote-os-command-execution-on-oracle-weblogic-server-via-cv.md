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
submitted: 2020-03-04T13:45:59.061Z
bounty_usd: null
votes: 29
cve: "CVE-2017-10271"
program: "[[programs/mtn_group|MTN Group]]"
reporter: "tounsi_007"
source: "https://hackerone.com/reports/810755"
title: "Remote OS Command Execution on Oracle Weblogic server via [CVE-2017-10271]"
---
# Remote OS Command Execution on Oracle Weblogic server via [CVE-2017-10271]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 29 | **Program:** MTN Group | **Disclosed:** 2021-04-25

- Report: [https://hackerone.com/reports/810755](https://hackerone.com/reports/810755)
- CWE: OS Command Injection | CVE: CVE-2017-10271
- Submitted: 2020-03-04T13:45:59.061Z

## Report summary

## CVE-2017-10271 :
>
* Vulnerability in the Oracle WebLogic Server component of Oracle Fusion Middleware (subcomponent: WLS Security). Supported versions that are affected are 10.3.6.0.0, 12.1.3.0.0, 12.2.1.1.0 and 12.2.1.2.0. Easily exploitable vulnerability allows unauthenticated attacker with network access via T3 to compromise Oracle WebLogic Server. Successful attacks of this vulnerability can result in takeover of Oracle WebLogic Server.
>

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-04-01** @tounsi_007: Greetings,
@vancora
* Any updates.

Thank you
- **2020-04-02** @vancora: This was fixed, kindly validate.
- **2020-04-02** @tounsi_007: hi @vancora,
>
**Yes, i validated that was fixed.**
>

**==POC:==** {F770949}
- **2020-04-03** @tounsi_007: Greetings,
@vancora
>
* Please can you change the status to Resolved.
>

Thank you
- **Report Resolved**
- **2020-04-07** @tounsi_007: Greetings @vancora,
>
* Please can you check those reports, i had submitted for more than 3 weeks #820330 #820326 #820321 #819270 #818939 #816927 and no response until now.
>

Thank you.
- **Agreed On Going Public**
- **Report Became Public**
