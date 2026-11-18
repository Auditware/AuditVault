---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - vuln/command-injection
  - vuln/dos
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2021-03-16
submitted: 2020-07-28T13:49:59.664Z
bounty_usd: null
votes: 38
cve: []
program: "[[programs/acronis|Acronis]]"
reporter: "adr"
source: "https://hackerone.com/reports/945122"
title: "Arbitrary file creation via symlink attack on syncagentsrv (Acronis Sync Agent Service)"
---
# Arbitrary file creation via symlink attack on syncagentsrv (Acronis Sync Agent Service)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 38 | **Program:** Acronis | **Disclosed:** 2021-03-16

- Report: [https://hackerone.com/reports/945122](https://hackerone.com/reports/945122)
- CWE: Privilege Escalation
- Submitted: 2020-07-28T13:49:59.664Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Issue class description
Arbitrary file creation is a vulnerability that allows attacker to create file in arbitrary location within filesystem. This includes protected directories, such as C:\Windows, C:\windows\system32 and "C:\Program Files". If in addition, attacker has control over the file content, it is possible to create DLL file which will be loaded by known operating system components and will result in Privilege Elevation to Local System (the highest level of privileges on local Windows system).

There are many known paths for this attacks, e.g. every desktop version of Windows will periodically run "schedule" service. The service will try to load non-existing library named WptsExtensions.dll. If attacker manages to plant custom version of this library, the code will be executed with highest privileges and can be used to add new administrative user or start reverse shell. The issue can be force by triggering system reboot as well. More details can be found here: https://itm4n.github.io/windows-dll-hijacking-clarified/

To perform this attack, typically we need privileged process that blindly follows symlinks (reparse points), without verifying destination. NTFS symlinks require extra privileges, but attacker can use other kind of symlinks: directory junctions mixed with object directory symlinks. The ready to use solution is hosted on Google's Project Zero's github: https://github.com/googleprojectzero/symboliclink-testing-tools

CreateSymlink.exe binary used in this attack originates from this source and can be downloaded to reproduce the attack.

# Affected software
Following True Image installer was used:
{F926995}

The vulnerable service is syncagentsrv ("C:\Program Files (x86)\Common Files\Acronis\SyncAgent\syncagentsrv.exe")

When service is running, it logs information into C:\ProgramData\Acronis\SyncAgent\logs\syncagent.log file. The file is not exclusively opened, nor protected, and can be deleted at any time. The C:\ProgramData\Acronis\SyncAgent\logs\ directory remains empty, thus can be transformed into directoy junction and symlink.

Once new entry is added to the log, the write operation will follow the symlink and write into arbitrary location. Attacker also controls the name of resulting file. The resulting file grants full control to EVERYONE, hence it is trivial to replace its content with custom code. 

{F927005}

The attack has been confirmed on my local system (when proper libraries were targeted) and I was able to elevate privileges.

# Steps to reproduce
1. Delete C:\ProgramData\Acronis\SyncAgent\logs\syncagent.log file. Make sure that directory is now empty.
2. Use following command to create symlink: `CreateSymlink.exe C:\ProgramData\Acronis\SyncAgent\logs\syncagent.log C:\Windows\system32\WptsExtensions.dll`
3. Wait for data to be written into the log or force it by triggering system reboot. After the reboot verify successful file creation.
4. Replace new file content (C:\Windows\system32\WptsExtensions.dll) with custom DLL functionality - e.g. adding administrative user or spawning remote shell connection.
5. Reboot again to trigger Windows Scheduler loading new dll.

## Impact

Low privileged user can overwrite any file in the system (this could lead to DoS) or create arbitrary files anywhere on the system. By creating arbitrary DLL, then replacing its content with custom code, user can elevate privileges up to Local System (the highest Windows privilege).

## Timeline

- **Report Filed**
- **2020-07-29** @stushieva: Hi, @adr. Thanks for your report!
We will review it and come back to you asap
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **External User Joined**
- **External User Joined**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
