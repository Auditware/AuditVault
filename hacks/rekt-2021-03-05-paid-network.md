---
tags:
  - sector/dex
  - sector/staking
  - sector/token
  - impact/privilege-escalation/ownership-transfer
  - precondition/insider
title: "Paid Network - REKT"
protocol: "[[Paid Network]]"
date: 2021-03-05
loss_usd: 27000000
auditors:
source: "https://rekt.news/paid-rekt"
excerpt: "Willy Wonka returns with the infinite mint, creating 59,471,745.571 PAID tokens before dumping them onto the unsuspecting Oompa Loompas who were providing liquidity to the PAID/ETH pair on Uniswap."
genome:
  - "[[ownership-transfer]]"
  - "[[insider]]"
  - "[[fot-slippage]]"
  - "[[reward-accounting]]"
---
# Paid Network - REKT

> **Loss:** $27,000,000 | **Date:** 2021-03-05 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/paidtokill.png)

**What a way to make a living.**

Willy Wonka returns with the infinite mint, creating 59,471,745.571 PAID tokens before dumping them onto the unsuspecting Oompa Loompas who were providing liquidity to the PAID/ETH pair on Uniswap.

**Total WETH swapped: 2079.603371141493 = $3,104,887.33**
**Total PAID left in account: 594,717,455.71 = $24,313,147**

**Total Rugged Amount: $ 27,418,034.33**

[Banteg](https://twitter.com/bantg) tweeted:

>I don't know what PAID is, but it looks to me that one founder rugged another.
>1. [Burn](https://etherscan.io/token/0x8c8687fc965593dfb2f0b4eaefd55e9d8df348df?a=0xd500aa2cffb70f460f4da6afa038ce35bed029bc…) 
>2. [Mint](https://etherscan.io/token/0x8c8687fc965593dfb2f0b4eaefd55e9d8df348df?a=0x18738290af1aaf96f0acfa945c9c31ab21cd65be) 

[@n2ckchong’s](https://twitter.com/n2ckchong/status/1367905499585282055) finding seems to correlate with this suggestion, as he pointed out that “Paid Network's deployer, an EOA, transferred ownership of a contract to the attacker 30 mins before the mint.” 

As with most of our cases, it will be almost impossible for the founders to prove that it wasn’t them, leaving the PAID team in a particularly uncomfortable situation. 

**_Perhaps_ their private keys were compromised…**

[Kyle Chasse](https://www.youtube.com/watch?v=hVGXHYF6NOo) is the CEO of Paid Network, a Youtuber and self-proclaimed “master disruptor crypto OG”. However, even these lofty achievements are not enough to prevent people from suspecting foul play.

**Someone out there believes that this was not an exploit, but an inside job.** 

We usually love it when people slide into the TXID’s, but this note was of a more personal nature than usual.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/paid-tx-chasse.png)

It seems the suspicious sender is not alone in their belief, as we can see that the Twitter account [WARONRUGS](https://twitter.com/WARONRUGS/status/1353771974506459138?s=20) warned users of this mint capability over a month ago.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/paid-warongrugs.png)

Another message was sent to the minters address to congratulate the “Russian Hackers” for putin in the work.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/paid-russian.png)

**PSA - If a protocol advertises themselves as a “100x altcoin gem” - it’s probably best to stay clear.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/paid-100x.png)

The mint happened just after 18:00 UTC, with the dumping during the next 30 minutes, which took the price of PAID from ~$2.86 to ~$0.32.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/paid-coingecko.png)

**PAID Network have [tweeted](https://twitter.com/paid_network/status/1367920257202061318?s=20) that;**

>We are investigating the issue. We pulled liquidity, are creating a new smart contract, & will be restoring everyone's original balances to before the hack.

>Those with staked, Lpool & UniFarm $PAID will have their tokens be sent to them manually.

>We will share more updates soon.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/paid-linebreak.png)

**DeFi runs 24/7, a hall of mirrors and back doors where the ruthless walk free.**

Working 9-5 is no way to make a living, but is stealing from others any more respectable?

**An infinite mint is a magical thing - a golden ticket to make profit illicit, but who’s to blame when the warnings are clear, loot isn’t shared but the responsibility is.**

Was this an exploit, a hack or an insider job? We await the official post-mortem from PAID.

_Thanks to all the greedy hackers and scammers for keeping us in work._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/paid-conc.png)
