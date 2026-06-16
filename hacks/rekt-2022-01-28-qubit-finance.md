---
tags:
  - blockchain/bitcoin
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/privacy
  - sector/stable
title: "Qubit Finance - REKT"
protocol: "[[Qubit Finance]]"
date: 2022-01-28
loss_usd: 80000000
auditors:
source: "https://rekt.news/qubit-rekt"
excerpt: "In other news... Qubit Finance, a protocol by the team behind repeat offender PancakeBunny, has fallen victim to an $80M exploit. But will anyone remember this next week?"
genome:
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Qubit Finance - REKT

> **Loss:** $80,000,000 | **Date:** 2022-01-28 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/01/qubit-header.png)

**In other news…**
  
[Qubit Finance](https://qbt.fi/), a BSC-based lending protocol [launched](https://pancakebunny.medium.com/introducing-qubit-qbt-innovating-lending-and-borrowing-on-the-bsc-9f3fe6438f44) by the team behind [repeat](https://rekt.news/pancakebunny-rekt/)  [offender](https://rekt.news/pancakebunny2-rekt/) PancakeBunny, has fallen victim to an $80M exploit.  
  
That’s number seven on [our leaderboard](https://rekt.news/leaderboard/).

_But will anyone remember this next week?_ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Qubit allows for [cross-chain collateralisation](https://docs.qbt.fi/protocol/bridge), locking assets on Ethereum to borrow against on BSC via the QBridge deposit function.

The attacker took advantage of a logic bug in the code which made xETH available for use on BSC without having deposited ETH on Ethereum.

The attacker’s Ethereum [address](https://etherscan.io/address/0xd01ae1a708614948b2b5e0b7ab5be6afa01325c7) was [funded](https://etherscan.io/tx/0x8d2e9fd13c3e3f59eac17ff55bb0a0b10eee965a2e768e60832b1b3d5b80ebfb) from Tornado Cash shortly before the exploit commenced at approximately 21:30 PM +UTC on January 27th 2022.

From the Qubit team’s [post-mortem](https://medium.com/@QubitFin/protocol-exploit-report-305c34540fa3):

**1.** The attacker called the QBridge deposit function on the ethereum network, which calls the deposit function QBridgeHandler.

**2.** QBridgeHandler should receive the WETH token, which is the original tokenAddress, and if the person who performed the tx does not have a WETH token, the transfer should not occur.

**3.** tokenAddress.safeTransferFrom(depositer, address(this), amount);

**4.** In the code above, tokenAddress is 0, so safeTransferFrom didn’t fail and the deposit function ended normally regardless of the amount value.

**5.** Additionally, tokenAddress was the WETH address before depositETH was added, but as depositETH is added, it is replaced with the zero address that is the tokenAddress of ETH.

**6.** In summary, the deposit function was a function that should not be used after depositETH was newly developed, but it remained in the contract.

According to Certik’s [analysis](https://certik.medium.com/qubit-bridge-collapse-exploited-to-the-tune-of-80-million-a7ab9068e1a0):

> _One of the root causes of the vulnerability was the fact that tokenAddress.safeTransferFrom() does not revert when the tokenAddress is the zero (null) address (0x0…000)._

Despite not having locked any ETH in the Ethereum contract, the attacker’s BSC address now had access to [77,162 qXETH](https://bscscan.com/tx/0x50946e3e4ccb7d39f3512b7ecb75df66e6868b9af0eee8a7e4b61ef8a459518e) ($185 million) to use as collateral against loans on Qubit.
  
They used this collateral to borrow WETH, BTC-B, USD stablecoins, and CAKE, BUNNY, and MDX before swapping everything for a total of 200k BNB (~$80M), which remains in the [BSC address](https://bscscan.com/address/0xd01ae1a708614948b2b5e0b7ab5be6afa01325c7).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**According to the Qubit docs, the cross-chain collateral feature was audited in Dec 2021.**

> _the whole X-Collateral feature (including contracts and scripts) has been audited by Theori, a professional auditing firm. The audit result is published [here](https://github.com/PancakeBunny-finance/qubit-finance/blob/master/audits/mound_qubit_xChain_audit_rev1.1.pdf)._

The project has a max bounty of $250k on [Immunefi](https://immunefi.com/bounty/qubit/), but the Qubit team seems prepared to [negotiate](https://twitter.com/QubitFin/status/1486984216072318977).

Back in May 2021, we were [gifted](https://twitter.com/RektHQ/status/1397195892327858181) 100k DAI by the Pancake Bunny hacker.  
  
We returned the funds, and [told](https://twitter.com/RektHQ/status/1399714766785028098?s=20) the team “not to lose it this time”, yet here we are again.  
  
Our donation address is listed below.
  
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/pancbunny2-conc.png)
