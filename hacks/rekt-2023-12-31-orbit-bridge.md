---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/multisig
  - sector/privacy
  - sector/stable
title: "Orbit Bridge - REKT"
protocol: "[[Orbit Bridge]]"
date: 2023-12-31
loss_usd: 81500000
auditors:
source: "https://rekt.news/orbit-bridge-rekt"
excerpt: "It wasn’t just fireworks blowing up on New Year’s Eve... Orbit Chain’s Ethereum bridge lost $81.5M. What will 2024 bring?"
genome:
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# Orbit Bridge - REKT

> **Loss:** $81,500,000 | **Date:** 2023-12-31 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/orbit-header.png)

_It wasn’t just fireworks blowing up on New Year’s Eve._

**The final hours of 2023 saw Orbit Chain’s Ethereum bridge lose $81.5M to what looks to have been a compromised multisig.**

Not to be confused with Orbiter, which connects ETH L2s, Orbit Chain is a standalone network aiming to work as a hub between other established ecosystems.

**The attack began just after 9PM UTC, and the [alarm was raised](https://twitter.com/KGJRTG/status/1741575860635783385) just a few minutes later.**

The official [acknowledgement](https://twitter.com/Orbit_Chain/status/1741725778956730778) referenced a breach shortly before the transactions began…

>An unidentified access to Orbit Bridge, a decentralized Cross-chain protocol, was confirmed on Dec-31-2023 08:52:47 PM +UTC.

…and was accompanied by [warnings](https://twitter.com/Orbit_Chain/status/1741725782421148068) about opportunistic [phishing](https://rekt.news/plenty-of-phish/) attacks.

_With 2023 ending on a bit of a downer, for Orbit at least, what will 2024 bring?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Tayvano](https://twitter.com/tayvano_/status/1741646766779552061), [Peckshield](https://twitter.com/peckshield/status/1741613040335036513)_

While the hack is initially assumed to be due to compromised keys of signer-addresses on the Orbit’s ETH Vault multisig, the team is yet to disclose the exact nature of the attack vector.

_Others have [suggested](https://t.me/ETHSecurity/87996) there could be a tx replay bug at play, similar to a ‘known issue’ identified during Theori’s [audit](https://github.com/orbit-chain/bridge-contract/blob/master/audit/Theori_OrbitBridge_2022_1Q.pdf) (see page 7)._

**NOTE: _This article will be updated to include the root cause once an official post-mortem has been published._**

---

**Follow-up note: On the 25th Jan, Ozys (Orbit's development company) published a [statement](https://medium.com/orbit-chain/official-statement-regarding-orbit-bridge-exploit-551928f3dc52) implicating the firm's former CISO:**

>**Two days after his voluntary retirement decision (November 20), the information security specialist who led Ozys’ efforts to become an ISMS-certified organization, abruptly made the firewall vulnerable and left the company on December 6, without any verbal or written communication during the handover process.**

**Investigations are ongoing.**

---

Withdrawals began with [10M DAI](https://etherscan.io/tx/0xafdc36278fcef8d54824b09ec019147cfe2afd995abf6754e52d273a2c1b07ca) at 21:08 UTC, followed by [231 WBTC](https://etherscan.io/tx/0xe0bada18fdc56dec125c31b1636490f85ba66016318060a066ed7050ff7271f9) ($9.8M), [9500 ETH](https://etherscan.io/tx/0x639d27e564214411ad8eb06cf00d85cd90f83503a53ab5bf35dd5c6e1148ae0a) ($21.5M), [10M USDC](https://etherscan.io/tx/0x64a6f486c20671e1389b3c7948d46733325c407245a86bf510cb69ef401a3f0e)  and finishing with [30M USDT](https://etherscan.io/tx/0xd8ca42941a0a2c25669267ad8d61f7f9f4118252cb502316602fe16624b80ac8) at 21:25 UTC. The bridge was [deactivated](https://etherscan.io/tx/0xedfcdeb97c57a106067315afd364af361b20f0cf1a10070db57241a5e11913f4) at 22:21 UTC.

Centralised stables and WBTC were swapped out for ETH, as shown in Peckshield’s [attack flow](https://twitter.com/tayvano_/status/1741646766779552061):

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/orbit-flow.png)

_Tay’s thread contains a [full list](https://twitter.com/tayvano_/status/1741647481707053535) of attacker addresses, where funds remain._

Attacker’s primary address: **[0x9263e7873613ddc598a701709875634819176aff](https://etherscan.io/address/0x9263e7873613ddc598a701709875634819176aff)**

**The methodical tx pattern [suggests](https://twitter.com/tayvano_/status/1741646766779552061) this may be another Lazarus job, and the team has [links](https://twitter.com/tayvano_/status/1741681104128770290) to previous hacked projects [Belt](https://rekt.news/belt-rekt/) and [Klayswap](https://medium.com/s2wblog/post-mortem-of-klayswap-incident-through-bgp-hijacking-en-3ed7e33de600).**

_The attacker’s address was [funded](https://etherscan.io/tx/0x5e35f4b1886d62543cc027b5c0ef54aac3901a25c37d8ea6b1ab8861c9bd09dd) via Tornado Cash through an [intermediary address](https://etherscan.io/address/0x70462bfb204bf3ccb0560f259072f8e3a85b3512)._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Over half of Orbit Bridge’s [TVL](https://defillama.com/protocol/orbit-bridge) was drained in the attack, adding over $80M to an already impressive total for the presumed culprits.**

Lazarus was responsible for at least $250M of losses in 2023 alone, with attacks on [Atomic Wallet](https://rekt.news/atomic-wallet-rekt/), [AlphaPo](https://rekt.news/alphapo-rekt/), [Stake](https://rekt.news/stake-rekt/) and [CoinEx](https://rekt.news/coinex-rekt/) all attributed to the group.

As markets pick up and institutional interest in crypto continues to grow, we will have to take security more seriously if we want to be [taken seriously](https://twitter.com/tayvano_/status/1741646766779552061) ourselves:

>Looks like 2024 is going to be another year of handing DPRK billions of dollars on a silver platter. 🙄
>
>embarrassing af.

Gradually emerging from a brutal bear market, will we [simply ape](https://rekt.news/ape-season-returns/) into whatever the next narrative is, content to take on more and more risk as the potential rewards stack up?

_Or can we do better this year?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
