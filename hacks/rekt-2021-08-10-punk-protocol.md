---
tags:
  - sector/dex
  - sector/launchpad
  - sector/privacy
  - sector/stable
  - vuln/access-control/missing-modifier
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
  - novelty/variant
title: "Punk Protocol - REKT"
protocol: "[[Punk Protocol]]"
date: 2021-08-10
loss_usd: 8950000
auditors:
source: "https://rekt.news/punkprotocol-rekt"
excerpt: "Punk is dead. On Aug 10th, Punk Protocol was hacked for $8.95M, ~$5M of which was later returned."
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-freshness]]"
---
# Punk Protocol - REKT

> **Loss:** $8,950,000 | **Date:** 2021-08-10 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/punk-header.png)

**Punk _is_ dead.**

On Aug 10th, [Punk Protocol](https://punk.finance/) was hacked for $8.95M, ~$5M of which was later returned.

The platform planned to offer a DeFi annuity scheme backed by ETH, WBTC and stablecoins.

_Because there’s nothing more “Punk” than a pension plan._

**Luckily, a whitehat was able to frontrun the transactions and return over half of the funds.** 

_But not without taking a million dollars for themselves._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/punk-investigates.png)

**The project planned to use a [Fair Launch](https://medium.com/punkprotocol/introducing-punk-protocol-fair-launch-be46ccbc8700) to bring  $3M of deposits into 3 stablecoin pools: USDC, DAI and USDT.**

The [Punk post-mortem](https://medium.com/punkprotocol/punk-finance-fair-launch-incident-report-984d9e340eb) details the vulnerability that led to the attack, and describes the root cause as a missing Modifier in the **initialize()** function within the [CompoundModel code](https://github.com/PunkFinance/punk.protocol/blob/master/contracts/models/CompoundModel.sol).

The hacker used **delegateCall()** to replace what should have been the protocol’s **forgeAddress** with their own [malicious contract](https://etherscan.io/address/0x1695ce70da4521cb94dea036e6ebcf1e8a073ee6), as a parameter of the CompoundModel’s **initialize()** function.

The lack of an “initializer” Modifier meant that the manipulated function was executed despite being associated with an unknown (and in this case malicious) contract.

With the contract address now updated, the attacker was then able to call **withdrawToForge**, sending the assets controlled by the CompoundModel directly to the malicious contract, and into their [wallet.](https://etherscan.io/txs?a=0x1d5a56402425c1099497c1ad715a6b56aaccb72b)

Although the withdrawal mechanisms are protected by the **OnlyForge** Modifier, the **initialize()** function had already defined the malicious contract as the **forgeAddress**, and as such **OnlyForge** did not detect any abnormality.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/punk-withdrawforge.png)

The stolen USDC was [swapped](https://etherscan.io/tx/0x60c0757b82e82c9bb3e658d2d5a49e94630d04eb1bd735077ffed4e60e2403b5) to ETH via 1inch and then sent to TornadoCash in [transactions](https://etherscan.io/tx/0x4dc506ec5e9de2bb4053de7fd6054176a51da5408752265c9c3058b53778718b) of 100 ETH each. The other assets were not swapped due to the whitehat intercepting them. 

The hacker’s plan only paid off for one of the three pools however, as the owner of a frontrunning bot decided to put on their white hat upon noticing the transactions.

The saviour made their motives clear via [tx input data](https://etherscan.io/tx/0x4c8072a57869a908688795356777270a77f56ae47d8f1d869be0d25e807e03b1), and negotiations began via email.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/punk-frontran.png)

**Original attack tx:**[0x7604c7dd6e9bcdba8bac277f1f8e7c1e4c6bb57afd4ddf6a16f629e8495a0281](https://etherscan.io/tx/0x7604c7dd6e9bcdba8bac277f1f8e7c1e4c6bb57afd4ddf6a16f629e8495a0281)

**Whitehat frontrun tx:** [0x597d11c05563611cb4ad4ed4c57ca53bbe3b7d3fefc37d1ef0724ad58904742b](https://etherscan.io/tx/0x597d11c05563611cb4ad4ed4c57ca53bbe3b7d3fefc37d1ef0724ad58904742b)

**However, the whitehat didn’t manage to stop all the funds from reaching the attacker:**

>Unfortunately, it looks like my frontrun was not perfect, as I did end up sending $3M USDC to the original hacker. Rewriting txs can be tricky.

Following a [brief exchange](https://medium.com/punkprotocol/punk-finance-fair-launch-incident-report-984d9e340eb) between the two, the Punk team managed to convince the whitehat that the incident had not been an inside job.
 
A bounty of $1M was decided by the protocol’s anonymous ally and after a halfhearted attempt to negotiate, the team eventually agreed, and the remaining ~$5M was returned.

**Approx $1.95M DAI:** [0x008dd92f8bcfcee400aed26d13495fbfc8351f9b21289792fc2bb9e771668147](https://etherscan.io/tx/0x008dd92f8bcfcee400aed26d13495fbfc8351f9b21289792fc2bb9e771668147)

**Approx $3M USDT:** [0xace7c07695ec1bbf917486c3c81ee7de79c04e0309d4f6a149688463e6f83247](https://etherscan.io/tx/0xace7c07695ec1bbf917486c3c81ee7de79c04e0309d4f6a149688463e6f83247)

Punk Protocol states that all [recovered funds](https://etherscan.io/address/0xec36e96739b0fe73f5d078952850d1fc608e7652) will go towards compensation efforts for their users, and that they will release an update within the next few days.

The Punk team is also still [hoping](https://twitter.com/PunkProtocol/status/1425391858524426242) for a change of heart from their attacker, although any amount of refund made would be insignificant compared to the previous day's events at [Poly Network.](https://www.rekt.news/polynetwork-rekt/)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**Is a white hat white if they refuse to return part of the money they save?** 

Although the anonymous actor only kept 16% of what was stolen, it was still worth $1M when they forced the deal onto Punk Protocol.

Something is better than nothing, and the Punk team have little reason to be angry at the whitehat, but that money could have gone back to its original owners...

_Anti-heroes are everywhere in DeFi. It's white hat by day, and black by night._

Security auditor salaries are nothing compared to what they can earn by using their skills for themselves, and they're given the first and best opportunity to do so.

**Whitehats set their own wages, while security auditors take their salaries and the blame.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/punk-bollocks-tilit-noise.png)
