---
tags:
  - blockchain/bitcoin
  - blockchain/bsc
  - sector/bridge
  - sector/dex
  - sector/privacy
  - sector/stable
title: "Uranium Finance - REKT"
protocol: "[[Uranium Finance]]"
date: 2021-04-28
loss_usd: 57200000
auditors:
source: "https://rekt.news/uranium-rekt"
excerpt: "Cross-chain hacks are on the rise. Uranium Finance exploded again, leaving BSC users to cope with the fall out. $57 million gone, in the latest hack on Binance Smart Chain."
genome:
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# Uranium Finance - REKT

> **Loss:** $57,200,000 | **Date:** 2021-04-28 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/04/uran-header.png)

**Uranium Finance has exploded, and [not](https://www.certik.org/blog/uranium-finance-exploit-technical-analysis) for the first time.**

The BSC Uniswap clone played around too much with their copied code and left a loophole open for _someone_ to take the funds.

At least $57,000,000 was taken due to a simple math bug introduced to the UraniumPair contracts which had been forked from the Uniswap v2 code.

[Uranium Finance](https://twitter.com/UraniumFinance) had already suffered a prior exploit of their rewards contract earlier this month, when they introduced vulnerabilities into the [MasterChef](https://www.certik.org/blog/uranium-finance-exploit-technical-analysis) contract.

At least 2,200 ETH from the latest incident have already been mixed through Tornado.cash, from a total amount worth approximately $57.2 million at the time of writing.

Co-founder of bzX [Kyle Kistner](http://BeTheb0x) pointed out the small change in the UraniumPair contract that had such dramatic effects:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/04/uran-uint11.png)

**VS**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/04/uran-uint2.png)

**Did you spot the difference?** 

1,000 was changed to 10,000 in two places but not at the end. 

This resulted in being able to swap 1 wei of the input token for 98% of the total balance of the output token.

>This ultimately breaks the check for the Uniswap v2 x * y = k “constant product” formula before updating fee-adjusted reserve balances. Credit: [0xdeadf4ce](https://twitter.com/0xdeadf4ce)

**The following funds were removed:**

- 34k WBNB ($18M)
- 17.9M BUSD ($17.9M)
- 1.8k ETH ($4.7M)
- 80 BTC ($4.3M)
- 26.5k DOT ($0.8M)
- 638k ADA ($0.8M)
- 5.7M USDT ($5.7M)
- 112k U92

**Before interacting with Uranium, the attacker sent the minimum amount of each token to pair contracts.** 

After that, they used a low-level function swap() whose execution should drain both reserves.

The Uranium team migrated the contract to v2 about ten days ago, and the old version did not have this bug. 

The team then decided to update the protocol to v2.1, in which the only significant change is the fix of the above-mentioned bug. The liquidity migration from v2 to v2.1 was supposed to start today.

_So they added a bug in v2, left it for ten days, and on the day they were due to fix it, it was exploited._

To make things even more suspicious, we note that the Uranium contracts repository has been removed from Github.

Credit :  [igor igamberdiev](https://twitter.com/FrankResearcher)

_Did the Uranium team add in the bug and use the liquidity migration to try and hide it?_

_Or did “somebody” “find out” about the bug and exploit it just before the developers managed to fix it?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/04/uran-loosetalk.png)

**Cross chain hacks are becoming more common.** 

The BSC system is not as closed as it once was. There are multiple bridges out of BSC now, and they’re not all controlled by Binance, meaning CZ can’t blacklist all the addresses and keep the stolen funds on BSC.

Attackers will steal on one chain and escape to another where they can’t be tracked so easily. Tornado is currently the only DAPP allowing for this kind of exit, but we’ll soon see clones on other chains. 

The beneficiary of this incident is now sat on $57.2 million of liquid assets, a much more preferable prize than the [EASY](https://www.rekt.news/easyfi-rekt/) tokens of our previous article, and one which places them in second place on our [leaderboard](https://rekt.news/leaderboard/).

Exploits and rug pulls will slow down, but they’re unlikely to stop completely. Even now, when we have battle tested code such as Curve and Uniswap, users still look to chase higher returns in untested projects, so for now, rug pulls look set to stay.

One day hackers will operate on fully private chains where they have no need to escape with their funds, but until then... 

_rekt will be watching._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/04/uran-conc.png)
