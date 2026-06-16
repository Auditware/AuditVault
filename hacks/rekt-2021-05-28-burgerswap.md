---
tags:
  - blockchain/bsc
  - sector/dex
  - sector/stable
  - vuln/reentrancy/single-function
  - novelty/known-pattern
title: "BurgerSwap - REKT"
protocol: "[[Burgerswap]]"
date: 2021-05-28
loss_usd: 7200000
auditors:
source: "https://rekt.news/burgerswap-rekt"
excerpt: "The hackers are really spoiling us this week with our fourth helping of the exact same meal. Can you ever really get tired of a classic? $7.2M was stolen from BurgerSwap in just 14 servings."
genome:
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
  - "[[reentrancy-guard]]"
---
# BurgerSwap - REKT

> **Loss:** $7,200,000 | **Date:** 2021-05-28 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/burgerswap-header.png)

The hackers are really spoiling us this week with our fourth helping of the exact same meal. 

**Can you ever really get tired of a classic?**

BurgerSwap was the next in a growing line of protocols to fall victim to the same hack that has been causing issues in recent weeks.

Since the market crash, this type of Drive-thru convenience exploit has been flavour of the month, and yet protocols still seem completely oblivious to this weakness in the contract. It’s as if they welcome these hacks with open arms, turning their backs to the counter and feigning surprise as people leave without paying.

It certainly appears as though even the easiest jobs can be royally messed up. BurgerSwap simply had to copy UniSwap’s code and yet there was something missing from their order.

**The question has to be asked, was this negligence? Or something a little seedier?**

Back to flipping burgers...

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/burgerswap-investigates.png)

At around 3 am on May 28th (UTC+8), $7.2M was stolen from #BurgerSwap in just 14 servings.

Thieves managed to make off with the following:

- 4.4k WBNB ($1.6M)
- 22k BUSD ($22k)
- 2.5 ETH ($6.8k)
- 1.4M USDT ($1.4M)
- 432k BURGER ($3.2M)
- 142k xBURGER ($1M)
- 95k ROCKS

And each attack looked like this:

1. Flash swap 6k WBNB ($2M) from PancakeSwap.

2. Swap almost all WBNB to 92k BURGER on BurgerSwap.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/burgerswap-hack-1.png)

3. Hackers created their own fake coin (a non-standard BEP-20 token) and formed a new trading pair with $BURGER of 100 fake tokens and 45k BURGER.

4. The 100 fake tokens were then swapped to 4.4k WBNB through the pool from step 3.

5. Attacker then made another swap from 45k BURGER to 4.4k WBNB.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/burgerswap-hack-2.png)

6. In total the attacker received 8.8k WBNB for the two latest steps.

7. Swap 493 WBNB to 108.7k BURGER on BurgerSwap.

8. Repay flash swap.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/burgerswap-hack-3.png)
Credit: [@FrankResearcher](https://twitter.com/FrankResearcher)

This exploit was made possible by the fact that the attacker could do reentrance and make a second swap before reserves, which are used to calculate the number of tokens in swaps, were updated.

Interestingly though, this seems to have been enabled by by a missing x*y=k check. Something which was present in the original univ2pair contract but was seemingly removed in this instance. 

It seems unlikely that the developers at BurgerSwap would be so careless in their coding but what is the alternative? With the x*y>k check removed, anyone can trigger a swap of any output size while paying only one unit of the input token, a deal straight from the saver menu.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/burgerswap-conc.png)

The number of hacks we have seen of projects on the BSC over the past week has been off the charts. This whole situation is eerily reminiscent of what happened in Autumn last year on ETH. A disappointing special offer which no-one wanted to see make a return.

While no-one likes to see the customers get short changed, it is increasingly difficult to [find sympathy](https://twitter.com/burger_swap/status/1398205523141427200) for rogue, copycat entrepreneurs who try to emulate and profit from a tried and tested recipe, but who don’t care enough about the consumer to check the ingredients of their products, risking the health of the very people they derive profit from.

**That said, if you eat at a McDaniels or Burger Duke, are you not at least partly responsible for your own indigestion?**

BurgerSwap claims they are in the process of producing a detailed compensation plan for their customers. A welcome relief for many whose stomachs have been turned by this whole affair. 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/burgerswap-footer.png)
