---
tags:
  - blockchain/arbitrum
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/privacy
  - sector/stable
  - sector/staking
  - sector/token
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Gamma Strategies - REKT"
protocol: "[[Gamma Strategies]]"
date: 2024-01-04
loss_usd: 4500000
auditors:
source: "https://rekt.news/gamma-strategies-rekt"
excerpt: "Gamma Strategies, an Arbitrum-based concentrated liquidity management protocol, was exploited for at least $4.5M, earlier today. Recently we wondered, 'Can we do better this year?'. So far, it’s not l"
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# Gamma Strategies - REKT

> **Loss:** $4,500,000 | **Date:** 2024-01-04 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/gamma-header.png)

_Bold strategy, Gamma, let’s see if it pays off…_

**Gamma Strategies, an Arbitrum-based concentrated liquidity management protocol, was exploited for at least $4.5M, earlier today.**

Security researchers [initially](https://twitter.com/PeckShieldAlert/status/1742753372334399513)  [thought](https://twitter.com/Phalcon_xyz/status/1742764570236608675) CryptoAlgebra was the affected protocol, before the victim was later [correctly identified](https://twitter.com/shoucccc/status/1742765618984829326) as Gamma.

**The attack [began](https://arbiscan.io/tx/0x025cf2858723369d606ee3abbc4ec01eab064a97cc9ec578bf91c6908679be75) around 03:30 UTC, with the alarm quickly [raised](https://twitter.com/PeckShieldAlert/status/1742753372334399513) and Gamma [acknowledging](https://twitter.com/GammaStrategies/status/1742772630699364759) the hack approximately an hour and a half after it commenced.**

A follow-up [announcement](https://twitter.com/GammaStrategies/status/1742839968240980408) informed users that the team had paused deposits to mitigate further attacks:

>All public vaults/hypervisors have had deposits shut down. You may withdraw your funds if need be. Our vaults will continue to be managed normally for now, but deposits are currently shut down until we identify and mitigate the problem.

**When [Orbit lost over $80M](https://rekt.news/orbit-bridge-rekt/) at New Year, we asked:**

>Can we do better this year?

_So far, it’s [not looking good](https://twitter.com/pcaversaccio/status/1742793977709899909)…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Gamma Strategies](https://twitter.com/GammaStrategies/status/1742882840247779453), [CharlesWang](https://twitter.com/CharlesWangP/status/1742855857178587387), [PeckShield](https://twitter.com/PeckShieldAlert/status/1742858988499427610/)_

_Gamma published a [thread](https://twitter.com/GammaStrategies/status/1742882840247779453) outlining the preliminary cause of the exploit. However, a full post-mortem is forthcoming. Paladin’s CharlesWang [outlined](https://twitter.com/CharlesWangP/status/1742855857178587387) a potentially similar attack vector._

**Flash loans were used to manipulate the value of deposits, allowing the attacker to mint an inflated number of LP tokens.**

Despite four desposit protection measures, the attack was viable due to the broad ranges in allowed price changes within certain vaults. Deposits remain paused on Gamma vaults, as it is during deposits that the attack vector arises.

As Gamma [explained](https://twitter.com/GammaStrategies/status/1742882843607416860):

>The main issue is with the settings we placed on (2) the price change threshold.
>
>It was placed too high allowing for up 50-200% price change on certain LST and stablecoin vaults. This allowed the attacker to manipulate the price up to the price change threshold and mint a disproportionately high number of LP tokens.

Peckshield [provided](https://twitter.com/PeckShieldAlert/status/1742858988499427610/) an attack flow:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/gamma-flow.png)

Attacker address ([ETH](https://etherscan.io/address/0x5351536145610aa448a8bf85ba97c71caf31909c), [ARB](https://arbiscan.io/address/0x5351536145610aa448a8bf85ba97c71caf31909c)): **0x5351536145610aa448a8bf85ba97c71caf31909c**

Attack contract 1: [0x4b57adc00ac38f74506d29fc4080e3dc65b78a69](https://arbiscan.io/address/0x4b57adc00ac38f74506d29fc4080e3dc65b78a69)

Example attack tx: [0x025cf285…](https://arbiscan.io/tx/0x025cf2858723369d606ee3abbc4ec01eab064a97cc9ec578bf91c6908679be75)

The majority of funds were bridged back to the hacker’s [Ethereum address](https://etherscan.io/address/0x5351536145610aa448a8bf85ba97c71caf31909c). USDT was then swapped out for ETH for a total of 1535 ETH ($3.4M). Approximately $1.1M of DAI and gDAI remains on [Arbitrum](https://arbiscan.io/address/0x5351536145610aa448a8bf85ba97c71caf31909c), however total losses to Gamma may have been [higher](https://twitter.com/itspublu/status/1742788866883363041).

_The attacker was [funded](https://etherscan.io/tx/0x9d82ff833fd56004d046a90658313a811f6f4aacd66d5326ccc2bdd993ecd251) via Tornado Cash two and a half hours before the attack began._

The team has [contacted](https://etherscan.io/tx/0x293698c1ab8b7c411d17aff9176c60ebafbeddefe557ff80f8dddd50c77e2cc2) the attacker on-chain, seemingly hoping for a whitehat. But the 1000 ETH [deposited](https://etherscan.io/advanced-filter?fadd=0x5351536145610aa448a8bf85ba97c71caf31909c&tadd=0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b&qt=1) into Tornado Cash doesn’t paint an optimistic picture.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_Collateral damage threatened a number of other projects…_

First, Crypto Algebra suffered reputation-wise from the initial mis-labeling, then [other](https://twitter.com/Eclipsefi/status/1742767159087112319)  [protocols](https://twitter.com/stellaxyz_/status/1742780708698124472) paused their contracts out of an abundance of caution. DEXs [Camelot](https://twitter.com/CamelotDEX/status/1742775130667831482) and [Quickswap](https://twitter.com/QuickswapDEX/status/1742785790856278221) were also keen to point out that the issue was not with their own code.

**However, [BlockSec](https://twitter.com/Phalcon_xyz/status/1742887316014891069) did note a series of smaller scale attacks on similar protocol [Dyson Money](https://twitter.com/dyson_money/status/1742895378964324812).**
---

_Gamma Strategies has a somewhat chequered past._

**Before rebranding, the protocol then known as Visor Finance suffered three incidents in 2021 alone.**

In June they defended the [loss of $500k](https://visorfinance.medium.com/visor-beta-incident-report-1b2521b9266) via a privileged function as “_[not a rug](https://twitter.com/GammaStrategies/status/1406261211000344576)_”, then in November they [downplayed](https://twitter.com/GammaStrategies/status/1464574917056385025) another [hack](https://twitter.com/Mudit__Gupta/status/1464657484367339527) as “_economic arbitrage_”.

December 2021’s [loss of $8.2M](https://rekt.news/visor-finance-rekt/) to an infinite mint bug seems to have been the nail in Visor’s coffin, with the rebrand and token migration [announced](https://medium.com/gamma-strategies/visor-merges-with-gamma-a-re-org-focusing-on-security-and-performance-b4deaf67e273) two days later.

**However, it bears mentioning that Gamma has had no issues since the rebrand, with [apparently](https://t.me/lobsters_chat/469430) “_no original developers or founders remaining from the project_”.**

The protocol has undergone [three audits](https://docs.gamma.xyz/gamma/learn/audits), from Consensys Diligence ([March 2022](https://github.com/GammaStrategies/hypervisor/blob/master/audits/ConsenSys-Diligence-Audit-28-03-22.pdf)), Arbitrary Execution ([March 2022](https://github.com/GammaStrategies/hypervisor/blob/master/audits/AE_Gamma_audit_09_03_22.pdf)), and Certik ([July 2021](https://github.com/GammaStrategies/hypervisor/blob/master/audits/REP-Hypervisor-2021-07-07.pdf)), but given that the vulnerability was due to the configuration of individual pool’s price change tolerances, the bug is likely out of scope.

**As we press on into 2024, it seems the [constant stream](https://rekt.news/leaderboard/) of hacks and exploits shows no sign of slowing down.**

And if we do see a new bull run, [at this rate](https://twitter.com/PaulFrambot/status/1742822921507049645) it will surely eclipse the madness of last time.

_Stay safe out there…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
