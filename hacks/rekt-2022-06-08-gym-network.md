---
tags:
  - blockchain/bsc
  - sector/bridge
  - sector/dex
  - sector/privacy
  - sector/stable
  - sector/vault
title: "Gym Network - REKT"
protocol: "[[Gym Network]]"
date: 2022-06-08
loss_usd: 2100000
auditors:
source: "https://rekt.news/gymnet-rekt"
excerpt: "Gym Network offers a “perfect workout for your tokens” but has pushed itself to failure, losing $2.1M. The project’s two audits were completed last month. Why introduce new code so soon and risk an in"
genome:
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# Gym Network - REKT

> **Loss:** $2,100,000 | **Date:** 2022-06-08 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/gymnet-header.png)

**[Gym Network](https://gymnetwork.io/) offers a “_perfect workout for your tokens_”, but has pushed itself to failure.**

A recently introduced feature led to a loss of $2.1M from the project, crashing the price of [GYMNET](https://www.coingecko.com/en/coins/gym-network) as the stolen tokens were sold off.

The [official announcement](https://twitter.com/GymNet_Official/status/1534452473754157056) states that the team has already fixed the issue and [plans to recover losses](https://t.me/gymnetworkofficial/802).

**The project’s two audits were completed last month.**

_Why introduce new code so soon and risk an injury?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [Peckshield](https://twitter.com/peckshield/status/1534423219607719936), [Beosin](https://twitter.com/Beosin_com/status/1534457403558662145)_

The BSC-based yield aggregator, built on top of Alpaca Finance, introduced a vulnerable “Claim and Pool” feature in its [updated Single Pool Contract](https://bscscan.com/address/0x0288fba0bf19072d30490a0f3c81cd9b0634258a#code) two days ago.

Peckshield [states](https://twitter.com/peckshield/status/1534423219607719936) that:

>The bug is due to the lack of caller verification, which is exploited to increase the balance without making any payment.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/gymnet-code.png)

This allows the hacker to create fake deposits to the contract, which are processed despite the attacker not spending any coins. The hacker can then simply withdraw their balance of falsely credited deposits.

**Exploiter’s address:** [0xb2c035eee03b821cbe78644e5da8b8eaa711d2e5](https://bscscan.com/address/0xb2c035eee03b821cbe78644e5da8b8eaa711d2e5)

**Example exploit tx:** [0x8432c1…](https://bscscan.com/tx/0x8432c1c6613995eeea8a3ae2cfeb9577913db6b7b35dbe26a8c56c02066096e6)

The attacker was [funded](https://bscscan.com/tx/0x45fbd778ac22e9b108a72226a84c62db43853640b9591931340118123cf5ec6d) via Tornado Cash, and their exploit contracts swapped the stolen GYMNET into [a total of ~7.5k BNB](https://bscscan.com/address/0xb2c035eee03b821cbe78644e5da8b8eaa711d2e5).

2k BNB (~$570k) sent to Tornado Cash

3k BNB (~$855k) remain on the exploiter’s [BSC address](https://bscscan.com/address/0xb2c035eee03b821cbe78644e5da8b8eaa711d2e5)

2.5k BNB [swapped](https://bscscan.com/tx/0xf009dc69b352f0deeb18b7bdf33a77a038e016d65c666d6180bca40a8f1f7efb) to 387 ETH (~$700k) and bridged to [ETH address](https://etherscan.io/address/0xb2c035eee03b821cbe78644e5da8b8eaa711d2e5#internaltx)

Gym Network was quick to confirm the source of the vulnerability, posting the [following message](https://t.me/gymnetworkofficial/802) in their Telegram group.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/gymnet-message.png)

**Although GYMNET [dropped ~90%](https://www.coingecko.com/en/coins/gym-network) as the exploiter dumped the stolen tokens, it has since recovered to ~70% of its pre-hack price.**

The project was audited by both [Certik](https://www.certik.com/projects/gym-network) and [Peckshield](https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-Gymnet-v1.0.pdf) in May, however the faulty code was introduced two days ago.

**Why carry out two audits if you’re going to change the codebase a month later?**

_Was this the plan all along?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**The popularity of BSC among retail users has led to many low-effort projects with weak security, and some projects have been [rekt](https://rekt.news/pancakebunny2-rekt/)  [multiple](https://rekt.news/merlin3-rekt/)  [times](https://rekt.news/value-rekt3/).**

But the timing of this hack comes at a time when Binance itself is in the spotlight, with pressure coming from multiple fronts.

On Monday, it was reported that an [SEC investigation](https://www.bloomberg.com/news/articles/2022-06-06/us-probes-binance-over-token-that-is-now-world-s-fifth-largest) is currently underway into whether the launch of BNB amounted to the sale of an unregistered security.

The same day, a Reuters [hit-piece](https://www.reuters.com/investigates/special-report/fintech-crypto-binance-dirtymoney) was published claiming that Binance is “_a hub for hackers, fraudsters and drug traffickers_”.

**At a time when critics are feeling vindicated by the [collapse](https://rekt.news/luna-rekt/) of Luna and UST, the narrative that crypto is only for dirty money is an tempting one for mainstream media outlets to push.**

However, Binance have [published email transcripts](https://www.binance.com/en/blog/ecosystem/the-crypto-money-laundering-myth-and-the-machine-working-overtime-to-sell-a-false-narrative-421499824684903964) showing a lack of willingness to cooperate on the part of the Reuters’ journalists who neglected to share the information necessary for the Binance team to investigate their claims.

While the markets are down and bear-market apathy takes over, it’s clear that those who disapprove of crypto are making their moves.

**Ape season is well and truly over, and FUD season is in full swing.**

_But amongst all the doom and gloom, it’s important to remember that this is not our first rodeo…_

>Progress will not be linear. There will be hurdles; restrictions, scams and market crashes.
>
>[However, the shared vision is key.](https://www.youtube.com/watch?v=v1Z5BnBuFyE)

**After all... no pain, no gain.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)

> If you enjoy our work, please consider donating to our [Gitcoin Grant](https://gitcoin.co/grants/1632/rekt-the-dark-web-of-defi-journalism).
