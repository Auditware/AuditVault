---
tags:
  - blockchain/bsc
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - sector/token
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
title: "PancakeBunny - REKT"
protocol: "[[Pancakebunny]]"
date: 2021-05-19
loss_usd: 45000000
auditors:
source: "https://rekt.news/pancakebunny-rekt"
excerpt: "The BSC bloodbath continues. $45 million gone from 'PancakeBunny'. At its peak, Pancake Bunny had over $10 billion in TVL. At the time of writing, that TVL is down to just over $1 billion. “Aren’t Fla"
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
---
# PancakeBunny - REKT

> **Loss:** $45,000,000 | **Date:** 2021-05-19 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/bunny-header.png) 

**“Aren’t Flash loans Earitating” [said the hacker](https://twitter.com/statelayer/status/1395267417832558596?s=20).**

_$45 million gone from Pancake Bunny Finance._

This was made possible due to a bug in the protocol that uses PancakeSwap to retrieve the prices of PancakeSwap liquidity providers (BNB-BUSDT / BNB-BUNNY)

8 flash loans were used to manipulate the price on various PancakeSwap pools, creating a skewed calculation of BUNNY from the VaultFliptoFlip vault.

This led to the minting of 697,000 BUNNY tokens, which were then sold, causing the price to drop from $146 to $6. 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/bunny-price.png) 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/bunny-investigates.png) 
Credit: [Peckshield](https://peckshield.medium.com/pancakebunny-incident-root-cause-analysis-7099f413cc9b)

[BSCScan Transaction.](https://bscscan.com/tx/0x897c2de73dd55d7701e1b69ffb3a17b0f4801ced88b0c75fe1551c5fcce6a979)

**Step 1:** Take 8 different flashloans:

**The first seven flashloans are taken from various PancakeSwap pools while the last comes from Fortube Bank.**

1.05M WBNB from WBNB+CAKE pool 

522.52K WBNB from WBNB+BUSD pool 

210.16K WBNB from WBNB+ETH pool 

133.50K WBNB from WBNB+BTCB pool 

241.02K WBNB from WBNB+SAFEMOON pool 

98.519K WBNB from WBNB+BELT pool 

66.29K WBNB from WBNB+DOT pool

2.96M USDT from Fortube Bank. 

**Step 2:** Deposit 2.96M USDT and 7886 WBNB into WBNB+BUSDT pool as liquidity and mint 144.45K LP tokens.

**Step 3:** Swap 2.32M WBNB for 3.83M BUSDT via the above WBNB+BUSDT pool so that the pool has a sufficiently large WBNB reserve, which is used to influence the valuation of the pool tokens.

**Step 4:** Call getReward() to claim rewards from VaultFlipToFlip. With the higher LP token valuation, the attacker is able to claim a reward of 6.97M BUNNY (valued about $1+ B). Note the dev team gets separate 1.05M BUNNY.

**Step 5:** Return the flashloans in Step 1 back to PancakeSwap pools and Fortube Bank.

**The attacker’s loot was initially held in this wallet:** 0xa0acc61547f6bd066f7c9663c17a312b6ad7e187.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)  

**At its peak, [Pancake Bunny](https://twitter.com/PancakeBunnyFin/status/1394932390590517249?s=20) had over $10 billion in TVL.** 

At the time of writing, that TVL is down to just over [$1 billion.](https://pancakebunny.finance/pool)

Even a [Haechi audit](https://github.com/PancakeBunny-finance/Bunny/blob/main/audits/[HAECHI%20AUDIT]%20PancakeBunny%20Smart%20Contract%20Audit%20Report%20ver%202.0.pdf) couldn’t protect the Pancake Bunny from the awesome power of flash loan attack, earning them joint third position on the [rekt leaderboard.](https://www.rekt.news/leaderboard/)

Yesterday was a brutal day for all crypto markets, but BSC users in particular must have felt under fire, as [Venus Protocol](https://twitter.com/VenusProtocol/status/1394892979190513664?s=20) and [“wArOnrUgS”](https://twitter.com/AltcoinPsycho/status/1394846317415911431?s=20) imploded within hours of each other. 

_Loyal readers will have noticed that our anonymous author was unfortunately unavailable on such an eventful day._

We are always recruiting community members for our research and OPSEC departments.  

**Will you help us in our quest to document corruption and exploitation in crypto and DeFi?**

If you have any suggestions or contributions towards our leaderboard or our content in general, please add to the [rekt repo](https://github.com/RektHQ/leaderboard-metrics), or contact us on [Twitter](https://twitter.com/RektHQ), [Telegram](https://t.me/Rekt_HQ), or via email using the address below.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-text-linebreak.png) 

**EDIT - 18th July 2021.**

Haechi reached out to us with the following statement:

>We audited their smart contracts and published a report. This warned the fact that there are non-audited and changeable external contracts and the “helper” function is weak to flash loans’ attack. Pancake Bunny team upgraded their smart contracts and chose another auditing team for the updated contracts. This flash loan was caused by new smart contracts we did not audit. 

>You can find the details [here.](https://twitter.com/haechi_audit/status/1395583924575686656)
