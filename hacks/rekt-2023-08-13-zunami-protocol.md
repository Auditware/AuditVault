---
tags:
  - sector/dex
  - sector/gaming
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - has/audit
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
title: "Zunami Protocol - REKT"
protocol: "[[Zunami Protocol]]"
date: 2023-08-13
loss_usd: 2100000
auditors:
  - "[[Hashex]]"
source: "https://rekt.news/zunami-protocol-rekt"
excerpt: "The Curve ecosystem can't catch a break... Yesterday, Zunami Protocol lost $2.1M to a price manipulation attack. Keeping DeFi safe is a constant game of cat-and-mouse, one that can’t always be won."
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Zunami Protocol - REKT

> **Loss:** $2,100,000 | **Date:** 2023-08-13 | **Audited by:** Hashex

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/zunami-header.png)

**NOTE:** This article has been edited to remove reference to Ackee Blockchain, who audited an [earlier version](https://ackeeblockchain.com/blog/zunami-uzd-audit-summary/) of the protocol before the attacked MimCurveStakeDAO strategy was added.
---

_The Curve ecosystem can't catch a break…_

**Yesterday, [Zunami Protocol](https://twitter.com/ZunamiProtocol/) lost $2.1M as the project’s Ether- and USD-pegged stablecoins came under a price manipulation attack.**

_Although Curve itself was unaffected, the exploiter drained Zunami’s zETH and UZD liquidity pools on Curve, causing the ‘zStables’ to depeg by [85%](https://www.coingecko.com/en/coins/zunami-ether) and [99%](https://www.coingecko.com/en/coins/zunami-usd), respectively._

Peckshield [raised the alarm](https://twitter.com/peckshield/status/1690857760412610560) but, after the recent [BlockSec/Curve debacle](https://www.dlnews.com/articles/defi/blocksec-criticised-for-live-tweeting-curve-exploit-details/), was careful not to provoke criticism and opted not to provide transaction hashes or addresses.

Shortly after, Zunami [confirmed](https://twitter.com/ZunamiProtocol/status/1690863406079696896) the exploit:

>It appears that zStables have encountered an attack. The collateral remain secure, we delve into the ongoing investigation.

**First [Conic Finance](https://rekt.news/conic-finance-rekt/), then [JPEG’D, Alchemix and Curve itself](https://rekt.news/curve-vyper-rekt/), now Zunami…**

_Could the [Curve Wars](https://rekt.news/curve-wars/) be proving even more lucrative for hackers than for protocols?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Peckshield](https://twitter.com/peckshield/status/1690877589005778945), [BlockSec](https://twitter.com/BlockSecTeam/status/1690931111776358400)_

**Just over an hour after the initial alert, and presumably after confirming no further funds were at risk, Peckshield followed up with [more detail](https://twitter.com/peckshield/status/1690877589005778945):**

>It is a price manipulation issue, which can be exploited by donation to incorrectly calculate the price as shown in the following figures.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/zunami-code.png)
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/zunami-tx.png)

**The attacker used flash loans to execute large token swaps (e.g. SDT), causing slippage in the pool which could be used to manipulate LP token prices. The root cause was a flawed price calculation via the totalHoldings function.**

BlockSec provided the following step-by-step:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/zunami-steps.png)

_The proceeds (1184 ETH or $2.1M) were quickly [deposited](https://etherscan.io/advanced-filter?fadd=0x5f4c21c9bb73c8b4a296cc256c0cde324db146df&tadd=0xd90e2f925da726b50c4ed8d0fb90ad053324f31b&txntype=0&qt=1) into Tornado Cash._

The protocol itself and the UZD and zETH contracts were [audited](https://zunamilab.gitbook.io/product-docs/risks-and-security/audits) by [Hashex](https://twitter.com/HashExOfficial/).

Attacker’s address: **[0x5f4c21c9bb73c8b4a296cc256c0cde324db146df](https://etherscan.io/address/0x5f4c21c9bb73c8b4a296cc256c0cde324db146df)**

Exploit tx (zETH): [0x2aec4fdb…](https://etherscan.io/tx/0x2aec4fdb2a09ad4269a410f2c770737626fb62c54e0fa8ac25e8582d4b690cca)

Exploit tx (UZD): [0x0788ba22…](https://etherscan.io/tx/0x0788ba222970c7c68a738b0e08fb197e669e61f9b226ceec4cab9b85abe8cceb)

**The Sushiswap SDT pool, although used by the hacker during the price manipulation, is safe (_despite what a certain relentless bear-poster might like to [imply](https://twitter.com/napgener/status/1690859664009768960)_).**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Peckshield may have been careful not to include sensitive information in their alert, but others [weren’t](https://twitter.com/Ironblocks_/status/1690869728204533760) so [cautious](https://twitter.com/AnciliaInc/status/1690857336158695425).**

Following BlockSec’s public announcement of the root cause behind the [Vyper bug](https://twitter.com/vyperlang/status/1685692973051498497) last month, the [backlash](https://twitter.com/LefterisJP/status/1685752260465180673) prompted a debate about how many security firms apparently chase Twitter clout while potentially aiding hackers.

The discussion, and [calls](https://twitter.com/peckshield/status/1689228812477939712) for feedback, appear to have led to tweaked [alerting standards](https://twitter.com/BlockSecTeam/status/1690377651540942848) which prioritise only the crucial information to alert users who may need to withdraw funds, but without giving away any clues which bad actors may take advantage of.

Another step forwarded is the [SEAL 911 hack hotline](https://twitter.com/samczsun/status/1688613385565528064); the Telegram bot aims to use its [list of members](https://gist.github.com/samczsun/366b853a54391a97ab13cd2e3ca2d7c9) is a fast-response for any concerned whitehat looking to alert a potentially vulnerable protocol’s team.

**Security teams do important work in DeFi, where exploiters are lurking around every corner.**

_Not least BlockSec, with their [impressive](https://rekt.news/saddle-finance-rekt2/)  [whitehacking](https://rekt.news/sushi-yoink-rekt/)  [record](https://rekt.news/platypus-finance-rekt/)._

But keeping DeFi safe is a constant game of cat-and-mouse, one that can’t always be won.

_Who will be next to fall prey?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
