---
tags:
  - blockchain/ethereum
  - blockchain/fantom
  - blockchain/optimism
  - sector/dex
  - sector/multisig
  - sector/oracle
  - sector/token
  - vuln/arithmetic/precision-loss
  - impact/data-corruption/price-manipulation
  - impact/mev/frontrun
  - trigger/price-manipulation
  - novelty/variant
title: "Balancer - REKT"
protocol: "[[Balancer]]"
date: 2023-08-27
loss_usd: 2100000
auditors:
source: "https://rekt.news/balancer-rekt"
excerpt: "Balancer has had a bit of a wobble. First came a warning. Then, last Sunday, the AMM (along with ‘official partner’ Beethoven X) lost $2.1M from v2 Boosted pools."
genome:
  - "[[precision-loss]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[frontrun]]"
  - "[[trigger/price-manipulation]]"
  - "[[variant]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Balancer - REKT

> **Loss:** $2,100,000 | **Date:** 2023-08-27 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/balancer-header.png)

_Balancer has had a bit of a wobble._

**Last Sunday, the AMM (_along with ‘official partner’ [Beethoven X](https://twitter.com/beethoven_x)_) lost $2.1M from v2 Boosted pools across Ethereum, Optimism and Fantom.**

**First came a [warning](https://twitter.com/Balancer/status/1694014645378724280):**

>Balancer has received a critical vulnerability report affecting a number of V2 Pools.
>
>Emergency mitigation procedures have been executed to secure a majority of TVL, but some funds remain at risk.
>
>Users are advised to withdraw affected LPs immediately.

Then, when the [list](https://github.com/BalancerMaxis/multisig-ops/blob/main/BIPs/00notGov/2023-08-mitigation.md) of vulnerable pools was announced, it seems to have set an army of blackhats to work, looking for a way in.

**A [later update](https://twitter.com/Balancer/status/1695064684620140942) stated that over 99% of vulnerable TVL had been secured, and that just $565k remained at risk.**

_Then, $2.1M ended up missing._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Balancer](https://twitter.com/Balancer/status/1696930832760635566), [Peckshield](https://twitter.com/peckshield/status/1696185272445419961), [Beosin](https://twitter.com/BeosinAlert/status/1696362629818908758)_

**The hacks came five days after Balancer’s disclosure of a potential threat, advising users to withdraw funds from certain pools.**

An official post-mortem is yet to be published, and details of the attack vector remain under wraps, given that further funds may still be at risk.

_This article will be edited to add further details when they are released._
---

**EDIT - 14 SEPT 2023:** While Balancer [still hasn't provided](https://twitter.com/Tree_of_Alpha/status/1702266183016149061) an official post-mortem, BlockSec [published](https://blocksecteam.medium.com/yet-another-risk-posed-by-precision-loss-an-in-depth-analysis-of-the-recent-balancer-incident-fad93a3c75d4) a detailed incident report, concluding that "_the root cause stems from the price manipulation resulting from the rounding down logic in the linear pool. This consequently affects the cached token rate used by the corresponding boosted pool inappropriately._"

BlockSec justified their frontrunning of an official report, stating that three weeks had passed since Balancer's [initial announcement](https://twitter.com/Balancer/status/1694014645378724280), and two weeks since the hacks, adding:

>This incident emphasizes the critical need for prompt notifications to projects that have forked from a vulnerable source, which indeed poses a significant challenge for the whole community.

**EDIT - also 14 SEPT 2023, four hours later:** Balancer finally published their own in-depth [post-mortem](https://medium.com/balancer-protocol/rate-manipulation-in-balancer-boosted-pools-technical-postmortem-53db4b642492).

---

Balancer’s response to the threat followed a clear protocol in order to mitigate potential losses. As well as publishing the list of pools at risk, the team adjusted the UI in order to inform users whether their deposits were affected.

Exploiter addresses:

[0xB23711b9D92C0f1c7b211c4E2DC69791c2df38c1](https://etherscan.io/address/0xB23711b9D92C0f1c7b211c4E2DC69791c2df38c1) (ETH)

[0xed187f37e5ad87d5b3b2624c01de56c5862b7a9b](https://etherscan.io/address/0xed187f37e5ad87d5b3b2624c01de56c5862b7a9b) (ETH)

[0x429313e53a220c4a5693cad1da26ae5045b5762f](https://etherscan.io/address/0x429313e53a220c4a5693cad1da26ae5045b5762f) (ETH)

[0x64E08fa89C2bAE9F123cc8a293775f0E6CC86760](https://ftmscan.com/address/0x64E08fa89C2bAE9F123cc8a293775f0E6CC86760) (FTM)

[0xBC794F1ff9AD7711A9d2E69Be5b499e290B8fD3c](https://optimistic.etherscan.io/address/0xBC794F1ff9AD7711A9d2E69Be5b499e290B8fD3c) (OP)

While Balancer has been [audited by multiple companies](https://docs.balancer.fi/reference/contracts/security.html), the Boosted pools are not listed under the scope of any of the linked reports.

_This isn’t the first time Balancer has been hacked, in 2020 the protocol lost $500k to a [flashloan attack](https://medium.com/balancer-protocol/incident-with-non-standard-erc20-deflationary-tokens-95a0f6d46dea). But that was before rekt.news’ time, making this latest incident Balancer’s leaderboard debut._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Doomscrolling the TL, it feels like we’ve hit peak apathy.**

With little to lift the spirits, influencers are content shilling themselves into quick profits via the latest popularity-ponzi.

_And some of last cycle's [wannabe](https://twitter.com/realChrisBrunet/status/1695640932228419701) main [characters](https://twitter.com/WatcherGuru/status/1696214485566881991) continue to disgrace themselves._

With the community at a low-point it's especially painful to see even OG protocols like [Curve](https://rekt.news/curve-vyper-rekt/) and Balancer eventually finding their way onto the [leaderboard](https://rekt.news/leaderboard/)…

Things look bleak and we may start to ask ourselves:

>Will there even be another cycle?

News that would have sent coins to the moon during a bull run is largely forgotten in a matter of days.

**But this industry isn't going away anytime soon.**

_Will you be [ready](https://twitter.com/lemiscate/status/1694254310354301396), anon?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
