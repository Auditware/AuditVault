---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - has/audit
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/privacy
  - sector/vault
title: "Rari Capital - REKT"
protocol: "[[Rari Capital]]"
date: 2021-05-08
loss_usd: 10000000
auditors:
  - "[[Quantstamp]]"
source: "https://rekt.news/rari-capital-rekt"
excerpt: "Young blood & new money. Rari Capital has fallen victim to a serial attacker, who came from across chains to drain the Rari Capital pool, removing $10 million worth of ETH."
genome:
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
---
# Rari Capital - REKT

> **Loss:** $10,000,000 | **Date:** 2021-05-08 | **Audited by:** Quantstamp

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/rari-header.png)

**Young blood and new money.**

After a quick break for lunch, it was [Rari Capitals](https://twitter.com/RariCapital/status/1391050253621678080?s=20) turn to get rekt. 

The youthful yield aggregator has fallen victim to a serial attacker, as the [same wallet](https://twitter.com/JohnDoughBull/status/1391050085161656320?s=20) which attacked [Value DeFi](https://www.rekt.news/value-rekt3/) only hours before, turned their eyes onto the Rari Capital [ETH pool](https://etherscan.io/tx/0xb7faca63a73d5d0490dda1c390577db3f30414cd91ce462e45c1e7f37c258519), removing $10 million worth of ETH. 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/rekt-deco-logobreak.png)

Rari Capital has attracted attention due to the young age of their developers, causing the community to argue amongst themselves as to whether age is of much relevance when the whole DeFi industry is only 2 - 3 years old. 

**Although [some](https://twitter.com/ChrisBlec/status/1391051943653650439?s=20) might say they “[had it coming](https://www.youtube.com/watch?v=D143VuAxr-k)”, we take no pleasure in learning that people have lost their money.** 

There are no developers with 10 years experience in DeFi system design, this is a meritocracy that depends on the skill and maturity of the person rather than the length of their CV. 

_Each attack presents us with a valuable lesson, and we must study the techniques in order to build a safer future._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/rari-investigates.png)

**We’re looking at the actions of a cross-chain killer, who used the blood money from Value DeFi to fuel their attack on Rari Capital.**

5,346 BNB ($3.8M) were stolen and swapped to 1k ETH.

**The attacker’s actions on BSC were as follows:**

**1:** Create a fake token and pool it with BNB on PancakeSwap in order to use Alpaca Finance.

**2:** Interact with Alpaca Finance, where when calling approve() for a fake token, a payload is called, which allows an attacker to use VSafe through Codex farm to get vSafeWBNB

**3:** Convert vSafeWBNB to WBNB

**4:** Transfer WBNB to Ethereum through Anyswap.

_Repeat 2x._

**The attack on Rari was as follows:**

**1:** Create a fake token and pool with it on SushiSwap

**2:** Interact with [Alpha Homora](https://twitter.com/alphafinancelab/status/1391046927349784589?s=2), where a payload is also called so that the attacker can get ibETH in the Rari ETH pool contract.

**3:** Convert ibETH to ETH in the Rari ETH pool.

As a result, 2.9k ETH ($11.1M) was stolen, and another 1.7k ETH was at risk before the actions of the Rari team.

**The total profit from the two attacks was $15M in ETH.**

credit: [frankresearcher](https://twitter.com/FrankResearcher/status/1391087260125188099)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/rari-chart.png)

The Rari Capital governance token [$RGT](https://www.coingecko.com/en/coins/rari-governance-token) fell sharply in price following the attack.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/rari-decode.png)

The attacker decided to voice their opinion on the involved protocols, but it seems they had second thoughts, as they tried to cancel the transaction. However, they set the gas too low and the cancellation didn’t go through for 20 minutes, giving everyone time to see their message.

Credit: [banteg](https://twitter.com/bantg/status/1391054251388964867?s=20) & [dudesahn](https://twitter.com/dudesahn/status/1391056013416140803?s=20)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/rekt-deco-logobreak.png)

**This attack technique was similar to the [Evil Pickle Jar](https://www.rekt.news/pickle-finance-rekt/), one which looks likely to become even more common in the future.**

Even though various protocols were used, the same exploit mechanism was applied. 

Alpaca/Alpha, vSafe/Rari, PancakeSwap/SushiSwap - the interaction between them was built in such a way that the exploit was easily repeated on another chain.

The interoperability between DeFi protocols is increasing, and the blurred lines make for even easier escape routes.

**In the roaring twenties, the ruthless are rewarded, and any prosecution seems unlikely.** 

_With so many other surface-level crimes in crypto, who’s going to try and prosecute someone for exploiting contracts where so many remain anonymous?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/artdecowidth.png)
