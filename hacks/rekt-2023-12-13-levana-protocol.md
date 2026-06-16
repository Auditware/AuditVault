---
tags:
  - sector/oracle
  - sector/token
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
title: "Levana Protocol - REKT"
protocol: "[[Levana Protocol]]"
date: 2023-12-13
loss_usd: 1146000
auditors:
source: "https://rekt.news/levana-rekt"
excerpt: "Gradually, then all at once. Levana Protocol lost over $1.1M to an oracle manipulation attack lasting almost two weeks. But if it hadn’t been for congestion, would they have even noticed?"
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Levana Protocol - REKT

> **Loss:** $1,146,000 | **Date:** 2023-12-13 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/levana-header.png)

_Gradually, then all at once._

**Perps platform Levana Protocol lost over $1.1M, or approximately 10% of the protocol’s liquidity, to an oracle manipulation attack lasting almost two weeks.**

_The slow burn went unnoticed until network congestion fanned the flames._

A [disclosure](https://twitter.com/Levana_protocol/status/1740071199483543819) published on Wednesday explained how the majority of the losses were realised when elevated gas costs on the Osmosis network suddenly made the exploit more profitable.

**The sharp increase in losses alerted the team, who responded by pausing the protocol.**

>The exploit started 14 days ago. Over a period of 12 days the attacker succeeded in draining approximately 4% of Levana's LPs.
>
>The change in PnL was initially attributed to organic trader profits and lack of effective cash and carry on Levana's smaller markets.
>
>Yesterday the attack increased significantly during Osmosis congestion, draining an additional ~5% from the pools until the protocol was closed from new positions being opened.

**But if it hadn’t been for the increased network traffic…**

_Would they have even noticed?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Levana](https://blog.levana.finance/levana-exploit-postmortem-df89a72cc92b), [Carter L. Woetzel](https://twitter.com/l_woetzel/status/1740086038624616525)_

According to Levana’s [post-mortem](https://blog.levana.finance/levana-exploit-postmortem-df89a72cc92b), the attack began on December 13th, before ramping up significantly on December 26th.

**The exploit took advantage of temporary price discrepancies (delta) between oracle updates to place winning trades in “_volatile markets with high leverage_”.**

_Although the attack vector is fairly simple, context is key._

Oracle updates are pushed during regular user trades, as well as from Levana’s off-chain update bot, or every 90 seconds. But by timing attacks just right, and ensuring other transactions couldn’t get through, there was a window of opportunity every once in a while…

During the first stage, profits were minimal, as the exploit relied on a combination of conditions:

>You would have to find, or artificially create, a period where two events coincide: the large price delta in <90 seconds, plus no other interrupting trading or bot activity

The second, more profitable stage took advantage of a period of congestion on Osmosis; it remains unclear whether this congestion was organic or engineered for the purposes of the attack.

Whatever the cause, it allowed for more cases in which the exploiter was free to make their loaded bets as regular user txs couldn’t get through. The report [explains](https://blog.levana.finance/levana-exploit-postmortem-df89a72cc92b):

>A bug in the Osmosis fee market code meant that during times of congestion, the provided gas price was generally insufficient for making trades or performing ongoing bot maintenance activities.

**To top it off, the project was subject to an ongoing DDoS attack over the majority of the exploit period, hampering their ability to respond.**

The markets affected and their losses (totaling $1.146M) are as follows:

stATOM_USD: $241k

ATOM_USD: $229k

BTC_USD: $190k

ETH_USD: $128k

TIA_USD: $108k

*_USDC: $168k + $82k

**The following step-by-step, provided by [Carter L. Woetzel](https://twitter.com/l_woetzel/status/1740086038624616525), shows the many factors at play.**

>1 Spam txs such that no oracle update txs can get through (from either users or Levana infra)
>
>2 DDoS backend infra tied to regularly scheduled oracle update txs
>
>3 Have an intelligent system tracking the delta🔺between the stale data and the actual market pricing that is ready to get pushed
>
>4 Use a multiexecute tx to go long or short + update the stale data to market pricing - guaranteeing profit for the attacker as they know exactly what the stale price of the oracle is about to get updated to within their multiexecute tx while also comboing it with a long or short guaranteed to be directionally correct.
>
>5 Because the attacker was the source of congestion, they knew precisely where to submit txs such that they would get accepted by the nodes

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

Levana had been [audited](https://docs.levana.finance/audits) by both [FYEO](https://static.levana.finance/audit-reports/levana-perps-fyeo-v1.1.pdf) and [Peckshield](https://static.levana.finance/audit-reports/levana-perps-peckshield-v1.0.pdf) earlier in the year. However, bugs which rely on external factors such as network congestion don't look to have been within scope.

The project plans to make users whole via fees and an upcoming airdrop of [LVN](https://www.coingecko.com/en/coins/levana) tokens, and is incorporating a transaction queuing system which will require a fresh oracle price to open positions.

**Even in the autonomous and disembodied world of DeFi, protocols do not exist in a vacuum.**

Fundamental considerations such as dependencies on external oracles and the reliance on an underlying network’s fee system must be constantly studied and meticulously tweaked to ensure a stable running product.

_And with inscriptions fever spreading across all chains lately, any protocol could find themselves suddenly clogged up._

Crafty attackers may attempt to identify similar opportunities, waiting for congestion to hit a critical threshold, and ready to strike on multiple fronts.

**But considering the complexity of this hack, which took advantage of network-level pressures, protocol logic _and_ off-chain systems, all combined with a distracting DDoS attack…**

Did Levana simply get unlucky?

_Or are we seeing the emergence of even more nuanced and time sensitive attacks?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
