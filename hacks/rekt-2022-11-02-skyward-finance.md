---
tags:
  - sector/launchpad
title: "Skyward Finance - REKT"
protocol: "[[Skyward Finance]]"
date: 2022-11-02
loss_usd: 3200000
auditors:
source: "https://rekt.news/skyward-rekt"
excerpt: "Skyward Finance has come crashing down to earth. The NEAR-based token launchpad had its treasury drained of approximately $3.2M. Don't fly too NEAR to the sun."
genome:
  - "[[flashloan-callback-auth]]"
---
# Skyward Finance - REKT

> **Loss:** $3,200,000 | **Date:** 2022-11-02 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/11/skyward-header.png)


**[Skyward Finance](https://twitter.com/skywardfinance?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor) has come crashing down to earth.**

The NEAR-based token launchpad had its treasury drained of 1.1M NEAR, worth approximately $3.2M at the time.

The exploit caused the price of [SKYWARD](https://www.coingecko.com/en/coins/skyward-finance) to tank by ~90%:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/11/skyward-price.png)

Rather than the usual damage-control and downplaying, the team’s [announcement](https://twitter.com/skywardfinance/status/1587947957789331457) concedes that the exploit “_render[ed] the Treasury and the $SKYWARD token effectively worthless._”

Going on to explain that the contracts are fully immutable, the Skyward assured any projects currently launching via the platform that “_existing and previous sales are not affected, so funds and proceeds can be withdrawn safely._”

But there was no such good news for Skyward holders:

>We recommend users to withdraw their funds safely where they can and for the community to no longer interact with Skyward.

Was this incident an honest, albeit simple, mistake?

Or a planned ejector seat?

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [Sanket Naikwadi](https://twitter.com/sanket_naikwadi/status/1587854474587930624), [BlockSec](https://twitter.com/BlockSecTeam/status/1587998122072231936)_

Shortly after 5pm UTC yesterday, the exploiter redeemed (previously accumulated) SKYWARD for wNEAR from the treasury using the redeem_skyward function.

However, the function lacks proper verification of the token_account_ids parameter, allowing the attacker to loop the redemption of wNEAR by repeatedly passing their withdrawal within the transaction.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/11/skyward-code.png)

The exploiter repeated the exploited redemption process until the treasury had been drained of wNEAR.

**Exploiter’s address: [5ebc5ecca14a44175464d0e6a7d3b2a6890229cd5f19cfb29ce8b1651fd58d39](https://explorer.near.org/accounts/5ebc5ecca14a44175464d0e6a7d3b2a6890229cd5f19cfb29ce8b1651fd58d39)**

Attack tx: [92Gq7zeh…](https://explorer.near.org/transactions/92Gq7zehKPwSSnpoZ7LGGtSmgmBb4wP2XNDVJqUZRGqz)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**The fact that it took over a year for anyone to find this relatively simple exploit is remarkable.**

Perhaps hackers are less familiar with the NEAR ecosystem and feel their time and resources can be put to use more profitably elsewhere…

Or maybe this was a planned exit-by-exploit, and the users were right to be [concerned](https://gov.near.org/t/how-can-we-be-sure-that-skyward-will-not-disappear-with-the-collected-money-after-the-sale/3161/4) before launch…

**This is the first [leaderboard](https://rekt.news/leaderboard/) entry (#88) for a NEAR-based project; let’s hope we can learn something from it…**

_When headed Skyward, don't fly too NEAR to the sun._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
