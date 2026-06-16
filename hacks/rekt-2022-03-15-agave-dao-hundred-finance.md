---
tags:
  - blockchain/ethereum
  - sector/governance
  - sector/lending
  - sector/privacy
  - vuln/reentrancy/single-function
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/known-pattern
title: "Agave DAO, Hundred Finance - REKT"
protocol: "[[Agave Dao Hundred Finance]]"
date: 2022-03-15
loss_usd: 11700000
auditors:
source: "https://rekt.news/agave-hundred-rekt"
excerpt: "Two forks met the same fate. Agave DAO and Hundred Finance both fell victim to the same reentrancy attack. A combined total of $11.7M stolen. Considering the structure of DeFi today, the double damage"
genome:
  - "[[single-function]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
---
# Agave DAO, Hundred Finance - REKT

> **Loss:** $11,700,000 | **Date:** 2022-03-15 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/03/agavehundred-header.png)

**Two forks met the same fate.**

[Agave DAO](https://twitter.com/Agave_lending/status/1503725275917565954?s=20&t=Ljd0MHhMQUZqPX-v8Qw_fg), _(an Aave fork)_, and [Hundred Finance](https://twitter.com/HundredFinance/status/1503754916300476420?s=20&t=5rAiSnRTdUV1eTN50HwBiA), _(a Compound fork)_, both fell victim to the same reentrancy attack.

2116 ETH ($5.5M) was lost from Agave, and 2363 ETH ($6.2M) from Hundred Finance, giving a total of $11.7M stolen by the anonymous attacker.

This is the first attack we’ve seen on the Gnosis (xDai) chain, and the first time we’ve seen two protocols be directly targeted like this.

**However, considering the structure of DeFi today, the double damage is not surprising.**

Forks upon forks create a house of cards. If the code is copied and pasted, vulnerabilities can open up where they're least expected.

_When one fork falls, all others have to check their foundations._ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [Daniel Von Fange](https://twitter.com/danielvf/status/1503756428212936710) and [Mudit Gupta](https://twitter.com/mudit__gupta/status/1503783633877827586)_

**The attacks were made possible due to the design of the xDAI token which contains the function _callAfterTransfer()_ creating a reentrancy vulnerability.**

Using flash loans as initial collateral, the attacker(s) nested additional borrow functions inside one another, increasing the amount borrowed before the protocol could update the debt balance. Repeating this process led to borrowing assets worth far more than the collateral supplied.

The attack vector is the same as in the $18.8M case of [CREAM Finance](https://rekt.news/cream-rekt/) last August.

**Agave DAO**

[Exploit tx (March-15-2022 11:25:40 AM +1 UTC)](https://dashboard.tenderly.co/tx/xdai/0xa262141abcf7c127b88b4042aee8bf601f4f3372c9471dbd75cb54e76524f18e)

The stolen funds were then sent to the attacker’s [ETH address](https://etherscan.io/address/0x0a16a85be44627c10cee75db06b169c7bc76de2c) and after a few hours 2116 ETH ($5.5M) were sent to Tornado Cash.

**Hundred Finance**

[Exploit tx (March-15-2022 11:28:40 AM +1 UTC)](https://dashboard.tenderly.co/tx/xdai/0x534b84f657883ddc1b66a314e8b392feb35024afdec61dfe8e7c510cfac1a098)

The stolen funds were then sent to the attacker’s [ETH address](https://etherscan.io/address/0xd041ad9aae5cf96b21c3ffcb303a0cb80779e358) and after a few hours 2363 ETH ($6.2M) were sent to Tornado Cash.

_While the price of [HND](https://www.coingecko.com/en/coins/hundred-finance) hasn’t suffered too badly from the news, [AGVE](https://www.coingecko.com/en/coins/agave-token) plunged >20%._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**Forking strong code is not enough to ensure security after changes are made. The idiosyncrasies of each new environment bring new threats.** 

In this case, the Gnosis (xDai) design revealed hidden dangers not considered when porting the protocols from Ethereum.

Though both projects are forks from foundational DeFi protocols (Aave and Compound), the original projects have strict vetting in place to avoid allowing tokens with reentrancy vulnerabilities to be used as collateral. Additionally, as Mudit Gupta pointed out, following a [“checks-effects-interactions pattern”](https://twitter.com/Mudit__Gupta/status/1503783638961299459) is another way to mitigate such attacks from taking place.

_Another entry on our [leaderboard (#35)](https://rekt.news/leaderboard/), and another lesson learned the hard way._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
