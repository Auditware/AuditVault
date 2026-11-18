---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - vuln/broken-access-control
  - vuln/privilege-escalation
  - trigger/auth-required
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2021-06-04
submitted: 2020-07-12T19:45:31.302Z
bounty_usd: 250
votes: 50
cve: []
program: "[[programs/glasswire|GlassWire]]"
reporter: "dawouw"
source: "https://hackerone.com/reports/921675"
title: "Uncontrolled Search Path Element allows DLL hijacking for priv esc to SYSTEM"
---
# Uncontrolled Search Path Element allows DLL hijacking for priv esc to SYSTEM

> **Severity:** High | **Bounty:** 250 USD | **Votes:** 50 | **Program:** GlassWire | **Disclosed:** 2021-06-04

- Report: [https://hackerone.com/reports/921675](https://hackerone.com/reports/921675)
- CWE: Privilege Escalation
- Submitted: 2020-07-12T19:45:31.302Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

GlassWire contains a DLL hijacking vulnerability that could allow an authenticated attacker to execute arbitrary code on the targeted system. The vulnerability exists due to GlassWire loading DLL files from the PATH environment variable without verification. The machine should have at least one writable PATH directory for the privilege escalation to work (e.g. having Python, Java, etc. installed).
Nine different DLL's are loaded by the GlassWire Service (GWCtlSrv.exe) as SYSTEM. 
One DLL is loaded by the GUI (GlassWire.exe) as the currently logged in user.

Class: Privilege Escalation [CAPEC-233]
Class: Uncontrolled Search Path Element [CWE-427]

**Affected Product**
GlassWire 2.2.210.0

**Proof of Concept**
Usually, Python is prepended to the PATH environment (Path=C:\Python38\Scripts\;C:\Python38\;..). For my ease and workflow, I prepended my folder to it (C:\Dima\;). Place the [x86 DLL](https://secret.club/2020/04/23/directory-deletion-shell.html) in one of the writable folder paths.


*C:\Program Files (x86)\GlassWire\GWCtlSrv.exe*
GlassWire (32bit) loads the following DLLs during boot as SYSTEM:
- swift.dll
- CSUNSAPI.dll
- nfhwcrhk.dll
- SureWareHook.dll
- aep.dll
- nfhwcrhk.dll
- atasi.dll
- nuronssl.dll
- ubsec.dll

{F904704}
{F904728}


*C:\Program Files (x86)\GlassWire\GlassWire.exe*
Glasswire GUI (32bit) loads the following DLL after user logon as the current user:
- Wtsapi32.dll.dll

{F904730}


I hope this helps. Please let me know if you require more information.

Kind regards,
Dima van de Wouw
[Outflank](https://outflank.nl/)

## Impact

Successful exploitation of the GlassWire service allows an attacker to gain SYSTEM privileges and inject into the GlassWire service process at boot.
Successful exploitation of the GlassWire GUI allows a user to gain persistence. On shared machines, this would allow a user to move laterally to sessions of other users.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **2020-07-13** @linkyj: We should have feedback at the end of the week or early next week.  Thank you for your detailed report.
- **2020-07-14** @linkyj: Please try this updated version and let us know if it has solved the issue.  Thank you.

https://www.dropbox.com/s/j96g8t9ujbqzihn/glasswire-setup-2.2.228.exe?dl=0
- **Report New**
- **2020-07-16** @linkyj: Thank you.  I will let the team know.
- **Report Needs More Info**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2021-05-05** @linkyj: This version of GlassWire was updated and has not been available for our users since before August of 2020.  Thank you.
- **2021-05-05** @dawouw: Yes, that's great! Since this information is not 'sensitive' anymore, I thought we could publish/disclose it.
- **2021-05-05** @linkyj: On our end the email that HackerOne sends says the report will be automatically disclosed if we take no action so I just posted a comment and took no action so it will be disclosed. Sorry for any confusion.

To stop the disclosure I would have to choose "cancel disclosure request" and we're not going to do that.

Thanks again for your report and help!
- **2021-05-05** @dawouw: Thank you! (This is the first time Hacker1 report disclosure, so thank you for the explanation!)
- **Report Became Public**
