---
tags:
  - blockchain/bsc
  - blockchain/polygon
  - sector/dex
  - sector/lending
  - sector/stable
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "PancakeBunny - REKT 2"
protocol: "[[Pancakebunny]]"
date: 2021-07-16
loss_usd: 2400000
auditors:
source: "https://rekt.news/pancakebunny2-rekt"
excerpt: "Two months ago PancakeBunny got rekt on BSC, now the same thing has happened on Polygon. $2.4 million lost. How earitating."
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# PancakeBunny - REKT 2

> **Loss:** $2,400,000 | **Date:** 2021-07-16 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/pancbunny2-header.png)
**[We sent it back,](https://twitter.com/RektHQ/status/1399714766785028098?s=20) and then they lost it.** 

**How [earitating.](https://www.rekt.news/pancakebunny-rekt/)**

Two months ago PancakeBunny got rekt on BSC, now the same thing has happened on Polygon.

$2.4 million lost, and their second entry earned on our [leaderboard. (#33)](https://www.rekt.news/leaderboard/)

They say there’s a plan to compensate their users, so it seems they’re not ready to give up yet.

Despite the growing accusations of it being “an inside job”, the [PancakeBunny TVL](https://defillama.com/protocol/bunny) is slowly returning.

_Try not to lose it this time._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/pancbunny2-investigates2.png)

_From the [official post-mortem.](https://pancakebunny.medium.com/polybunny-post-mortem-compensation-42b5c35ce957)_

**Attacker’s Address:** [0xa6021d8c36b2de6ceb4fe281b89d37d2be321431](https://polygonscan.com/address/0xa6021d8c36b2de6ceb4fe281b89d37d2be321431)

**Attack TX Log:** [0x25e5d9ea359be7fc50358d18c2b6d429d27620fe665a99ba7ad0ea460e50ae55](https://polygonscan.com/tx/0x25e5d9ea359be7fc50358d18c2b6d429d27620fe665a99ba7ad0ea460e50ae55)

The attacker made a small deposit in one of the Bunny Vaults and at the same time, made a large deposit directly to MiniChefV2 (SushiSwap) 

They then called the function _withdrawAll_ to execute the attack, using the amount deposited in the MiniChefV2 as interest.

**The attacker followed the following steps to exploit the polyBUNNY minter:**

Deposit 0.000000009416941138 SLP (~19,203 USD) into the polygon.pancakebunny USDT-USDC Vault.

Deposit 0.000023532935903931 SLP (~47,990,975 USD) to the USDT-USDC MiniChefV2 contract on SushiSwap.

This generated a performance fee of 0.000007006743943544 SLP (~14,284,950 USD) and minted 2.1 million polyBUNNY to the attacker

Dump polyBUNNY for WETH

Repay AAVE’s flashloan and exit the attack, gaining 1,281.702952074137533313 ETH.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/pancbunny2-price.png)

>The price of [polyBunny](https://www.coingecko.com/en/coins/pancake-bunny-polygon) fell from $10 to $1.78.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**This [same exploit](https://twitter.com/peckshield/status/1415187038605758464?s=20) was used on [“ApeRocketFi”](https://aperocket.medium.com/moving-forward-24b9ae22c428), a direct fork of PancakeBunny, just 2 days ago.** 

ApeRocket lost $260K on BSC and $1M on Polygon, yet PancakeBunny didn’t prevent the same thing from happening to them.

_Was somebody using the smaller protocol as a test, to check that their technique worked?_

If so, why would they risk alerting PancakeBunny to the loophole? Perhaps somehow they knew that wouldn’t be an issue...

Of course, it’s possible that the attackers were not the same person, or that they didn’t realise the same attack vector was possible in the original code. 

_Somehow that seems unlikely._

**Who will send money to PancakeBunny now?** 

We wish we hadn’t...

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/pancbunny2-conc.png)
