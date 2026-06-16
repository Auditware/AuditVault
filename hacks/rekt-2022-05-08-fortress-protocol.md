---
tags:
  - blockchain/bsc
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - has/audit
  - vuln/governance/proposal-manipulation
  - impact/data-corruption/price-manipulation
  - trigger/governance-vote
  - trigger/price-manipulation
  - novelty/variant
title: "Fortress Protocol - REKT"
protocol: "[[Fortress Protocol]]"
date: 2022-05-08
loss_usd: 3000000
auditors:
  - "[[Hash0x]]"
  - "[[EtherAuthority]]"
source: "https://rekt.news/fortress-rekt"
excerpt: "Fortress is in ruins after $3M was stolen by an oracle manipulation and malicious governance act. The UI is paused, but the contracts remain live. Will Fortress's ecosystem bail out users for the lost"
genome:
  - "[[proposal-manipulation]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[governance-vote]]"
  - "[[trigger/price-manipulation]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[chainlink-round-completeness]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Fortress Protocol - REKT

> **Loss:** $3,000,000 | **Date:** 2022-05-08 | **Audited by:** Hash0x, EtherAuthority

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/fortress-header.png)

**[Fortress Protocol](https://fortress.loans/), the lending arm of [JetFuel Finance](https://jetfuel.finance/vaults) on BSC, was [pillaged for $3M](https://twitter.com/Fortressloans/status/1523495202115051520) yesterday.**

**Weak fortifications surrounding the project’s oracle and governance process allowed the invading hacker to pass a malicious proposal and manipulate the price of collateral.**

Though contracts remain live, the team have [paused the platform’s UI](https://twitter.com/Jetfuelfinance/status/1523555687468793856) and launched a [follow-up proposal](https://bsc.fortress.loans/vote/proposal/12) to repair the damage.

_However with $3M gone, will this leave Fortress in ruins?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [BlockSecTeam](https://twitter.com/BlockSecTeam/status/1523530484877209600), [Certik](https://twitter.com/certikalert/status/1523529765969444864)_

**The protocol’s price oracle was vulnerable to manipulation as the price submit() function is publicly callable.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/fortress-code.png)

Coupled with a [malicious proposal](https://bsc.fortress.loans/vote/proposal/11) to add FTS as collateral (with a factor of 700000000000000000), the attacker was able to drain all assets from the platform using just 100 FTS (~4.5$ at pre-hack prices) as collateral.

The attack was [funded](https://bscscan.com/tx/0xd253c7c22a5a526e6240d315f95d6b525828ae0632df7f711c363d1960c6a2cb) with ETH (on BSC), originally [sourced](https://etherscan.io/tx/0x1f1b43b6a56698af777c8c8b7e70eb77f10ff08bd8518c1685b9c19528e3daa5) from Tornado Cash on mainnet. The funds were then [swapped](https://etherscan.io/tx/0x1f1b43b6a56698af777c8c8b7e70eb77f10ff08bd8518c1685b9c19528e3daa5) for large quantities of FTS, which were used to reach quorum for the malicious proposal and as collateral.

Following the exploit, the attacker deposited a total of 1048 ETH ($2.6M) and 400k DAI into Tornado Cash.

**Oracle attack tx: [0x13d198…](https://bscscan.com/tx/0x13d19809b19ac512da6d110764caee75e2157ea62cb70937c8d9471afcb061bf)**

**Attacker’s address on [BSC](https://bscscan.com/address/0xA6AF2872176320015f8ddB2ba013B38Cb35d22Ad) and [ETH](https://etherscan.io/address/0xA6AF2872176320015f8ddB2ba013B38Cb35d22Ad): 
0xA6AF2872176320015f8ddB2ba013B38Cb35d22Ad**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**The project’s site lists [ChainLink](https://chain.link/) among its “collaboraters” (sic), however it seems that their oracle expertise was not part of the “collaboration”.**

Fortress Protocol was audited by both [Hash0x](https://fortress.loans/audit_hash0x.pdf) and [EtherAuthority](https://fortress.loans/audit_etherautherity.pdf), two new names on our leaderboard, neither of which picked up any oracle vulnerability in the code.

Although the attacker was able to pass quorum, their malicious governance proposal was active for 3 days. Why was the suspicious vote not addressed?

**Once again, we see that taking a vigilant role in governance is important, not just for the team but for all users.**

_Will the larger JetFuel Finance ecosystem bail out users for the lost funds?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
