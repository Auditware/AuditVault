---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/classic-buffer-overflow
  - env/web
substate: "resolved"
weakness: "Classic Buffer Overflow"
enriched: true
body: true
date: 2020-02-27
submitted: 2018-08-21T06:33:12.777Z
bounty_usd: null
votes: 321
cve: []
program: "[[programs/valve|Valve]]"
reporter: "kohtep2010"
source: "https://hackerone.com/reports/397545"
title: "Malformed .BMP file in Counter-Strike 1.6 may cause shellcode injection"
---
# Malformed .BMP file in Counter-Strike 1.6 may cause shellcode injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 321 | **Program:** Valve | **Disclosed:** 2020-02-27

- Report: [https://hackerone.com/reports/397545](https://hackerone.com/reports/397545)
- CWE: Classic Buffer Overflow
- Submitted: 2018-08-21T06:33:12.777Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

With the vulnerability of the GoldSource Engine, the server is able to perform remote code execution on the client, overwriting the stack when reading the BMP file. The problem is in the LoadBMP8 function, which is executed when the player connects to the server, by loading the "overviews\%MAPNAME%.bmp" file. If we send a badly formed file to this function, then we will be able to rewrite the stack of the function by setting the own code in the stack and passing program control to it.

I've wrote a program that compiles file like that. The shellcode, which runs on the stack, starts the "calc.exe" process with the WinExec function.

For the client to execute this file, the server must send this file to the client. The server can do this if map that is not present on the client is launched. The server must load a map with random name, for example, "definitely_missing_client_map.bsp". In this case, the name of the BMP file must also be "definitely_missing_client_map.bmp" and it must be in "overviews" folder. You also must create the "overviews\definitely_missing_client_map.txt" file, which is overview description. The nonstandard name of the map prompts the client to download the missing files (bsp, bmp and txt). Upon completion, when the client is able to see the map, the BMP file will be loaded and the binary code from BMP file will be executed on the stack.

I've attached the source code of "compiler" to the message. You can find more detailed instructions in the code comments. You need to compile this project in "Release" configuration and then start this project. After that, malformed "de_dust2.bmp" file will be produced.

## Impact

An attacker can execute remote code on the client's machine.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-08-21** @mikela: Hi @kohtep, thanks for the submission, this is definitely a valid RCE vector.

Were you able to force the client to download the overview files without specifying them in a RES file for the map? I was able to trigger to automatic download and loading of the bitmap but not with following your steps exactly. If I only create a nonexistant BSP file, BMP and overview description file only the BSP downloads on connection to the server. It's only once I create a RES file to accompany the BSP file and reference the BMP and overview description that those download as well. Not that this is a problem with regards to issue, just something additional I found while reproducing the bug.
- **2018-08-22** @kohtep2010: Hello! I did not use RES files to force the client to download the rest of the files other than BSP (if I understood you correctly). The way I described in the message worked for me, and it seemed to me the simplest. I think that you can also try to upload files to client using engine functions Netchan_CreateFileFragments/Netchan_CreateFileFragmentsFromBuffer, which allow you to transfer files in both directions.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
