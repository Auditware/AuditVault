---
tags:
  - sector/dex
  - sector/privacy
  - impact/loss-of-funds/direct-drain
title: "Value DeFi - REKT 3"
protocol: "[[Value Defi]]"
date: 2021-05-07
loss_usd: 11000000
auditors:
source: "https://rekt.news/value-rekt3"
excerpt: "Twice in one week. Value DeFi is a trainwreck. Six months ago they lost $7M. Three days ago they lost $10M. Now they’ve lost another $11M. What went so wrong with Value DeFi?"
genome:
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
---
# Value DeFi - REKT 3

> **Loss:** $11,000,000 | **Date:** 2021-05-07 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/3value-header.png) 

**Twice in one week.** 

Value DeFi is a trainwreck. 

Six months ago they lost $7M. Three days ago they lost $10M. 

**Now they’ve lost another $11M.** 

_Brutal, savage, rekt._ 

The “co-founder” was a [paid actress](https://twitter.com/CryptoBethany/status/1390880003261288448?s=19), the code was copied and used incorrectly, and as a result, Value DeFi has been _absolutely taken down_.

Is this the third and final time, or will the apes continue to forgive and forget?

_What went so wrong with Value DeFi?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/3value-investigates.png) 

**Approximately $11 million was stolen from the vSwap AMM vSwap pools.**

The incident was due to the improper use of a complex exponentiation power() function behind the calculation and enforcement of the weighted constant product invariant.

Any pool which did not have its liquidity split 50/50 between assets was exploited. 

Since Uniswap only supports pools with a 50/50 asset ratio, Value DeFi used the Bancor formula for their non-standard pools.

**Reference Transaction:** [0x2fd0aaf0bad8e81d28d0ee6e4f4b5cbba693d7d0d063d1662653cdd2a135c2de](https://bscscan.com/tx/0x2fd0aaf0bad8e81d28d0ee6e4f4b5cbba693d7d0d063d1662653cdd2a135c2de)

**1.** First of all, the attacker sends a small amount of a second token to pair addresses

**2.** They then make a swap in which they want to withdraw a small amount of the first token and a large amount of the second token.

**3.** Due to incorrect use of the Bancor formula, the pair contracts consider the swap to be successful. (root of exploit)

**Stolen funds:**
- 15k BNB
- 2.7k FARM
- 1.7k BASv2
- 8.5M BDO
- 68.3k BUSD
- 41.4k MDG
- 945k VBOND
- 1.2M BAC
- 11k FIRO

Credit: [frankresearcher](https://twitter.com/FrankResearcher/status/1390905494844313602?s=20)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/3value-code.png) 

>Note the power() routine takes four arguments (baseN, baseD, expN, and expD) and is used to calculate an integer approximation of (baseN/baseD)^(expN/expD)*(2^precision) where precision is used for the calculated result. However, there is a caveat in how this power() function should be used. It makes an explicit assumption that baseN must be no less than baseD, i.e., baseN >= baseD. In this attack, the pool’s swap() function is called with a crafted input that intentionally violates the above assumption. As a result, the weighted constant product enforcement is passed while the pool funds are being drained.

Credit: [peckshield](https://peckshield.medium.com/valuedefi-incident-incorrect-weighted-constant-product-invariant-calculation-1bbaa220a02b)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/3value-price.png) 

Despite achieving their third place on our [leaderboard](https://www.rekt.news/leaderboard/), the native token of Value DeFi has recovered somewhat since the latest exploit. However, [Nansen](https://www.nansen.ai/) shows us that the DEX volume has been decreasing consistently.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/3value-dex.png) 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**Will another rebrand save the most hacked protocol from losing _all_ their users, or is this the end for Value DeFi?**

The Value DeFi team were reassuring users of the safety of their platform only hours before the latest exploit, [tweeting](https://twitter.com/value_defi/status/1326949815557611520?s=20) about increased security measures which clearly had zero impact.

Going forward, it’s hard to see how anyone could trust the anonymous developers, who admitted to using a paid actress on fiverr to play the role of their founder, and when they were confronted about it by a user, responded with [something similar](https://twitter.com/CryptoDeFi137/status/1390891682917457920?s=20) to; 

>The girl we caption as our co-founder in that video is actually just a paid actress, but one of our devs happened to go by that online alias, so then we coincidentally tracked down an actress by that same name on Fiverr to feature in our video! 

[Ape tax](https://www.rekt.news/ape-tax/) is high for users of Value DeFi, the least secure DeFi protocol. Who can have any sympathy for users of such blatant low quality projects?

**We’re very thankful for all the new readers that Value DeFi has brought us over the recent months, but hopefully this will be the last time.**

Although we ridicule the repetitive failures of the founders, these are not their funds that are being stolen. If they plan to continue their operations, then they will have to try much harder.
 
Instead of focusing on fake communications, focus on real users safety, not piling up worthless security audits.

**Or maybe it’s time to call it quits and stop putting users funds at risk.** 

_Can Value DeFi close their operations safely, or will we soon see a final exit scam?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-text-linebreak.png)
