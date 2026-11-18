---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/classic-buffer-overflow
  - env/web
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "Classic Buffer Overflow"
enriched: true
body: true
date: 2018-07-19
submitted: 2018-05-13T00:57:18.088Z
bounty_usd: null
votes: 154
cve: []
program: "[[programs/valve|Valve]]"
reporter: "chippy"
source: "https://hackerone.com/reports/351014"
title: "Malformed .BSP Access Violation in CS:GO can lead to Remote Code Execution"
---
# Malformed .BSP Access Violation in CS:GO can lead to Remote Code Execution

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 154 | **Program:** Valve | **Disclosed:** 2018-07-19

- Report: [https://hackerone.com/reports/351014](https://hackerone.com/reports/351014)
- CWE: Classic Buffer Overflow
- Submitted: 2018-05-13T00:57:18.088Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

A malformed .BSP can trigger an Access Violation on CS:GO that can lead to arbitrary code execution on a remote computer. I have attached a copy of the malformed .BSP which reliably triggers an Access Violation on CS:GO.

## Impact

An attacker hosting a malicious server could compromise a remote client by having them download a custom map, triggering remote code execution on the victim's computer.

## Timeline

- **2018-05-13** @chocolatechipmuffi: Thanks for your report! We need some more information before we can adequately review this report. Is it possible you could provide a clear step-by-step PoC showing your vulnerability?  Thanks again for your report and we hope to hear back from you soon.

Kind regards.
- **2018-05-13** @chippy: Yes absolutely!

###Reproduction Steps

1.) Launch CS:GO, w/ de_fuzz.bsp in Map directory
2.) Attach WinDBG to CS:GO Process
3.) Launch de_fuzz from CS:GO game console
4.) Monitor the crash from WinDBG

I've attached a compressed zip containing images of each of the above steps. Enjoy!
- **Report Filed**
- **Report Triaged**
- **2018-05-17** @chippy: To provide additional context, please see the attached image. Based on our analysis the buffer overflow is occuring in zipFileHeader.
- **2018-06-05** @chippy: Hello, may I have an update on this kindly?
- **2018-06-16** @chippy: Still kindly awaiting an update on this critical issue.
- **2018-06-26** @chippy: Any update?
- **2018-07-10** @mcjohn: Hello Chippy,

Apologies for the delay. This has been fixed and the fix will ship in the next CSGO update.
- **Bounty Awarded**
- **2018-07-10** @chippy: Great to hear, thanks @mcjohn
- **2018-07-10** @chippy: @valve it's a great honor. Many more bugs to come, thanks for working with HackerOne to create an excellent disclosure program.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
