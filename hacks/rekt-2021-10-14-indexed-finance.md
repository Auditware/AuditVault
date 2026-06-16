---
tags:
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/token
title: "Indexed Finance - REKT"
protocol: "[[Indexed Finance]]"
date: 2021-10-14
loss_usd: 16000000
auditors:
source: "https://rekt.news/indexed-finance-rekt"
excerpt: "$16 million taken from Indexed Finance. That’s one more protocol added to the rekt register, and $16 million more on our leaderboard. Is anonymity the only way to stay safe?"
genome:
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Indexed Finance - REKT

> **Loss:** $16,000,000 | **Date:** 2021-10-14 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/10/Index-Header.png)
**$16 million taken from Indexed Finance.**

_That’s one more protocol added to the rekt register, and $16 million more on our [leaderboard.](https://rekt.news/leaderboard/)_

We’ll always bring our stories to [Twitter](https://twitter.com/RektHQ), but if you want to talk directly to the characters involved, then the best place for you is the [rekt.news Telegram group.](https://t.me/Rekt_HQ)

Shortly after the attack, Indexed Finance core contributor and rekt reader [Dr Laurence Day](https://twitter.com/laurence_e_day) showed the rekt group members as he tried to communicate with the hacker [on-chain;](https://etherscan.io/tx/0x50af8eb95eeebf2ceb8e5a141841ad5bde7ddcc0bdc206ad761322cb26e4ec75)

>Indexed Finance here.

>Time to talk?

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**[Indexed Finance](https://indexed.finance/) offers investors 6 indices, each one a pool of various assets. Each index pool has its own token whose price _should_ be a weighted average of the underlying assets.**

At 18:37 UTC on October 14th, an attack took place targeting the [DEFI5](https://www.coingecko.com/en/coins/defi-top-5-index) and [CC10](https://www.coingecko.com/en/coins/cryptocurrency-top-10-index) pools. The “Future of Finance Fund” [(FFF)](https://www.coingecko.com/en/coins/future-of-finance-fund) was also heavily affected, given that DEFI5 and CC10 tokens make up 37.05% of its underlying assets.

_More details of the exploit can be found in the [official post-mortem](https://ndxfi.medium.com/indexed-attack-post-mortem-b006094f0bdc) as well as in [Mudit Gupta’s twitter thread](https://twitter.com/Mudit__Gupta/status/1448884940964188167)._

**Dillon Kellar; the sole developer responsible for writing the original code of Indexed Finance, has made his thoughts public in a [Tweet thread.](https://twitter.com/d1ll0nk/status/1448856748467630085)**

The code governing the index pools is forked from the [Balancer Pool contract](https://github.com/balancer-labs/balancer-core/blob/master/contracts/BPool.sol). This allows for the internal rebalancing of assets within the pool on a constant product curve.

The function _extrapolatePoolValueFromToken_ is based on the _“first token in the pool with a target weight over 0 and which is fully initialized”_ to calculate the total value of the pool.

>total_value = token_balance * total_weight / token_weight

**In order to control slippage, the rate at which the resulting changes in weights are enacted within the pool is [limited](https://docs.indexed.finance/index-pool-protocol/index), creating a temporary discrepancy ripe for manipulation.**

**The attacker’s address was funded via Tornado Cash hours before the attack:**
[0xba5ed1488be60ba2facc6b66c6d6f0befba22ebe](https://etherscan.io/address/0xba5ed1488be60ba2facc6b66c6d6f0befba22ebe)

_Both the DEFI and CC10 pools were attacked in the same way, see [this transaction](https://etherscan.io/tx/0x44aad3b853866468161735496a5d9cc961ce5aa872924c5d78673076b1cd95aa) for the attack on the DEFI5 pool._

The attacker was able to take advantage of the above by using flash loans of the other assets in the pool to buy out UNI, decreasing the extrapolated value due to the delay in updating UNI’s weight decrease.

This was done gradually, as the _“pool does not allow swaps to send more than 1/2 of the pool’s existing balance in a token or purchase more than 1/3 of the pool’s balance in a token”._

After calling the _updateMinimumBalance_ function using the gamed pool value, the controller valued the pool at just 29,851 SUSHI (~$300k), _“despite the pool having received over a hundred million dollars worth of other assets”._

Once prepared, the attacker could deposit relatively small amounts of (now heavily over-weighted) SUSHI into the pool, minting a massively inflated number of DEFI5 tokens in return.
 
**These were subsequently cashed out for the assets in the pool.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/10/Index-assets.png)

In total, about $16M of a variety of assets were stolen by the attacker, at the time of writing they remain in [this address.](https://etherscan.io/address/0xba5ed1488be60ba2facc6b66c6d6f0befba22ebe)

**In a follow up to the official post-mortem, [Doctor Day has put out a statement:](https://twitter.com/laurence_e_day/status/1449036388209512457?s=20)**

>The knife twist is that we've realised that we believe that we actually know who did this: we spoke to them quite a bit prior to the execution of this attack.

>Starting on the 15th of September, we were approached by a Discord user under the name 'UmbralUpsilon' (currently BogHolder#1688), asking some questions about the way in which certain parameters were utilised in the oracle. Since every component of Indexed is open-source, we answered these questions, and upon asking the reason, were told that they were attempting to create an arbitrage bot for the pools.

>This is a key part of how Indexed generates revenue (exit fees on burns when arbitraging the NAV of tokens and their value on DEXes), and we were happy to engage with queries about the mechanics, explaining how reindexes work, the timing of reweights, how tokens are added and removed from candidate asset lists, and so on. We had no reason to be alarmed: all of these conversations were in the spirit of open-source collaboration.

>We are aware (courtesy of [@pcaversaccio](https://twitter.com/pcaversaccio)) that the exploiter requested some Kovan testnet Ether via Gitter, using the (dead, presumably created for the purposes of the assault) Twitter account @ZetaZeroes. We have reached out to them via Gitter with the [following message](https://imgur.com/a/rhUHQY2).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/10/Index-zeta.png)  

>**We speak now directly to the exploiter, if they ever read this: you’re clearly incredibly skilled: this is something that has been overlooked for ten months in production, and you’re the only one that found it. While it would have been so much more productive for you to instead choose to work with us: be the antihero of this story rather than the villain. Take a 10% whitehat, and save a lot of people the effort of engaging law enforcement.**

>The people that are affected by this are those that are trying to diversify risk within a volatile space. That’s part of what makes this particularly cruel: no one deserves to have their funds whisked away, but the context here is an irony that can’t be ignored.

>Our door’s open, and it’ll make a much more satisfying footnote to our appearance on rekt.news.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)  

**Wise words from the Doxxed Doctor, who’s been put in the hot seat through no fault of his own.**

The damage dealt by these attackers is not just financial.

No DeFi developer should have to receive [death threats.](https://twitter.com/laurence_e_day/status/1448809966614290436?s=20) 

_Is anonymity the only way to stay safe?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-text-linebreak.png)
