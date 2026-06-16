---
tags:
  - blockchain/bitcoin
  - blockchain/bsc
  - sector/staking
title: "DeFiLabs - REKT"
protocol: "[[Defilabs]]"
date: 2023-07-27
loss_usd: 1600000
auditors:
source: "https://rekt.news/defilabs-rekt"
excerpt: "Yesterday, DeFiLabs rugged $1.6M from its users on BSC via a backdoor function in their staking contract. Random projects rugging on BSC is nothing new. The shitcoin casino claims another set of victi"
genome:
  - "[[reward-accounting]]"
---
# DeFiLabs - REKT

> **Loss:** $1,600,000 | **Date:** 2023-07-27 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/defilabs-header.png)

_The [shitcoin](https://rekt.news/shitcoins/) casino claims another set of victims._

**Yesterday, [DeFiLabs](https://twitter.com/defilabs_farm) rugged $1.6M from its users on BSC via a backdoor function in their staking contract.**

The project describes itself as “_A decentralized financeplatform managed by AI_” with a “_Secure Stable High-Yield Return Staking Pool_”.

**A full-house on low-effort-buzzword bingo.**

_Random, previously unheard-of projects rugging on BSC is nothing new._

Mostly, a few to a few hundred thousand dollars go missing, socials get deleted, and a handful of degenerate gamblers barely notice they’ve lost one of their many longshot bets.

But at this stage in the cycle, and with much of retail long gone…

_…who’s still YOLOing into this stuff?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Beosin](https://twitter.com/BeosinAlert/status/1684736475815157760), [HashDit](https://twitter.com/HashDit/status/1684579783261458434)_

**As with most low-effort BSC rugs, there is no sophisticated hack to report in this case.**

The latest [vPoolv6 contract](https://bscscan.com/address/0xdEDbd1804569F369e33e453Ee311F0F97dCd0Bde) contained the backdoor function _withdrawFunds_ which allowed the [funder address](https://bscscan.com/address/0xee08d6c3a983eb22d7137022f0e9f5e7d4cf0be2) to drain the contract of user deposits.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/defilabs-code.png)

_The stolen funds [include](https://bscscan.com/address/0x53ccFbC90A3fCDAfe9a2a50F798bEE7CcB5461b6#tokentxns) BSC-USD (the vast majority), Cake, wrapped BTC and ETH, and BUSD._

Exploiter address: **[0xee08d6c3a983eb22d7137022f0e9f5e7d4cf0be2](https://bscscan.com/address/0xee08d6c3a983eb22d7137022f0e9f5e7d4cf0be2)**

Rug contract: [0xdEDbd1804569F369e33e453Ee311F0F97dCd0Bde](https://bscscan.com/address/0xdEDbd1804569F369e33e453Ee311F0F97dCd0Bde)

Example tx: [0xcd255e0d…](https://bscscan.com/tx/0xcd255e0d507d59ac4a357b64a8e0649fc16995f7950fd0421f2010e27cc01e99)

Funds ($1.6M) consolidated here: [0x53ccFbC90A3fCDAfe9a2a50F798bEE7CcB5461b6](https://bscscan.com/address/0x53ccFbC90A3fCDAfe9a2a50F798bEE7CcB5461b6)

**It will come as no surprise that the project had been audited by [Certik](https://skynet.certik.com/projects/defilabs) (who did point out centralisation, aka ruggability, issues), as well as [Cyberscope](https://www.cyberscope.io/audits/defilabs).**

_However, neither audit covered the vPoolv6 contract, despite the fact that both audits were conducted after the contract’s [publication](https://bscscan.com/tx/0x6cbb76eee8c58b104e3bfd86e3b72a0305b318cae9c4a4460e8a45ac6cead2b7)._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

DeFiLabs released a statement on both [Twitter](https://twitter.com/defilabs_farm/status/1684715946714533888) and [Telegram](https://t.me/defilabs_farm/267) stating that:

>[the] platform is currently undergoing maintenance and updates. Unfortunately, we encountered an unexpected issue during this process. To ensure the safety of your assets and smooth operations, we have decided to temporarily suspend staking operations.

**The message goes on to state that withdrawals are paused but, funnily enough, doesn’t mention the draining of the staking contract.**

The team have promised an update in 48 hours…

_…just enough time for the next rug to come along and everyone to forget._

Two months ago DeFiLabs helpfully [published](https://medium.com/@defilabs_farm/defilabs-risk-warning-1930caae44c9) a ‘RISK WARNING!!’ to make sure users didn’t accidentally stray from their rug contract.

_How considerate of them._

**This incident is just one in a long line of rugpulls on BSC, with the last notable incident being the [$2.36M lost on GMETA](https://twitter.com/BeosinAlert/status/1681240663868973056) last week.**

The ill-gotten gains of one rug are often being [siphoned](https://twitter.com/MetaSleuth/status/1681639773969211393) straight into the [next](https://twitter.com/MetaSleuth/status/1684800647097634816) project’s LP or used to pump the new token, according to BlockSec’s MetaSleuth.

**It’s all so tiresome.**

Multiple repetitions of the [same bug](https://rekt.news/conic-finance-rekt/).

Centralised platforms losing tens of millions to [compromised keys](https://rekt.news/alphapo-rekt/).

Hacks and rugs on little-known BSC projects popping up [every few days](https://twitter.com/BeosinAlert/status/1681240663868973056).

It feels like 2021 again here at [rekt.news](https://rekt.news/).

_We are so back._

_Right?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
