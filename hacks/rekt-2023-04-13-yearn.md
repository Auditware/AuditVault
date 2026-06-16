---
tags:
  - sector/dex
  - sector/lending
  - sector/perpetuals
  - sector/privacy
  - sector/stable
  - sector/token
  - sector/vault
title: "Yearn - REKT 2"
protocol: "[[Yearn]]"
date: 2023-04-13
loss_usd: 11400000
auditors:
source: "https://rekt.news/yearn2-rekt"
excerpt: "rekt in prod… eventually. Over two years since its first leaderboard entry, Yearn has lost over $10M from an original iearn finance contract. As we wrote last time, no protocol is too big to fail. Who"
genome:
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Yearn - REKT 2

> **Loss:** $11,400,000 | **Date:** 2023-04-13 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/yearn2-header.png)

**rekt in prod.**

_…eventually._

**Over two years since its [first leaderboard entry](https://rekt.news/yearn-rekt/), Yearn has landed back on [rekt.news](https://rekt.news/) having lost over $10M.**

Considered by many as one of DeFi’s most reliable, secure platforms, Yearn made it’s name by offering some of the sector’s simplest farming opportunities.

The immutable yUSDT contract that was attacked was [deployed](https://etherscan.io/tx/0x947dfc6f73cccba391f2eb3fce5bc3be87bea3727ba5a23425f9f44db7f74d7a) over three years ago, back when Yearn was Andre Cronje’s iearn finance.

While the strategy was superceded by newer versions, plenty of funds still remained in the original contract. Later Yearn vault contracts [are not affected](https://twitter.com/iearnfinance/status/1646436798086672385).

_Despite a last-minute [warning](https://twitter.com/urbittesweet/status/1646391151900114944) on Twitter, immutable contracts can’t be saved._

Team member storming0x [acknowledged](https://twitter.com/storming0x/status/1646408774477922305) the attack before Yearn [reassured](https://twitter.com/iearnfinance/status/1646436798086672385) users that current contracts were unaffected.

**1156 days to spot a multimillion dollar vulnerability in one of DeFi’s longest established protocols.**

_How did it take so long?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Samczsun](https://twitter.com/samczsun/status/1646404331967778820), [OtterSec](https://twitter.com/osec_io/status/1646411672175939585), [SlowMist](https://twitter.com/SlowMist_Team/status/1646455406808666113)_

**The attacker exploited a misconfiguration in the iearn [yUSDT token contract](https://etherscan.io/address/0x83f798e925bcd4017eb265844fddabb448f1707d).**

The token generated yield via an underlying basket of yield-bearing tokens, including USDT positions on Aave, Compound, DYDX and BzX’s Fulcrum.

However, since launch, the yUSDT has contained what appears to be a copy/paste error whereby the Fulcrum USDC [address](https://etherscan.io/address/0xF013406A0B1d544238083DF0B93ad0d2cBE0f65f) was used instead of the Fulcrum USDT contract.

**The exploiter was able to take advantage of the misconfiguration to vastly manipulate the underlying share prices of yUSDT, and mint a large quantity (1.2 quadrillion) of yUSDT using just 10k USDT.**

Theori’s junomon.eth [provided](https://twitter.com/junorouse/status/1646424901602123776) the step-by-step analysis:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/yearn2-steps.png)

Exploiter address 1: **[0x5bac20beef31d0eccb369a33514831ed8e9cdfe0](https://etherscan.io/address/0x5bac20beef31d0eccb369a33514831ed8e9cdfe0)**

Exploiter address 2: **[0x16af29b7efbf019ef30aae9023a5140c012374a5](https://etherscan.io/address/0x16af29b7efbf019ef30aae9023a5140c012374a5)**

Exploiter address 3: **[0x6f4a6262d06272c8b2e00ce75e76d84b9d6f6ab8](https://etherscan.io/address/0x6f4a6262d06272c8b2e00ce75e76d84b9d6f6ab8)**

Attack transaction 1: **[0xd55e43c1…](https://etherscan.io/tx/0xd55e43c1602b28d4fd4667ee445d570c8f298f5401cf04e62ec329759ecda95d)**

Attack transaction 2: **[0x8db0ef33…](https://etherscan.io/tx/0x8db0ef33024c47200d47d8e97b0fcfc4b51de1820dfb4e911f0e3fb0a4053138)**

The minted yUSDT was then swapped for other stables totalling $11.4M, BlockSec [provided](https://twitter.com/MetaSleuth/status/1646441750918217728) the following breakdown:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/yearn2-funds.png)

The attacker was [funded](https://etherscan.io/tx/0x8b3c6f46f0d52787d8ded61549237df4e22cda56aa785c09b6166491aa64d829) via Tornado Cash and [redeposited 1000 ETH](https://etherscan.io/address/0x16af29b7efbf019ef30aae9023a5140c012374a5?toaddress=0xd90e2f925da726b50c4ed8d0fb90ad053324f31b) for laundering. At the time of writing, the first two exploiter addresses contain approximately $1.5M of assets each, and address 3 contains 7.4M DAI.

_Certik conducted an [audit](https://github.com/yearn/yearn-audits/blob/master/Certik%20-%20itoken-finance-audit-report-1.1.0.pdf) of iearn finance in Feb 2020, however it appears that only the yDAI contract was investigated._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**The test in prod attitude, Cronje’s preferred method, has been responsible for plenty of incidents, providing much of rekt.news’ early content.**

_Generally, though, new protocols and features got rekt within hours or days, not years…_

**In the wake of each attack, a [decentralised monopoly](https://rekt.news/decentralised-monopoly/) began to grow.**

The wider Cronje-verse has experienced enough incidents to have its own leaderboard, as we [discussed](https://rekt.news/cream-rekt-2/) after CREAM Finance was hacked for the second time, in October 2021.

Despite the significant losses, it’s lucky that this case only affected an old and deprecated strategy, and didn’t threaten the [$450M of TVL](https://defillama.com/protocol/yearn-finance) across current Yearn strategies.

As we wrote [last time](https://rekt.news/yearn-rekt/):

>No protocol is too big to fail.

_First [Sushi](https://rekt.news/sushi-yoink-rekt/), now Yearn._

**It’s a big week for DeFi stalwarts getting rekt.**

_Who will be next?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
