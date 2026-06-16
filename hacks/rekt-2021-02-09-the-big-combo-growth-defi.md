---
tags:
  - sector/dex
  - sector/gaming
  - sector/staking
  - has/audit
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
title: "The Big Combo (Growth DeFi - REKT)"
protocol: "[[The Big Combo Growth Defi]]"
date: 2021-02-09
loss_usd: 1300000
auditors:
  - "[[Consensys Dilligence]]"
source: "https://rekt.news/the-big-combo"
excerpt: "The days blur into one. Locked down, wired up and worn out. Millions of dollars gone but nobody blinks an eye. BT Finance? Growth DeFi? Small name backstreet protocols are easy prey for the serial kil"
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[fot-slippage]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# The Big Combo (Growth DeFi - REKT)

> **Loss:** $1,300,000 | **Date:** 2021-02-09 | **Audited by:** Consensys Dilligence

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/02/header-big-combo.jpg)

The days blur into one.

**Locked down, wired up and worn out.**

Millions of dollars gone but nobody blinks an eye.

**Seems to be the first time we hear about some of these protocols is when they get arbed into the limelight by hackers using the same old attack vectors.**

BT Finance? Growth DeFi? Small name backstreet protocols are easy prey for the serial killers who roam these streets without fear.

**We’ve been through this before, you know the deal. Manipulate the price, call earn, and withdraw the loot. Nothing new under the sun, why change the plan if it always works?**

BT Finance would have been stopped by a copyright claim if the hackers hadn’t got to them first, so they were already set to fail. For the few users who were tempted in by their sultry slogan of “Best yield for tokens”, maybe they should have seen this coming…

If you’re depositing your money into a protocol that is trying something new, or competing with what’s currently on offer, then taking on a certain level of risk can be justified. However, these low quality copycat bits of code are by and for simple gamblers who don’t look long term.

**So [BT Finance done](https://twitter.com/emilianobonassi/status/1358884929313140736?s=20), no surprise.**

[$1.5 million](https://etherscan.io/tx/0x82f95242963ac274d63e78234cb71c156f3135c32037e7e5b4424a6043da2a9a). Flash in flash out, like taking candy from a baby. Is a [Peckshield audit](https://github.com/peckshield/publications/blob/master/audit_reports/peckshield-audit-report-btdotfinance-v1.0.pdf) supposed to be deterrence or encouragement for a hacker? At this point it’s not quite clear.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/02/the-big-combo-middle-image-4.jpg)

**Growth DeFi had a little more to them.**

Although their product was nothing new, they worked hard and built up a user base before eventually falling victim to a slightly more exotic attack than the usual.

By forcing the staker contract to accept a liquidity pair containing a fake token, the attacker was able to remove $1.3 million in liquidity.

The attacker created a fake token called AXZ and supplied rAXZZ/GRO liquidity. He then staked it in the contract and pulled out the other pair.

[@r0bster97](https://twitter.com/r0bster97/status/1358858462579539968?s=20) summarised the attack.

[**First transaction**](https://etherscan.io/tx/0x97373e454e0d5bc7b552de8075c33ea257f570bea519dc2c6220658257b304b5):

Swap 0.001 [$ETH](https://twitter.com/search?q=%24ETH&src=cashtag_click) for ~0.0148 [$GRO](https://twitter.com/search?q=%24GRO&src=cashtag_click)

[**Second transaction**](https://etherscan.io/tx/0x97373e454e0d5bc7b552de8075c33ea257f570bea519dc2c6220658257b304b5):

~0.0148 [$GRO](https://twitter.com/search?q=%24GRO&src=cashtag_click) and 100,000,000,000 [$AXXZ](https://twitter.com/search?q=%24AXZ&src=cashtag_click) liquidity to Uniswap

[**Third transaction**](https://etherscan.io/tx/0x2152214a6be27a904af5a25e77fdca92ae60c6a9d7d298a41f88558649a41a23):

Remove ~27,516 [$GRO](https://twitter.com/search?q=%24GRO&src=cashtag_click) and ~1,218 [$rAAVE](https://twitter.com/search?q=%24rAAVE&src=cashtag_click) liquidity from Uniswap.

"Missing if-condition in the smart contract code"

[**Fourth transaction**](https://etherscan.io/tx/0xffef18b38096c96c1f6be784ea0ebb07964137858e38f3d65858a79e6a96797f):

Swap ~27,516 [$GRO](https://twitter.com/search?q=%24GRO&src=cashtag_click) for ~597 [$ETH](https://twitter.com/search?q=%24ETH&src=cashtag_click) on Uniswap.

**Payday.**

The Growth DeFi team has provided a further analysis of the attack on their Medium page [here](https://growthdefi.medium.com/raave-farming-contract-exploit-explained-f3b6f0b3c1b3).
---

**Two attacks, two techniques, the same end result.**

$2,7 million combined, taken with little to no consequence.

Just another day in the wild west phase of DeFi.

**Money always moves to the smartest players, whether that’s through deception or not is irrelevant.**

Don’t rely on audits to do your diligence for you, check the code yourself or work with people that can.

**In a game where the smartest players are trying to outsmart each other, all the small guys can do is try to play safe.**
