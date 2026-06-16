---
tags:
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/privacy
  - impact/data-corruption/price-manipulation
  - trigger/low-liquidity
  - trigger/price-manipulation
  - fix/use-multi-oracle
title: "Inverse Finance - REKT"
protocol: "[[Inverse Finance]]"
date: 2022-04-02
loss_usd: 15600000
auditors:
source: "https://rekt.news/inverse-finance-rekt"
excerpt: "Inverse Finance got flipped for ~$15M. A professionally executed hack allowed an anonymous actor to manipulate the price of INV and help themself to an exclusive deal from the ETH based lending protoc"
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/low-liquidity]]"
  - "[[trigger/price-manipulation]]"
  - "[[use-multi-oracle]]"
  - "[[chainlink-round-completeness]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Inverse Finance - REKT

> **Loss:** $15,600,000 | **Date:** 2022-04-02 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/04/inverse-header.png)

**Inverse Finance got flipped for ~$15M.**

_This attack got the experts attention._ 

A professionally executed hack allowed an anonymous actor to manipulate the price of INV and help themself to an exclusive deal from the ETH based lending protocol.

How did it happen?

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [Igor Igamberdiev](https://twitter.com/frankresearcher/status/1510239094777032713?s=21&t=xSsIh9c1zODe1XtYcHFNxQ) & [Peckshield.](https://twitter.com/peckshield/status/1510232640338608131?s=20&t=kG2VjhsXC7XN-GbLoMOeNQ)_

**~$15.6M was stolen in the form of:**

- 1588 ETH
- 94 WBTC
- 4M DOLA
- 39.3 YFI

**First of all, the exploiter withdrew 901 ETH from Tornado Cash.**

Then they transferred 1.5 ETH to 241 clean addresses via Disperse and deployed five different smart contracts, of which only one was real.

He then swapped 500 ETH to 1.7k INV so that it went through the INV-WETH pair on SushiSwap, significantly changing the price due to low liquidity (50x).

At the same time, he began spamming transactions with an exploit to be the first to get into the next block and get an inflated price from SushiSwap.

The Inverse Finance oracle, through Keeper Network, ended up using SushiSwap TWAP as an oracle, returning the price that made the INV token on the platform incredibly expensive.

The attacker then deposited his 1.7k INV (fair price - $644k) as collateral and (permanently) borrowed $15.6M.

_[Peckshield provided](https://twitter.com/peckshield/status/1510235343160676359?s=20&t=yOTDaUd1_qHww5WjfNApBw) the following visualisation._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/04/inverse-peckshield.png)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/04/inverse-twap-code.png)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/04/inverse-inv-price.png)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**We would prefer that hackers take the weekends off, but at least this wasn’t another case of “compromised keys”.**

Inverse Finance have since released their [official statement](https://twitter.com/InverseFinance/status/1510282040809299972?s=20&t=0nY6XsdfJ2qu1YUB11CsSQ), and several knowledgeable community members have pointed out the complexity / efficiency of the attack technique.

Flash bot expert himself, [@bertcmiller](https://twitter.com/bertcmiller/status/1510246695929532417?s=21&t=TKrULBbJo5NiglPzNffQyw), said that:

>"The InverseFinance hack is one of the most MEV aware hacks I've seen."

>"[the attacker] held an oracle's price at an insane level across multiple blocks, prevented arb bots from bringing prices back in line, and protected against generalised frontrunners."

[Chainlinkgod](https://twitter.com/chainlinkgod/status/1510298134202572800?s=21&t=mYGxl3w-OSq78TqYpc-zgg), _(who always has something to say when an oracle is exploited)_ also pointed out that:

>"Relying upon a TWAP oracle generated from a single thinly traded DEX trading pair with a short time sample compounds market manipulation risks."

After the attack, in Twitter Spaces, [Inverse Finance stated](https://twitter.com/ChainLinkGod/status/1510321456751599617?s=20&t=yOTDaUd1_qHww5WjfNApBw) that they are working with Chainlink to launch a INV price feed once liquidity requirements have been met. This would then replace the current TWAP oracle. 

**Although these risks are obvious in hindsight, it’s clear that this was not an amateur job.**

_Even the best in the business wear black hats sometimes…_

Maybe it’s better not to aggravate them.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
