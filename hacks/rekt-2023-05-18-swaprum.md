---
tags:
  - blockchain/arbitrum
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/privacy
  - vuln/dependency/upgradeable-contract
  - impact/loss-of-funds/direct-drain
  - precondition/insider
  - novelty/variant
title: "Swaprum - REKT"
protocol: "[[Swaprum]]"
date: 2023-05-18
loss_usd: 3000000
auditors:
source: "https://rekt.news/swaprum-rekt"
excerpt: "Swaprum, an Arbitrum-based DEX, pulled the rug for $3M on Thursday. Certik, the project's auditor, has since updated Swaprum’s security score to “Exit Scam”. Too little, too late?"
genome:
  - "[[upgradeable-contract]]"
  - "[[direct-drain]]"
  - "[[insider]]"
  - "[[variant]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
---
# Swaprum - REKT

> **Loss:** $3,000,000 | **Date:** 2023-05-18 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/swaprum-header.png)

**Swaprum, an Arbitrum-based DEX, pulled the rug for $3M on Thursday.**

While the project’s social media presence and GitHub repos have been deleted, Swaprum’s [website](https://swaprum.finance/) remains live, proudly displaying Certik’s seal of approval in its banner.

This latest incident comes less than a month after [Merlin DEX rugged $1.8M](https://rekt.news/merlin-dex-rekt/), sparking a debate as to whether a Certik audit was more of a red flag than a mark of confidence.

This is the 4th rug over $1M we’ve covered so far this year, all of them supposedly audited.

But not all audits are created equal…

_When will we learn?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Beosin](https://twitter.com/BeosinAlert/status/1659482287422193664)_

_As with most rug-pulls, the mechanics behind the incident were not complicated._

**The project’s reward [contract](https://arbiscan.io/address/0x99801433f5d7c1360ea978ea18666f7be9b3abf7#code) was [upgraded](https://arbiscan.io/tx/0xe2cd28c9c6ecdc6c5297cff39bf28271d8a97cd02cbc7b43fe0e9da650325ead) to a [new version](https://arbiscan.io/address/0xcb65d65311838c72e35499cc4171985c8c47d0fc#code) which included the backdoor function _add()_.**

_add()_ sends users LP tokens to the team’s Deployer address, which was able to steal the funds by draining the underlying liquidity.

Attacker address (Swaprum: Deployer): [0xf2744e1fe488748e6a550677670265f664d96627](https://arbiscan.io/address/0xf2744e1fe488748e6a550677670265f664d96627)

Example tx: [0x36fef881…](https://arbiscan.io/tx/0x36fef881f7e9560db466a343e541072a31a07391bcd0b9bcdb6cfe8ae4616fc0)

Funds were bridged to [Ethereum](https://etherscan.io/address/0xaaf8b44376f4ef3ed477eeeb3553b7623fef5e1c) where a total of 1620 ETH was deposited into Tornado Cash.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

It should be noted that the upgraded (malicious) contract was not included in the [audit](https://skynet.certik.com/projects/swaprum). But the capability to upgrade contracts containing user funds to an arbitrary deployment was always there...

**Certik does mention major centralisation issues in Swaprum’s code, remarking that the contract owner has authority over certain aspects of the protocol.**

However, the wording mainly refers to external threats:

>Any compromise to the _owner account may allow the hacker to take advantage of this authority…

>If an attacker compromises the account, he can change the implementation of the contract and drain tokens from the contract.

**Given the recent backlash, one would think that auditors might make an effort to be more explicit about the potential for malicious insiders, reflecting the fact in the report’s wording.**

A simple ‘ruggability’ score would go a long way to communicating these risks in a degen-friendly format.

_However, the idea probably wouldn’t go over well with grifters looking to rubber stamp their latest scam._

**Certik has since updated Swaprum’s security score to “Exit Scam”.**

_Too little, too late?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
