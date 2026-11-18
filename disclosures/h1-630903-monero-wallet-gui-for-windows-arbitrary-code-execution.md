---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - os/windows
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2019-11-18
submitted: 2019-06-27T19:10:51.047Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/monero|Monero]]"
reporter: "l00ph0le"
source: "https://hackerone.com/reports/630903"
title: "Monero Wallet Gui for Windows (Arbitrary Code Execution)"
---
# Monero Wallet Gui for Windows (Arbitrary Code Execution)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Monero | **Disclosed:** 2019-11-18

- Report: [https://hackerone.com/reports/630903](https://hackerone.com/reports/630903)
- CWE: Code Injection
- Submitted: 2019-06-27T19:10:51.047Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Summary:
The windows version of the monero-wallet-gui.exe application allows for code injection. The monero-wallet-gui.exe utilizes a precompiled OpenSSL library called libeay32.dll. This OpenSSL library is trying to read a configuration file that doesn’t exist. By default, on windows systems, authenticated users can create under the c:\ drive. A user with low privileges can create the folder structure and copy a malicious openssl config and .dll files into their path. When the monero-wallet-gui.exe application is executed, the malicious .dll file is also executed. 

Description: 
If you download Microsoft sys internals process monitor and execute it. Then open the monero-wallet-gui.exe application, you can see the “monero-wallet-gui.exe” binary trying to read a file called openssl.cnf and getting the result “PATH NOT FOUND”. See attached screenshot (FileNotFound.png).

I believe the issue can be resolved by compiling the OpenSSL library using –openssldir parameter and specifying a directory that can only be written too by administrators (i.e. C:\Program Files, C:\ProgramData). Currently it looks for the “ssl” directory in the parent directory of the Monero install path. For example, if I download the monero-gui-win-x64-v0.14.0.0.zip file and save it to the c: drive, then extract the file, the install path becomes “C:\monero-gui-win-x64-v0.14.0.0\monero-gui-v0.14.0.0”. When monero-wallet-gui.exe is executed, it looks for the openssl.cnf file in “C:\monero-gui-win-x64-v0.14.0.0\ssl”, which doesn’t exist.

I’ve included two example exploits for this;

Exploit example 1
calc.c – source code of my .dll file to execute calc.exe
calc.dll – compiled version of the calc.exe library
openssl-calc.cnf – example malicious openssl config

Exploit example 2
backdoor.c – source code my .dll file to create a local administrator, this uses a known uac bypass
backdoor.dll – compiled version of the local admin backdoor library
openssl-backdoor.cnf - example malicious openssl config

Steps To Reproduce:
Download and extract monero-gui-win-x64-v0.14.0.0.zip to c: drive.

Exploit 1 – calc.exe – See attached video calc.mp4
1.	Login with a low privileged user (part of Users group)
2.	Open a cmd.exe and issue command: mkdir C:\monero-gui-win-x64-v0.14.0.0\ssl
3.	Copy calc.dll C:\monero-gui-win-x64-v0.14.0.0\ssl
4.	Copy openssl-calc.cnf to C:\monero-gui-win-x64-v0.14.0.0\ssl
5.	Rename openssl-calc.cnf to openssl.cnf
6.	Logout of low privileged user.
7.	Login with local administrator.
8.	Launch monero-wallet-gui.exe application.
9.	Calc.exe with execute.

Exploit 2 – create a local admin user (uac bypass) – See attached video backdoor.mp4
1.	Login with a low privileged user (part of Users group)
2.	Open a cmd.exe and issue command: mkdir C:\monero-gui-win-x64-v0.14.0.0\ssl
3.	Copy backdoor.dll to C:\monero-gui-win-x64-v0.14.0.0\ssl 
4.	Copy openssl-backdoor.cnf .dll to C:\monero-gui-win-x64-v0.14.0.0\ssl 
5.	Rename openssl-backdoor.cnf to openssl.cnf
6.	Logout of low privileged user.
7.	Login with local administrator.
8.	Launch monero-wallet-gui.exe application.
9.	Open “Computer Management”
10.	Navigate to “System Tools” -> “Local Users and Groups” -> “Users”
11.	A new user of “backdoor” with a password of “backdoor” was added.
12.	Right click on “backdoor” and click “Properties”, then click “Member Of”.
13.	The “backdoor” user is part of the local administrator group.

How can the system be exploited with this bug?
DLL Hi-jacking can be used for many nefarious purposes. It can be used by malware to propagate and establish persistence on a workstation. It can be used to privilege escalation in the post exploitation phases of an attack.

## Impact

The impact is high. Successful exploitation leads to arbitrary code execution on the windows system. There are many actions a nefarious individual could accomplish with this vulnerability. In addition to post-exploitation privilege escalation, another example could be ransomware, or other malware.

## Timeline

- **Report Filed**
- **2019-07-02** @anonimal: Hi @l00ph0le, thank you for the very clear report.

This is mostly a duplicate of https://hackerone.com/reports/407572 but that reporter disappeared soon after we had asked for more info, so I'm glad that you've filled in the gaps.

Quoting myself from that report:

>2018-09-19 00:44:54 anonimal I believe the solution would be to 1. install the DLLs in a protected space 2. *ENSURE* that the DLL is given a fully qualified path within the symbol table (however that works in windows). We have an *optional* InnoSetup installer, though that shouldn't be optional IMHO.

Do you feel that enforcing InnoSetup, in addition to properly building dependencies, will be an accurate solution?

Also, please paste an XMR address if you wish to receive bounty, thank you.
- **Report Triaged**
- **2019-07-02** @l00ph0le: Hi @anonimal 

Thanks for the response. My XMR address is: 46TahjVg2gSbzt4WRLU5oyXpzrP1HaYSEGhGB4ndzikm39XshYYknNxXcGz34v4GwX97p2vBc6pudgJBgBXCNHBZSKWK7DB

The report you linked is private, so I appreciate that you provided a quote of your question. Enforcing InnoSetup, building the dependencies properly, and ensuring DLL's are in a protected space is an appropriate remediation.

I've reported similar openssl issues to other bounty programs, and the remediation steps you've listed are the how they too have addressed the vulnerability.

Let me know if you need anything further.

Thank you

~Nick
- **2019-07-20** @luigi1111w: Sent 5 XMR: <106101bf62a97fc6b6d0146252a2ba8bc656d564ca9d4cbd00de99e6a7e681b6>
- **Swag Awarded**
- **2019-07-20** @l00ph0le: Thank you for the bounty!
- **Report Resolved**
- **Agreed On Going Public**
- **2019-11-18** @l00ph0le: Thank you for the update. Since this will be disclosed publicly I'd like to site credit to Rich Mirch for the original research on this openssl dll issue. He has a great blog https://blog.mirch.io/2019/06/10/cve-2019-12572-pia-windows-privilege-escalation-malicious-openssl-engine/ on a issue with the Private Internet Access client.
- **Agreed On Going Public**
- **Report Became Public**
