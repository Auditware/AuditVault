---
tags:
  - sector/dex
  - sector/oracle
  - sector/stable
  - sector/vault
  - vuln/reentrancy/read-only
  - vuln/reentrancy/single-function
  - impact/data-corruption/price-manipulation
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
  - trigger/price-manipulation
  - novelty/known-pattern
title: "Conic Finance - REKT"
protocol: "[[Conic Finance]]"
date: 2023-07-21
loss_usd: 4200000
auditors:
source: "https://rekt.news/conic-finance-rekt"
excerpt: "Lightning does strike twice. Conic Finance got double-rekt on Friday, losing a total of $4.2M from their ETH and crvUSD omnipools. Will such a promising protocol survive this double blow?"
genome:
  - "[[read-only]]"
  - "[[single-function]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[trigger/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
---
# Conic Finance - REKT

> **Loss:** $4,200,000 | **Date:** 2023-07-21 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/conic-header.png)

_Lightning **does** strike twice._

**[Conic Finance](https://conic.finance/) got double-rekt on Friday, losing a total of $4.2M from their ETH and crvUSD omnipools.**

Omnipools accept single asset deposits, which are then spread across a variety of Curve pools to earn LP rewards for depositors.

**As the news spread, Conic quickly [acknowledged](https://twitter.com/conicfinance/status/1682346727578255360) the first attack, which drained the ETH pool of $3.3M. Following the second incident, the team decided to [shut down](https://twitter.com/ConicFinance/status/1682524319518269440) all pools.**

The initial hack was yet another instance of the notorious read-only reentrancy vulnerability which has wreaked havoc on DeFi over the last year. [Sturdy Finance](https://rekt.news/sturdy-rekt/), [Midas Capital](https://rekt.news/midas-capital-rekt/) and [dForce Network](https://rekt.news/dforce-network-rekt/), amongst others, have all suffered from the issue in recent months.

Both attacks were frontrun, with the recipient of funds from the second incident (an [MEV bot](https://etherscan.io/address/0xd050e0a4838d74769228b49dff97241b4ef3805d)) [returning](https://etherscan.io/tx/0xf56f34a092d8864549052d8a1072e8477a4fb45382ec9549a25c63bb566630b4) 90% of their [profits](https://etherscan.io/tx/0xaf1535ea5bee7ccbc048eafd1fe0771c31cde51d065e6abc2c4aa2c1f9d264ff) (81 ETH) the following day.

**With the majority of lost funds (over 1700 ETH) still sitting in the [address](https://etherscan.io/address/0x3d32c5a2e592c7b17e16bddc87eab75f33ae3010) of the first attack’s frontrunner, there is still [hope for recovery](https://etherscan.io/tx/0x5cf6288c7940150e3624c3459f26f837109262002add2f89488b07b64b0ef3a8)…**

_…but given the address had previously been [labelled by Blocksec](https://twitter.com/BlockSecTeam/status/1682355195894976514) as “LadyPepe Token Exploiter”, we probably shouldn’t hold our breath._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[BlockSec](https://twitter.com/BlockSecTeam/status/1682356244299010049), [Conic Finance](https://medium.com/@ConicFinance/post-mortem-eth-and-crvusd-omnipool-exploits-c9c7fa213a3d)_

**The first attack exploited the common read-only reentrancy vulnerability in order to manipulate token prices, as discussed in many previous articles.**

In this case, the attack can be summed up with the [following TLDR](https://twitter.com/pcaversaccio/status/1682373814754111489) by pcaversaccio:

>TL;DR: Due to a read-only reentrancy vulnerability in the oracle contract `CurveLPOracleV2`, the attacker can reenter `rETH-f.totalSupply()` (and other tokens like steCRV) and thus can manipulate the prices accordingly. Thus, the attacker can withdraw more than deposited.

A more detailed breakdown can be found in Daniel Von Fange’s [thread](https://twitter.com/danielvf/status/1682496333540741121).

**[According](https://twitter.com/peckshield/status/1682354822899712001) to auditors Peckshield, the vulnerability was identified in the [audit](https://conic.finance/media/PeckShield-Audit-Report-ConicFinance.pdf), however a new oracle contract reintroduced the bug.**

>FWIW, our audit identifies a similar read-only reentrancy issue. However, the same issue is introduced in the newly introduced CurveLPOracleV2 contract, which was not part of the audit scope.

Conic dev [0xWicket](https://twitter.com/0xWicket/status/1682379983010791424) later clarified that the contract did have inbuilt reentrancy protection, however it wasn’t triggered due to a mix-up between ETH and WETH addresses.

>We are currently in the process of writing a post-mortem. The root cause of this being exploitable was our assumption that ETH was treated as address 0xeee... by Curve, while it uses the the WETH address for V2 pools. Our reentrancy protection failed to trigger because of that

Exploiter address (1st attack): **[0x8d67db0b205e32a5dd96145f022fa18aae7dc8aa](https://etherscan.io/address/0x8d67db0b205e32a5dd96145f022fa18aae7dc8aa)**

Over 1700 ETH (around $3.3M) was forwarded to a secondary address: [0x3d32c5a2e592c7b17e16bddc87eab75f33ae3010](https://etherscan.io/address/0x3d32c5a2e592c7b17e16bddc87eab75f33ae3010)

Exploit tx (1st attack): [0x8b74995d…](https://etherscan.io/tx/0x8b74995d1d61d3d7547575649136b8765acb22882960f0636941c44ec7bbe146)

Original failed tx (1st attack): [0x97a8315e…](https://etherscan.io/tx/0x97a8315e942dd180fb90a17b92f7dabd6e8a2e5b9fd5e4a95ee4049ff33d2f16)

Original exploiter address (1st attack): [0x10db234e02c3889d8e408c7084e8ce10892bdad7](https://etherscan.io/address/0x10db234e02c3889d8e408c7084e8ce10892bdad7)
---

**The second attack was somewhat simpler and far [less damaging](https://twitter.com/CurveCap/status/1682492113001275392), apart from to Conic’s reputation. The issue was described in Conic’s [post-mortem](https://medium.com/@ConicFinance/post-mortem-eth-and-crvusd-omnipool-exploits-c9c7fa213a3d) as a type of sandwich attack on imbalanced pools.**

The attack steps are as follows:

>Exchange crvUSD to USDC in the Curve pool
>
>Deposit crvUSD into Conic
>
>Exchange USDC to crvUSD in the Curve pool
>
>Withdraw from Conic
>
>Repeat steps above

The report goes on to explain that:

>The attacker would benefit from the exchanges in the Curve pool by exchanging at a favorable rate. While we did have some mechanism in place to ensure we did not interact with imbalanced Curve pools, the bounds that we had set were not tight enough and allowed the attacker to slowly drain funds from the pool.
>
>A total of approx. $934,000 was stolen from the crvUSD Omnipool, giving the attacker a profit of approx. $300,000.

Exploiter address: **[0xb6369f59fc24117b16742c9dfe064894d03b3b80](https://etherscan.io/address/0xb6369f59fc24117b16742c9dfe064894d03b3b80)**

Example hack tx: [0x37acd17a…](https://etherscan.io/tx/0x37acd17a80a5f95728459bfea85cb2e1f64b4c75cf4a4c8dcb61964e26860882)

Frontrunning bot (returned 81 ETH): [0xd050e0a4838d74769228b49dff97241b4ef3805d](https://etherscan.io/address/0xd050e0a4838d74769228b49dff97241b4ef3805d)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

For all the talk of the [Curve Wars](https://rekt.news/curve-wars/), the wider ecosystem feels Conic's pain.

The Curve team got involved in [warning users](https://twitter.com/CurveFinance/status/1682469750364950528) of the dangers, and even suggesting [safe havens](https://twitter.com/CurveFinance/status/1682673844081786880) for farmers.

Conic’s was one of the most hotly anticipated DeFi projects before launching earlier this year, and was seen by some [threadoors](https://twitter.com/adamscochran/status/1573068921397477376) as a contender for being the next cycle’s CVX/Yearn.

Pre-hack, [CNC](https://www.coingecko.com/en/coins/conic) was sitting at around $6. News of the initial incident caused a drop in price of around 35% with a further fall to just $1.72 following the second exploit. CNC has since settled at around $2.75, just below half of its pre-hack value.

**The [TVL chart](https://defillama.com/protocol/conic-finance) shows just how much damage Friday’s events have done, with less than a third of Conic’s pre-hack TVL remaining:**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/conic-tvl.png)

_Will such a promising protocol survive this double-blow?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
