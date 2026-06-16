---
tags:
  - blockchain/ethereum
  - blockchain/optimism
  - sector/bridge
  - sector/lending
  - sector/privacy
title: "Exactly Protocol - REKT"
protocol: "[[Exactly Protocol]]"
date: 2023-08-18
loss_usd: 7200000
auditors:
source: "https://rekt.news/exactly-protocol-rekt"
excerpt: "L2s have been going through something of a rekt-naissance lately. Exactly Protocol got hit for $7.2M by an exploit which drained users' collateral. Will Exactly ever financially recover from this?"
genome:
  - "[[bridge-message-validation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Exactly Protocol - REKT

> **Loss:** $7,200,000 | **Date:** 2023-08-18 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/exactly-header.png)

_L2s have been going through something of a rekt-naissance lately._

**[Exactly Protocol](https://twitter.com/ExactlyProtocol) becomes the latest victim of this summer’s on-chain crime spree, after being hit for $7.2M.**

The lending platform, based on Optimism, was targeted by an exploit which drained users' collateral.

Peckshield [raised the alarm](https://twitter.com/peckshield/status/1692469871962202522) and the Exactly team [responded](https://twitter.com/ExactlyProtocol/status/1692481399620858053) that they were investigating. An [update](https://twitter.com/ExactlyProtocol/status/1692509323690184966) came almost two hours later, stating that the protocol had been paused:

>We're actively investigating a security issue within our protocol. To ensure user safety, the protocol is temporarily paused (you can still withdraw assets). Our team is on top of this and will share more details asap.

**While the losses are heavy, the collateral (_heh_) damage looks to have been even heavier.**

DeFiLlama [shows](https://defillama.com/protocol/exactly) the project’s TVL to have dropped from $37M pre-hack, to $26M [post-hack](https://twitter.com/PeckShieldAlert/status/1692484653494751563).

The figure has continued to drop since, presumably as users who are [able to withdraw](https://twitter.com/MoJo_Fi/status/1692511090930815438) do so, and sits at less than $11M at the time of writing. The [EXA token](https://www.coingecko.com/en/coins/exactly-token) is also down almost 35% since the hack.

_Will Exactly ever financially recover from this?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[BlockSec](https://twitter.com/BlockSecTeam/status/1692533280971936059)_

The attack was made possible due to an insufficient check in the DebtManager contract ([proxy](https://optimistic.etherscan.io/address/0x675d410dcf6f343219AAe8d1DDE0BFAB46f52106), [implementation](https://optimistic.etherscan.io/address/0x16748Cb753A68329cA2117a7647aA590317EbF41#code)) as to whether the market address was valid.

This allowed the hacker to pass a fake market address, inserting the victim’s address as _msgSender, and thereby drain users’ collateral.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/exactly-code.png)

Exploiter address 1: [0x3747dbbcb5c07786a4c59883e473a2e38f571af9](https://optimistic.etherscan.io/address/0x3747dbbcb5c07786a4c59883e473a2e38f571af9)

Exploiter address 2: [0xe4f34a72d7c18b6f666d6ca53fbc3790bc9da042](https://optimistic.etherscan.io/address/0xe4f34a72d7c18b6f666d6ca53fbc3790bc9da042)

Exploiter address 3: [0x417179df13ba3ed138b0a58eaa0c3813430a20e0](https://optimistic.etherscan.io/address/0x417179df13ba3ed138b0a58eaa0c3813430a20e0)

Attack contract: [0x6dd61c69415c8ecab3fefd80d079435ead1a5b4d](https://optimistic.etherscan.io/address/0x6dd61c69415c8ecab3fefd80d079435ead1a5b4d#code)

Example attack tx: [0x3d6367de…](https://optimistic.etherscan.io/tx/0x3d6367de5c191204b44b8a5cf975f257472087a9aadc59b5d744ffdef33a520e)

_The attacker was [funded](https://etherscan.io/tx/0x97618de89d43593dda51585a07972a1267d11433e387f89bfc2831ce120c2f86) from Tornado Cash on [Ethereum](https://etherscan.io/address/0xe4f34a72d7c18b6f666d6ca53fbc3790bc9da042) before bridging to Optimism._

**Of the 4324 ETH (~$7.2M) of total proceeds from the hack, 1500 ETH ($2.5M) have been bridged back to Ethereum, where they remain.**

[BlockSec](https://twitter.com/MetaSleuth/status/1692529887628636439) provided the following chart illustrating the flow of funds:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/exactly-funds.png)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_Despite extensive [audits from four firms](https://docs.exact.ly/security/audits) (though none since the debtManager contract was uploaded to [GitHub](https://github.com/exactly/protocol/blob/main/contracts/periphery/DebtManager.sol)), Exactly Protocol still got rekt._

**As we’ve said many times before, audits are not a silver bullet.**

They should be seen as just one, albeit very important, part of an overall holistic security approach.

**But while some bounty hunters [find themselves](https://twitter.com/usmannk/status/1691943833511379290) undervalued by [projects](https://bug-bounty-wall-of-shame.github.io/) who don’t want to cough up the cash, we’re sure to stay busy here at [rekt.news](https://rekt.news/).**

_Who will be next on the [leaderboard](https://rekt.news/leaderboard/)?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
