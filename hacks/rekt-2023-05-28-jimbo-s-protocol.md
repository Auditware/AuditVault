---
tags:
  - blockchain/arbitrum
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/stable
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Jimbo's Protocol - REKT"
protocol: "[[Jimbo S Protocol]]"
date: 2023-05-28
loss_usd: 7500000
auditors:
source: "https://rekt.news/jimbo-rekt"
excerpt: "Jimbo’s Protocol was hit with a flash loan attack in the early hours of Sunday, losing $7.5M. The team have sent the attacker an ultimatum. But for now, Jimbo is stuck in limbo."
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[circuit-input-range-check]]"
---
# Jimbo's Protocol - REKT

> **Loss:** $7,500,000 | **Date:** 2023-05-28 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/jimbo-header.png)

_The exploits are stacking up on Arbitrum._

**[Jimbo’s Protocol](https://twitter.com/jimbosprotocol) was hit with a flash loan attack in the early hours of Sunday, losing $7.5M.**

The project, which aims to create a semi-stablecoin via rebalancing (OHM flashbacks, anybody?), had just relaunched. Its v2 was an attempt to fix a [buggy v1](https://twitter.com/jimbosprotocol/status/1658853333958787076) which fell apart on launch earlier this month.

As [UltraXBT](https://twitter.com/UltraXBT/status/1661660684499709952) put it:

>Kinda sus $JIMBO v1 failed because it was way too complicated and now 1 week later they have decided to launch a v2 with even more complexity by adding leverage
>
>Very dope if they succeed and rooting for them but this is a lot of moving parts for a defi protocol

**After just three days of the v2 protocol, the [alarm was raised](https://twitter.com/icebergy_/status/1662623826428022799).**

An [acknowledgement](https://twitter.com/jimbosprotocol/status/1662711995072909312) eventually came from the team, almost six hours after being alerted via Twitter.

_Wake up Jimbo._

This is the sixth incident we’ve covered on Arbitrum this year, with [dForce Network](https://rekt.news/dforce-network-rekt/), [Dexible](https://rekt.news/dexible-rekt/), [Hope Finance](https://rekt.news/hope-finance-rekt/), [Deus DAO](https://rekt.news/deus-dao-r3kt/) (no. 3) and [Swaprum](https://rekt.news/swaprum-rekt/) all taking losses since the start of 2023.

_Are we seeing a repeat of Spring 2021’s carnage on BSC?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Peckshield](https://twitter.com/peckshield/status/1662650673731624961), [Numen Cyber](https://twitter.com/numencyber/status/1662748403972071429)_

**The hack was due to a lack of slippage control in the shift() function of the [JimboController contract](https://arbiscan.io/address/0x271944d9D8CA831F7c0dBCb20C4ee482376d6DE7#code).**

The attacker took a flashloan of 10k ETH and used the funds to buy JIMBO, heavily increasing the token’s price. Then, by depositing some of the overvalued JIMBO into the JimboController, a rebalance was triggered via shift(), transferring the contract’s WETH back into the pool.

The attacker was then able to sell the remaining JIMBO back into the pool, draining all WETH liquidity and crashing the price of JIMBO.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/jimbo-code.png)

Attacker’s address: **[0x102be4bccc2696c35fd5f5bfe54c1dfba416a741](https://arbiscan.io/address/0x102be4bccc2696c35fd5f5bfe54c1dfba416a741)**

Location of stolen funds (ETH): [0x5f3591e2921d5c9291f5b224e909ab978a22ba7e](https://etherscan.io/address/0x5f3591e2921d5c9291f5b224e909ab978a22ba7e)

Attack tx: [0x3c6e053f…](https://arbiscan.io/tx/0x3c6e053faecd331883641c1d23c9d9d37d065e4f9c4086e94a3c34bf8702618a)

Over 4000k ETH (~$7.5M) were bridged back to Ethereum, where they remain in the above address.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Jimbo has [reached out](https://etherscan.io/tx/0xa77e60f93a350588211275c20d6e05b3b134b3e0de9d15f9cbd77c9e8782912b) to the hacker on-chain, offering a 10% bounty for the return of funds.**

They seem confident in getting a result, trying to push the hacker into responding with an [ultimatum](https://twitter.com/jimbosprotocol/status/1662874613548978176):

>We are already working with multiple security researchers and on-chain analysts who helped with both the Euler Finance and Sentiment exploits.
>
>We will start working with law enforcement agencies tomorrow by 4PM UTC if this isn’t sorted out by then.

**But unless the attacker responds, it looks like Jimbo is stuck in limbo.**

_Will we see a v3?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
