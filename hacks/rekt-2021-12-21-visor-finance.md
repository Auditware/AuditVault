---
tags:
  - sector/dex
  - sector/governance
  - sector/privacy
  - sector/staking
  - sector/token
  - vuln/oracle/spot-price
  - impact/privilege-escalation/ownership-transfer
  - novelty/known-pattern
title: "Visor Finance - REKT"
protocol: "[[Visor Finance]]"
date: 2021-12-21
loss_usd: 8200000
auditors:
source: "https://rekt.news/visor-finance-rekt"
excerpt: "It is the season of giving, and Visor Finance is going all in. Visor allowed an anonymous actor to mint $8.2M in VISR."
genome:
  - "[[spot-price]]"
  - "[[ownership-transfer]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# Visor Finance - REKT

> **Loss:** $8,200,000 | **Date:** 2021-12-21 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/12/visor-header.png)
**It is the season of giving, and Visor Finance is going all in.**

[Visor](https://www.visor.finance/) allowed certain contracts to mint unlimited rewards.

Yesterday an anonymous actor took advantage of this gift, and withdrew 8.8M VISR from the platform, worth $8.2M at pre-hack prices.

**However, the hacker suffered when dumping VISR via Uniswap’s VISR-ETH pool.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/12/visor-priceimpact.png)

**-87%**

>rekt.

Back in June, Visor, a liquidity management protocol for [Uni v3](https://rekt.news/uniswap-v3-lp-rekt/), downplayed the loss of $500k (of its then $3M TVL) in a [security breach.](https://visorfinance.medium.com/visor-beta-incident-report-1b2521b9266)

Then, last month, the project fell victim to what the Visor team defensively [claimed](https://twitter.com/VisorFinance/status/1464574917056385025) was “_economic arbitrage_”. 

**Does “_[reliance on spot prices for issuing shares](https://twitter.com/Mudit__Gupta/status/1464657484367339527)_” not count as a smart contract bug?…**

_What was it this time?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**Hacker’s address:** [0x8efab89b497b887cdaa2fb08ff71e4b3827774b2](https://etherscan.io/address/0x8efab89b497b887cdaa2fb08ff71e4b3827774b2)

[Funded](https://etherscan.io/tx/0x660b97542ade1e533bd5e098dbe53da26b63d53a3c2c4dd46b481a91bd075ead) by Tornado Cash a few mins before the [execution](https://etherscan.io/tx/0x69272d8c84d67d1da2f6425b339192fa472898dce936f24818fda415c1c1ff3f) of the attack.

Due to a vulnerable _require()_ check in the [vVISR Rewards Contract](https://etherscan.io/address/0xc9f27a50f82571c1c8423a42970613b8dbda14ef#code)’s _deposit()_ function, the hacker was able to mint unlimited shares using their own [contract.](https://etherscan.io/address/0x10c509aa9ab291c76c45414e7cdbd375e1d5ace8)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/12/visor-code.png)

**As long as the hacker passes their own contract as “_from_” and the contract has an _Owner()_ method of _msg.sender_, then they can mint as many shares as they want to any address using _vvisr.mint()_.**

_Credit: [@storming0x](https://twitter.com/storming0x/status/1473321779250802693)_

**The attacker [transferred ownership](https://etherscan.io/tx/0x27f2210536553392cf180c0b37055b3dc92094a5d585d7d2a51f790c9145e47c) of the contract to its own address, before executing the exploit transaction, [minting](https://etherscan.io/tx/0x69272d8c84d67d1da2f6425b339192fa472898dce936f24818fda415c1c1ff3f) 195k vVISR tokens.**

These were then [burned](https://etherscan.io/tx/0x6eabef1bf310a1361041d97897c192581cd9870f6a39040cd24d7de2335b4546) for 8.8M VISR before being swapped via Uniswap v2 for ETH and washed via Tornado Cash in [this](https://etherscan.io/tx/0x0e16210218ecc487a35b9ff48fe3d9f3e9b0f50330f9e7805e38135732b85270) and 6 subsequent transactions totalling 113 ETH ($450k) so far.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**In their [official post-mortem](https://medium.com/visorfinance/post-mortem-for-vvisr-staking-contract-exploit-and-upcoming-migration-7920e1dee55a), Visor has proposed a [token migration](https://twitter.com/VisorFinance/status/1473317327601078279) based on a snapshot before the exploit.**

They also state that:

“_We are engaged with both Quantstamp and ConsenSys Diligence for December and January [audits](https://docs.visor.finance/learn/audits) and this new staking contract will be included._”

As the users are to be refunded, it seems the only damage done is to the reputation of the Visor team.

**At least they are gaining experience in post-hack PR…**

As [BlockSec](https://twitter.com/BlockSecTeam/status/1473343144620015619) wrote on Twitter:

>“Since last time an attack was called arbitrage, can we call it an airdrop this time?”

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
