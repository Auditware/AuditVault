---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - sector/dex
  - sector/stable
  - sector/token
  - has/audit
  - impact/loss-of-funds/direct-drain
title: "Arbix Finance - REKT"
protocol: "[[Arbix Finance]]"
date: 2022-01-04
loss_usd: 10000000
auditors:
  - "[[Certik]]"
source: "https://rekt.news/arbix-rekt"
excerpt: "New year, old news. Rug pulls are common on Binance Smart Chain; we’re only mentioning this one because it was larger than most. ~$10 million taken, and Arbix Finance are nowhere to be seen."
genome:
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# Arbix Finance - REKT

> **Loss:** $10,000,000 | **Date:** 2022-01-04 | **Audited by:** Certik

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/01/arbix-header.png)

**New year, old news.**

>Rug pulls are common on Binance Smart Chain.

**We’re only mentioning this one because it was larger than most.**

_~$10 million taken, and no advanced attack techniques in sight._

Arbix Finance labelled themselves as an arbitrage-focused project on BSC, in which users could deposit into single-asset vaults in order “to gain optimal yield with low risk”.

_However, their users got the opposite._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
**Starting around 3 AM +UTC on Jan 4th, the project drained the vaults of users’ funds and deleted their [website](http://www.arbix.finance/), [Twitter](https://twitter.com/ArbixFinance) and [Telegram](https://t.me/ArbixFinance) accounts.**

Around $10M in user’s assets were drained directly from the vaults into [this wallet](https://bscscan.com/address/0x4714a26e4e2e1334c80575332ec9eb043b61a2c4), beginning with [~$1M](https://bscscan.com/tx/0xfbba507c8e90a264d5e77e5db854f5697572da1681f3647d4fa4381f7ef825b9) in BTCB. 

_Also stolen were:_ 

[$920k](https://bscscan.com/tx/0x55d17937c5ff918a9314dd96d75ce770c9d8a06f119fbbe28359387a1c69ec39) Binance-pegged ETH

[$2.25M](https://bscscan.com/tx/0xb5682534481ffd22db6ba777051049e2c9805d6bd04733772915e84f8a32a5a5) in BSC-USD

[$1.7M](https://bscscan.com/tx/0x79f40c432499301f8aa2d9fdddc0d451655f1ec6be6b97e425ef29130bb6f954) BUSD

[$1.4M](https://bscscan.com/tx/0x5fac3ef218e76a7bbfa38284df91a0baad4bf5ef068ecc2045feac4238356aa0) CAKE

[$1M](https://bscscan.com/tx/0x91981907416ab908ec4134f12204a837b5207fb6fe31c7a7e93a5df503a25b6b) BSC-USDC

_As well as lesser amounts of ADA, DOT, DOGE, LINK, XRP and WBNB._

In addition to the vault funds, on the 10th December [this address](https://bscscan.com/address/0x161262d172699cf0a5e09b6cdfa5fee7f32c183d) [minted 4.5M ARBX](https://bscscan.com/tx/0x4707d30a8d8152eebad1cdcae1d93af24cb9a344b447412ee1d65638b5c3db6f). Once the rug pull had begun, these tokens were dumped via PancakeSwap, [tanking the price](https://www.coingecko.com/en/coins/arbix-finance) from $1.42 to ~$0.00. The ~$50k in proceeds were then [sent](https://bscscan.com/tx/0xb86dc583850e8497f1b721c70403da160c0f504a5fac1e74bbeaf3125e235ec9) to the main rug wallet.

**Funds were sent from the BSC wallet:** [0x4714a26e4e2e1334c80575332ec9eb043b61a2c4](https://bscscan.com/address/0x4714a26e4e2e1334c80575332ec9eb043b61a2c4)

**To Ethereum:** [0x4714a26e4e2e1334c80575332ec9eb043b61a2c4](https://etherscan.io/address/0x4714a26e4e2e1334c80575332ec9eb043b61a2c4)

_And from there, converted into ~2.5k ETH (currently worth ~$9.9M), then sent to [0xdc85c1eb22b0ece7be559a83fd788fe57f5a7a9f](https://etherscan.io/address/0x4714a26e4e2e1334c80575332ec9eb043b61a2c4)._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**Despite providing the project’s [audit](https://www.certik.com/projects/arbix) in November of last year, and marking all major or critical issues as resolved, Certik decided to publish a basic [incident analysis.](https://twitter.com/certikorg/status/1478243729244839938)**

_However, the thread merely served to attract the [attention](https://twitter.com/lookfirst/status/1478182289599127552) of the frustrated users who had trusted Certik’s stamp of approval._

**[In 2021 we covered $2.1B in scams, hacks, and rug pulls.](https://twitter.com/RektHQ/status/1476902345896308744?s=20)**

Will we see more than that this year?

_Vote now in our [Telegram group.](https://t.me/Rekt_HQ)_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
