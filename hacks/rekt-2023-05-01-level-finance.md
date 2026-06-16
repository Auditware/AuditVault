---
tags:
  - blockchain/bsc
  - sector/dex
  - sector/lending
  - has/audit
  - trigger/flash-loan
  - trigger/time-based/epoch-boundary
  - precondition/flash-loan-available
title: "Level Finance - REKT"
protocol: "[[Level Finance]]"
date: 2023-05-01
loss_usd: 1100000
auditors:
  - "[[Obelisk]]"
source: "https://rekt.news/level-finance-rekt"
excerpt: "Level Finance got levelled. $1.1M in referral rewards were robbed from the BSC-based perps platform yesterday. The attack was initially attempted over a week ago, but it seems nobody noticed. Could a "
genome:
  - "[[flash-loan]]"
  - "[[epoch-boundary]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
---
# Level Finance - REKT

> **Loss:** $1,100,000 | **Date:** 2023-05-01 | **Audited by:** Obelisk

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/level-header.png)

_[Level Finance](https://twitter.com/Level__Finance) got levelled._

**Yesterday, $1.1M in referral rewards were robbed from the BSC-based perps platform.**

The alarm was [raised by definalist](https://twitter.com/definalist/status/1653110385552289792) (whilst the attack was still ongoing) and [confirmed](https://twitter.com/Level__Finance/status/1653140756540825638) two hours later by the Level Finance team.

**Luckily, the losses were contained to the project’s referral programme, with Treasury funds and LP both safe.**

The hacker dumping LVL tokens for BNB initially crashed the price by 65%, though this has mostly recovered since.

The attack was initially attempted over a week ago, but it seems nobody noticed.

_Could a warning have saved Level?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Peckshield](https://twitter.com/peckshield/status/1653149493133729794), [BlockSec](https://twitter.com/BlockSecTeam/status/1653267431127920641)_

**Level Finance’s LevelReferralControllerV2 contract contained a bug which allowed for repeated referral reward claims to be processed within the same epoch.**

The exploiter prepared the attack by creating many referrals and using flash loans to make swaps, thereby increasing their reward tier.

**The claimMultiple function does not contain a check that the claim’s epoch is not being reused:**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/level-code.png)

Exploiter's address: **[0x70319d1c09e1373fc7b10403c852909e5b20a9d5](https://bscscan.com/address/0x70319d1c09e1373fc7b10403c852909e5b20a9d5)**

Example tx: [0xe1f25704…](https://bscscan.com/tx/0xe1f257041872c075cbe6a1212827bc346df3def6d01a07914e4006ec43027165)

LevelReferralControllerV2 contract: [0x977087422C008233615b572fBC3F209Ed300063a](https://bscscan.com/address/0x977087422C008233615b572fBC3F209Ed300063a)

**The project was audited by [Quantstamp](https://certificate.quantstamp.com/full/level-finance/929d1708-a464-476d-86f3-7d7942faa4d2/index.html) and [Obelisk](https://obeliskauditing.com/audits/level-finance-core?openPdf=true), who both examined [LevelReferralControllerV2](https://github.com/level-fi/level-core-contracts/blob/master/src/referral/LevelReferralControllerV2.sol) as part of the project’s [Core contracts](https://github.com/level-fi/level-core-contracts) without spotting the bug.**

**_UPDATE 09/05/2023 - Quantstamp contacted rekt.news stating that the vulnerability was introduced after their audit. They provided the following statement via DM:_**

>The vulnerability was included in an upgrade done on April 18 ([bscscan.com/tx/0xe0a8e635f…](https://bscscan.com/tx/0xe0a8e635f4778f6cc935873d8c17a92979eb9adfa77b249dec1d4a15b3e82909)) that upgraded the proxy of LevelReferralControllerV2 ([bscscan.com/address/0x9770…](https://bscscan.com/address/0x977087422C008233615b572fBC3F209Ed300063a)) to the vulnerable implementation ([bscscan.com/address/0x9f00…](https://bscscan.com/address/0x9f00fbd6c095d2c542687ed5afb68d9c3fb2f464#code)).
>
>This code is different to the commit audited by Quantstamp as stated in the audit report ([certificate.quantstamp.com/full/level-fin…](https://certificate.quantstamp.com/full/level-finance/929d1708-a464-476d-86f3-7d7942faa4d2/index.html)). The source code for the vulnerable implementation in question is not committed in the official public repository of Level Finance in GitHub ([github.com/level-fi/level…](https://github.com/level-fi/level-core-contracts)).

In total, 214k LVL tokens were drained by the exploiter, who swapped them for 3,345 BNB, worth approximately $1.1M at the time of writing. The funds currently remain in the attacker’s address.

The sell-off of tokens caused the [LVL price](https://www.coingecko.com/en/coins/level) to drop from $8.42 to a low of $2.93 (-65%), though this recovered substantially following the attack.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

As mentioned by [BlockSec](https://twitter.com/BlockSecTeam/status/1653267431127920641), the week that passed between the hacker’s first attempts and their eventual successful exploit demonstrates the potential of on-chain monitoring systems.

When malicious contracts are created containing code designed to interact with DeFi protocols in unconventional ways, tools like [Forta](https://forta.org/), [Sentinel](https://docs.openzeppelin.com/defender/sentinel) and [Spotter](https://blog.pessimistic.io/spotters-almanac-4c594fd834d1) are able to recognise the actions as suspicious, and alert teams accordingly.

_However, few incidents have so much warning._

**DeFi protocols can go from SAFU to rekt from one block to the next.**

Usually, though, an attack contract must be deployed before a hack can be executed. And even a few minutes' warning could be useful for more centralised protocols with the ability to pause contracts.

If not, though, BlockSec’s own [whitehat frontrunning system](https://blocksecteam.medium.com/securing-web3-through-proactive-threat-prevention-e9c6e0319531) has intervened in a number of cases, saving funds and thwarting the efforts of hackers.

**Perhaps a future of on-chain sentinels protecting fully decentralised and self-executing code seems a long way off for now…**

_…but who knows what the future will bring?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
