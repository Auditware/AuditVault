---
tags:
  - blockchain/arbitrum
  - blockchain/optimism
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/multisig
  - sector/oracle
  - sector/token
  - vuln/reentrancy/read-only
  - vuln/reentrancy/single-function
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
  - novelty/known-pattern
title: "dForce Network - REKT"
protocol: "[[Dforce Network]]"
date: 2023-02-09
loss_usd: 3650000
auditors:
source: "https://rekt.news/dforce-network-rekt"
excerpt: "dForce Network was hit for $3.65M on both Arbitrum and Optimism. This attack on two fronts exploited a common reentrancy vulnerability. How much more will be lost to this bug?"
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
# dForce Network - REKT

> **Loss:** $3,650,000 | **Date:** 2023-02-09 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/dforce-header.png)

**[dForce Network](https://dforce.network/) was hit for $3.65M on both Arbitrum and Optimism.**

Shortly after 11pm Thursday night (UTC), an attack on two fronts exploited a common reentrancy vulnerability, netting $1.9M on Arbitrum and $1.7M on Optimism.

The [alarm was raised](https://twitter.com/ZoomerAnon/status/1623879348498432002) a few hours later, and [dForce confirmed](https://twitter.com/dForcenet/status/1623904209161830401) the incident after a further 90 minutes. The team then expanded on their original announcement, [stating](https://twitter.com/dForcenet/status/1623983550734163969) that they had pause all vaults and adding:

>Users' funds supplied to dForce Lending and other vaults are SAFE.

Good news came a few days later, when the exploiter [returned](https://twitter.com/dForcenet/status/1625004207395807232) all funds to dForce multisigs.

**However, the read-only reentrancy vulnerability is well-known, having most recently affected [Midas Capital](https://rekt.news/midas-capital-rekt/) and, before that, [Market.xyz](https://quillaudits.medium.com/decoding-220k-read-only-reentrancy-exploit-quillaudits-30871d728ad5).**

As we wrote in the Midas article:

>It’s always a shame to report on losses in DeFi, but especially when they are down to already known issues

_How much more will be lost to this bug?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[SlowMist](https://twitter.com/SlowMist_Team/status/1623956763598000129), [Peckshield](https://twitter.com/peckshield/status/1623910257033617408)_

**The exploit used flash loaned funds to deposit into Curve’s wstETH/ETH, depositing the LP tokens into dForce’s wstETHCRV-gauge vault.**

Upon calling the remove_liquidity function, the attacker’s contract exploited the reentrancy vulnerability to manipulate the virtual price, which dForce uses as an oracle for the wstETHCRV-gauge tokens.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/dforce-code.png)

This resulted in the hacker profiting off the liquidation of other users using wstETHCRV-gauge as collateral.

Exploiter’s address ([OP](https://optimistic.etherscan.io/address/0xe0d551017c0111ac11108641771897aa33b2817c), [ARBI](https://arbiscan.io/address/0xe0d551017c0111ac11108641771897aa33b2817c), [ETH](https://etherscan.io/address/0xe0d551017c0111ac11108641771897aa33b2817c)): **0xe0d551017c0111ac11108641771897aa33b2817c**

Attack tx OP: [0x6c197621…](https://optimistic.etherscan.io/tx/0x6c19762186c9f32c81eb2a79420fc7ad4485aa916cab37ec278b216757bfba0d)

Attack tx ARBI: [0x5db5c240…](https://arbiscan.io/tx/0x5db5c2400ab56db697b3cc9aa02a05deab658e1438ce2f8692ca009cc45171dd)

**The vulnerability has been well-known for some time. According to ChainSecurity’s [original report](https://chainsecurity.com/curve-lp-oracle-manipulation-post-mortem/):**

>On April 14, we informed Curve and affected projects about a read-only reentrancy vulnerability in some Curve pools. More specifically, the value of function get_virtual_price can be manipulated by reentering it during the removal of liquidity.”

And Curve have [provided](https://twitter.com/CurveFinance/status/1614939752507244544) a known workaround:

>one can call any method which has the nonreentrant lock (removing 0 liquidity is probably the cheapest).

The attacker's ETH address was funded via Railgun on mainnet, before being used to fund OP and ARBI addresses via Synapse.

dForce sent transactions ([OP](https://optimistic.etherscan.io/tx/0xcca0c24c7156fcb9b8b4af19640c6d3897eb3ea4b322c268e3dd13a4eeb38b97), [ARBI](https://arbiscan.io/tx/0x0f43b40889bcfec6b5eef5802f9ae3cd8b881316e8bea98e6a015f06610cfac8)) offering the attacker a bounty via tx input data.

Fortunately, the hacker responded days later.

**dForce [announced](https://twitter.com/dForcenet/status/1625004207395807232) that funds had been returned to the project's multisigs and:**

>All impacted users will be made whole, we will announce the details for distribution of the funds over the next few days.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_But this isn’t the first time dForce has got rekt._

Back before [rekt.news](https://rekt.news/), in what seems like the distant past of April 2020, [dForce lost $25M](https://cointelegraph.com/news/dforce-loses-9995-of-funds-in-latest-test-of-defi-resilience) to an ERC-777 vulnerability. Users were [reportedly refunded](https://twitter.com/dForcenet/status/1254738662039752704) days later.

**More recently, though, Layer 2 networks have been enjoying a boom in adoption.**

Of the most popular ETH L2s, Optimism is currently the only one with a token, and OP’s recent all time high is a sign of its growing popularity.

_But with increased usage and higher TVL comes extra attention from those who seek to profit by any means necessary..._

[Airdrop hunters](https://rekt.news/airdrop-hunters/) are [everywhere](https://rekt.news/airdrop-hunters2/) and, although they may only stick around until they get what they came for, they are generally harmless.

**But speculators aren’t the only ones on the lookout for the next big thing.**

So far, we have covered [relatively](https://rekt.news/wintermute-rekt/)  [few](https://rekt.news/lodestar-rekt/)  [incidents](https://rekt.news/treasure-dao-rekt/) on L2s, but we expect that to change as blackhats seek out new opportunities…

_This won’t be the last L2 entry on our [leaderboard](https://rekt.news/leaderboard/)._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
