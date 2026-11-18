---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/stack-overflow
  - env/web
  - vuln/dos
substate: "resolved"
weakness: "Stack Overflow"
enriched: true
body: true
date: 2019-08-25
submitted: 2019-01-16T11:03:23.213Z
bounty_usd: null
votes: 99
cve: []
program: "[[programs/notepad-plus-plus|Notepad++]]"
reporter: "ammm"
source: "https://hackerone.com/reports/480883"
title: "Stack overflow in XML Parsing"
---
# Stack overflow in XML Parsing

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 99 | **Program:** Notepad++ | **Disclosed:** 2019-08-25

- Report: [https://hackerone.com/reports/480883](https://hackerone.com/reports/480883)
- CWE: Stack Overflow
- Submitted: 2019-01-16T11:03:23.213Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 

A stack buffer overflow vulnerability has been detected in XML parsing functionality  on Notepad++.

That's due to the fact that _invisibleEditView.getText function doesn't check buffer boundaries.

**Description:** 
Vulnerability src file: notepad-plus-plus/PowerEditor/src/Notepad_plus.cpp
Vulnerability line: line 1008
Variable affected: char encodingStr[128];
Function that overflows buffer: _invisibleEditView.getText

## Steps To Reproduce:

  1. Create a .xml file with a correct XML format
  2. Introduce a big XML field that overflows "encodingStr" buffer.
  3. Open the file with Notepad++ and application should crash.

## Supporting Material/References:

  * BoF_example1.xml -> Exploit example

## Impact

An attacker could create a malicious .xml file that triggers a stack buffer overflow on victim machine.

You only need to open attached .xml file example with Notepad++ to reproduce the exploit.

## Timeline

- **Report Filed**
- **2019-01-16** @lasagna: Hi @ammm,

Thanks for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@lasagna
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Severity Updated**
- **External User Joined**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
