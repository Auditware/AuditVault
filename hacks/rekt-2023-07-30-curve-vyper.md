---
tags:
  - blockchain/arbitrum
  - blockchain/bsc
  - blockchain/ethereum
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/stable
  - vuln/reentrancy/read-only
  - vuln/reentrancy/single-function
  - impact/mev/frontrun
  - novelty/known-pattern
title: "Curve, Vyper - REKT"
protocol: "[[Curve Vyper]]"
date: 2023-07-30
loss_usd: 69300000
auditors:
source: "https://rekt.news/curve-vyper-rekt"
excerpt: "Multiple protocols bit by the Vyper. Curve Finance returns to the leaderboard with a total of $69M drained from four pools. Some funds have been returned with hopefully more to come. Will this wake-up"
genome:
  - "[[read-only]]"
  - "[[single-function]]"
  - "[[frontrun]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
---
# Curve, Vyper - REKT

> **Loss:** $69,300,000 | **Date:** 2023-07-30 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/vyper-header.png)

_Multiple protocols bit by the Vyper._

**And Curve Finance returns to the [leaderboard](https://rekt.news/leaderboard/), 100x-ing their [previous entry](https://rekt.news/curve-finance-rekt/).**

**The [total drained](https://twitter.com/tayvano_/status/1685789453556846592) from the affected pools reached $69M (_nice_) and came from a number of protocols who use Curve for liquidity of their ETH-pegged assets:**

[JPEG’D](https://twitter.com/JPEGd_69/status/1685655792274341888) lost $11.5M from the pETH/ETH pool

[Alchemix](https://twitter.com/AlchemixFi/status/1685679422693629953) lost $20.5M from the alETH/ETH pool but were able to save $11.5M

[Metronome](https://twitter.com/MetronomeDAO/status/1685688052159520768) lost $1.6M from the msETH-ETH pool, with the attack tx frontrun by MEV bot [0xc0ffeebabe](https://etherscan.io/address/0xc0ffeebabe5d496b2dde509f9fa189c25cf29671)

And Curve itself lost $24.2M from the CRV/ETH pool, $5.4M of which was also frontrun by 0xc0ffeebabe, who quickly [returned](https://etherscan.io/tx/0xb76754124fdde090f25129105ed2907e3c62e0db87ecb8ffcefcb1dede0954fd) the funds.

_Smaller [amounts](https://twitter.com/PeckShieldAlert/status/1685696196839649280) were lost from [dBridge](https://twitter.com/deBridgeFinance/status/1685949893628620800) ($25k from dormant LPs who hadn’t migrated affected) and BSC Curve-fork [Ellipsis](https://twitter.com/Ellipsisfi/status/1685695547271987200) ($69k)._

**Peckshield [raised the alarm](https://twitter.com/peckshield/status/1685645064364822530) on JPEG’d. Then when Alchemix was [also hit](https://twitter.com/spreekaway/status/1685676752335425536), the DeFi community began to panic.**

This was [not just another iteration](https://twitter.com/pcaversaccio/status/1685655708996448257) of the read-only reentrancy bug which has plagued the sector for the past months, despite what Curve initially, and dismissively, [assumed](https://twitter.com/knveth/status/1685740775379013632).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/vyper-tweets.png)

**The tweet was deleted once it became clear that the problem ran deeper…**

_…were more pools at risk?_

As the nature of the threat became [clearer](https://twitter.com/vyperlang/status/1685692973051498497), Curve [clarified](https://twitter.com/CurveFinance/status/1685693202722848768), stating that the bug affected the alETH/msETH/pETH pools and that:

>Other pools are safe.

**Then Curve itself was [hit](https://twitter.com/blockanalia/status/1685732007400079360) when the CRV/ETH [pool](https://etherscan.io/address/0x8301ae4fc9c624d1d396cbdaa1ed877821d7c511) was drained for $24.3M.**

_Would this bloody Sunday ever end?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Vyper](https://twitter.com/vyperlang/status/1685692973051498497), [Ancilia](https://twitter.com/AnciliaInc/status/1685716765266116608), [Chaofan Shou](https://twitter.com/shoucccc/status/1685688647637725184), [Tayvano](https://twitter.com/tayvano_/status/1685789453556846592)_

**Initially, the hacks were [thought](https://twitter.com/DecurityHQ/status/1685646377198505985) to be due to the read-only reentrancy vulnerability which has damaged countless protocols over the last few months, most recently [Conic Finance](https://rekt.news/conic-finance-rekt/) and [EraLend](https://rekt.news/eralend-rekt/).**

_However, the exploited contracts were not external projects using Curve pools as a price feed, but the Curve pools themselves…_

**The [root cause](https://twitter.com/vyperlang/status/1685692973051498497) was in fact a 0-day compiler bug in certain older versions of Vyper, the language Curve’s contracts are written in.**

A [misalignment](https://twitter.com/AnciliaInc/status/1685716765266116608) of storage slots between two functions (add_liquidity and remove_liquidity) causes a malfunction in the [nonreentrant guard](https://twitter.com/shoucccc/status/1685688647637725184). This allows the attacker/s to re-enter the transaction between these two functions in order to manipulated LP token prices and drain the pool.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/vyper-code1.png)
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/vyper-code2.png)
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/vyper-code3.png)

**[Any pool](https://twitter.com/CurveFinance/status/1685696639325933568) containing native ETH and written in versions 0.2.15, 0.2.16 and 0.3.0 was vulnerable.**

The bug has been exploitable since 2021, and was patched (seemingly by accident, given no protective actions were taken) in version 0.3.1.

**Attacker’s addresses and attack transactions:**

JPEG’D: [0x6ec21d1868743a44318c3c259a6d4953f9978538](https://etherscan.io/address/0x6ec21d1868743a44318c3c259a6d4953f9978538)

Tx: [0xa84aa065…](https://etherscan.io/tx/0xa84aa065ce61dbb1eb50ab6ae67fc31a9da50dd2c74eefd561661bfce2f1620c)

Alchemix: [0xdce5d6b41c32f578f875efffc0d422c57a75d7d8](https://etherscan.io/address/0xdce5d6b41c32f578f875efffc0d422c57a75d7d8)

Tx: [0xb676d789…](https://etherscan.io/tx/0xb676d789bb8b66a08105c844a49c2bcffb400e5c1cfabd4bc30cca4bff3c9801) and [0x20d00acd…](https://etherscan.io/tx/0x20d00acdfbaeffa5fe618ecbcbb8c13df80133cb6d964f9a7ab6a5a7b0d796f3) (whitehat tx)

Metronome (whitehat frontrunner): [0xc0ffeebabe5d496b2dde509f9fa189c25cf29671](https://etherscan.io/address/0xc0ffeebabe5d496b2dde509f9fa189c25cf29671)

Tx: [0xc93eb238…](https://etherscan.io/tx/0xc93eb238ff42632525e990119d3edc7775299a70b56e54d83ec4f53736400964)

Curve: [0xB1C33b391C2569B737eC387E731E88589e8ec148](https://etherscan.io/address/0xB1C33b391C2569B737eC387E731E88589e8ec148) and [0xb752def3a1fded45d6c4b9f4a8f18e645b41b324](https://etherscan.io/address/0xb752def3a1fded45d6c4b9f4a8f18e645b41b324)

Tx: [0x2e7dc8b2…](https://etherscan.io/tx/0x2e7dc8b2fb7e25fd00ed9565dcc0ad4546363171d5e00f196d48103983ae477c) and [0x2e7dc8b2...](https://etherscan.io/tx/0x2e7dc8b2fb7e25fd00ed9565dcc0ad4546363171d5e00f196d48103983ae477c)

Despite not being able to find a workable exploit, Curve has [advised](https://twitter.com/CurveFinance/status/1685933800088391680) users to withdraw from the Tricrypto pool on Arbitrum out of caution.

_Thankfully, although being from an older Vyper version, the [stETH/ETH pool](https://etherscan.io/address/0xDC24316b9AE028F1497c275EB9192a3Ea0f67022#code) (>$400M TVL) is [fine](https://twitter.com/pcaversaccio/status/1685926647449432064)._
---

**As the chaos was unfolding, whitehats [rushed](https://twitter.com/pcaversaccio/status/1685693433858437120) to save funds, but were repeatedly [pipped](https://twitter.com/AlchemixFi/status/1685737642565173248) to the [post](https://twitter.com/bantg/status/1685734521981857792) by hackers.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/vyper-mich.png)

Some funds were saved, however, totalling $17M so far, with the Metronome funds likely to be returned (0xc0ffeebabe has [already](https://etherscan.io/tx/0xc52cce67226ca6c9fd85b6081d532171623a4ba2cb78f5f69811e38f82c22f2b) set [1000 ETH](https://etherscan.io/tx/0x9d18d84353c8216d653afd402de8b4961cb3316f40152fab592c35d28515e060) aside).

But many were [frustrated](https://twitter.com/LefterisJP/status/1685752260465180673) at the perceived irresponsible disclosure of the vulnerability (specifically the at-risk version numbers) while efforts were still on-going.

BlockSec, who came [under fire](https://twitter.com/DefiLlama/status/1685965910207545344) for publicly reaching out to Curve via Twitter, seem to have a [clear conscience](https://twitter.com/nothingrude_q/status/1685762944032788482) and [defended](https://twitter.com/BlockSecTeam/status/1685859878101983233) their actions as having come after all exploitable pools were drained.

_Clout farming should take a back-seat when every second counts._

As banteg [put it](https://twitter.com/bantg/status/1685679541212069888):

>you 👏 don't 👏 tweet 👏 live 👏 vulns 👏 before 👏 they 👏 are 👏 fully 👏 mitigated

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_The losses have been heavy, but the fallout could be worse…_

Many of the associated tokens took a beating: [JPEG](https://www.coingecko.com/en/coins/jpeg-d) (initially -45%, since settled around -20%), [pETH](https://www.coingecko.com/en/coins/peth) (initially -85%, then settled at around -40%), [ALCX](https://www.coingecko.com/en/coins/alchemix) (down <10%), [alETH](https://www.coingecko.com/en/coins/alchemix-eth) (roughly -20%), [CRV](https://www.coingecko.com/en/coins/curve-dao-token) currently -15% but dropped to $0.60 at lowest point.

_And CRV is the one to watch…_

The potential impact of such a large amount of CRV being dumped onto the open market (which the hacker still hasn’t done so far…) caused [worries](https://twitter.com/adamscochran/status/1685735584344506368) due to the highly-leveraged position of the protocol’s founder Michael Ergorov.

In a [fittingly](https://twitter.com/setanimals/status/1685797479919263745) degen manner, Ergorov has borrowed a total of $107.2M of stablecoins against $284M of CRV collateral [across a variety](https://debank.com/profile/0x7a16ff8270133f063aab6c9977183d9e72835428) of DeFi lending protocols. But with such a large quantity of CRV hanging in the balance, a liquidation cascade could cause much larger problems than yesterday’s hacks.

Theories of perverse [incentives](https://twitter.com/napgener/status/1685836352552644608) aside, Ergorov does seem to be [maneuvering](https://twitter.com/adamscochran/status/1685984003919056897) but remains in a dicey position under pressure from rapidly increasing interest.

_For the sake of the whole sector let’s hope his [good luck](https://twitter.com/newmichwill/status/1682741861134262275) continues…_

Some managed to [profit](https://twitter.com/dcfgod/status/1685689924769771520) from yesterday’s chaos, [bots](https://cointelegraph.com/news/ethereum-million-dollar-mev-block-reward-amid-curve-finance-exploit) included, but are now being [urged](https://twitter.com/spreekaway/status/1685965363475828736) to do the right thing (by the alETH hacker no less, maybe hinting at some good news to come for Alchemix).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_While Curve has [made clear](https://twitter.com/CurveFinance/status/1685702848103710720) that the other protocols were not at fault, it’s hard to know where the blame does ultimately lie._

**Compiler-level vulnerabilities come as a chilling surprise to all involved.**

Situations like these, which at times seemed to present an existential threat to a key piece of DeFi infrastructure, present an opportunity to break from business as usual and reprioritise.

**One of the most [valuable innovations](https://twitter.com/StaniKulechov/status/1685966638741442560) of our system is the transparency which allows us to dissect incidents like these in an open conversation, in stark contrast to TradFi.**

The tools underlying our industry require just as much attention as the protocols they are used to build. With the majority of attention on Solidity, this vulnerability in Vyper snuck under the radar for years before being exploited.

_But the [incentives](https://twitter.com/fubuloubu/status/1686031792581582849) are skewed…_

Auditing projects can be good money, but generally takes for granted the stability of the underlying language. And with no token for VCs to dump on retail the base layer can often get forgotten about.

_With [59 contracts](https://twitter.com/bantg/status/1686055412540358682) potentially affected, a similar bug in Solidity could see far more [widespread](https://twitter.com/fubuloubu/status/1685856283448979457) damage._

This hack took a different approach to most. Not content with ripping off protocols for a million or so going after the same read-only reentrancy, the attacker/s targeted a deeper layer to find a way in.

**That kind of dedication and attention to detail sounds like a certain [state-sponsored hacking group](https://rekt.news/big-phish/)…**

Or perhaps this time the bug was discovered by accident; it’s hard to imagine such a deeply buried vulnerability being painstakingly researched only to get frontrun on execution.

**Either way, this still offers an opportunity to change direction.**

Given some of the larger protocols in the space have money to burn, _and even more to lose_, hiring in-house specialists to work on maintain and research could be money well spent.

But while money remains attracted to our casino solely by the promise of moonshots, investment in the most basic level of infrastructure will likely continue to be lacking.

_Will we learn this time?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
