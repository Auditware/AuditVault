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
date: 2019-09-18
submitted: 2018-06-09T05:00:54.753Z
bounty_usd: 4000
votes: 50
cve: []
program: "[[programs/rootstocklabs|Rootstock Labs]]"
reporter: "z3t"
source: "https://hackerone.com/reports/363636"
title: "DoS through PeerExplorer"
---
# DoS through PeerExplorer

> **Severity:** High | **Bounty:** 4,000 USD | **Votes:** 50 | **Program:** Rootstock Labs | **Disclosed:** 2019-09-18

- Report: [https://hackerone.com/reports/363636](https://hackerone.com/reports/363636)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2018-06-09T05:00:54.753Z

## Timeline

- **Report Filed**
- **2018-06-09** @julianor: Thanks for the clear and detailed report Jacob! 

To make your PoC attack succeed exhausting the program's memory and crashing it you had modified the target RSKj code . It will be helpful for us if you can provide more information to estimate the amount of memory an attacker can force the node to allocate and for how long for each source IP address.

Please share your modified `NodeChallengeManager`  and details of the target system against which the attack succeeded including CPU, RAM and Java VM memory limits configuration.

Thank you
- **2018-06-10** @z3t: Thanks for the quick response!

>It will be helpful for us if you can provide more information to estimate the amount of memory an attacker can force the node to allocate and for how long for each source IP address.

To measure the memory usage of `NodeChallengeManager.activeChallenges` I wrote a program (attached as `MemTest.java`) that uses the memory measurement utility [Classmexer](https://www.javamex.com/classmexer/). With this I measured memory usage in increments of 10,000 insertions into a structure identical to `activeChallenges`. The results of that are as follows:
```
0 entries = 64 bytes
10000 entries = 2785848 bytes
20000 entries = 5571200 bytes
30000 entries = 8421080 bytes
40000 entries = 11139592 bytes
50000 entries = 14122256 bytes
60000 entries = 16841752 bytes
70000 entries = 19560104 bytes
80000 entries = 22278232 bytes
90000 entries = 24996520 bytes
100000 entries = 28239416 bytes
```
The memory usage of each increment remains pretty consistent with each additional 10,000 entries occupying ~2.8MB of memory and 100,000 entries occupying ~28MB. Given these measurements and the limitation I mentioned in the initial report, with the default configuration a single host can theoretically force a maximum of ~18.2MB in allocations per minute.

As stated before, entries in `activeChallenges` are never removed unless a specific "pong" message is received, making the entries ineligible for garbage collection and thus resulting in the allocations remaining until the JVM shuts down.

>Please share your modified NodeChallengeManager and details of the target system against which the attack succeeded including CPU, RAM and Java VM memory limits configuration.

I've attached my modified `NodeChallengeManager.java` that I initially used to accelerate the PoC, but in my latest test I was able to trigger a crash without the modifications. Unfortunately I don't have the hardware resources to run a full test against a node running with the [recommended system specs](https://github.com/rsksmart/rskj/wiki/Node-Minimum-Requirements). However, because the allocated memory in the attack is never freed, a crash should be reachable regardless of system specs. My latest testing was against a node running on a 2GB RAM Debian server, the relevant JVM memory configurations for it are below:
```    
uintx InitialHeapSize                          := 33554432
uintx MaxHeapSize                              := 526385152
```
- **Report Severity Updated**
- **Report Triaged**
- **2018-06-11** @z3t: Thanks for the update. Just to add a clarification, I discovered that the full JVM crashes were due to the JVM not being able to reach its `MaxHeapSize` on the low-memory VM I initially used for testing. In subsequent tests the expected behavior of most threads crashing with `OutOfMemoryError`s was observed.
- **2018-06-12** @julianor: Hello Jacob,  

We would be grateful if you could review the fix pushed to the `update_explorer` branch and share your comments here.

https://github.com/rsksmart/rskj/commits/update_explorer 

Thank you!
- **2018-06-12** @z3t: I've reviewed the changes and the issue appears to be fixed.
- **Bounty Awarded**
- **Report Resolved**
- **2018-06-13** @z3t: Awesome, thank you so much for the bounty and quick fix! I'm fine with making this report public, but we should probably define some period of delay so users have time to update as needed.
- **Agreed On Going Public**
- **Manually Disclosed**
