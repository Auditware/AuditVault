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
date: 2025-06-13
submitted: 2024-03-11T19:40:38.520Z
bounty_usd: null
votes: 85
cve: []
program: "[[programs/rootstocklabs|Rootstock Labs]]"
reporter: "guido"
source: "https://hackerone.com/reports/2412583"
title: "Crafted smart contract can take 8 minutes to execute due to bug in modexp precompile."
---
# Crafted smart contract can take 8 minutes to execute due to bug in modexp precompile.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 85 | **Program:** Rootstock Labs | **Disclosed:** 2025-06-13

- Report: [https://hackerone.com/reports/2412583](https://hackerone.com/reports/2412583)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2024-03-11T19:40:38.520Z

## Timeline

- **Report Filed**
- **2024-03-12** @vrongusername: Hello @guido !

Thank you for the report!
Can you please provide us a solidity code of the contract?
- **2024-03-12** @bernacodesido: Hey @guido 

Thanks for your report. We are currently analyzing it.
- **2024-03-12** @guido: Thanks, do you still need a Solidity version of this? It might take me some time to construct.
- **2024-03-12** @vrongusername: @Guido, no need if you haven't used it.
- **2024-03-24** @guido: Do you have an update you can share on this please?
- **2024-03-26** @h1_analyst_dmitry: Hi @guido,

I have pinged the IOVLabs team regarding this report. I will get back to you as soon as I hear back from them. Please bear with us in the meantime.

Thank you for your patience.

Cheers,
@h1_analyst_dmitry
- **2024-03-26** @vrongusername: Hello @guido,
Thanks for your patience! We confirmed the issue and currently fixing it.
We'll back to you soon.
- **2024-04-08** @guido: @vrongusername update please?
- **2024-04-11** @guido: I believe you have fixed the bug, please proceed to the reward now.
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2024-07-17** @guido: @bernacodesido Can I talk about this bug publicly (just this bug, not the other oones I reported)? Did everyone upgrade their nodes to an unaffected version?
- **Agreed On Going Public**
- **2025-06-13** @vrongusername: Hi @guido,
Would you be ok if we disclose this issue as well?
- **Agreed On Going Public**
- **Report Became Public**
