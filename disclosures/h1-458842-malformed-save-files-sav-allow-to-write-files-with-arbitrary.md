---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/malware
  - env/web
  - impact/dos-impact
  - fix/file-validation
substate: "resolved"
weakness: "Malware"
enriched: true
body: true
date: 2020-02-24
submitted: 2018-12-07T20:40:15.649Z
bounty_usd: 1500
votes: 99
cve: []
program: "[[programs/valve|Valve]]"
reporter: "splatt581"
source: "https://hackerone.com/reports/458842"
title: "Malformed save files (.sav) allow to write files with arbitrary extensions and content in GoldSrc-based games."
---
# Malformed save files (.sav) allow to write files with arbitrary extensions and content in GoldSrc-based games.

> **Severity:** High | **Bounty:** 1,500 USD | **Votes:** 99 | **Program:** Valve | **Disclosed:** 2020-02-24

- Report: [https://hackerone.com/reports/458842](https://hackerone.com/reports/458842)
- CWE: Malware
- Submitted: 2018-12-07T20:40:15.649Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The structure of the save file implies unpacking of temporary files with extensions ```.HL1```, ```.HL2``` and ```.HL3```. In the code of command 'load', there is a check for invalid substrings, such as ```..```, so unpacking the files into the top directories will not work. Also, it seems, there is a code for checking the file extension by substring ```*.HL?```. So, the problem is that it seems that checking for the presence of this substring is valid throughout the file path, and not just at its end. Therefore, such a check can be bypassed by inserting a substring in the middle of the file path and setting its extension.

In the attached archive there is a demonstration file ```fakeresource.sav```, which in turn unpacks the file ```test.HL1.dll``` with the ASCII string 'Hello World!' inside.

How to reproduce it:
1) Put the file ```fakeresource.sav``` in the path ```%gamedir%/SAVE/```;
2) Launch the game client and type in the console ```load fakeresource```;

The file ```test.HL1.dll``` will appear in the folder ```SAVE``` next to the file ```fakeresource.sav```.

Also, files can be unpacked into internal child directories, with the help of this it can be loaded into memory, the game client simply starts to connect to the mailicious server:
1) The server downloads the file ```SAVE/fakeresource.sav``` to the game client;
2) After downloading the file, the server, using the messages ```SVC_StuffText``` or ```SVC_Director```, execute the following string in the client console ```_setgamedir %gamedir%_downloads;_restart```. Let's take a closer look at this string:

* ```_setgamedir %gamedir%_downloads``` - sets the directory in which the .sav file is downloaded, for its subsequent load;
* ```_restart``` - applying the above changes.

3) Since the client was on the server, when the engine is restarted, it starts to reconnect to it. This time the server executes the following string in the client console ```logsdir SAVE/test.HL1/cl_dlls;log on;_setgamedir %gamedir%_downloads/SAVE/test.HL1;load fakeresource;_restart```. Consider more:

* ```logsdir SAVE/test.HL1/cl_dlls;log on``` - creates directories into which the .dll file will be unpacked, because files cannot be unpacked in non-existent directories;
* ```_setgamedir %gamedir%_downloads/SAVE/test.HL1``` - sets the directory against which the engine will try to load the client library 'cl_dlls/client.dll' into memory when restarted;
* ```load fakeresource``` - unpacks the file along the path ```SAVE/test.HL1/cl_dlls/client.dll```;
* ```_restart``` - restarts the engine to apply changes and load the new library into memory.

As a proof, there is a video in the attached archive showing the connection to the test server, which downloads such a .dll file to the client with a call to MsgBox.

## Impact

A malicious server can download the .sav file to the game client, execute commands on the client console to unpack a binary file, such as .dll, and load its malicious code into the client’s memory.

## Timeline

- **Report Title Updated**
- **Report Filed**
- **2018-12-10** @h1_analyst_leon: Hey @splatt581 - Thanks for your submission. We are currently reviewing your report and will get back to you once we have additional information to share.
- **2018-12-11** @nasr0x01: Hi @splatt581, thanks for your submission. We’re reviewing your report and we’ll get back to you as soon as there’s more to share.
- **Report Severity Updated**
- **Report Triaged**
- **2019-01-20** @mikela: Hi Vsevolod, thanks for the detailed report! I've verified the issue and fixed it internally. I'll let you know when a fixed version is available if you'd like to retest then.
- **Bounty Awarded**
- **Report Resolved**
- **2019-03-08** @splatt581: Hello everyone,

I believe that it's too early to close the report, because the update for the products has not yet been released in even the beta branch and I can't confirm it's resolve.
- **2019-03-14** @splatt581: A few hours ago an update was released in the beta branch, I tested it and confirm that the issue has been fixed.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
