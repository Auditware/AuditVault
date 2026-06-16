---
tags:
  - blockchain/bitcoin
  - blockchain/bsc
  - blockchain/polygon
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/stable
  - sector/vault
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Eleven Finance - REKT"
protocol: "[[Eleven Finance]]"
date: 2021-06-22
loss_usd: 4500000
auditors:
source: "https://rekt.news/11-rekt"
excerpt: "This one almost struck a nerve. Eleven.finance, a yield aggregator on Binance Smart Chain (BSC) and Polygon (MATIC) was exploited for a total of $4.5M."
genome:
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Eleven Finance - REKT

> **Loss:** $4,500,000 | **Date:** 2021-06-22 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/06/11-header.png) 

**This one almost struck a [nerve](https://twitter.com/NerveFinance/status/1407481720220307456?s=20).**

[Eleven.finance](https://eleven.finance/), a yield aggregator on Binance Smart Chain (BSC) and Polygon (MATIC) was exploited for a total of $4.5M.

Some feared that it was the much larger Nerve Finance who was under attack, but it was in fact the NRV vault of Eleven Finance.

_There’s no rest for the wicked - who would attack at such an ungodly hour?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/06/11-investigates.png) 

Credit: [0xdeadf4ce](https://twitter.com/0xdeadf4ce)

[Transaction details here.](https://bscscan.com/tx/0xeaaa8f4d33b1035a790f0d7c4eb6e38db7d6d3b580e0bbc9ba39a9d6b80dd250)

**The root cause was a function called emergencyBurn() in the intermediary vault used to track anySwap / Nerve-bridged assets nrvBTC, nrvETH and nrvFUSDT in the Eleven “MasterMind” farming contract.**

The attacker first took a Flashloan of each asset’s underlying token balance in the “MasterMind” contract (Binance-pegged BTC, ETH and USDT) to convert these into nrvBTC, nrvETH and nrvFUSDT respectively.

**Nerve 3Pool and PancakeSwap BUSD - NRV liquidity provider positions were also affected.**

A vulnerable function emergencyBurn() in the intermediate vault contract allowed the attacker to withdraw the deposited balance without having the withdrawal being accounted for internally.

**As a result the attacker was able to not only remove his own deposit but the full balance of the same amount that had been in the vault before as well.**

The attacker used the Nerve bridge to transfer out 2,293 ETH in proceeds to the address 0xdb2d590aCe7cAe51DF1fB3312738038Ec032Bf33.

**Steps**

**1:** borrow underlying assets from PancakeSwap (Flash Swap)

**2:** convert amount (mint) to Nerve asset

**3:** deposit Nerve asset to “MasterMind” through intermediate vault

**4:** call emergencyBurn() on intermediate vault, transferring an amount equal to the previously deposited amount (equal to vault balance before attack) to the attacker

**5:** proceed with a regular withdrawal, transferring the previously deposited asset balance back to the attacker

**Funds lost**

30.75 BTCB
for ~$1.05M from nrvBTC

286 ETH
for ~$561K from nrvETH

2.241M BUSD
for ~$2.241M from NRV 3Pool LP

0.647M BUSD
for $647K from NRV - BUSD LP

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**$4.5 million gone, entering at position 27 on the ever expanding [rekt leaderboard.](https://www.rekt.news/leaderboard/)**

[Peckshield](https://twitter.com/peckshield/status/1407479655142100994?s=20) blamed this on a “dumb logic issue”; a shockingly simple way to lose over four million dollars. 

Fear and greed is [on the rise](https://twitter.com/BitcoinFear/status/1407654240995057664?s=20), will we see more attacks now that honest work is harder to find?

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-text-linebreak.png) 

>If you enjoy our work, please donate to our [Gitcoin grant.](https://gitcoin.co/grants/1632/rektnews-the-dark-web-of-defi-journalism)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/06/gitcoin-type.png)
