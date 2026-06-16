---
tags:
  - blockchain/arbitrum
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/oracle
  - has/audit
  - impact/data-corruption/price-manipulation
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
title: "Woofi - Rekt"
protocol: "[[WOOFi]]"
date: 2024-03-05
loss_usd: 85000000
auditors:
  - "[[Certik]]"
source: "https://rekt.news/woo-rekt"
excerpt: "WooFi  got taken for a $8.5 Million ride on March 5th, after a flash loan attack on Arbitrum."
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[bridge-message-validation]]"
  - "[[chainlink-round-completeness]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Woofi - Rekt

> **Loss:** $85,000,000 | **Date:** 2024-03-05 | **Audited by:** Certik

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/woofi-header.png)
  




_Nothing to Woo about here._

  

**WooFi got taken for a $8.5 Million ride on March 5th, after a flash loan attack on Arbitrum.**

  

[Spreek](https://twitter.com/spreekaway) who was the first to catch last week’s Seneca Protocol attack, [front ran the news](https://twitter.com/spreekaway/status/1765046559832764886) on the exploit:

  

_Wootrade's WooPPV2 contract exploited for a total attacker haul of 8.5m on arbitrum. It is now paused, so no further action is needed._  


The team didn’t take long to [address the issue](https://twitter.com/_WOOFi/status/1765047837727891853) and paused the pools that were under attack.

  

_[WooFi](https://fi.woo.org/), self described as “One Dex to rule all chains”, they offer single-sided yields, cross-chain swaps, perps trading and revenue sharing._  
  
**Looks like they’re the ones who got ruled, doesn’t it?**

  

2024 is off to a hot start for Arbitrum attacks, with [Radiant Capital](https://rekt.news/radiant-capital-rekt/), [Gamma Strategies](https://rekt.news/gamma-strategies-rekt/) and [Seneca](https://rekt.news/seneca-protocol-rekt/) already getting hit.

  

**Now that bull season is back, will 2024 make 2023 look like a giant wrestling a midget?**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

  


Credit: [Spreek](https://twitter.com/spreekaway/status/1765046559832764886), [Peckshield](https://twitter.com/PeckShieldAlert/status/1765072442702401853), [Nick L. Franklin](https://twitter.com/0xNickLFranklin/status/1765057041398456594), [WooFi](https://fi.woo.org/)

  

**One of the WOOFi oracles on Arbitrum was exploited using flash loans, which manipulated the price of WOO in order to repay the flash loans at a cheaper price.**

  

The attacker manipulated the Woo price to drain funds from the WooPPV2 pool contract. Then drained the pool using the swap function 3 times, stealing about $8.5 million.

 
The exploit was caught and contracts paused within 13 minutes. The attacker still managed to get away with a big stash of ETH.
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/woofi-code.png)
Attacker’s address:

[0x9961190b258897bca7a12b8f37f415e689d281c4](https://arbiscan.io/address/0x9961190b258897bca7a12b8f37f415e689d281c4)

  

Attack tx:

[0x40e1b8c78083fc666cb7598efcecd0ae0af313fc41441386e4db716c2808ce07](https://arbiscan.io/tx/0x40e1b8c78083fc666cb7598efcecd0ae0af313fc41441386e4db716c2808ce07)

  

Attack contract:

[0xD4c633C9A765bC690E1FbA566981c1F4eab52dF0](https://arbiscan.io/address/0xd4c633c9a765bc690e1fba566981c1f4eab52df0)

**[Attack Flow:](https://metasleuth.io/result/arbitrum/0x40e1b8c78083fc666cb7598efcecd0ae0af313fc41441386e4db716c2808ce07)**
 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/woofi-flow.png)
  

The stolen funds were sent to [this address](https://arbiscan.io/address/0xb59d04d9957c9e266dff5c4173d4d2324eb029ad).  
  
Woofi sent an [onchain message](https://arbiscan.io/tx/0xe4a7d630b46ecc8e11013447e2255ea8bf71c13bf44cc21ba72be6f11fbd1821) to the attacker, [assuming a whitehat](https://twitter.com/MetaTrustAlert/status/1765167754309665243) executed the exploit and offered a 10% bounty.

  

Woofi issued a [post-mortem](https://woo.org/blog/en/woofi-spmm-exploit-post-mortem) and highlighted the exploit:  
  
_In WOOFi v2, the sPMM system adjusts oracle prices based on trade value to manage slippage and balance pools. However, an error led to a price adjustment outside the expected range and the fallback check, normally executed against Chainlink and didn't cover the WOO token price._

  

_The recent addition of a lending market for WOO on Arbitrum, plus relatively low liquidity support for WOO tokens elsewhere on the network, made the exploit economically feasible._

  

**Just because your code is audited** **isn’t a guarantee. Certik** **most recently** **audited** **WOOFi's** [**swap and oracle**](https://skynet.certik.com/projects/woofiswap)  **contracts** **in October 2022**.

  

Immunefi also held a [bug bounty](https://immunefi.com/bounty/woofi/) in 2022-3 that included their Wooracle. Although the results don’t seem to be public.  
  
_Oracle manipulation_ _and_ _flash loan attacks_ _were not excluded._  
  
**Woofi went live on Arbitrum in November 2022, looks like somebody found a bug.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)



**Woofi said this was their first incident. But going cross-chain has its risks.**

These risks are becoming more common as we connect more networks across the chains.

*The attack on Woofi underscores the importance of robust security measures, thorough testing, audits, bug bounties and a keen understanding of the complexities of cross-chain operations.*

**The recent addition of a lending market for WOO on Arbitrum, coupled with relatively low liquidity, created a fertile ground for exploitation.**

Having a novel oracle design that is not widely used, battle-tested and proven to be a cross-chain solution should serve as a reminder not only for Woofi, but any other protocol that tries to reinvent the wheel.

*Bragging about your sPMM design a [few hours before](https://twitter.com/_WOOFi/status/1764947706529845634) someone took advantage of it is pretty ironic.*  
  
Is using Chainlink price feeds as a [fail safe](https://learn.woo.org/v/woofi-dev-docs/resources/on-chain-price-feeds) a good idea?

**Given some of these circumstances, is it a surprise they were attacked?**

It's a wake-up call for the DeFi community, reminding us that no system is immune to exploitation, especially in an environment where the stakes are high and the pace of innovation is relentless.  
  
*Time in our space moves fast, but protocols should slow down at times, especially when they are already live and the risks are more dangerous than in a testing environment.*

It is much better to catch the mistakes in the lab instead of having them revealed in real time, where bad actors and vigilantes can make an example out of you.  
  
While Woofi leads us to believe that it was a whitehat that was behind the attack. At the end of the day, what matters is the fact that they were attacked.

*It shouldn’t even matter whether it was the good guys or the bad guys.*

  

**Does it matter if the person who broke your window was a burglar or a neighbor trying to get in?**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
