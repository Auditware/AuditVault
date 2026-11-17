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
