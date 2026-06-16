---
tags:
  - sector/dex
  - sector/lending
  - sector/perpetuals
  - sector/stable
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "X-Token - REKT X2"
protocol: "[[X-Token]]"
date: 2021-08-29
loss_usd: 4500000
auditors:
source: "https://rekt.news/xtoken-rekt-x2"
excerpt: "Some sequels should never be written. Three months ago this team lost $24 million - in the same token, to the same attack technique. Why did they let it happen again?"
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# X-Token - REKT X2

> **Loss:** $4,500,000 | **Date:** 2021-08-29 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/2xtok-header.png)
**X-token X2 - The X-ploiter Returns.**

**Some sequels should never be written.**

[X-token](https://twitter.com/xtokenmarket) rekt again, and it seems flash loans are still in fashion. 

~$4.5 million stolen from their xSNX contract.

Three months ago this team lost $24 million - in the same token, to the same attack technique.

[At the time, we wrote;](https://www.rekt.news/xtoken-rekt/)_“XToken is a quality protocol”._ 

**Now we’re not so sure.**
 
_Why did they let it happen again?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/2xtok-investigates.png)

**Attack Transaction:** 
[0x924e6a6288587b497f73ddcf6ae3c184f15ab35dfcb85f3074b55266974029ef](https://etherscan.io/tx/0x924e6a6288587b497f73ddcf6ae3c184f15ab35dfcb85f3074b55266974029ef)  

Credit: [Official Post Mortem](https://medium.com/xtoken/xsnx-post-mortem-666d35071f38)

**1:** Flash loan 25,000 ETH from dydx.

**2:** Borrow ~1m SNX from a combination of Aave V1 and V2.

**3:** Swap of 6.8k ETH to 519k SNX on Bancor.

At this point the attacker is holding ~1.5m SNX.

**4:** Swap of 1.5m SNX on Kyber for ~6.5m USDC, lowering SNX price considerably.

**5:** Swap of ~6.5m USDC for ~6.5m sUSD on Curve.

**6:** Transfer ~2m sUSD to xSNXAdmin contract (this is the contract that holds the assets managed by xSNX), with the intention of repaying the contract’s sUSD debt in order to unlock SNX.

**7:** Call of the callFunction function on xSNXAdmin contract, burning outstanding sUSD debt and swapping ~614k SNX for ~811k sUSD debt at artificially depressed price.

That the attacker was able to call the callFunction function was the source of the vulnerability. This function should only have been callable from dydx’s SoloMargin flashloan contract that had been integrated to improve fund performance on rebalances. 

An erroneous require statement allowed the function to be publicly callable.

**require(sender==address(this)** was used when xToken should have used **require(msg.sender==soloMarginAddress)**.

**8:** Swap of ~811k sUSD for ~811k USDC, which remains in the contract.

**9:** The attacker then reverses all actions, swapping back to ETH and repaying loans. 

The source of the value extraction was that the attacker used xSNX assets to pressure SNX price and create profitable external arbitrage opportunities.

LINEBREAK

**The first time can be considered a mistake, but a second time?**

The X-token team say they’ll compensate their users (again), and that they have taken the decision to phase out their xSNX product.

As they wrote in the post-mortem;

>xSNX is by far our most complex product and we want to be maximally confident in the products we’re offering investors. We are highly confident in our other products and contracts, but can no longer say the same about the current implementation of our xSNX contract.

Although their reputation will be permanently damaged from taking two positions on the [rekt leaderboard](https://www.rekt.news/leaderboard/), it does seem that this team care about their users, and are taking steps to make things right. 

The decision to withdraw their xSNX offering may be wise, however, by publicly admitting that it was too complicated for them, aren’t they just worsening the damage to their reputation?

Perhaps a fresh start would be more appropriate.

**A sequel normally leads to a series.**

_Will the X-ploiters try for a trilogy?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/2xtok-rekt-stamped.png)
