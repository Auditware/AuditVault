---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/cloud
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2019-10-16
submitted: 2019-09-13T02:39:39.780Z
bounty_usd: 2000
votes: 112
cve: []
program: "[[programs/semmle|Semmle]]"
reporter: "testanull"
source: "https://hackerone.com/reports/694181"
title: "Worker container escape lead to arbitrary file reading in host machine"
---
# Worker container escape lead to arbitrary file reading in host machine

> **Severity:** Critical | **Bounty:** 2,000 USD | **Votes:** 112 | **Program:** Semmle | **Disclosed:** 2019-10-16

- Report: [https://hackerone.com/reports/694181](https://hackerone.com/reports/694181)
- CWE: Privilege Escalation
- Submitted: 2019-09-13T02:39:39.780Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Because lack of security, attacker will be able to remove original log file and replace it will a symlink to other file, 
After finishing job, host machine copy file from docker container.
Because the original log file has been removed, the host machine will copy the symlink file.
But the problem is it doesn't copy the linked file in container, it copys the linked file in the HOST MACHINE.

## Steps To Reproduce:
The attack is very simple, just remove the original build.log file and replace with a symlink file,
I used this configuration to read the ``/etc/passwd``:
```extraction:
  cpp:
    after_prepare:
      - rm -rf /opt/out/snapshot/log/build.log && ln -s /etc/passwd /opt/out/snapshot/log/build.log
```

## PoC
Content of ``/etc/passwd`` is attached below

## Impact

Give attacker ability to explore the host machine, expose more sensitive informations from it.

## Timeline

- **2019-09-13** @testanull: Bonus private ip of host machine
- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2019-09-13** @testanull: Thank you,
:D Your team seems to be working hard in the last few days,
Have nice weekend!
- **Report Resolved**
- **Agreed On Going Public**
- **2019-09-17** @chrisgavin: That's fine with us. We're also happy to disclose immediately if you'd prefer.
- **Report Became Public**
