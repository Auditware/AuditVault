---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/stack-overflow
  - env/web
substate: "resolved"
weakness: "Stack Overflow"
enriched: true
body: true
date: 2019-09-17
submitted: 2019-03-04T22:02:57.059Z
bounty_usd: 1000
votes: 62
cve: []
program: "[[programs/valve|Valve]]"
reporter: "nyancat0131"
source: "https://hackerone.com/reports/504951"
title: "Malformed playlist.txt in GoldSrc games leads to Access Violation & arbitrary code execution"
---
# Malformed playlist.txt in GoldSrc games leads to Access Violation & arbitrary code execution

> **Severity:** High | **Bounty:** 1,000 USD | **Votes:** 62 | **Program:** Valve | **Disclosed:** 2019-09-17

- Report: [https://hackerone.com/reports/504951](https://hackerone.com/reports/504951)
- CWE: Stack Overflow
- Submitted: 2019-03-04T22:02:57.059Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

A crafted `playlist.txt` can be used to exploit a stack overflow vulnerability in `GameUI.dll` that can lead to arbitrary code execution.

# Reproduction
Place attached `playlist.txt` in game directory (`valve`, `cstrike`, etc.). The game will crash when it tries to play `Splash` track.

# Exploitability
The file can be sent from server with `precache_generic` function (custom `mp.dll`, amxx plugins, etc.). I don't know ant way to force reload the playlist, so for the exploit to trigger, the client must be restarted. In my opinion, it's still dangerous. And this method won't work if the client already had `playlist.txt` in the game directory.

## Impact

The attacker can use this to do many things, from crashing the client to stealing important data.

## Timeline

- **2019-03-04** @nyancat0131: Here is a reproduction video of the bug. The exploit works even if `playlist.txt` is in `cstrike_downloads` because it's a search path of the game's file system.
- **Report Filed**
- **2019-03-05** @h1_analyst_decimo: Thank you for reporting this potential issue, 

Your report is currently being examined by the HackerOne triage team. You will receive further details, or questions, as soon as technically possible. Thanks for your patience.

Cheers,
@still
- **2019-03-08** @nyancat0131: Update: this `playlist.txt` will reliably run `c:/windows/system32/calc.exe` :)
- **2019-03-09** @nyancat0131: Another update: I've found a way to remotely force the client to restart, using this AMXX snippet:
```
stock SendCmd(const iClient, const szCommand[]) {
    message_begin(MSG_ONE, SVC_DIRECTOR, _, iClient);
    write_byte(strlen(szCommand) + 2);
    write_byte(10);
    write_string(szCommand);
    message_end();
}
```
and send `disconnect; _restart` command to the client.
- **Report Severity Updated**
- **2019-03-15** @nyancat0131: Hello, may I have some update on this issue?
- **Report Severity Updated**
- **Report Triaged**
- **2019-03-15** @mikela: Also, thank you for the additional report about the SVC_DIRECTOR message being usable as a way to get around the command filter. This has been previously reported by another user and will be fixed in the next release.
- **2019-03-16** @mikela: Hi, this should now be fixed in the current beta releases of Half-Life, Counter-Strike and TFC. If you would like to verify that the issue is fixed I would appreciate it. This update should be released early next week if everything is good.
- **2019-03-16** @nyancat0131: Hello, I've just tested the beta update and confirmed that the vulnerability has been fixed. Thank you!
- **2019-03-22** @nyancat0131: Hi, any updates on the issue? I saw that the patch is now on the public branch too.
- **2019-03-29** @nyancat0131: Any updates? It has been a week since the patch went out.
- **2019-04-05** @mikela: Hi @nyancat0131, this and the other GoldSrc issues that you've submitted should be closed out soon. Thanks again!
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
