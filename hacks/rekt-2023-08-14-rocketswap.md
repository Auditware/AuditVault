---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/launchpad
  - precondition/insider
title: "RocketSwap - REKT"
protocol: "[[Rocketswap]]"
date: 2023-08-14
loss_usd: 869000
auditors:
source: "https://rekt.news/rocketswap-rekt"
excerpt: "RocketSwap has lost $869k to compromised private keys, allegedly stolen in a bruteforce attack on the project’s server. We are very sorry for your loss."
genome:
  - "[[insider]]"
  - "[[bridge-message-validation]]"
---
# RocketSwap - REKT

> **Loss:** $869,000 | **Date:** 2023-08-14 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/rocketswap-header.png)

**[Base](https://twitter.com/buildonbase) is having its moment in the spotlight.**

_But presumably not for the reasons Coinbase would like._

**RocketSwap has lost ~$869k to compromised private keys, allegedly stolen in a bruteforce attack on the project’s server.**

_And it’s not even the first time they’ve been in [hot water](https://twitter.com/o_ponle/status/1691247459673010176)._

[Two weeks ago](https://rekt.news/bald-rekt/), the high-profile rugpull of BALD was followed quickly by LeetSwap getting rekt.

This feels like the same old familiar story of low-effort cash grabs capitalising on the FOMO of missing the 'next big thing'.

_If Base is supposed to be our new hope for a boom in retail adoption, we'll have to do better than this…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Certik](https://twitter.com/CertiKAlert/status/1691279385507090432), [Peckshield](https://twitter.com/PeckShieldAlert/status/1691268504396374016), [RocketSwap](https://twitter.com/RocketSwap_Labs/status/1691229656593371136)_

**At approximately 11pm UTC on August 14th, RocketSwap's farming contracts were drained via an internal address.**

If the team is to be [believed](https://twitter.com/Forgiving15/status/1691245819096383488), the project's [announcement](https://twitter.com/RocketSwap_Labs/status/1691229656593371136) of the incident states that the keys were bruteforced from the server on which they were stored:

>We are sorry to inform you that the team needed to use offline signatures when deploying the launchpad and put the private keys on the server.
>
>A brute force hack of the server was detected, and due to the proxy contract used for the farm contract, there were multiple high-risk permissions that led to the transfer of the farm's assets.
>
>We shut down the farm to prevent further damage.

The team have [promised](https://twitter.com/RocketSwap_Labs/status/1691258298409029632) to redeploy the farming contracts directly, i.e. not via a proxy contract, and relinquish minting privileges.

_But with comments disabled on their tweets and the community Telegram also on pause, one wonders why they are so keen to control the narrative…_

Attacker’s address: **[0x96c0876F573e27636612CF306C9db072d2B13DE8](https://basescan.org/address/0x96c0876F573e27636612CF306C9db072d2B13DE8)**

The attacker bridged 472 ETH back to Ethereum as well as launched their own memecoin with [400 ETH liquidity](https://etherscan.io/tx/0xbe0b89188b044a3b69702c73fd76cf555b39fa4ad2d609685411b71cfa4f3dba), maybe hoping for a repeat of the BALD frenzy.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

While Base may be Coinbase signaling to the community that they still believe in crypto's core principles, especially whilst [under pressure](https://rekt.news/grudgematch-sec/) from the SEC, this messy start might just spur on Gensler even further.

Building on top of OP, one of the more utopian visions for crypto and with a strong focus on public goods, is a show of support for what the tech could accomplish and a motivating force during times when spirits are low across the industry.

_Though even the most well-intentioned platforms sometimes beggar belief with their [inability to read the room](https://twitter.com/gitcoin/status/1691092823872073728)._

**But Base itself is, so far, drawing parallels to the [early days of BSC](https://rekt.news/bsc-the-bridge-to-defi/), a new chain launched by a CEX, full of memecoins and quick rugs (another project, SwirlLend, has [rugged since](https://twitter.com/PeckShieldAlert/status/1691719373571186925)).**

This stage may just be part of the natural evolution of a new chain...

_Are all experiments destined to go through the same ordeal?_

>[We are very sorry for your loss.](https://twitter.com/RocketSwap_Labs/status/1691229656593371136)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
