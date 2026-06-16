---
tags:
  - blockchain/ethereum
  - blockchain/polygon
  - sector/stable
title: "SafeDollar - REKT"
protocol: "[[Safedollar]]"
date: 2021-06-28
loss_usd: 248000
auditors:
source: "https://rekt.news/safedollar-rekt"
excerpt: "Your dollars are not safe and they never were. Just $248k taken from a protocol that was called 'SafeDollar.'"
genome:
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# SafeDollar - REKT

> **Loss:** $248,000 | **Date:** 2021-06-28 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/06/safedollar-header.png) 

**Your dollars [are not safe](https://www.bloomberg.com/opinion/articles/2021-01-25/the-dollar-s-crash-is-only-just-beginning) and they never were.**

_Users jump from chain to chain, but hackers follow hot on their heels._

Polygon has seen its user base grow in recent months, initially as an alternative to the congested Ethereum network, and then later to escape the [Binance](https://www.rekt.news/uranium-rekt/) [Smart](https://www.rekt.news/pancakebunny-rekt/) [Chain](https://www.rekt.news/merlin-rekt/) [minefield](https://www.rekt.news/merlin2-rekt/), but it seems where there’s liquidity; there’s a loophole, and now everyones money is Polygone. 

**Low-quality protocols get [low-quality coverage](https://twitter.com/lawmaster/status/1409456309456486400?s=20), but you [asked](https://twitter.com/afalol/status/1409495785654345732?s=20) for more, so here it is.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

>Two hundred and forty eight thousand gone, from a protocol that was called [“SafeDollar”.](https://www.safedollar.fi/)

**If they need to tell you they’re safe, they usually are not.**

Not only has SafeDollar seen its Polygon-based “stable” coin SDO drop to $0, but this isn’t even the first exploit the protocol has suffered [this week.](https://safedollar.medium.com/safedollar-postmortem-analysis-96c8cfb4c2a3)

> ...we have met our 1st challenge but we will continue to work tirelessly to ensure the project stays on its course.
>
> Thank you for your understanding and support to SafeDollar.

Writing a half-hearted post-mortem, congratulating yourself and thanking users for continuing to trust in your flawed project isn’t a great look.

In fact, it looks more like an invitation.

Less than two weeks ago [we asked:](https://www.rekt.news/iron-finance-rekt/)

_Are all algorithmic stablecoins bound to the same fate?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**Only $250k taken this time, via an infinite mint exploit.** 

The exploit used a bug in SafeDollar’s reward mechanism to manipulate the **accSdoPerShare** value, eventually being able to claim vast quantities of SDO for each token deposited.

An initial [deposit](https://polygonscan.com/tx/0x55dad44a7ed31d1637e70879af66e02290d39aea54554f8411e6ec19c03a074b) into one of the protocol’s Safe Farms was made in preparation.

The token that SafeDollar was incentivising, [PLX](https://polygonscan.com/token/0x7a5dc8a09c831251026302c93a778748dd48b4df), charges fees on transfers. These fees are supposedly borne by the user, but during withdrawal transactions these fees were deducted from the rewarder balance instead.

A deposit/withdraw [loop](https://polygonscan.com/tx/0xd78ff27f33576ff7ece3a58943f3e74caaa9321bcc3238e4cf014eca2e89ce3f), allowed the hacker to gradually deplete the PLX balance of the pool over the course of 101 transactions, resulting in a massively inflated accSdoPerShare of 1,142,913,215,739,484,400 SDO being rewarded for each PLX deposited.

**With the rewards system now skewed, the attacker fired a final transaction.**

Claiming the rewards on the initial deposit produced a total of 831,309,277,244,108,000 [SDO](https://app.polychart.io/explorer/polygon/0x742ad5057abd4c3ed4f851085297ff15f865438d), which was simultaneously sold, crashing the price of SDO straight to $0.00.

Despite owning such an enormous quantity of the stablecoin, the attacker could only make off with the defunct coin’s exit liquidity of 202k USDC and 46k USDT.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**So, just $248k, **not** $248 million.**

At position number 36 on the [leaderboard](https://www.rekt.news/leaderboard/), hopefully this will be the smallest hack we'll have to cover.

_Apparently CTRL C / CTRL V is just as popular when writing about DeFi protocols as it is when forking them._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-text-linebreak.png)
