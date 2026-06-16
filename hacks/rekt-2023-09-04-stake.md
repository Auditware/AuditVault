---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - blockchain/polygon
  - sector/dex
  - sector/stable
  - impact/loss-of-funds/direct-drain
  - precondition/insider
title: "Stake - REKT"
protocol: "[[Stake]]"
date: 2023-09-04
loss_usd: 41600000
auditors:
source: "https://rekt.news/stake-rekt"
excerpt: "They say the house always wins. Not in crypto. On-chain casino Stake lost over $41M from its hot wallets today. But why the delay, and omissions, in official comms?"
genome:
  - "[[direct-drain]]"
  - "[[insider]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# Stake - REKT

> **Loss:** $41,600,000 | **Date:** 2023-09-04 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/stake-header.png)

They say the house always wins.

_Not in crypto._

**On-chain casino [Stake](https://twitter.com/stake) lost over $41M from its hot wallets yesterday.**

Suspicious transactions were [initially flagged](https://twitter.com/CyversAlerts/status/1698690342113931422) by Cyvers, with losses on mainnet of around $16M. Then [came another](https://twitter.com/zachxbt/status/1698712407177150729) round of transactions, with a further $25.6M lost on BSC and Polygon.

The platform took four and a half hours (or just three, according to Stake themselves) to publish an [acknowledgment](https://twitter.com/Stake/status/1698746766076588057), despite managing to put out a tone-deaf [promo](https://twitter.com/Stake/status/1698715792718901561) tweet in the meantime.

**However, the announcement fails to mention the transactions on Polygon, or address [reports](https://twitter.com/spreekaway/status/1698700572784820533) that user withdrawals are currently suspended.**

_After another four hours, the team [tweeted again](https://twitter.com/Stake/status/1698809658742637022), informing users that deposits and withdrawals had resumed._

Surely $41M must be a drop in the ocean for Stake, with co-founder Bijan Tehrani earlier [stating](https://twitter.com/BijanTehrani/status/1698730623152664644) that there would be no impact on customer funds.

_So why the delay, and the omissions, in official comms?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[tayvano](https://twitter.com/tayvano_/status/1698713232532467837), [PeckShield](https://twitter.com/PeckShieldAlert/status/1698704431104360668)_

Given that the transactions, which [began](https://etherscan.io/tx/0x98610e0a20b5ebb08c40e78b4d2271ae1fbd4fc3b8783b1bb7a5687918fad54e) at 12:48 UTC, were simple transfers, it appears that the private keys of Stake's hot wallets had been compromised.

The funds were drained as native tokens ([6k ETH](https://etherscan.io/tx/0x98610e0a20b5ebb08c40e78b4d2271ae1fbd4fc3b8783b1bb7a5687918fad54e), [3M MATIC](https://polygonscan.com/tx/0x30dab44e09593c6aae593fe8b8384d07c51a23b5c9307444f1c293eb7c5f4858) and [12k BNB](https://bscscan.com/tx/0xcc696992ac198e8fadd91dbacb8292e9ac23584e111e1e6fafa965de6ece97f0), totalling $14M), a total of $22.3M in stablecoins, plus [$650k of SHIB](https://bscscan.com/tx/0x65ba9579dce9948a6ba7e15211c8dd002811982d9b23838dc0942239ff238e52) and [$3.25M of Binance-pegged ETH](https://bscscan.com/tx/0x7d5c515953b99f4b30469e974ebc9a3b6f7bd389ffe5ee527aa3ec70fcb45315).

Stake’s hot wallet addresses (on [Ethereum](https://etherscan.io/address/0x974caa59e49682cda0ad2bbe82983419a2ecc400), [Polygon](https://polygonscan.com/address/0x019d0706d65c4768ec8081ed7ce41f59eef9b86c) and [BSC](https://bscscan.com/address/0xfa500178de024bf43cfa69b7e636a28ab68f2741)) are showing no transfers since approximately 3 hours after the draining, suggesting that users are indeed currently unable to withdraw.

**Funds were drained into the following hacker addresses:**

ETH: [0x3130662aece32f05753d00a7b95c0444150bcd3c](https://etherscan.io/address/0x3130662aece32f05753d00a7b95c0444150bcd3c)

MATIC: [0xfe3f568d58919b14aff72bd3f14e6f55bec6c4e0](https://polygonscan.com/address/0xfe3f568d58919b14aff72bd3f14e6f55bec6c4e0)

BSC: [0x4464e91002c63a623a8a218bd5dd1f041b61ec04](https://bscscan.com/address/0x4464e91002c63a623a8a218bd5dd1f041b61ec04)

Any non-native assets were then swapped to native tokens and distributed to other addresses, see the [full list here](https://twitter.com/tayvano_/status/1698713232532467837), and mainnet fund-flow [diagram here](https://twitter.com/PeckShieldAlert/status/1698704431104360668).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Backed by Drake, and relentlessly shilled by Bitboy, Stake has grown by appealing to a largely normie audience.**

_And for [washing](https://twitter.com/tayvano_/status/1698721766292811898) scammers’ loot, of course… just like a real casino._

Rollbit may have been making more noise recently thanks to its [pumping](https://www.coingecko.com/en/coins/rollbit-coin) token, but Stake is clearly doing [just fine](https://twitter.com/StakeEddie/status/1604073814354448384), making enough to buy a [$28M mansion](https://www.casino.org/news/worlds-biggest-cypro-betting-site-founder-just-bought-a-28m-mansion/) last year.

_Aussie crypto founders certainly know how to cash out._

**But with Stake’s main fanboy Bitboy out of the picture so recently, the timing certainly seems coincidental.**

Then again, anyone [trading shitcoins](https://twitter.com/zachxbt/status/1656021525470879774) via Metamask is probably not the type to pull off a multimillion dollar hack...

**Stake may be a casino but, ultimately, this story is the same as a large number of CEX hacks we've covered over the last few years.**

DeFi might have a reputation for incidents of this size, and looking at the [leaderboard](https://rekt.news/leaderboard/) it'd be hard to argue that it was undeserved.

**But centralised platforms should be held to a higher standard.**

DeFi protocols are open books, where permissions, privileges, and source code are published so users can DYOR.

Where are CeFi's disclosures of who has access to private keys within their systems? Some may argue that this would pose a risk of individuals being targeted for phishing campaigns (or worse).

_So should they overhaul their entire infrastructure?_

**Tens of millions held in hot wallets behind a single set of private keys...**

_How many more ‘coincidences’ can we take?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
