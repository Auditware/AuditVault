---
tags:
  - sector/dex
  - sector/lending
  - sector/privacy
  - sector/stable
  - has/audit
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Popsicle Finance - REKT"
protocol: "[[Popsicle Finance]]"
date: 2021-08-03
loss_usd: 20000000
auditors:
  - "[[Peckshield]]"
source: "https://rekt.news/popsicle-rekt"
excerpt: "Protocol meltdown. ~$20 million gone. A complex hack of a simple bug leaves Popsicle Finance in a sticky situation."
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Popsicle Finance - REKT

> **Loss:** $20,000,000 | **Date:** 2021-08-03 | **Audited by:** Peckshield

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/popsicle-header.png)
**Meltdown.**

~$20 million gone. 

A complex hack of a [simple bug](https://twitter.com/Mudit__Gupta/status/1422797923037814786?s=20) leaves [Popsicle Finance](https://twitter.com/PopsicleFinance/status/1422748604524019713?s=20) in a sticky situation.

_The [RewardDistribution](https://twitter.com/WildCredit/status/1406939127229026304?s=20) bug has already been exploited in several other protocols._

**Auditors and Smart contract developers need to stay up to date. This code should not have made it to production.**

_If only there was [somewhere](https://www.rekt.news/) they could read about previous hacks and exploits..._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/popsicle-investigates.png)

>Credit: [@Peckshield](https://twitter.com/peckshield/status/1422776188913819648?s=20) & [@Mudit__Gupta](https://twitter.com/Mudit__Gupta/status/1422797923037814786?s=20)

**Attacker address:** [0xf9E3D08196F76f5078882d98941b71C0884BEa52](https://etherscan.io/address/0xf9e3d08196f76f5078882d98941b71c0884bea52)

**Transaction Hash:** [0xcd7dae143…](https://etherscan.io/tx/0xcd7dae143a4c0223349c16237ce4cd7696b1638d116a72755231ede872ab70fc)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/popsicle-peckshield.png)

>The “Sorbetto Fragola” contract automatically manages Liquidity on Uniswap V3. Fragola adjusts the position so it is always in the correct range.

**The hack was due to the lack of proper fee accounting when LP tokens are transferred.** 

_Specifically, the attacker creates three contracts: A, B, and C and repeats in the sequences of:_ 

A.deposit(), 

A.transfer(B), 

B.collectFees(), 

B.transfer(C), 

C.collectFees() for eight pools.

**Step 1:** Flashloan 30M USDT, 13K WETH, 1.4KBTC, 30M USDC, 3M DAI and 200K UNI from Aave to attack eight PLP pools.

_Below we take the USDT-WETH pool as an example._

**Step 2:** Alice calls deposit() to add 30M USDT and 5.467K WETH liquidity into the USDT-WETH PLP pool and gets 10.51 PLP tokens.

**Step 3:** A transfers the 10.52 PLP tokens to B

**Step 4:** B calls the collectFees() function to get its tokenRewards updated.

**Step 5:** B transfers the 10.52 PLP tokens to C

**Step 6:** C calls the collectFees() function to get its tokenRewards updated.

**Step 7:** C transfers the 10.52 PLP tokens back to A, so A will be able to remove the liquidity later on.

**Step 8:** A calls withdraw() to remove the liquidity and gets back 30M USDT and 5.46 WETH.

**Step 9:** B calls collectFees() to get 2.15M USDT and 392 WETH as rewards.

**Step 10:** C calls collectFees() to get 2.15M USDT and 402 WETH as rewards.

**Step 11:** The attacker repeats step 2 to 10 for several other PLP pools and repays the flashloan in step 1.

**A portion of the attack's profits (4,100 ETH, about $10M) is immediately deposited to Tornado Cash.** 

_At the time of writing, the remaining 2,560 WETH, 96 WBTC and 159,928 DAI are still in the attacker account:_ [0xf9E3D08196F76f5078882d98941b71C0884BEa52.](https://etherscan.io/address/0xf9e3d08196f76f5078882d98941b71c0884bea52) 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/popsicle-linebreak-logo.png)

**Everyone makes mistakes, but not many are responsible for $20M TVL…**

It’s strange that Peckshield decided to publish a post-mortem of code that they audited, instead of waiting and releasing it as an official release from the Popsicle account. 

**Another client's funds lost, while Peckshield chase clout on Twitter.**

There is little excuse for the auditors for missing an already known bug. 

_They did write a nice post-mortem though, so at least Popsicle Finance got something for their money._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
