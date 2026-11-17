---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/array-index-underflow
  - env/web
substate: "resolved"
weakness: "Array Index Underflow"
enriched: true
date: 2019-09-17
submitted: 2019-03-21T13:30:56.037Z
bounty_usd: 3000
votes: 229
cve: []
program: "[[programs/valve|Valve]]"
reporter: "nyancat0131"
source: "https://hackerone.com/reports/513154"
title: "Unchecked weapon id in WeaponList message parser on client leads to RCE"
---
# Unchecked weapon id in WeaponList message parser on client leads to RCE

> **Severity:** Critical | **Bounty:** 3,000 USD | **Votes:** 229 | **Program:** Valve | **Disclosed:** 2019-09-17

- Report: [https://hackerone.com/reports/513154](https://hackerone.com/reports/513154)
- CWE: Array Index Underflow
- Submitted: 2019-03-21T13:30:56.037Z

## Timeline

- **2019-03-21** @nyancat0131: P/S: `poc_calc_pop.zip` contains a video of the reproduction.
- **2019-03-21** @nyancat0131: Another P/S: I think there could be a way that won't need additional weapon sprites list to trigger RCE.
- **Report Filed**
- **2019-03-25** @h1_analyst_leon: Hey @nyancat0131 - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
- **Report Needs More Info**
- **Report New**
- **2019-03-27** @nyancat0131: P/S: `weapon_pwn.txt` is only required on the server-side, the client will download it automatically when connecting to the server, assuming there's no `weapon_pwn.txt` in client's `cstrike/sprites` directory. I used `weapon_pwn.txt` just for the sake of this PoC, attackers can use an arbitrary name, as long as it's a valid file name.
- **Report Triaged**
- **2019-04-12** @nyancat0131: Hello @mikela, just tested and verified that the fix works correctly. BTW, it has been a bit long since my old reports were patched, why haven’t they been resolved yet? :(
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
