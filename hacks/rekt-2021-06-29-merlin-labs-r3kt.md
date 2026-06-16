---
tags:
  - sector/privacy
title: "Merlin Labs - R3KT"
protocol: "[[Merlin Labs R3kt]]"
date: 2021-06-29
loss_usd: 330000
auditors:
source: "https://rekt.news/merlin3-rekt"
excerpt: "The third time’s a charm for Merlin Finance. Why do people keep going back?"
genome:
  - "[[reward-accounting]]"
---
# Merlin Labs - R3KT

> **Loss:** $330,000 | **Date:** 2021-06-29 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/06/Merlin3-header.png) 

**Merlin’s hat trick.**

**The third time’s a charm for Merlin Finance.** 

_Why do people keep going back?_

A total of $330k was stolen, bringing their TVL (total value lost) to $1,560,000, and putting them on par with [Value DeFi](https://www.rekt.news/value-rekt3/) as one of the few protocols to be so unsafe that they have three positions onto the [rekt leaderboard.](https://www.rekt.news/leaderboard/)

**“Madam Merlin” wrote the following message in the Merlin Telegram group.**

>Thank you for your patience. It has been identified that this was an economic exploit. 

>The Merlin Dev team had deployed the Alpaca single asset vaults onto the Mainnet for testing this morning. This vault was not supposed to be publicly available or ready to launch to the public. 

>Via the smart contract, a hacker deposited 0.1WBNB into the vault and then manually transferred 1000BNB into the contract to trick the contract into thinking it has received 1000BNB in rewards, which resulted in the minter producing MERL rewards.

>We thank you for your patience. 

**Thank you for your patience?!**

**At this point they should just say sorry.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/06/merlin3-investigates.png) 

_Credit: [RugDoc](https://twitter.com/RugDocIO/status/1409821481941540866?s=19)_ 

**Exploiter wallet:** [0x2bADa393e53D0373788d15fD98CB5Fb1441645BD](https://bscscan.com/address/0x2bADa393e53D0373788d15fD98CB5Fb1441645BD)

Merlin's reward system gave users Merlin tokens for every $ in performance fees they brought in. 

It was rewarding 35 MERL (~$500 at the time) for every BNB (worth ~$300).

When calculating the profit of the strategy, it converted the received BNB to WBNB. 

**The increase in WBNB balance was then seen as the profit.** 

By sending BNB to the contract directly, it is also converted to WBNB and considered "profit".

By depositing BNB in the contract, the attacker could harvest and all that BNB would be assumed to be rewardable profit.

**Straight to ETH, then [Tornado](https://etherscan.io/address/0x2bADa393e53D0373788d15fD98CB5Fb1441645BD) and it’s gone.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**It’s hard times at Merlin Labs.**

**Having lost their lead engineer and being forced to [advertise the vacancy](https://t.me/Rekt_HQ/13150), it looks like not only has this wizard lost their staff, but also their magic.**

>[Must try harder.](https://www.rekt.news/merlin2-rekt/)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-text-linebreak.png)
