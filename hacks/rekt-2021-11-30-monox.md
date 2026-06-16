---
tags:
  - blockchain/ethereum
  - blockchain/polygon
  - sector/dex
  - sector/oracle
  - sector/stable
  - has/audit
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
title: "MonoX - REKT"
protocol: "[[Monox]]"
date: 2021-11-30
loss_usd: 31400000
auditors:
  - "[[Halborn]]"
  - "[[Peckshield]]"
source: "https://rekt.news/monox-rekt"
excerpt: "rekt by their own token. Mono X lost $31M via a price manipulation of their recently launched $MONO. How did two audits not prevent this?"
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# MonoX - REKT

> **Loss:** $31,400,000 | **Date:** 2021-11-30 | **Audited by:** Halborn, Peckshield

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/11/monox-header.png)

**rekt by their own token.**

_Over $31 million stolen, across two chains, via a price manipulation of the project’s native token, [MONO](https://www.coingecko.com/en/coins/monox)._

[MonoX](http://monox.finance), which launched [last month](https://twitter.com/MonoXFinance/status/1450825924040134664) on Polygon and Ethereum, is a DEX based on Single Token Liquidity pools. Rather than the standard pool model of paired assets deposited by LPs, MonoX pools function by grouping a deposited token “_into a virtual pair with our virtual cash stablecoin (vCASH)_”.

**One of the benefits that MonoX claimed their virtual pool model brought was streamlined swap routing.**

How convenient for today’s hacker who, manipulating a pricing bug, was able to inflate the price of the platform's native token and make a _streamlined cash-out_ into the other deposited tokens.

**[Two attacks](https://twitter.com/FrankResearcher/status/1465679352448917504) hit the protocol in swift succession.**

First, ~$19.4M was stolen on Polygon and just 17 minutes later, the same attack vector was used on Ethereum, taking a further ~$12M.

The team provided a [statement](https://t.me/MonoXAnnouncement/116) via the MonoX Announcements channel on Telegram, and later via [Twitter](https://twitter.com/MonoXFinance/status/1465692925791137799).

> _...A method in the swap contract was exploited and boosted MONO token price to sky high. The attacker then used $MONO to purchase all the other assets in the pool..._
>
> _...We also really wish to have a chance in talking with the "attacker". We value very much for what we've built for the current and future MonoX, and most importantly our users and their funds; PLEASE reach out to us!_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/11/monox-investigates.png)

_Credit: [@BlockSecTeam](https://twitter.com/BlockSecTeam/status/1465690478414761992)_

The protocol’s [recently](https://twitter.com/MonoXFinance/status/1462410267233505281)-launched MONO token was used in the exploit. The hacker was able to massively inflate its value owing to a bug in the _swapTokenForExactToken_ code in the Monoswap contract ([Polygon](https://polygonscan.com/address/0x3826367A5563eCE9C164eFf9701146d96cC70AD9), [Ethereum](https://etherscan.io/address/0xC36a7887786389405EA8DA0B87602Ae3902B88A1)).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/11/monox-code.png)

**The function __updateTokenInfo_ was used to update token prices following swaps through MonoX pools. However, there was nothing to restrict the use of the same asset for both _tokenIn_ and _tokenOut_.**

By doing just this with the platform’s native token, the hacker created a loop in which the price of _tokenOut_ would overwrite the price of _tokenIn_, pumping the price of MONO over the course of many “swaps”.

Once the price had been manipulated, the attacker cashed out the overvalued MONO for almost all the other tokens deposited in the platform’s Single Token Liquidity pools.

**Both Halborn and Peckshield conducted [audits](https://docs.monox.finance/library/audits) of the Monoswap contract. How did they both miss this simple bug? Was it deliberate, or just careless?**

**Total assets stolen:**

**5.7M MATIC** ($10.5M)

**3.9k WETH** ($18.2M)

**36.1 WBTC** ($2M)

**1.2k LINK** ($31k)

**3.1k GHST** ($9.1k)

**5.1M DUCK** ($257k)

**4.1k MIM** ($4.1k)

**274 IMX** ($2k)

**Exploit transactions:**  [Polygon](https://polygonscan.com/tx/0x5a03b9c03eedcb9ec6e70c6841eaa4976a732d050a6218969e39483bb3004d5d), [Ethereum](https://etherscan.io/tx/0x9f14d093a2349de08f02fc0fb018dadb449351d0cdb7d0738ff69cc6fef5f299).

**Exploit contracts:**  [Polygon](https://polygonscan.com/address/0x119914de3ae03256fd58b66cd6b8c6a12c70cfb2), [Ethereum](https://etherscan.io/address/0xf079d7911c13369e7fd85607970036d2883afcfd)

**Stolen funds:** ($31.4M total) [Polygon](https://polygonscan.com/address/0x8f6a86f3ab015f4d03ddb13abb02710e6d7ab31b#tokentxns) ($19.4M), [Ethereum](https://etherscan.io/address/0x8f6a86f3ab015f4d03ddb13abb02710e6d7ab31b#tokentxns) ($12M).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/11/monox-linebreak.png)

**Over $30M lost on a protocol barely one month old. In fact, the project had passed $30M TVL just [3 days prior](https://twitter.com/MonoXFinance/status/1464673862562557964) to the exploit.**

While the rate at which projects are now able to attract value is impressive, the insecurity that comes with investing in DeFi is a stark reminder of the immaturity of the space.

With time, casualties like these build a base of knowledge on which best practises can be established.

But for now, experiments will continue to be launched.

_And some of them will fail._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
