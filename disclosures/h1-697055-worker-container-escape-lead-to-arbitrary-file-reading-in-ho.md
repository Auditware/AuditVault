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
date: 2019-10-21
submitted: 2019-09-18T09:34:52.929Z
bounty_usd: 2000
votes: 178
cve: []
program: "[[programs/semmle|Semmle]]"
reporter: "testanull"
source: "https://hackerone.com/reports/697055"
title: "Worker container escape lead to arbitrary file reading in host machine [again]"
---
# Worker container escape lead to arbitrary file reading in host machine [again]

> **Severity:** Critical | **Bounty:** 2,000 USD | **Votes:** 178 | **Program:** Semmle | **Disclosed:** 2019-10-21

- Report: [https://hackerone.com/reports/697055](https://hackerone.com/reports/697055)
- CWE: Privilege Escalation
- Submitted: 2019-09-18T09:34:52.929Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
After a successful build, LGTM allow user to view the file list.
By default, only source code files and build config files are reserved (``lgtm.yml`` and ``.lgtm.yml``).
If there are both files in folder, LGTM will process ``lgtm.yml`` file and skip ``.lgtm.yml``, but it still keeps both of files in directory.
By making symlink to ``.lgtm.yml`` file, after successful build, it will point to HOST MACHINE file!

## Steps To Reproduce:

1. Create a simple project which LGTM can build successful.
In this report, I use this project (https://github.com/testanull/test11)
2. Create file: ``lgtm.yml``  with a valid config content, for example:

```
extraction:
  java:
    index:
      build_command:
      - ./custom-build
```

3. Make a symlink point to a HOST MACHINE file/directory with name: ``.lgtm.yml``
4. After successful build, ``.lgtm.yml`` file will contain the host machine file content!

##PoC of reading ``/etc/passwd`` is attached below

## Impact

Give attacker ability to explore the host machine, expose more sensitive informations from it.

## Timeline

- **Report Filed**
- **2019-09-18** @testanull: Update:
I just set the project on github to private
The project files is attached below
- **Report Triaged**
- **Bounty Awarded**
- **2019-09-18** @chrisgavin: Thanks again @testanull.

We've deployed an initial fix for the problem you've found. We're currently in the process of fully auditing our use of symlinks before marking this report as resolved, but we hope to have this done over the next few days.

Thanks,
Chris
- **2019-09-19** @testanull: Can you make a disclosure request after closing this report?
- **2019-10-14** @testanull: It has been a while since last activity,
Have your team resolved this issues yet?
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
