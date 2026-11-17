---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/out-of-bounds-read
  - env/network
substate: "resolved"
weakness: "Out-of-bounds Read"
enriched: true
date: 2021-05-04
submitted: 2020-02-29T17:19:45.863Z
bounty_usd: 7500
votes: 219
cve: []
program: "[[programs/valve|Valve]]"
reporter: "slidybat"
source: "https://hackerone.com/reports/807772"
title: "OOB reads in network message handlers leads to RCE"
---
# OOB reads in network message handlers leads to RCE

> **Severity:** Critical | **Bounty:** 7,500 USD | **Votes:** 219 | **Program:** Valve | **Disclosed:** 2021-05-04

- Report: [https://hackerone.com/reports/807772](https://hackerone.com/reports/807772)
- CWE: Out-of-bounds Read
- Submitted: 2020-02-29T17:19:45.863Z

## Timeline

- **Report Filed**
- **2020-03-01** @ktistai: Hi @slidybat,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@ktistai
- **Report Needs More Info**
- **Report New**
- **2020-03-03** @h1_analyst_oceana: Hello @slidybat,

Thanks for the update! I am looking into this, and I will update you once there is more information to share.

Cheers,

@magicmouse
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report Inactive**
- **2020-07-25** @slidybat: Hi @ktistai,

I've found an infoleak that can make this bug 100% reliable. I submitted it as a separate report, you can find the details for it in #942359.

Attached is an implementation for a PoC that makes use of this infoleak. Other than chaining with the infoleak it contains almost no differences to the initial PoC in the report, but here's a video showcasing it anyways:
{F922660}

Hoping we can get this report reopened, let me know if anything else is needed.

Thanks.
- **Report Reopened**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2020-08-06** @slidybat: Hi @ktistai.

Server is now set up. Here are the details:
IP - `139.99.199.147:27015`
Password - `2214`

To summarize the replication steps:
1) Start CS:GO and ensure that `sv_allowuploads` is set to `1`. This can be done by entering the command `sv_allowuploads 1` into the console.
2) Connect to the server listed above. Can be done by entering this into console: `connect 139.99.236.89:27015; password 2214`
3) Once fully connected `calc.exe` should be automatically popped. If not check chat messages in-game (press Y after selecting a team); the server may have failed to leak `client.dll` base address, in which case you need to go into the `csgo` folder of the game and delete `_leak.txt` and reattempt from step 1.

Should only take a few attempts at most to get working.
- **2020-08-06** @slidybat: Just noticed in step 2 above I used the wrong IP address, the original IP that was first listed is the correct one. The amended command is: `connect 139.99.199.147:27015; password 2214`
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2020-08-13** @ktistai: Hi @slidybat

I've tried with both the map and without it on my filesystem and the. With the map copied from here, I'm getting another error that the map is not the same as the server's. 

{F947645}

When deleting both files and letting the game download them from your server, it hangs as what it looks downloading the second file (`.nav` ) as the BSP finishes loading. 

After finishing 100%, it goes back to 0: 

{F947642} 

{F947641}


and then it just hangs. I'll leave it until later, but I doubt it's a network/latency issue. 

Thanks, 
@ktistai
- **2020-08-14** @slidybat: Hi @ktistai,

Odd that you're getting an error about map not being the same, I copied it directly from the server. I also tested it myself and worked fine. Regardless, I set `sv_pure 0` on the server so that it doesn't kick you for mismatched files.

As for the hanging, I tested again and didn't encounter that. I also tested on other devices, which does make me think it is a network issue.

Since the map seems to be causing so much trouble I also decided to change to a map that is available in the default CS:GO installation (`ar_baggage`). The reason I used a custom map in the first place was that existing maps tend to have lots of assets that cause game allocations and slightly decrease the success rate of the infoleak.

Sorry for all the back and forth, you seem to be coming across a lot of issues that don't pop up for me. Hopefully this sorts them out.

Thanks.
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Severity Updated**
- **2020-11-15** @slidybat: Hi, any updates?
- **2020-11-16** @ktistai: Hi @slidybat , the report was just sent to the team that is supposed to fix it as of two weeks ago. Please be aware that for Valve fixing these issues may take time, as the releases are not so often, so the pipeline is slow.
- **2021-04-28** @slidybat: Seems this bug has been fixed in the latest beta release of CS:GO.
The usermessage handler now contains proper upper/lower bounds checks:
{F1281312}
- **Bounty Awarded**
- **Report Resolved**
- **2021-05-01** @slidybat: Hi @mcjohn,

Glad to see this report finally resolved, but can I ask why the bounty was reduced from the usual amount? The policy states that critical severity bugs for CS:GO should be about $7500.

Thanks.
- **Agreed On Going Public**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
