---
tags:
  - blockchain/near
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
title: "Saddle Finance - REKT 2"
protocol: "[[Saddle Finance]]"
date: 2021-12-02
loss_usd: 11000000
auditors:
source: "https://rekt.news/saddle-finance-rekt2"
excerpt: "$11M was stolen from Saddle Finance yesterday, with a further $3.8M taken in a rescue by BlockSec. Despite claiming that “user funds are safe”, Saddle later clarified they were only referring to the a"
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Saddle Finance - REKT 2

> **Loss:** $11,000,000 | **Date:** 2021-12-02 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/saddle2-header.png)

**$11M was stolen from [Saddle Finance](https://twitter.com/saddlefinance/status/1520329884526170116) yesterday, with a further $3.8M [rescued by BlockSec](https://twitter.com/BlockSecTeam/status/1520321721500200960).**

This latest attack makes the Curve knock-off take their second position (#43) on [our leaderboard](https://rekt.news/leaderboard/), much higher than their rekt.news [debut](https://rekt.news/saddle-finance-rekt/) in January of last year.

**Despite [claiming](https://twitter.com/saddlefinance/status/1520451021725741056) that “user funds are safe”, Saddle later [clarified](https://twitter.com/saddlefinance/status/1520517647074529281) they were only referring to the amount that was not stolen.**

_rekt.news can clarify that the $11 million that was stolen, is definitely not safe._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [SlowMist](https://twitter.com/SlowMist_Team/status/1520443927261814786) and [PeckShield](https://twitter.com/peckshield/status/1520330006710616064)_

**The funds were taken from the protocol’s sUSDv2 metapool in which Synthetix’ sUSD is paired with saddleUSD-V2 LP tokens (from the DAI, USDC, USDT pool).**

The exploit was possible due to a bug in an [old version](https://etherscan.io/address/0x88cc4aa0dd6cf126b00c012dda9f6f4fd9388b17#code) of the MetaSwapUtils library which doesn’t use a VirturalPrice to calculate the value of the LP token during metapool swaps.

The issue had been fixed in the [current version](https://etherscan.io/address/0x824dcd7b044d60df2e89b1bb888e66d8bcf41491), but the swap calculation was still using the old version.

The hacker made a series of flash loan assisted sUSD/saddleUSD-V2 swaps in the metapool, manipulating the price of the LP token which could then be swapped back for more sUSD.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/saddle2-steps.png)

Exploiter’s address, initially [funded](https://etherscan.io/tx/0xfc5fb681f54ceb4b0b9db4fcb38204dee7ca89f5cde0ba94179bf1fae563d7db) via Tornado Cash: [0x63341b… ](https://etherscan.io/address/0x63341ba917de90498f3903b199df5699b4a55ac0)

Main hack tx for (3375 ETH): [0x2b023d…](https://etherscan.io/tx/0x2b023d65485c4bb68d781960c2196588d03b871dc9eb1c054f596b7ca6f7da56)

Second hack tx (for 557 ETH): [0xe7e047…](https://etherscan.io/tx/0xe7e0474793aad11875c131ebd7582c8b73499dd3c5a473b59e6762d4e373d7b8)

[BlockSec whitehat](https://twitter.com/0xHotpot/status/1520337032240848896) tx for (1357 ETH): [0x9549c0…](https://etherscan.io/address/0x63341ba917de90498f3903b199df5699b4a55ac0)

Though funds have begun to move through Tornado Cash, at the time of writing, the majority remains in the exploiter’s address.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**In November of last year, Saddle published [a report](https://blog.saddle.finance/metapool-exploit-fix-is-live/) on the vulnerability after a $8.2M near-miss for Synapse protocol who were using some Saddle code.**

_BSC-based nerve.fi were also hit via the [same attack vector.](https://blocksecteam.medium.com/the-analysis-of-nerve-bridge-security-incident-ead361a21025)_ 

The [resulting fix](https://github.com/saddle-finance/saddle-contract/pull/469/commits) to the MetaSwapUtils library was made in December but, apparently, the code wasn’t implemented into metapool swaps properly.

>Saddle forking Curve: if it ain’t broke don’t fix it.

>Saddle not implementing their own fix: if it ain't fixed don't use it.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
