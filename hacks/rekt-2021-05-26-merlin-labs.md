---
tags:
  - blockchain/bsc
  - has/audit
  - sector/bridge
  - sector/dex
title: "Merlin Labs - REKT"
protocol: "[[Merlin Labs]]"
date: 2021-05-26
loss_usd: 680000
auditors:
  - "[[Hacken]]"
source: "https://rekt.news/merlinlabs-rekt"
excerpt: "The PancakeBunny attack pulled the rabbit out of the hat, now a surprisingly similar string of attacks emerges from Binance Smart Chain. $680,000 taken from Merlin Lab."
genome:
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[reward-accounting]]"
---
# Merlin Labs - REKT

> **Loss:** $680,000 | **Date:** 2021-05-26 | **Audited by:** Hacken

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/merlin-header.png) 
**Security looser than a wizard's sleeve.** 

The [PancakeBunny](https://www.rekt.news/pancakebunny-rekt/) attack pulled the rabbit out of the hat, now a surprisingly similar string of attacks emerges from [Binance Smart Chain](https://www.rekt.news/bsc-the-bridge-to-defi/).

**$680,000 taken from [Merlin Lab](https://twitter.com/MerlinLab_).** 

We have to set ourselves some standards here at [rekt.news](https://www.rekt.news/) - generally we won’t report on hacks concerning less than $1M, but when there’s something worth saying we’ll say it.

**The same technique has been used three times in one week.**

_BSC developers must try harder._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/merlin-investigates.png) 

>Credit: [watchpug](https://twitter.com/WatchPug_)

**On May 26, 2021, 03:59:05 AM +UTC, less than 48 hrs after the [Autoshark](https://www.rekt.news/autoshark-rekt/) hack. Merlin Lab, (another fork of PancakeBunny), was attacked in a similar fashion to the Bunny and the Autoshark hack.**

As a result, the hacker was able to remove ~240 ETH (~680K USD).

[Transaction Details on BscScan.](https://bscscan.com/tx/0x8e20a1118a669d03b66c5eca2d937646bd855a998afb1e94b94ff6303456ff97)

**1:** Add a small sum of deposit to the LINK-BNB Vault (with this transaction).

**2:** Send 180 CAKE to the LINK-BNB Vault contract. (This is the key that leads to the hack.)

**3:** Call getReward with the deposit of LINK-BNB Vault from the first step.

**4:** With the large amount of CAKE token in the wallet balance of the vault contract (sent by the hacker in step 2), it returns a large amount of profit. As a result, the system minted 100 MERL as a reward to the hacker.

**5:** Repeat 36 times. Receive 49K of MERL token in total.

**6:** Swapped MERLIN token into 240 ETH and transferred out of BSC using Anyswap.

_The hacker used the wallet balance of CAKE as the profit (performanceFee) which can be easily tampered with by just sending the CAKE token to the vault contract._ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**We don’t document these attacks to help the hackers, although sometimes they might [thank us for our work](https://twitter.com/RektHQ/status/1397195892327858181?s=20).**

Each attack provides a lesson for the protocols that remain. 

If these lessons are ignored, meaning users' funds are lost, then what does that say about the founders and the auditors?  

**Merlin Labs was audited by [Hacken](https://merlinlab.com/15052021_Merlin_SC_SecondReview_Audit_Report.pdf) on May 15th, just 11 days before this exploit.**

Now they both take a spot at the bottom of our [leaderboard](https://www.rekt.news/leaderboard/).

_Must try harder._ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-text-linebreak.png)
