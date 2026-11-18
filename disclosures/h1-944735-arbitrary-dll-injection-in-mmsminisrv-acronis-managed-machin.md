---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2020-10-20
submitted: 2020-07-28T09:14:57.895Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/acronis|Acronis]]"
reporter: "adr"
source: "https://hackerone.com/reports/944735"
title: "Arbitrary DLL injection in mmsminisrv (Acronis Managed Machine Service Mini)"
---
# Arbitrary DLL injection in mmsminisrv (Acronis Managed Machine Service Mini)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Acronis | **Disclosed:** 2020-10-20

- Report: [https://hackerone.com/reports/944735](https://hackerone.com/reports/944735)
- CWE: Privilege Escalation
- Submitted: 2020-07-28T09:14:57.895Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

During initialization, **mms_mini.exe** (service binary of mmsminisrv) loads library *C:\Program Files (x86)\Common Files\Acronis\Home\libssl10.dll*. The library then tries to load non-existing file: *C:\bs_hudson\workspace\mod-openssl-fips-win\205\product\out\standard\vs_2013_release\OpenSSL\ssl\openssl.cnf*. The path seems to be hardcoded leftover from compilation. 
{F926518}

Because by default any user is able to create directories  on C:\ drive, it is possible to create missing directories and missing file (*openssl.cnf*). The OpenSSL config file implements support for loading additional DLL modules. Attacker may point to arbitrary DLL which will be loaded by service running with Local System privileges. Once service is restarted (e.g. due to system reboot), the planted library is loaded by the service and arbitrary code is executed. The code would typically add new Administrative user to the Windows system or establish reverse shell connection.

Successful injection of arbitrary library is shown on procmon log:
{F926535}

# Steps to reproduce
1. Create directories: ```mkdir C:\bs_hudson\workspace\mod-openssl-fips-win\205\product\out\standard\vs_2013_release\OpenSSL\ssl```
2. Inside, create openssl.cnf file with following content (replace DLL path with any path you wish):
    
    ``` 
openssl_conf = openssl_init
[openssl_init]
engines = engine_section
[engine_section]
woot = woot_section
[woot_section]
engine_id = woot
dynamic_path = c:\\temp\\cqbeacondll.dll
init = 0
    ```
3. Plant arbitrary DLL under *dynamic_path* location.
4. Wait for service to start (or force it by rebooting system)

## Impact

After successful attack, low privileged local user can elevate privileges up to Local System (the highest Windows privilege). The vulnerability can be also exploited by malware with local system access.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2020-07-28** @adr: The same vulnerability exists in another service: syncagentsrv ("C:\Program Files (x86)\Common Files\Acronis\SyncAgent\syncagentsrv.exe"). Please decide whether this belongs here or you'd prefer me to open new report. The root-cause is very likely the same, though.

This time curl.dll is vulnerable library. Proof:
{F926924}
- **2020-07-28** @adr: anti_ransomware_service.exe is also affected. I'm testing components one by one, thus the issue may still affect more components than that.
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **2020-08-04** @stushieva: @adr,
Since the root cause is the same, we consider this as single issue
Thanks for your efforts!
- **Bounty Awarded**
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
