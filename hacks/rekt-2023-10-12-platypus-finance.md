---
tags:
  - blockchain/avalanche
  - blockchain/ethereum
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/stable
  - impact/data-corruption/price-manipulation
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
title: "Platypus Finance - REKT 2"
protocol: "[[Platypus Finance]]"
date: 2023-10-12
loss_usd: 2200000
auditors:
source: "https://rekt.news/platypus-rekt2"
excerpt: "After three exploits in 8 months, Platypus is beginning to look like an endangered species. A flashloan attack has drained the Avalanche-based protocol of $2.2M. It’s been a rough week for Avalanche."
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Platypus Finance - REKT 2

> **Loss:** $2,200,000 | **Date:** 2023-10-12 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/platypus2-header.png)

_[Platypus](https://twitter.com/Platypusdefi) is beginning to look like an endangered species._

**A flashloan attack has drained the Avalanche-based protocol of $2.2M, but this isn’t their first time on the [leaderboard](https://rekt.news/leaderboard/)…**

In February, [Platypus lost $8.5M](https://rekt.news/platypus-finance-rekt/) when its recently-released stablecoin was attacked (also via flash loan).

_The incident wasn’t exactly a blackhat masterclass._

The hacker had [neglected](https://twitter.com/danielvf/status/1626641254531448833) to code a way to withdraw funds from the attack contract, and BlockSec were able to [whitehack 2.4M USDC](https://snowtrace.io/tx/0x5e3eb070c772631d599367521b886793e13cf0bc150bd588357c589395d2d5c3) to be returned. Additionally, shoddy OPSEC led to the hacker being quickly [tracked down](https://twitter.com/zachxbt/status/1626434265260118021), and later [arrested](https://cointelegraph.com/news/french-police-arrest-2-people-in-connection-to-platypus-attack) in France.

_The project was also [hit](https://twitter.com/peckshield/status/1678800450303164431) in July for $150k._

**This time, after [Peckshield](https://twitter.com/peckshield/status/1712354198246035562) raised the alarm, and the losses began to [mount up](https://twitter.com/PeckShieldAlert/status/1712367911766257912), Platypus [acknowledged](https://twitter.com/Platypusdefi/status/1712365385100689584) the incident:

>Due to suspicious activities in our protocol, we have taken the proactive measure of temporarily suspending all pools.

As we wrote last time:

>Evolution works in mysterious ways.

**But after three exploits in 8 months…**

_…how long until Platypus goes extinct?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[BlockSec](https://twitter.com/BlockSecTeam/status/1712445197538468298), [Inspex](https://twitter.com/InspexCo/status/1712489621018599468)_

**The attack was comprised of three transactions, each of which used flash loans to manipulate the prices within the Platypus [LP-AVAX pool](https://snowtrace.io/address/0xc73eed4494382093c6a7c284426a9a00f6c79939).**

According to [BlockSec](https://twitter.com/BlockSecTeam/status/1712445197538468298), the attacker “_manipulated 'cash' and 'liability' which affected the swap price_” via slippage.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/platypus2-code.png)

**Inspex [provided](https://twitter.com/InspexCo/status/1712489621018599468) the following step-by-step:**

>1/ The attacker deposits WAVAX to LP-AVAX, and sAVAX to LP-sAVAX increases the liability of both LP contracts.
>
>2/ The attacker swapped sAVAX to WAVAX to reduce the cash from the LP-AVAX contract.
>
>3/ The attacker then withdrawn WAVAX from LP-AVAX to remove all available cash from the LP-AVAX contract. This will increase the slippageFrom value, resulting in manipulating the `actualToAmount` value.
>
>4/ As a result, the attacker swap and take profit from the manipulated slippage.

****Again, as in February, the hacker made a mistake which allowed for the [recovery](https://snowtrace.io/tx/0xa15960386586816486261dbc5cd9c8bf5f212f9f667e32abaa9f18891d0165e4) of [some](https://snowtrace.io/tx/0xb643892f6d343965856f9f85045820bb55bb1b4b8064fee3bbcc2b0929c7616b) ($575k) of the stolen assets.****

Attacker address 1: **[0x0cd4fd0eecd2c5ad24de7f17ae35f9db6ac51ee7](https://snowtrace.io/address/0x0cd4fd0eecd2c5ad24de7f17ae35f9db6ac51ee7)**

Malicious contract 1: [0x4cfb527f51b391ecb1a5197edc7a38160c261b6f](https://snowtrace.io/address/0x4cfb527f51b391ecb1a5197edc7a38160c261b6f)

Attack tx 1: [0xab5f6242…](https://snowtrace.io/tx/0xab5f6242fb073af1bb3cd6e891bc93d247e748a69e599a3744ff070447acb20f)

Attack tx 2: [0x4425f757…](https://snowtrace.io/tx/0x4425f757715e23d392cda666bc0492d9e5d5848ff89851a1821eab5ed12bb867)

Attacker address 2: **[0x464073f659591507d9255b833d163ef1af5ccc2c](https://snowtrace.io/address/0x464073f659591507d9255b833d163ef1af5ccc2c)**

Malicious contract 2: [0xf2c444572a402ec83b7cb64e4a9fc2188f0628f2](https://snowtrace.io/address/0xf2c444572a402ec83b7cb64e4a9fc2188f0628f2)

Attack tx 3: [0x6a09d385…](https://snowtrace.io/tx/0x6a09d38505beeb29ed4dbb30de2803f30f3c62e2464c6a20ec17026c372c763e)

Rescued funds ($575k): [0x068e297e8ff74115c9e1c4b5b83b700fda5afdeb](https://snowtrace.io/address/0x068e297e8ff74115c9e1c4b5b83b700fda5afdeb)

**The remaining stolen funds ($1.6M of WAVAX and sAVAX) currently remain in the primary [attack contract](https://snowtrace.io/address/0x4cfb527f51b391ecb1a5197edc7a38160c261b6f).**

_Platypus fork Hummus Exchange has also [paused contracts](https://twitter.com/hummusdefi/status/1712425534930534465) in order to avoid a repeat attack._

Platypus was audited by both Hacken and Omniscia, but both audits were [completed](https://medium.com/platypus-finance/platypus-successfully-passed-hackens-smart-contract-audit-and-omniscia-s-security-analysis-767d79bff5a6) by early January 2022, over three months before the affected contract was [deployed](https://snowtrace.io/tx/0xa9320f3f74dfd0a4ceb5ef875148f923b9493492d3d426172fcebed6bb8f9b86).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_It’s been a rough week for Avalanche._

**Last weekend’s [Stars Arena](https://rekt.news/stars-arena-rekt/) debacle came after a while with barely a peep from the AVAX community.**

Despite the fact that [90% of funds](https://twitter.com/starsarenacom/status/1712192197443883453) have been returned, the way the incident was handled (by both the team and Ava Labs’ CEO) left a bad impression.

Then, news broke that Avalanche’s favourite DEX Trader Joe is [being sued](https://twitter.com/CoinDesk/status/1711720164121628846) by none other than… Trader Joe’s. _Who could've seen that coming?_

**With many alternate L1s struggling, and even [pivoting](https://twitter.com/CantoPublic/status/1703809950290718871) to the more active Ethereum L2 ecosystem…**

_…what’s next for Avalanche?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
