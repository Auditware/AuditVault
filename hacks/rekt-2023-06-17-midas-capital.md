---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - blockchain/optimism
  - sector/bridge
  - sector/lending
  - sector/privacy
title: "Midas Capital - REKT 2"
protocol: "[[Midas Capital]]"
date: 2023-06-17
loss_usd: 600000
auditors:
source: "https://rekt.news/midas-rekt2"
excerpt: "Midas can’t keep hold of their gold. On Saturday they lost $600k to a known vulnerability, again. Weaknesses, once discovered, instantly propagate through the ecosystem… When will they learn?"
genome:
  - "[[bridge-message-validation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Midas Capital - REKT 2

> **Loss:** $600,000 | **Date:** 2023-06-17 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/midas2-header.png)

_Midas can’t keep hold of their gold._

**On Saturday, one of the lending protocol’s pools was exploited for $600k on BSC.**

Midas Capital have found themselves on the rekt.news [leaderboard](https://rekt.news/leaderboard/) for the 2nd time this year. Acknowledging the incident, the team [stated](https://twitter.com/MidasCapitalxyz/status/1670151398900596737) they had “_pre-emptively paused all pools_”.

[Last time](https://rekt.news/midas-capital-rekt/) we wrote:

>It’s always a shame to report on losses in DeFi, but especially when they are down to already known issues, with simple workarounds.

Sadly, this exploit was also down to a known issue, having affected [Hundred Finance](https://rekt.news/hundred-rekt2/) in April. In what was also a 2nd entry, Hundred lost $7.4M on Optimism.

On Hundred’s [first outing](https://rekt.news/agave-hundred-rekt/) we wrote:

>Forks upon forks create a house of cards…
>
>When one fork falls, all others have to check their foundations.

_When will they learn?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Peckshield](https://twitter.com/peckshield/status/1670148905810403330), [Ancilia](https://twitter.com/AnciliaInc/status/1670130656586919936), [BlockSec](https://twitter.com/BlockSecTeam/status/1670145829204819969)_

The exploit was made possible due to a rounding vulnerability in the redeem counter, affecting interest rate calculation (as in April’s [Hundred Finance](https://rekt.news/hundred-rekt2/) incident).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/midas2-code.png)

On Wednesday, RSK-based [Tropykus](https://twitter.com/tropykus/status/1669310852787216385) was hit by the [same attack](https://blog.tropykus.com/comunicado_004), leading to $150k in losses. As pointed out by [Alexand39172242](https://twitter.com/Alexand39172242), the [attacker](https://etherscan.io/address/0x34027a026f17d0dbe273827baceec7c3e46f9987), who was [contacted](https://etherscan.io/tx/0xd9057dffd6a46d1da2de02c7cdacfffeb4085bda9aba0816d642075699c28f28) by the Tropykus team, also [funded](https://bscscan.com/tx/0x6ca209d77d19d5b09d816c8446389be17a367d97c832b19167a33e0d5269cc00) the Midas attacker’s address.

Attacker’s address: **[0x4b92cc3452ef1e37528470495b86d3f976470734](https://bscscan.com/address/0x4b92cc3452ef1e37528470495b86d3f976470734)**

The attacker has deposited a [portion](https://bscscan.com/address/0x4b92cc3452ef1e37528470495b86d3f976470734?toaddress=0x0d5550d52428e7e3175bfc9550207e4ad3859b17) of the stolen funds into Tornado Cash and bridged some to Ethereum.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

DeFi is an interconnected web of composable protocols and forked code; the possibilities for innovation are limitless, and the opportunities for integration, endless.

**But weaknesses, once discovered, instantly propagate through the ecosystem…**

_…sometimes finding their way into projects whose own devs are seemingly unaware, or don’t think to check._

**Keeping on top of these incidents is crucial for anyone working on securing funds in such a complex and interdependent industry.**

_Our [archive](https://rekt.news/leaderboard/) is just one click away…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
