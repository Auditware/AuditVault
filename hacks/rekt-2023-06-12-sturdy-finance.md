---
tags:
  - blockchain/ethereum
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/staking
  - vuln/reentrancy/read-only
  - vuln/reentrancy/single-function
  - impact/data-corruption/price-manipulation
  - impact/mev/frontrun
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
title: "Sturdy Finance - REKT"
protocol: "[[Sturdy Finance]]"
date: 2023-06-12
loss_usd: 800000
auditors:
source: "https://rekt.news/sturdy-rekt"
excerpt: "Not so Sturdy, after all. Sturdy Finance has lost $800k to a price manipulation exploit made possible by a well-known read-only reentrancy vulnerability. Why is this issue still causing problems?"
genome:
  - "[[read-only]]"
  - "[[single-function]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[frontrun]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
---
# Sturdy Finance - REKT

> **Loss:** $800,000 | **Date:** 2023-06-12 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/sturdy-header.png)

_Not so Sturdy, after all._

**[Sturdy Finance](https://twitter.com/SturdyFinance/) has lost ~$800k to a price manipulation exploit.**

The Ethereum-based lending protocol offers leverage for yield farmers who deposit staked assets as collateral.

Shortly after the [alarm was raised](https://twitter.com/AnciliaInc/status/1668065601028505602), the Sturdy Finance team [acknowledged](https://twitter.com/SturdyFinance/status/1668080627030315009) the attack:

>We are aware of the reported exploit of the Sturdy protocol. All markets have been paused; no additional funds are at risk and no user actions are required at this time.

**As noted by [Ancilia](https://twitter.com/AnciliaInc/status/1668081008615325698), the attack [vector](https://chainsecurity.com/curve-lp-oracle-manipulation-post-mortem/) is similar to exploits on [Midas Capital](https://rekt.news/midas-capital-rekt/) and [dForce Network](https://rekt.news/dforce-network-rekt/).**

_Is this issue really still causing problems?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Ancilia](https://twitter.com/AnciliaInc/status/1668081008615325698), [BlockSec](https://twitter.com/BlockSecTeam/status/1668084629654638592)_

**The attack used a flash loan to target the (unfortunately named) SturdyOracle and return a manipulated price of collateral token (B-stETH-STABLE).**

[BlockSec](https://twitter.com/BlockSecTeam/status/1668084629654638592) provided the following step-by-step:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/sturdy-steps.png)

Attacker’s Address: **[0x1e8419e724d51e87f78e222d935fbbdeb631a08b](https://etherscan.io/address/0x1e8419e724d51e87f78e222d935fbbdeb631a08b)**

Attack contract (with front-running [protection](https://twitter.com/yannickcrypto/status/1668072276548370433) built in): [0x0b09c86260c12294e3b967f0d523b4b2bcdfbeab](https://etherscan.io/address/0x0b09c86260c12294e3b967f0d523b4b2bcdfbeab)

Attack Tx: [0xeb87ebc0…](https://etherscan.io/tx/0xeb87ebc0a18aca7d2a9ffcabf61aa69c9e8d3c6efade9e2303f8857717fb9eb7)

**The 442 ETH ($800k) profit was immediately deposited into Tornado Cash, completing the laundering just 20 minutes after being [funded](https://etherscan.io/tx/0x2e8767269feaa14c0de59bbb29ecd1b375a511ccac57c9b01a471326f1af9bb8) from the same source.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**This read-only reentrancy vulnerability has been seen in a number of [attacks](https://twitter.com/pcaversaccio/status/1668200720913293313) over the last year.**

A February [post](https://forum.balancer.fi/t/reentrancy-vulnerability-scope-expanded/4345) on Balancer forums noted how some Balancer pools are also susceptible to the attack vector, with the specific pools targeted in today’s attack listed as vulnerable.

With three audits (from [Certik](https://skynet.certik.com/projects/sturdy), [Quantstamp](https://certificate.quantstamp.com/full/sturdy.pdf) and [Code4rena](https://code4rena.com/reports/2022-05-sturdy)), and a well-known exploit type, it is surprising that these pools were left open to attack.

_**EDIT 02/06/2024:** As pointed out by [Quantstamp](https://twitter.com/Quantstamp/status/1752397356371149209)
, the vulnerable version of the LendingPool contract did not fall within the audit scope. The leaderboard has been updated accordingly._

No wonder many are [discussing](https://twitter.com/delitzer/status/1661755779240841222) the need for oracle-free lending systems, which is becoming a [hot topic](https://twitter.com/euler_mab/status/1667190907161182210). Though, certain solutions may eventually need [oracles of their own](https://twitter.com/euler_mab/status/1667191013671305216)…

_Let’s hope that, in the future, we’ll be building on Sturdy-er foundations._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
