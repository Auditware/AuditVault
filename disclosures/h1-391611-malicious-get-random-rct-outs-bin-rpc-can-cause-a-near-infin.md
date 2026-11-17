---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2018-09-28
submitted: 2018-08-07T21:32:40.904Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/monero|Monero]]"
reporter: "ahook"
source: "https://hackerone.com/reports/391611"
title: "Malicious get_random_rct_outs.bin rpc can cause a near-infinite loop"
---
# Malicious get_random_rct_outs.bin rpc can cause a near-infinite loop

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Monero | **Disclosed:** 2018-09-28

- Report: [https://hackerone.com/reports/391611](https://hackerone.com/reports/391611)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2018-08-07T21:32:40.904Z

## Timeline

- **Report Filed**
- **2018-08-07** @ahook: Update: the list of 168 nodes I checked were drawn from this guy's site: https://www.xmr.be/. Which on second look is limited only to "open" nodes, so that 25% is actually most likely something like 2.5%.
- **2018-08-13** @moneromooo: OK. Not critical since it is only a DoS that affects people who expose their RPC port to the world, though. I started added some rough sanity checks to some a while back, but that RPC's obsolete, so I guess I'll remove it.

I have a preliminary branch which requires the client to mine a certain amount based on the amount of work required (https://github.com/moneromooo-monero/bitmonero/commits/share-rpc) which will get rid of the actual DoS.
- **2018-08-14** @moneromooo: https://github.com/monero-project/monero/pull/4253

This might break the mymonero server, so if so it won't go in, and I'll just add a sanity check on the amount of outputs.
- **Report Triaged**
- **2018-08-14** @ahook: Cool, yeah, I think a simple sanity check on the outs_count should suffice.
- **Report Resolved**
- **2018-09-28** @ahook: Awesome, thanks!

44Yg7iSGmrqdow2XKhLWxDMF17JR6SmyHQkNzaeaCiYL2YpMhUcapJ6XvHR1S5Kj87bRoeCmrgTK2Lrn58XiPFSJHtPKgXe
- **2018-09-28** @luigi1111w: Sent 3 XMR: <a1de8a4db49b8e231c1da14304abb8ddfcbef61c6a1ae66e01e1c877b45b18e5>
- **Swag Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
