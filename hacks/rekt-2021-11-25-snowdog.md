---
tags:
  - blockchain/avalanche
  - sector/dex
  - sector/gaming
  - sector/staking
  - impact/mev/frontrun
title: "Snowdog - REKT"
protocol: "[[Snowdog]]"
date: 2021-11-25
loss_usd: 18100000
auditors:
source: "https://rekt.news/snowdog-rekt"
excerpt: "A “game theory experiment” or a new breed of rug pull? ~$18M snapped up by just the first two transactions of Snowdog’s buyback. Was it luck or inside information that led the top dogs to success?"
genome:
  - "[[frontrun]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[reward-accounting]]"
---
# Snowdog - REKT

> **Loss:** $18,100,000 | **Date:** 2021-11-25 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/11/snowdog-header.png)

A “_game theory experiment_” or a new breed of rug pull?

**For many, [Snowdog](https://twitter.com/SnowdogDAO) has made this a thanksgiving to forget…**

Snowdog claims to be “_a decentralized reserve meme coin_”, forked by the anon team at Snowbank from their own project; one of many OHM-forks to have launched recently.

The premise was to run an 8-day [accumulation phase](https://twitter.com/SnowdogDAO/status/1460000864165376016), during which users could stock up on [SDOG](https://www.coingecko.com/en/coins/snowdog) via minting, staking or market buying.

Then, a buyback was [scheduled](https://twitter.com/SnowdogDAO/status/1463868041222144001) which offered SDOG holders the chance to cash out for a share of $44M in MIM, bought using the treasury funds grown during the accumulation phase.

Following the buyback, the project planned to burn the proceeds, cut staking rewards and renounce contract ownership in order to fix the supply and establish SDOG as the “_meme currency of Avalanche_”.

This is the first incident we have investigated on Avalanche.

_Was it luck or inside information that led the top $DOGs to success?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/11/snowdog-investigates.png)

**In the lead-up to last night, [SDOG](https://www.coingecko.com/en/coins/snowdog) had been trading on [TraderJoe](https://traderjoexyz.com/) at close to $1350.**

**However, claiming they wanted to protect against bots and MEV searchers frontrunning the sale, Snowdog [decided](https://twitter.com/SnowdogDAO/status/1463989671470546950) to set up a new AMM with an SDOG-MIM pool solely for the purposes of the buyback.**

> _adding a simple mathematical challenge to the AMM, it became nearly impossible for bots to quickly adapt and understand how the swap works. Only users using the front-end could swap_

The front-end was kept password-protected until the moment the buyback went live, and once the [liquidity](https://snowtrace.io/tx/0xb853a431a06643ca0b557bf521d55e07334d50a3d03d925905927234810b553e) migrated from TraderJoe was added to the pool, it [became clear](https://twitter.com/FrankResearcher/status/1463983190360662026?t=xB4JemihSoALSP1-QRwZTg&s=19) that a massive price hike had been created as the pooled ratios determined a new SDOG price of ~$70k.

A list of transactions from the first few minutes in the pool can be found [here](https://pastebin.com/raw/8ZS2BpF3).

The first two transactions were the clear winners, picking up around 40% of the spoils between them.

[Tx1](https://snowtrace.io/tx/0x9207a13689617db6f4f88b3f512f2c7dbcfa87205a410556932f2d383cb38277) - 187.8 SDOG for 10.4M MIM (SDOG price of ~$55k) from [this address](https://snowtrace.io/address/0xae41199b0d576dbe43fbc8a81bd192d7b86b1c3b), [funded via FTX](https://etherscan.io/address/0xae41199b0d576dbe43fbc8a81bd192d7b86b1c3b) the day before.

[Tx2](https://snowtrace.io/tx/0x9e189624e41b3927cee86409084af93610af081fb1f46abff3018c1df9b606f6) - 215.1 SDOG for 7.7M MIM (SDOG price of ~$36k) from [this address](https://snowtrace.io/address/0x83170aa4ae32edc5d86df2e170e373fbf795c37d), also [funded via FTX](https://etherscan.io/address/0x83170aa4ae32edc5d86df2e170e373fbf795c37d) the day before.

These two transactions sold a total of 403 SDOG for approximately $18M, which would have been worth a mere $500k at pre-buyback rates.

However the “_joy_” referred to in Snowdog’s [explanation](https://medium.com/@snowbankDAO/snowdog-present-and-future-1b4f3504eb6) of the incident quickly turned to “_deception_” for the vast majority of users who were left either selling their tokens below the previous market price or holding while watching their value nosedive.

> _36 seconds after the front-end reveal, $SDOG market price was already lower than the market price before buyback ($1200)._
---

The report goes on to defend the use of the custom liquidity pool by drawing attention to the number of failed botted transactions at the time of the launch. However, [suspicion began to build](https://twitter.com/0xshabby/status/1463992586100633602) over the earliest trades, and the likelihood of them being an inside job:

The two first and most profitable trades are from brand-new addresses ([one](https://snowtrace.io/address/0xae41199b0d576dbe43fbc8a81bd192d7b86b1c3b), [two](https://snowtrace.io/address/0x83170aa4ae32edc5d86df2e170e373fbf795c37d)), funded within hours of each other on the day before the buyback. The accounts were funded via FTX, so are likely KYC’d.

The accounts appeared to have [prior knowledge](https://twitter.com/TwigCrypto/status/1464019604913762305) that the buyback would happen on a new DEX, not having approved SDOG for trading on TraderJoe in advance but approving the custom pool as soon as it was published.

The contract’s _challengeKey_, introduced in order to disrupt sniping bots, is a further [source of suspicion](https://twitter.com/artoriamaster/status/1463997950498123780) given that team members would know the details of this mechanism and have privileged access to the contract directly before the front-end went live.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Snowbank and Snowdog have attempted to capture the two extremes of the current crypto zeitgeist on Avalanche.**

Combining [dogcoin FOMO](https://rekt.news/fomo-on-meme-street2/) with the aim to establish a reserve currency backed by protocol owned liquidity is ambitious to say the least. And the anon team’s attempt to join these two popular but opposing narratives has backfired, given how the Snowdog “_experiment_” has affected Snowbank’s [token price](https://www.coingecko.com/en/coins/snowbank).

_That’s one botched buyback, and two projects rekt by the same team._

It seems the response to yesterday’s events has tightened Snowbank’s leash with regard to [further launches](https://twitter.com/SnowbankDAO/status/1464022884700016656), despite initially using the hype to tease [upcoming products](https://twitter.com/SnowbankDAO/status/1463990215673065484).

As for any [future](https://medium.com/@snowbankDAO/snowdog-present-and-future-1b4f3504eb6) success of SDOG as Avalanche's answer to DOGE, and Snowbank as its reserve currency, only time will tell.

**Was this a gamed buyback, representing a slightly more sophisticated form of the everyday rugpull?**

_Or was it simply the bubble popping on what was never meant to be anything more than an experimental memecoin?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
