---
tags:
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/token
  - vuln/reentrancy/read-only
  - vuln/reentrancy/single-function
  - trigger/flash-loan
  - trigger/governance-vote
  - precondition/flash-loan-available
  - novelty/known-pattern
title: "Onyx Protocol - REKT"
protocol: "[[Onyx Protocol]]"
date: 2023-11-01
loss_usd: 2100000
auditors:
source: "https://rekt.news/onyx-protocol-rekt"
excerpt: "Compound fork Onyx Protocol lost $2.1M to a high-profile, well-known vulnerability on Tuesday. Many protocols have fallen victim to repeated vulnerabilities so far this year. Are devs paying attention"
genome:
  - "[[read-only]]"
  - "[[single-function]]"
  - "[[flash-loan]]"
  - "[[governance-vote]]"
  - "[[flash-loan-available]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
---
# Onyx Protocol - REKT

> **Loss:** $2,100,000 | **Date:** 2023-11-01 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/onyx-header.png)

_Another total fork-up._

**[Onyx Protocol](https://twitter.com/OnyxProtocol), a Compound Finance fork, lost $2.1M on Tuesday to a high-profile, well-known vulnerability.**

The exact same attack vector has hit two other forks, [Hundred Finance](https://rekt.news/hundred-rekt2/) and [Midas Capital](https://rekt.news/midas-rekt2/) (_themselves both repeat [leaderboard](https://rekt.news/leaderboard/) entrants_), already this year, tipping the total lost to this bug over the $10M mark.

Peckshield, as ever, [warned](https://twitter.com/peckshield/status/1719656987124965677) Onyx to “_take a look_”. However, no official response came for almost three hours, when a team member [acknowledged](https://twitter.com/al_onyxprotocol/status/1719698066020733063) the loss.

In the meanwhile, and while TG mods were [urging](https://t.me/OnyxOrg/52458) users “_Please don’t fud_” the protocol was hit by a repeat [attack](https://etherscan.io/tx/0x27a3788d504af542681436bfdecf1823f7a8a691d04309ad33e6d3825e899746), though for substantially [less profit](https://twitter.com/PeckShieldAlert/status/1719665280715231717) ($~62k).

Many protocols have fallen victim to repeated exploits of identical vulnerabilities over the course of the year, with read-only reentrancy also claiming multiple victims including [Conic](https://rekt.news/conic-finance-rekt/), [Sturdy](https://rekt.news/sturdy-rekt/), [EraLend](https://rekt.news/eralend-rekt/) and [Midas](https://rekt.news/midas-capital-rekt/).

_Are the devs paying attention?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Peckshield](https://twitter.com/peckshield/status/1719664641109037551), [BlockSec](https://twitter.com/Phalcon_xyz/status/1719697319824851051)_

**The exploit was made possible due to a [known vulnerability](https://www.comp.xyz/t/hundred-finance-exploit-and-compound-v2/4266) of Compound v2 code. Under certain conditions, a rounding error allows an attacker to manipulate empty markets in order to drain liquidity from across the protocol.**

In Onyx’ case, governance had recently voted through [Proposal 22](https://onyx.org/governance/proposal/22) to add a lending market for memecoin PEPE to the protocol.

The ‘empty market attack’ involves taking a flash loan which is swapped, in this case, for PEPE. Then, by minting a small number of shares (oPEPE) and donating a large amount of PEPE to the pool, vastly inflating the price of oPEPE for use as collateral on Onyx.

Other assets can then be borrowed against the overvalued oPEPE, draining the protocol’s liquidity. The rounding error is then exploited to withdraw the donated funds, and the flash loan is repaid.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/onyx-code.png)

Exploiter address: **[0x085bdff2c522e8637d4154039db8746bb8642bff](https://etherscan.io/address/0x085bdff2c522e8637d4154039db8746bb8642bff)**

Attack tx: [0xf7c21600…](https://etherscan.io/tx/0xf7c21600452939a81b599017ee24ee0dfd92aaaccd0a55d02819a7658a6ef635)

Repeat exploiter address: [0x5083956303a145f70ba9f3d80c5e6cb5ac842706](https://etherscan.io/address/0x5083956303a145f70ba9f3d80c5e6cb5ac842706)

Repeat-attack tx: [0x27a3788d…](https://etherscan.io/tx/0x27a3788d504af542681436bfdecf1823f7a8a691d04309ad33e6d3825e899746)

**The 1164 ETH ($2.1M) of profits were sent on to an [intermediary address](https://etherscan.io/address/0x4c9c8661243e9e9a15a35b8873317eb881330c98) before 1140 ETH were [deposited](https://etherscan.io/advanced-filter?fadd=0x4c9c8661243e9e9a15a35b8873317eb881330c98&tadd=0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b&txntype=0&qt=1) into Tornado Cash.**

_The [remaining 24 ETH](https://t.me/investigations/68) were sent to on-chain panhandlers, prompting a follow-up stream of [input data messages](https://etherscan.io/idm?addresses=0x4c9c8661243e9e9a15a35b8873317eb881330c98) to the hacker’s address, begging for further scraps._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

Onyx Protocol was [audited by Certik](https://skynet.certik.com/projects/onyx-protocol), however the viability of this vulnerability is ultimately determined by the conditions within the individual market, rather than the codebase in itself.

**Empty markets in Comp v2 code are a known issue; the launch of new markets should be treated especially carefully by project teams.**

The [discussion](https://www.comp.xyz/t/hundred-finance-exploit-and-compound-v2/4266) following the (second) Hundred Finance hack references Hexagate’s [recommendations](https://twitter.com/hexagate_/status/1650177766187323394) for launching potentially vulnerable markets (“_markets with low total supply and a non-zero collateral factor (CF)_”):

>we recommend any Compound V2 fork, when launching new markets to mint some cTokens and burn them to make sure the total supply never goes to zero. When the total supply goes to zero, the protocol becomes vulnerable and this strategy mitigates this situation.
>
>That means that when listing a new collateral token, first set its collateral factor to zero, set in the Comptroller, mint some cTokens, burn them and then change the collateral factor to the desired factor.

_Compound itself has many eyes scouring all governance proposals, though the [occasional blunder](https://rekt.news/overcompensated/) does [seem to](https://rekt.news/compound-rekt/) slip [through](https://rekt.news/compound-errors/)…_

But with just 11 wallets voting on Proposal 22 (_and over 97% of votes coming from a single address_), perhaps Onyx doesn’t have the same level of community vigilance over its lending markets.

**For teams working with forks, devs must be sure to stay on top of the security landscape, to avoid getting rekt by replicated vulnerabilities.**

_Blackhats are certainly keeping up-to-date._

**Onyx’ proposed [compensation plan](https://community.onyx.org/t/the-onyxprotocol-experienced-an-exploit/1125/5) intends to refund victims by selling native tokens from the treasury, while DAO contributors' salaries will be paused until further notice.**

While superficially sounding like a fair and selfless way to make users whole, the plan has the potential to trigger a death sprial on XCN, whilst the team’s incentives grow increasingly misaligned…

_What could go wrong?_
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
