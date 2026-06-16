---
tags:
  - blockchain/bitcoin
  - sector/bridge
  - sector/governance
  - sector/lending
  - vuln/access-control/uninitialized-owner
  - vuln/pda/reinitialization
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/variant
title: "Value DeFi - REKT 2"
protocol: "[[Value Defi]]"
date: 2021-05-05
loss_usd: 10000000
auditors:
source: "https://rekt.news/value-rekt2"
excerpt: "2 for 1, that’s Value DeFi - The first protocol to feature twice on the rekt leaderboard. First seven million, and now ten million dollars taken, as Value DeFi gets rekt cross-chains."
genome:
  - "[[uninitialized-owner]]"
  - "[[reinitialization]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[initializer-auth]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Value DeFi - REKT 2

> **Loss:** $10,000,000 | **Date:** 2021-05-05 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/value2-header2png.png) 

**2 for 1, that’s Value DeFi: The first protocol to feature twice on the [rekt leaderboard](https://www.rekt.news/leaderboard/).**

When we [first covered](https://www.rekt.news/value-defi-rekt/) Value in November of 2020, they had just lost $7,000,000 after bragging about their “flash loan protection”. 

Back then we learned that Value DeFi _did not really know flash loan_. Now they have lost another $10,000,000, and we find out that Value DeFi _do not really know copy paste_ either, as they report the exploit was made possible due to losing a line of code by “human error” 

Ten million dollars lost due to basic mistakes by the team, yet the native token [$VALUE](https://www.coingecko.com/en/coins/value-defi) barely dumped at all. 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/value2-price.png) 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/value2-investigates.png) 

**The following analysis is taken from the official post-mortem.**

On May 5th 2021, 3:22 AM UTC, the exploiter [re-initialized](https://bscscan.com/tx/0xd3382252bc204fdc32a6b3add8c639850882b70a798399d6e00a542cdf769040) the pool and set the operator role to himself and _stakeToken to HACKEDMONEY.

By doing so, the exploiter took control of the pool and called the method governanceRecoverUnsupported() and drained the original stake token (vBWAP/BUSD LP).

The exploiter then [removed 10,839.16 vBWAP/BUSD LP](https://bscscan.com/tx/0x9ba0454c2301ad5780795ae7477e9fa7e38226be16cc282158624479e66389b6), then burned the LP tokens and received 7342.75 vBSWAP and 205,659.22 BUSD.

The exploiter then sold all 7342.75 vBSWAP for 8790.77 BNB at 1inch. 

The exploiter used both BNB and BUSD to buy renBTC and used renBridge to move the funds back to BTC, sent to the following address: [1Cm6WGvXQ9EgvvWX5dRsBxE2NvxFjfbcVF](https://www.blockchain.com/btc/address/1Cm6WGvXQ9EgvvWX5dRsBxE2NvxFjfbcVF)

The actions can be verified on-chain [here](https://bscscan.com/tokentxns?a=0xef63ad578e75d498d0723e5420fa1962b1d28764).

The [affected pool contract](https://bscscan.com/address/0x7a8ac384d3a9086afcc13eb58e90916f17affc89#code) had an initialize() function that should have been activated after deployment.

The line: **initialized = true**; is missing from the function. 

This meant anyone could re-initialize the pool and set themself as owner, thereby taking full control. As owner, the exploiter used the **governanceRecoverUnsupported()**, which is used for recovering pool funds in the event of a bug or undesired event.

During set up of the profit-sharing vStake pool, the code was not written from scratch but migrated from the old implementation of the Value DeFi Reserve Fund, which had the correct setting. When merging the code, the line was not included.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**In the end, the hacker was the only one who got their value for their money, a ten million dollar prize without even taking out a loan.** 

_The Value DeFi team however, just got another spot on our [leaderboard](https://www.rekt.news/leaderboard/)._ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-text-linebreak.png)
