---
tags:
  - blockchain/arbitrum
  - blockchain/bsc
  - sector/governance
  - sector/lending
  - sector/stable
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Radiant Capital - REKT"
protocol: "[[Radiant Capital]]"
date: 2024-01-02
loss_usd: 4500000
auditors:
source: "https://rekt.news/radiant-capital-rekt"
excerpt: "2024 is off to a bright start... Lending protool Radiant Capital lost $4.5M, to a known bug. Keeping up with the security landscape is key, especially when dealing with forked code."
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Radiant Capital - REKT

> **Loss:** $4,500,000 | **Date:** 2024-01-02 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/radiant-header.png)

_2024 is off to a bright start..._

**Lending protool Radiant Capital lost 1900 ETH ($4.5M), yesterday, to a known bug affecting freshly-launched markets.**

Radiant, a fork of Aave V2, operates on Arbitrum and BSC, with the hack occurring on the Arbitrum deployment’s new native USDC market.

_It appears the attacker had been lying in wait, [likely having identified](https://twitter.com/lemiscate/status/1742338944057114972) the vulnerability in Aave-forks via updates to the Aave protocol itself._

The [attacker’s address](https://twitter.com/delucinator/status/1742314791795068993), as well as [Discord screenshots](https://twitter.com/solvingKasada/status/1742316833867550918), were posted to Twitter, raising the alarm. An [official confirmation](https://twitter.com/RDNTCapital/status/1742338729925112272) came later, adding:

>No current funds are at risk.

_So, just the $4.5M that had already been stolen, then?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Peckshield](https://twitter.com/peckshield/status/1742334242120466580), [Ancilia](https://twitter.com/AnciliaInc/status/1742323976251273332)_

**The issue in forked Aave V2 code affects recently-launched (and therefore _empty_) markets.**

A potential attacker has a brief window after launch to use a flash loan to manipulate the value of collateral, thanks to the combination of a rounding error and a totalSupply value of 0.

_The exploiter wasted no time, [deploying](https://arbiscan.io/tx/0x81a1414641bc823cd623208ba4c19a6cfc94f363050487bb122c15dceadc8937) their [attack contract](https://arbiscan.io/address/0x39519c027b503f40867548fb0c890b11728faa8f) just six seconds after the new [market](https://arbiscan.io/address/0x3a2d44e354f2d88ef6da7a5a4646fd70182a7f55) was [activated](https://arbiscan.io/tx/0x0e5330ad77b9b806cb9f6ea595d58552f341dbad0691e0599ab5f1caf214c247)._

The bug was previously mitigated in the original Aave protocol by simply including an initial deposit with the creation of new markets, ensuring they are never sitting empty.

Given the speed of the attack, the attacker had clearly prepared everything in advance whilst waiting for the [proposal to add the market](https://community.radiant.capital/t/proposal-gauntlet-usdc-e-migration-parameter-adjustment-recommendation/1478) (which [passed](https://snapshot.org/#/radiantcapital.eth/proposal/0xf1822c8cded8bef5c16334413bc02463104e9c67d9ad06dce7f7f277aad72ba5) on December 25th) to be enacted.

Attacker’s address: **[0x826d5f4d8084980366f975e10db6c4cf1f9dde6d](https://arbiscan.io/address/0x826d5f4d8084980366f975e10db6c4cf1f9dde6d)**

Attack contract: [0x39519c027b503f40867548fb0c890b11728faa8f](https://arbiscan.io/address/0x39519c027b503f40867548fb0c890b11728faa8f)

Attack tx 1: [0x1ce7e9a9…](https://arbiscan.io/tx/0x1ce7e9a9e3b6dd3293c9067221ac3260858ce119ecb7ca860eac28b2474c7c9b)

Attack tx 2: [0x2af55638…](https://arbiscan.io/tx/0x2af556386c023f7ebe7c662fd5d1c6cc5ed7fba4723cbd75e00faaa98cd14243)

Attack tx 3: [0xc5c4bbdd…](https://arbiscan.io/tx/0xc5c4bbddec70edb58efba60c1f27bce6515a45ffcab4236026a5eeb3e877fc6d)

The Radiant Team has sent an [on-chain message](https://arbiscan.io/tx/0xcd1865e3bf185fc5fe0b5fb055f6d74cfa68ee50335ff92ad721063538922664) to the hacker’s address (where funds remain), and appear confident that they’re dealing with a whitehat “_for various reasons_”.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Despite [four audits](https://docs.radiant.capital/radiant/contracts-and-security/audits/v2-audits), from OpenZeppelin, BlockSec, Peckshield and Zokyo, a constantly-evolving security landscape means updates _must_ be made in a timely manner.**

_Especially when dealing with forked code._

We've discussed the risks of forks plenty of times, with multiple [leaderboard entries](https://rekt.news/leaderboard/) down to vulnerabilities patched in one place before being exploited elsewhere.

When copy-pasting an established project, more eyes are focused on the original project’s larger TVL, providing an early warning system for bugs like these.

**But if [lessons aren’t learned](https://twitter.com/ChainLight_io/status/1742561576077709405), there’s little to be done.**

_Are any other forked protocols planning to launch new markets soon?_

_Are they up to date on the risks?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
