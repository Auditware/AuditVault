---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/memory-corruption-generic
  - env/web
  - vuln/code-injection
  - vuln/dos
  - impact/rce
substate: "resolved"
weakness: "Memory Corruption - Generic"
enriched: true
body: true
date: 2019-10-09
submitted: 2019-02-14T01:34:41.616Z
bounty_usd: null
votes: 90
cve: []
program: "[[programs/valve|Valve]]"
reporter: "chippy"
source: "https://hackerone.com/reports/495793"
title: "Malformed .MDL triggers an Access Violation on GoldSRC (hl.exe)"
---
# Malformed .MDL triggers an Access Violation on GoldSRC (hl.exe)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 90 | **Program:** Valve | **Disclosed:** 2019-10-09

- Report: [https://hackerone.com/reports/495793](https://hackerone.com/reports/495793)
- CWE: Memory Corruption - Generic
- Submitted: 2019-02-14T01:34:41.616Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

A malformed player .MDL triggers an exploitable Access Violation on GoldSRC engine games (Half-Life) upon invocation, which could lead to remote code execution on a client.

###Crash Information
FAILURE_ID_HASH_STRING:  um:invalid_pointer_write_exploitable_c0000005_hw.dll!createinterface
Event Type: Exception
Exception Faulting Address: 0x4c01000
First Chance Exception Type: STATUS_ACCESS_VIOLATION (0xC0000005)
Exception Sub-Type: Write Access Violation

FOLLOWUP_IP: 
hw!CreateInterface+282aa
03a554ea d95efc          fstp    dword ptr [esi-4]

PROBLEM_CLASSES: 

    ID:     [0n309]
    Type:   [@ACCESS_VIOLATION]
    Class:  Addendum
    Scope:  BUCKET_ID
    Name:   Omit
    Data:   Omit
    PID:    [Unspecified]
    TID:    [0x6e30]
    Frame:  [0] : hw!CreateInterface

    ID:     [0n282]
    Type:   [INVALID_POINTER_WRITE]
    Class:  Primary
    Scope:  DEFAULT_BUCKET_ID (Failure Bucket ID prefix)
            BUCKET_ID
    Name:   Add
    Data:   Omit
    PID:    [Unspecified]
    TID:    [0x6e30]
    Frame:  [0] : hw!CreateInterface

    ID:     [0n156]
    Type:   [ZEROED_STACK]
    Class:  Addendum
    Scope:  BUCKET_ID
    Name:   Add
    Data:   Omit
    PID:    [0x300]
    TID:    [0x6e30]
    Frame:  [0] : hw!CreateInterface

    ID:     [0n115]
    Type:   [EXPLOITABLE]
    Class:  Addendum
    Scope:  DEFAULT_BUCKET_ID (Failure Bucket ID prefix)
            BUCKET_ID
    Name:   Add
    Data:   Omit
    PID:    [0x300]
    TID:    [0x6e30]
    Frame:  [0] : hw!CreateInterface

BUGCHECK_STR:  APPLICATION_FAULT_INVALID_POINTER_WRITE_ZEROED_STACK_EXPLOITABLE

###Steps for Reproducing the Crash
Place the attached .MDL in the games "Gman" multiplayer model folder (Steam\steamapps\common\Half-Life\valve\models\player\gman) Load the attached .MDL by setting the player character to "Gman" from the games multiplayer menu. Then, start a local game by typing "map crossfire" in console. Finally, execute the command "thirdperson" in console. The game will crash.

## Impact

An attacker hosting a malicious server could compromise a remote client by having them download a custom model, triggering remote code execution on the victim's computer.

## Timeline

- **Report Filed**
- **2019-02-14** @h1_analyst_leon: Hi @chippy - Thanks for the report. This report is currently being reviewed and you will be updated when there is additional information to share.
- **2019-04-08** @chippy: Hey everyone, just a little bump on this to see where things are. Hope all is well as always
- **Report Severity Updated**
- **Report Triaged**
- **2019-07-24** @chippy: No problem at all! Glad to hear. Let me know if there's anything I can do to help. Have some interesting server-side reports coming up as well.
- **Bounty Awarded**
- **2019-07-25** @chippy: Much appreciated @valve . Would love to have this one publicly disclosed once the patch is live.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
