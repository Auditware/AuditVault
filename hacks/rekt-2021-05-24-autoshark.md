---
tags:
  - blockchain/bsc
  - sector/dex
  - sector/lending
  - sector/stable
  - has/audit
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Autoshark - REKT"
protocol: "[[Autoshark]]"
date: 2021-05-24
loss_usd: 745000
auditors:
  - "[[Techrate]]"
source: "https://rekt.news/autoshark-rekt"
excerpt: "Autoshark hacked, now they swim with the fishes, although the damage was small - only ~$745k profit. Perhaps the hacker who donated $100k DAI to the rekt.news treasury didn’t like to see Autoshark fis"
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# Autoshark - REKT

> **Loss:** $745,000 | **Date:** 2021-05-24 | **Audited by:** Techrate

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/shark-header.png)  

**We’re going to need a bigger team.**

Before we’ve even caught up with the weekend's affairs, another one is dead in the water.

[Autoshark](https://twitter.com/AutoSharkFin) hacked, and now they swim with the fishes, although the damage was small: only ~$745k profit.

_Perhaps the [hacker who donated $100k DAI](https://twitter.com/RektHQ/status/1396809950484209673?s=20) to the rekt.news treasury didn’t like to see Autoshark fishing for promotion in the replies._ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/shark-compound.png)  

**8 hours later, Autoshark fell victim to the same exploit as the PancakeBunny hack.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/shark-investigates.png)  

credit : [watchpug](https://watchpug.medium.com/sharkfinance-performance-fee-minting-incident-analysis-4b2e3bd03923)

**1:** Add a small sum of deposit to the SHARK-BNB Vault (with this transaction).

**2:** Borrow 100K BNB of flash loan from PancakeSwap.

**3:** Swap 50K BNB into SHARK token and send them alongside the rest 50K BNB to the SharkMinter contract. (this is important! this is the key to the hack.)

**4:** Call getReward with the deposit of SHARK-BNB Vault from the first step.

**5:** With the huge amount of SHARK token and WBNB in the wallet balance of the minter contract (sent by the hacker at step 3), it returned an extremely large amount of profit. As a result, the system minted 100M SHARK as a reward to the hacker. (plus 15M for Dev and 20M for Referrer)

**6:** Sold SHARK token for 102K WBNB, repaid flash loans, taken out 2.2K WBNB.

**The 50K BNB and 50K BNB worth of SHARK token sent to the contract’s wallet at step 3 made the contract believe the profit was very high.**

**The result: 100M (plus 15M for Dev and 20M for Referrer) of Shark token minted and dumped.**

[Transaction Details on BscScan.](https://bscscan.com/tx/0xfbe65ad3eed6b28d59bf6043debf1166d3420d214020ef54f12d2e0583a66f13)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**The tides have turned on BSC, and they’re now in damage prevention mode.** 

Any new DeFi ecosystem will have to pass through this phase, but poorly copied code won’t take them far. 

There’s plenty of [audit firms](https://docs.autoshark.finance/autoshark/general/audit) who are willing to ignore mistakes in low quality code, and we must consider their motives. 

_We’re watching [you.](https://techrate.org/)_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-text-linebreak.png)
