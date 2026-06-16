---
tags:
  - blockchain/bsc
  - sector/lending
  - sector/privacy
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "bEarn - REKT"
protocol: "[[Bearn]]"
date: 2021-05-17
loss_usd: 18000000
auditors:
source: "https://rekt.news/bearn-rekt"
excerpt: "$18 million gone from bEarnFi. Has the hacker returned richer to their day job, or do they attack on weekends as they expect less attention? As we watch the rapid rise and fall of TVL on BSC, it becom"
genome:
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# bEarn - REKT

> **Loss:** $18,000,000 | **Date:** 2021-05-17 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/bearn-header.png) 
**Every weekend another one falls.**

Binance Smart Chain provides the easiest prey for the anonymous apex predator.

Hard-hearted hackers are fast to feast on copied code from developers keen to cut corners.

**Another week finished and another protocol with it.** 

_$18 million gone from bEarnFi._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/bearn-investigates.png) 

The following is taken from the [Peckshield](https://peckshield.medium.com/bearn-fi-incident-inconsistent-asset-denomination-between-vault-strategy-9b24b68ab1c0) and [bEarn analysis](https://bearn-defi.medium.com/bvaults-busd-alpaca-strategy-exploit-post-mortem-and-bearn-s-compensation-plan-b0b38c3b5540).

**Starting at 10:36:20 AM +UTC, May 16, 2021, BearnFi’s BvaultsBank contract was exploited and approximately $18M funds were drained from the pool.** 

The incident was made possible due to a bug in the internal withdraw logic, which inconsistently read the same input amount, but with different asset denominations between the BvaultsBank and the associated strategy BvaultsStrategy. 

The BvaultsBank's withdraw logic assumes the withdrawn amount is denominated in BUSD while the BvaultsStrategy's withdraw logic assumes the withdrawn amount is denominated in ibBUSD. 

**However, [ibBUSD](https://bscscan.com/token/0x7c9e73d4c71dae564d41f78d56439bb4ba87592f) is an interest-bearing token and is more expensive than [BUSD](https://bscscan.com/token/0xe9e7cea3dedca5984780bafc599bd69add087d56).**  

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/bearn-step.png) 

**1:** Borrow a flashloan from CREAM with 7,804,239.111784605253208456 BUSD, which is returned at the last step with necessary fee to cover the flash loan cost.

**2:** Deposit the borrowed funds into BvaultsBank, which are immediately sent to the associated BvaultsStrategy strategy, then to Alpaca Vault for yield. Due to the above deposit, the Alpaca Vault mints 7,598,066.589501626344403426 ibBUSD back to BvaultsStrategy.

**3:** Farm with the received 7,598,066.589501626344403426 ibBUSD via the Alpaca FairLaunch.

**4:** Withdraws the 7,804,239.111784605253208533 BUSD from BvaultsBank, which is interpreted as withdrawing 7,804,239.111784605253208533 ibBUSD, the equivalent of 8,016,006.09792806917101481 BUSD.

**5:** In the next round, the user still deposits 7,804,239.111784605253208533 BUSD into BvaultsBank, cascadingly to BvaultsStrategy. But with the previous leftover from the last round, BvaultsStrategy credits the user with 8,016,006.09792806917101481 BUSD, which is used for yield again via Alpaca.

**6:** Repeat the above steps to continue accumulating the credit and finally exits by draining the pool.

**7:** Return the flash loan with 7,806,580.383518140634784418 BUSD.

The attacker’s funds from the above exploitations were initially held in this wallet: [47f3](https://bscscan.com/address/0x47f341d896b08daacb344d9021f955247e50d089). 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**Another week begins. Has the hacker returned richer to their day job, or do they attack on weekends as they expect less attention?**

The boom in BSC code copies has created a wealth of new opportunities for any developer who seeks to exploit protocols. 
As we watch the rapid rise and fall of TVL on BSC, it becomes even more apparent that time is the most valuable audit of all. 

Longevity suggests security, and vice versa. 

_How long until the next rekt comes along?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/bearn-conc.png) 

>Photography by [Ray Metzker](https://www.lesdoucheslagalerie.com/en/artists/2218-ray-k.-metzker/works/1302-ray-k.-metzker-early-philadelphia-1963/)
