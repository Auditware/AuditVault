---
tags:
  - sector/dex
  - sector/lending
  - sector/perpetuals
  - sector/privacy
  - has/audit
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "XToken - REKT"
protocol: "[[Xtoken]]"
date: 2021-05-12
loss_usd: 24000000
auditors:
  - "[[Peckshield]]"
source: "https://rekt.news/xtoken-rekt"
excerpt: "The X-ploiters live amongst us. $24 Million gone from XToken. A sub-species of crypto users have developed superhuman abilities which allow them to tear through holes in smart contracts or mould them "
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# XToken - REKT

> **Loss:** $24,000,000 | **Date:** 2021-05-12 | **Audited by:** Peckshield

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/xtok-header.png)

**The X-ploiters live amongst us.** 

A sub-species of crypto users have developed superhuman abilities which allow them to tear through holes in smart contracts or mould them to their will with flash loans and arbitrage.

_Nobody is entirely safe from the anonymous team._

However, rekt.news is here to help by archiving the stories of the infamous X-ploiters so that our readers can learn and future generations may be protected from their brutal attacks.

This was no cheap ticket - [XToken](https://twitter.com/xtokenmarket) is a quality protocol with strong partnerships. Hacks like these remind us that even the “blue chips” aren’t entirely safe.

**What went wrong?**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/xtok-investigates.png)

Credit: [0xdeadfce](https://twitter.com/0xdeadf4ce) & [Frankresearcher](https://twitter.com/FrankResearcher/status/1392515198674681863?s=20)

[Exploit Transaction](https://ethtx.info/mainnet/0x7cc7d935d895980cdd905b2a134597fb91004b5d551d6db0fb265e3d9840da22)

**xToken.Market, a decentralized passive investing protocol, was exploited with the use of flash loans.**

**Over $24 million was taken from the yield-bearing liquidity pools for SNX (xSNXa) and BNT (xBNTa).**

At 15:14 UTC X-Token released the following [warning](https://twitter.com/xtokenmarket/status/1392483368135233544).

>Minting on all contracts has been paused as we investigate reports.

The community alerted us to X-Tokens [tweet](https://twitter.com/xtokenmarket/status/1392490733588946948?s=20) within minutes. 

A second tweet explained that:

>xSNXa and xBNTa contracts have been exploited. Minting paused on all contracts as we investigate further. 

>Liquidity pools have been drained, however most SNX and BNT remain in xToken contracts. 

The attacker used a Flashloan from DyDx for 61,833 ETH (~$267M) and a Private Transaction using Flashbots MEV to facilitate the attack.

**Funds lost**

- 2.4k ETH ($10.3M)
- 781k BNT ($6.2M)
- 407k SNX ($8M)
- 1.9B xBNTa

**All tokens except xBNTa have already been sold to ~5.6k ETH through 1inch.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/xtok-how.png)

**1:** Hacker borrowed 61.8k ETH flash loan on dYdX

**2:** Deposited 10k ETH to borrow 564k SNX on Aave and swap 5.5k ETH to 700k SNX on SushiSwap

**3:** Sold 1.2M SNX for 818 ETH on Uniswap v2, significantly reducing the SNX price.

**4:** Used only 0.12 ETH to mint 1.2B xSNXa, because the protocol buys SNX through Kyber, who in turn led to use Uniswap v2 for this swap.

**5:** However, within the protocol, xSNXa price turned out to be normal, which made it possible to swap 105M xSNX into 414 ETH.

**6:** After that, the attacker began to do reverse swaps in SushiSwap and Uniswap and repaid loans in Aave.

**7:** Then they also began to sell the existing xSNXa to the Balancer SNX/ETH/xSNXa (25/25/50) pool.

**8:** Repaid flash loan to dYdX.

**9:** Issued xBNTa four times for 0.03 ETH, which ultimately gave them 3.9B xBNTa.

**10:** Swap half of xBNTa to 781k BNT.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/xtok-conclude.png)

**Another $24 million gone, yet the only unusual thing is the names involved.**

We’re not used to seeing our blue chip babies involved in such violence. 

Perhaps that label gives a false sense of security, even the most time-tested protocols are still incredibly new when you look long term.

A new entry onto our leaderboard for XToken as they take the number 9 spot, but it’s the fourth time for their security auditor Peckshield, making them the most rekt auditor on the rekt.news leaderboard.

But then again, perhaps a $24 million bounty is worth another spot on the leaderboard…

**Did this attack come from within?**  
  
_We may never know, but we will always wonder._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/rekt-stamped.png)
