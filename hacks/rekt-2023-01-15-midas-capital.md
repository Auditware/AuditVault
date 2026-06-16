---
tags:
  - blockchain/polygon
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - vuln/reentrancy/read-only
  - vuln/reentrancy/single-function
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
  - novelty/known-pattern
title: "Midas Capital - REKT"
protocol: "[[Midas Capital]]"
date: 2023-01-15
loss_usd: 660000
auditors:
source: "https://rekt.news/midas-capital-rekt"
excerpt: "The Midas touch has backfired, leaving a $660K hole in one of its jFIAT pools. The read-only reentrancy vulnerability is a known weakness of a recently introduced collateral type. Let’s hope this rush"
genome:
  - "[[read-only]]"
  - "[[single-function]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
---
# Midas Capital - REKT

> **Loss:** $660,000 | **Date:** 2023-01-15 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/midas-header.png)

**The [Midas](https://midascapital.xyz/) touch has backfired, leaving a $660K hole in one of its pools of [Jarvis Network](https://twitter.com/Jarvis_Network)’s jFIAT assets.**

_On Sunday, Polygon-based lending protocol Midas Capital was exploited via a flash loan attack on a recently-added collateral type._

[Both](https://twitter.com/MidasCapitalxyz/status/1614774901247991808)  [organisations](https://twitter.com/Jarvis_Network/status/1614723934519234560) announced the cause of the attack as the use of WMATIC-stMATIC Curve LP token. The read-only reentrancy vulnerability is a known weakness of this type of LP token, and had [previously](https://quillaudits.medium.com/decoding-220k-read-only-reentrancy-exploit-quillaudits-30871d728ad5) led to a $220k loss on [market.xyz](https://www.market.xyz/) in October.

_All that glitters is not gold…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[BlockSec](https://twitter.com/BlockSecTeam/status/1614864084956254209), [Beosin](https://twitter.com/BeosinAlert/status/1614905399102287872)_

Midas recently added WMATIC-stMATIC Curve LP token for use as collateral. These tokens have a read-only reentrancy [vulnerability](https://chainsecurity.com/curve-lp-oracle-manipulation-post-mortem/) which allows the token's virtual price to be manipulated when improperly implemented.

**According to BlockSec’s [analysis](https://twitter.com/BlockSecTeam/status/1614864084956254209) the attack has 5 basic steps:**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/midas-steps.png)

>1) the calculation of a position's collateral depends on self.D and totalSupply
>
>2) self.D is updated after an unexcepted callback, so the four borrows in step 5 to use an outdated self.D.
>
>3) the contract burns stMATIC-f before the unexcepted callback, which causes the four borrows in step 5 to use an updated `stMATIC-f.totalSupply()`.
>
>As a result, [@MidasCapitalxyz](https://twitter.com/MidasCapitalxyz) over-estimated the attack contract's position and lent excessive assets to the contract.

**Attacker address:** [0x1863b74778cf5e1c9c482a1cdc2351362bd08611](https://polygonscan.com/address/0x1863b74778cf5e1c9c482a1cdc2351362bd08611)

**Attack tx:** [0x00534902…](https://polygonscan.com/tx/0x0053490215baf541362fc78be0de98e3147f40223238d5b12512b3e26c0a2c2f)

**Attacked smart contract:** [0x5bca7ddf1bcccb2ee8e46c56bfc9d3cdc77262bc](https://polygonscan.com/address/0x5bca7ddf1bcccb2ee8e46c56bfc9d3cdc77262bc#code)

The attacker was able to borrow the [following](https://twitter.com/StfnTdrv/status/1614942921609945088) assets against the inflated collateral:

jCHF: 273,973

jEUR: 368,058

jGBP: 45,250

agEUR: 45,435

**Which were then swapped to ~660k MATIC ($660k) and sent on to Kucoin and Binance.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**It’s always a shame to report on losses in DeFi, but especially when they are down to already [known](https://twitter.com/BeosinAlert/status/1614905406039658496) issues, with simple [workarounds](https://twitter.com/CurveFinance/status/1614939752507244544).**

Jarvis Network will [cover](https://twitter.com/pscltllrd/status/1614924762547122176) the (~$350k) shortfall in backing of jFIATs that resulted from the exploit, and Midas Capital have reached out to the hacker in an [attempt](https://twitter.com/MidasCapitalxyz/status/1614977157561987072) to negotiate a bounty.

In a statement to rekt.news, Jarvis Network's founder [Pascal Tallarida](https://twitter.com/pscltllrd) explained how they plan to deal with the incident going forward:

>As a result of the Midas exploit, the protocol lost 257k jEUR, 237k jCHF and 45k jGBP, and users lost 111k jEUR and 36k jCHF. The jFIATs belonging to the protocol were not collateralized.
>
>We have decided to do not wait after Midas, and we are working on a plan to re-collateralize the jFIATs the protocol lost, and reimburse the users who were victim of the exploit. We will propose to the Jarvis governance to allocate part of the protocol’s revenus (liquidity provision, lending interests, protocol fee and farming with POL) and part of the protocol treasury to it, and we will ask for the help and support of our community, partners, investors, and “frens”. I have already discussed with many of them and they have expressed their will to support us in this difficult moment, either with or without counterparty. Also, the company which is the main liquidity provider within the protocol, will help, with both its treasury and revenues (±$700k last year with swap fees, interests and market making).
>
>Then, Midas promised us that they will do right by us, by reimbursing what they can, and by helping us to provide value to the protocol. It could take them a while to do so, but I trust that they will do it.

This isn’t the first time we have seen a hastily incorporated collateral type leading to a loss, and is unlikely to be the last.

**Let’s hope this rushed decision doesn’t prove to be Midas’ [undoing](https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Claudian/In_Rufinum/1*.html) this time…**

_"His senses are captured by the bait, and, thrilled beyond measure, he feasts his greedy eyes on the sight. So Midas, king of Lydia, swelled at first with pride when he found he could transform everything he touched to gold: but when he beheld his food grow rigid and his drink harden into golden ice then he understood that this gift was a bane and in his loathing for gold cursed his prayer."_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
