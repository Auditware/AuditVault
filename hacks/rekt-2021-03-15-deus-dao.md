---
tags:
  - blockchain/fantom
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Deus DAO - REKT"
protocol: "[[Deus Dao]]"
date: 2021-03-15
loss_usd: 3000000
auditors:
source: "https://rekt.news/deus-dao-rekt"
excerpt: "Deus rekt machina. An unexpected plot twist saw Deus DAO users liquidated, with the attacker making ~$3M profit. Flash loan attacks are not as common they once were. Is DeFi growing stronger?"
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
---
# Deus DAO - REKT

> **Loss:** $3,000,000 | **Date:** 2021-03-15 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/03/deus-header.png)

**Deus rekt machina.**

An unexpected plot twist saw [Deus DAO](https://twitter.com/DeusDao/status/1503652836978143242?s=20&t=7KOBNi8X9vonyspyd2rC0A) users liquidated via a flash loan attack on the recently launched DEI [lending contract](https://ftmscan.com/address/0xec1fc57249cea005fc16b2980470504806fca20d#code), with [the attacker](https://ftmscan.com/address/0xb8f5c9e18abbb21dfa4329586ee74f1e2b685009) making ~$3M profit.

Five months have passed since we [last reported](https://rekt.news/cream-rekt-2/) a flash loan attack, but they used to be commonplace. 

_Is DeFi growing stronger?_ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**A flash loan [attack](https://ftmscan.com/tx/0xe374495036fac18aa5b1a497a17e70f256c4d3d416dd1408c026f3f5c70a3a9c) was used to manipulate the balance of the Solidex USDC/DEI pool, which is used as an oracle for collateral value on Deus Finance’s $DEI lending contract.**

This resulted in user positions becoming insolvent, which the [hacker’s contract](https://ftmscan.com/address/0xb8f5c9e18abbb21dfa4329586ee74f1e2b685009) liquidated, before repaying the flash loan.

_Credit: [Peckshield](https://twitter.com/peckshield/status/1503632734299701250)_

**1:** Flashloan 9,739342 DEI via SPIRIT-LP_USDC_DEI

**2:** Flashloan 24,772,798 DEI out of the sAMM-USDC/DEI pair (used as price oracle to calculate collateral value)

**3:** Liquidate the users who become insolvent from Step 2

**4:** Repay the borrowed 24,772,798 DEI to the sAMM-USDC/DEI pair

**5:** Burn the liquidated LP token to get 5,218,173 USDC + 5,246,603 DEI

**6:** Swap 5,218,173 USDC to 5,170,594 DEI

**7:** Repay flashloan with 3,001,552 DEI as hack profit

**Attack tx:**

[0xe374495036fac18aa5b1a497a17e70f256c4d3d416dd1408c026f3f5c70a3a9c](https://ftmscan.com/tx/0xe374495036fac18aa5b1a497a17e70f256c4d3d416dd1408c026f3f5c70a3a9c)

**The attacker then went on to [send](https://ftmscan.com/tx/0x09dc3a1afd1dae211c31d7ad4b5cd6f68c9350727fa5d4c7c63efb9d287e3210) 3M USDC via Multichain from an [FTM address](https://ftmscan.com/address/0x1ed5112b32486840071b7cdd2584ded2c66198dd) to [ETH address](https://etherscan.io/address/0x1ed5112b32486840071b7cdd2584ded2c66198dd), and from there 1.1k ETH and 200k DAI to Tornado cash, totalling ~$3M gained.**

The project’s token, [DEUS](https://www.coingecko.com/en/coins/deus-finance), dropped ~40% in the hour following the attack and, despite some recovery, remains volatile.

>Deus [have announced](https://twitter.com/lafachief/status/1503678891386359808) that they will be reimbursing affected users who return their DEI debts, returning their liquidated collateral.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**[Flash loan season](https://rekt.news/on-flash-loans/) taught even non-technical users about the importance of price oracles.**

Security standards emerged from our baptism of fire, and the industry learned and moved forward. 

We know that these [attacks can be mitigated](https://samczsun.com/so-you-want-to-use-a-price-oracle/) by using decentralised or TWAP [oracles.](https://docs.uniswap.org/protocol/V2/concepts/core-concepts/oracles)

_Why didn’t Deus DAO have a more robust system in place?_ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/03/deus-conc.png)
