---
tags:
  - sector/dex
  - sector/governance
  - sector/stable
  - sector/vault
title: "TempleDAO - REKT"
protocol: "[[Templedao]]"
date: 2022-10-11
loss_usd: 2300000
auditors:
source: "https://rekt.news/templedao-rekt"
excerpt: "TempleDAO’s STAX was hacked for approximately $2.3M worth of LP tokens. The vulnerable contract had been live for four months. Why did it take so long to be exploited?"
genome:
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# TempleDAO - REKT

> **Loss:** $2,300,000 | **Date:** 2022-10-11 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/10/temple-header.png)

**TempleDAO’s STAX, was hacked yesterday for approximately $2.3M worth of LP tokens.**

  

TempleDAO launched as one of many OHM-forks in the run-up to last year’s market top, before pivoting to stablecoin farm when the Olympus model crumbled.

  

Temple’s current focus is on yield for FRAX3CRV via Convex, and STAX forms part of their “[flywheel system](https://templedao.medium.com/the-temple-flywheel-part-ii-4ef4846b8fa1)” as “_a reward boosting liquidity layer for the FRAX/TEMPLE gauge_”.

  

**Despite initially establishing a cult-like following, the devotion of their users seems to be waning.**

  

The day before the exploit, [DCF GOD responded](https://twitter.com/dcfgod/status/1579522572341088257) to a TempleDAO community vibe check:

  

>”After a year of it, I’m low on hope”

  

**Now that users have lost all hope, who still has faith in Temple DAO?**

  

The alarm was raised by [Spreek](https://twitter.com/spreekaway/status/1579836562338361345) approximately an hour after the exploit, which was later [confirmed by STAX](https://twitter.com/staxfinance/status/1579855195693256704). Although the damage done is unlikely to pose an existential threat to the wider TempleDAO protocol, the details of the exploit make for painful reading.

  

**How did the devs make such a simple oversight when they [published](https://etherscan.io/tx/0x601bf705db76812a867ac34da18920d70b1e866b7d18cd26174e78b8e076ab92) the contract in June?**

  

_And why did it take so long to be exploited?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)


_Credit: [FrankResearcher](https://twitter.com/FrankResearcher/status/1579840347647414272), [BlockSec](https://twitter.com/BlockSecTeam/status/1579843881893769222)_

  

**This hack was worryingly simple.**

  
The [StaxLPStaking](https://etherscan.io/address/0xd2869042e12a3506100af1d192b5b04d65137941#code) contract’s migrateStake() function did not contain any checks that the oldStaking parameter was valid.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/10/temple-code1.png)

This meant that anyone could create a contract with the same oldStaking parameter, specifying an arbitrary deposit amount and address to which the funds could be sent.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/10/temple-code2.png)


The resulting ~320k Stax Frax/Temple LP tokens were then swapped for ETH inside the [attacker’s contract](https://etherscan.io/address/0x2df9c154fe24d081cfe568645fb4075d725431e0).

  

**Attacker’s address: [0x9c9fb3100a2a521985f0c47de3b4598dafd25b01](https://etherscan.io/address/0x9c9fb3100a2a521985f0c47de3b4598dafd25b01)**

  

**Attack tx: [0x8c3f442f…](https://etherscan.io/tx/0x8c3f442fc6d640a6ff3ea0b12be64f1d4609ea94edd2966f42c01cd9bdcf04b5)**

  

The exploiter’s address was [funded via Binance](https://etherscan.io/tx/0x95d85a52ca63c16362cabd872c047fbe1e7ec3a4b0b0509a7e28ae8ccaff68aa) shortly before the attack, and the stolen funds were forwarded to another address ([0x2b63d4a3b2db8acbb2671ea7b16993077f1db5a0](https://etherscan.io/address/0x2b63d4a3b2db8acbb2671ea7b16993077f1db5a0)) where they remain.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 


**$2M is a relatively small amount compared to the TVL of TempleDAO, (~$57M according to [DeFiLlama](https://defillama.com/protocol/temple-dao)).**  
  
STAX have [assured](https://twitter.com/staxfinance/status/1579855202362224640) that ”_Remediations will be made for all affected users._”

  

**Arguably, the greatest damage done will be to the project’s reputation, after allowing such a basic error to make it to production.**

  

TempleDAO have [pointed out](https://twitter.com/templedao/status/1579878591981969416) that their Temple Core Vaults are secure and share no common code with STAX. However, after such a simple oversight…

  

_Can Temple users keep the faith?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
