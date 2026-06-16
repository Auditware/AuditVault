---
tags:
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/stable
  - sector/staking
  - vuln/oracle/spot-price
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
title: "Makina - Rekt"
protocol: "[[Makina]]"
date: 2026-01-20
loss_usd: 4130000
auditors:
source: "https://rekt.news/makina-rekt"
excerpt: "Flash loan goes in, pools get manipulated, permissionless oracle trusts the lie, $4.13 million walks out. Makina's code worked exactly as designed. MEV bots front-ran the attacker and kept most of the"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
---
# Makina - Rekt

> **Loss:** $4,130,000 | **Date:** 2026-01-20 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/makina-rekt-header.png)









_Six audits. One hundred million in TVL. Zero protection against the attack vector explicitly listed as out of scope._  
  

**[Makina Finance bled $4.13 million on January 20th](https://x.com/PeckShieldAlert/status/2013468943193645085) through an oracle manipulation so textbook it could've been ripped [from the Cantina CTF exclusion list](https://cantina.xyz/competitions/2adf7150-27ba-4cba-86a2-bd8ea175e7da).**  
  

"Losses caused by oracle price/liquidity pool manipulation, where an unchecked synchronous deposit is used."  
  

[That exact phrase sat in Cantina’s audit scope document](https://cantina.xyz/competitions/2adf7150-27ba-4cba-86a2-bd8ea175e7da) while Dialectic, Makina's first Operator, deployed DUSD tokens into Curve pools with a share price mechanism that trusted spot prices like a tourist trusts a three-card monte dealer.  
  

**Flash loan goes in, manipulated price gets locked, profit walks out - [$280 million borrowed](https://x.com/CertiKAlert/status/2013485614767972501), pools drained, one atomic transaction, no TWAP, no delay, no second chance.**  
  

[MEV bots front-ran the original attacker](https://x.com/PeckShieldAlert/status/2013468943193645085) and grabbed most of the haul, splitting $4.13 million across two addresses while Makina sent polite on-chain messages offering a 10% bounty for funds that were already being laundered.  
  

ChainSecurity, OtterSec, SigmaPrime, Enigma Dark, Cantina - every firm signed off on "high level of security" while the protocol marketed itself as infrastructure where "every new protocol integration no longer requires new code, new audits, nor does it introduce new attack vectors."

  
**Turns out the attack vector was flexibility itself.**

  
_When auditors write the exploit in the out-of-scope section and nobody reads the fine print, who exactly failed the security review?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Peckshield](https://x.com/PeckShieldAlert/status/2013468943193645085), [Cantina](https://cantina.xyz/competitions/2adf7150-27ba-4cba-86a2-bd8ea175e7da), [CertiK](https://x.com/CertiKAlert/status/2013485614767972501), [TenArmor](https://x.com/TenArmorAlert/status/2013460083078836342), [ExVul](https://x.com/exvulsec/status/2013468647399006533), [Arkham](https://intel.arkm.com/explorer/address/0x573Db3Aed219EfD4D2cDABC0D00366E7B80F910E), [Makina](https://x.com/makinafi/status/2014001946915414342), [dewhales](https://dewhales.substack.com/p/makina-rebuilding-defi-asset-management), [n0b0dy](https://x.com/nn0b0dyyy/status/2013472538832314630), [SlowMist](https://x.com/SlowMist_Team/status/2013506241776230897), [Defimon](https://x.com/DefimonAlerts/status/2013550327425900970), [QuillAudits](https://x.com/QuillAudits_AI/status/2013527143662395622), [Blocksec Phalcon](https://x.com/Phalcon_xyz/status/2013502538239352970), [DefiLlama](https://defillama.com/protocol/makina?tvl=true), [cyber.fund](https://cyber.fund/content/makina-the-defi-execution-engine)_

**January 19th - [TenArmor's monitoring flagged suspicious activity](https://x.com/TenArmorAlert/status/2013460083078836342) on Makina Finance.**

  
[The attack happened on the DUSD/USDC CurveStable pool](https://x.com/exvulsec/status/2013468647399006533). 1299 ETH swept away (worth roughly $4.13 million at the time of the exploit).  
  
**[ExVul arrived shortly after with the diagnosis](https://x.com/exvulsec/status/2013503874968232158):** "The lastTotalAum value is derived from Curve pool states which can be manipulated within a single atomic transaction via flash loans."  
  

**[CertiK confirmed shortly after](https://x.com/CertiKAlert/status/2013473512116363734):** The majority was captured by an MEV builder address.  
  

But here's where it gets weird.  
  

**Original attacker address ([according to Makina’s Incident Update](https://x.com/makinafi/status/2014079031423930710)):**  
[0x2F934B0Fd5c4f99BAb37d47604a3a1AEADEF1CCc](https://etherscan.io/address/0x2F934B0Fd5c4f99BAb37d47604a3a1AEADEF1CCc)

  
They deployed an unverified exploit contract in block 24273361. [One block later](https://x.com/makinafi/status/2014079031423930710), an MEV searcher ([0x935bfb495E33f74d2E9735DF1DA66acE442ede48](https://etherscan.io/address/0x935bfb495E33f74d2E9735DF1DA66acE442ede48)) decompiled the contract and replicated the attack for themselves.  
  

_Two addresses. Two different operators. [$3.3 million in one wallet, $880k in another](https://x.com/PeckShieldAlert/status/2013468943193645085)._

  
**[PeckShield tracked it](https://x.com/PeckShieldAlert/status/2013468943193645085): 1,299 ETH total, split between two addresses:**
[0xbed26250Db2097318386F540fD546acEDf7bdE25](https://etherscan.io/address/0xbed26250Db2097318386F540fD546acEDf7bdE25)
[0x573Db3Aed219EfD4D2cDABC0D00366E7B80F910E](https://etherscan.io/address/0x573Db3Aed219EfD4D2cDABC0D00366E7B80F910E) ([Labeled Rocket Pool Node Distributor on Arkham](https://intel.arkm.com/explorer/address/0x573Db3Aed219EfD4D2cDABC0D00366E7B80F910E))

  
Makina's response wasn't a war room scramble - [it was a negotiation](https://x.com/makinafi/status/2014001946915414342).  
  

**[An onchain message was sent](https://x.com/makinafi/status/2014001946915414342) to one of the addresses involved in the MEV front running operation:** 10% whitehat bounty if you return the funds. Keep up to 102.3 ETH, send back 920.7 ETH. 24-hour deadline.  
  
**The message laid out the terms clearly:** cooperate and keep the bounty, or face "judicial matter" escalation.  
  
**Onchain message to the Attacker:**  
[0xc5c5898eaf8c9ac7bee2c28eb971e8c5fee51c9ecdaf48b42c3357186c0235bf](https://etherscan.io/tx/0xc5c5898eaf8c9ac7bee2c28eb971e8c5fee51c9ecdaf48b42c3357186c0235bf)

_[Hypernative had actually caught an attack attempt one block](https://x.com/makinafi/status/2013660098539720742) before the main exploit. One block of warning. One block too late._  
  
**By the time [Makina posted their incident update](https://x.com/makinafi/status/2013660098539720742), the damage was contained but not reversed.**

[The Security Council triggered recovery mode](https://x.com/makinafi/status/2013660098539720742), pausing all Machines in coordination with SEAL911 and their security auditors. Hypernative had caught the attack attempt one block before - but the actual exploit was carried out by the MEV bot that front-ran it.

[Isolated to DUSD/USDC Curve pool LPs](https://x.com/makinafi/status/2013660098539720742). DUSD holders, Pendle positions, Gearbox integrations, other Machine tokens - all unaffected.

[Makina claimed leads on the MEV operators' identity](https://x.com/makinafi/status/2013660098539720742) and "strong reasons to believe they'll be cooperative."

[Dialectic, Makina's first Operator](https://makinafi.substack.com/p/operator-deep-dive-dialectic) and strategic design partner, had [moved DUSD into Curve pools in late October 2025](https://makinafi.substack.com/p/makina-protocol-launch-the-machines).

**Six weeks after Dialectic moved DUSD into Curve pools during [Season 1's shift to active management](https://dewhales.substack.com/p/makina-rebuilding-defi-asset-management), someone found the pricing mechanism and turned it into an ATM.**

_When your MEV bots become your biggest security problem and your whitehat bounty offer, did the exploit really fail or just get redistributed?_  
  
### The Oracle That Trusted Everything

  

_Most oracle exploits require creative manipulation - reentrancy tricks, sandwich attacks, multi-block MEV schemes._  
  

**This one just asked the protocol to update its own accounting mid-transaction.**  
  

Makina's share price oracle - the mechanism that determines how much DUSD is worth - relied on a function called updateTotalAum().  
  

AUM. Assets Under Management. The total value of everything the Machine controls.

Simple concept. Fatal implementation.  
  
_[updateTotalAum() was permissionless](https://x.com/nn0b0dyyy/status/2013472538832314630). Anyone could call it. Anytime. Mid-transaction._

**[It pulled data from calc_withdraw_one_coin() on Curve's MIM/3CRV pool](https://x.com/SlowMist_Team/status/2013506241776230897) - a function that estimates withdrawal amounts by checking whatever the pool balances happen to be at that exact moment.**

Current pool state. Spot prices. [The oracle has no time delay, no TWAP,](https://x.com/nn0b0dyyy/status/2013472538832314630) no sanity check.

The function would query the Curve pool, calculate what one coin was worth based on that exact moment's balances, [lock that value into lastTotalAum](https://x.com/exvulsec/status/2013468647399006533), and update the share price accordingly.

**[N0b0dy from CertiK explicitly states](https://x.com/nn0b0dyyy/status/2013472538832314630):** "the price anchor is fully manipulable in the same transaction... the Curve pool pays out at the distorted rate."

Same transaction. Same block. Same atomic execution.

The code had [no access control on updateTotalAum(), no time-weighted average pricing, no delay between price updates](https://x.com/nn0b0dyyy/status/2013472544494625050), no minimum time between calls, no comparison against previous values, no circuit breaker for abnormal movements - just a permissionless function pulling spot prices from pools that could be manipulated with borrowed capital.

**What it did have:** [Caliber's accountForPosition() function](https://x.com/DefimonAlerts/status/2013550327425900970) allowing pre-approved [Weiroll](https://github.com/weiroll/weiroll) commands, one of which was calc_withdraw_one_coin() - the exact function that could be manipulated with flash loan capital.

_The attack math becomes obvious once you see the architecture._  
  

**Step one:** Flash loan the capital. [Borrow 280 million USDC](https://x.com/CertiKAlert/status/2013485614767972501). [Split between Morpho (160.6M) and Aave V2 (119.4M).](https://x.com/QuillAudits_AI/status/2013527143662395622)

Capital doesn't need to be yours if you're only holding it for one transaction.

  

**Step two:** Manipulate the Curve pools. Distort the pool balances across DUSD/USDC, 3pool, and MIM-3CRV.

  
_[Dump 170 million USDC into the pools](https://x.com/CertiKAlert/status/2013485614767972501). Prices shift. Balances skew. The pools think DUSD is worth more than it actually is because the ratio just got hammered in one direction._  
  

**This isn't breaking the pools. It's using them exactly as designed - they respond to supply and demand, even if that demand is artificial and temporary.**  
  
**Step three:** Lock in the lie.  [Call accountForPosition() and updateTotalAum()](https://x.com/Phalcon_xyz/status/2013506550493782222).

The function queries [calc_withdraw_one_coin() on the manipulated pools](https://x.com/DefimonAlerts/status/2013550327425900970).

The manipulated pools spit back inflated values.

[lastTotalAum updates. getSharePrice() recalculates.](https://x.com/Phalcon_xyz/status/2013506550493782222)

_[DUSD is suddenly worth more](https://x.com/SlowMist_Team/status/2013506241776230897) than it was five seconds ago._

**Not because anything changed in the real world. Because the accounting said so.**

Not because the code broke. Because the code worked exactly as written.

**Step four:** Extract the value. [Trade the remaining 110 million USDC](https://x.com/CertiKAlert/status/2013485614767972501) into the ~$5 million DUSD/USDC pool.

But the pool is paying out based on the inflated share price.

Swap DUSD for USDC at the manipulated rate. Withdraw LP tokens at the inflated valuation.

_The [pool hemorrhages 5,107,871 USDC](https://x.com/Phalcon_xyz/status/2013502538239352970)._

**Repay the flash loans. Keep approximately $4.13 million profit.**

  
Convert to WETH on Uniswap V3. One transaction. One block. Pool drained.

  
The entire sequence executed atomically. No pause. No delay.  
  
**[Phalcon's transaction trace shows it clearly](https://app.blocksec.com/phalcon/explorer/tx/eth/0x569733b8016ef9418f0b6bde8c14224d9e759e79301499908ecbcd956a0651f5?line=1068):** updateTotalAum() called before the DUSD-to-USDC swap and LP withdrawal (lines [1062](https://app.blocksec.com/phalcon/explorer/tx/eth/0x569733b8016ef9418f0b6bde8c14224d9e759e79301499908ecbcd956a0651f5?line=1063) to [1067](https://app.blocksec.com/phalcon/explorer/tx/eth/0x569733b8016ef9418f0b6bde8c14224d9e759e79301499908ecbcd956a0651f5?line=1068)).  
  
The manipulated state became the accounting truth. The inflated price became the withdrawal reality.  
  

**Multiple security firms confirmed the root cause:** [ExVul flagged "share price oracle manipulation](https://x.com/exvulsec/status/2013468647399006533) via lastTotalAum," [CertiK documented the "MachineShareOracle manipulated using 280M USDC](https://x.com/CertiKAlert/status/2013485614767972501) flash loan," [SlowMist traced "AUM pushed up through calc_withdraw_one_coin manipulation](https://x.com/SlowMist_Team/status/2013506241776230897)," and [Blocksec Phalcon identified "spot price calculation that allowed for an arbitrage attack](https://x.com/Phalcon_xyz/status/2013502538239352970)."

  
The attack didn't break anything. The system worked exactly as designed - which was the problem.

  

**Just permissionless accounting updates pulling spot prices from pools that could be moved with borrowed capital.**  
  

_When your oracle trusts the current block's state and anyone can update it mid-transaction, is it really an oracle or just a price-reporting service with delusions of security?_ 
  
### The Money Trail  
  
_The attacker moved fast. But they were not alone. The blockchain kept receipts._  
  

**Every address. Every transaction. Every wei accounted for.**  
  

**Primary Attack Transaction:**
[0x569733b8016ef9418f0b6bde8c14224d9e759e79301499908ecbcd956a0651f5](https://etherscan.io/tx/0x569733b8016ef9418f0b6bde8c14224d9e759e79301499908ecbcd956a0651f5)

  
One transaction. Over $4 million drained.  
  
**Original Attacker ([deployed exploit contract in block 24273361](https://x.com/makinafi/status/2014079031423930710)):** [0x2F934B0Fd5c4f99BAb37d47604a3a1AEADEF1CCc](https://etherscan.io/address/0x2F934B0Fd5c4f99BAb37d47604a3a1AEADEF1CCc)

**MEV Searcher ([decompiled and replicated attack in block 24273362](https://x.com/makinafi/status/2014079031423930710)):** [0x935bfb495E33f74d2E9735DF1DA66acE442ede48](https://etherscan.io/address/0x935bfb495E33f74d2E9735DF1DA66acE442ede48)

**Attacker's Exploit Contract (Delegated execution):** [0x454d03b2a1D52F5F7AabA8E352225335a1b724E8](https://etherscan.io/address/0x454d03b2a1D52F5F7AabA8E352225335a1b724E8)

This contract handled the heavy lifting - flash loan coordination, pool manipulation, AUM updates, withdrawals.  
  

_[Flash Loan Sources are as follows](https://x.com/QuillAudits_AI/status/2013527143662395622)._  
  

**Morpho:** 160,590,920,349,812 USDC
**Aave V2 Lending Pool:** 119,409,079,650,188 USDC
**Total borrowed:** 280 million USDC.  
  

**Targeted Pool - DUSD/USDC Curve StableSwap:**  
[0x32E616F4f17d43f9A5cd9Be0e294727187064cb3](https://etherscan.io/address/0x32E616F4f17d43f9A5cd9Be0e294727187064cb3)

**Exploited Caliber Contract:**
[0x06147e073B854521c7B778280E7d7dBAfB2D4898](https://etherscan.io/address/0x06147e073b854521c7b778280e7d7dbafb2d4898#code)

_The contract that exposed accountForPosition() with pre-approved Weiroll commands including calc_withdraw_one_coin()._  
  

**But here's where the story splits into something stranger.**  
  

The original attacker set up the exploit. Deployed an unverified contract.  
  
Before they could execute, an MEV searcher decompiled the contract, replicated the attack logic, and beat them to the punch by one block.

  
**MEV Builder Address:**
[0xa6c248384C5DDd934B83D0926D2E2A1dDF008387](https://etherscan.io/address/0xa6c248384C5DDd934B83D0926D2E2A1dDF008387)

_This address intercepted the transaction, reordered the execution, and captured the majority of the profit._  
  

**The stolen funds didn't go to the original hacker. They went to two addresses that [Makina believes are non-malicious MEV operators](https://x.com/makinafi/status/2013660098539720742).**  
  

**MEV Recipient Address 1:**
[0xbed26250Db2097318386F540fD546acEDf7bdE25](https://etherscan.io/address/0xbed26250Db2097318386F540fD546acEDf7bdE25)

**Holdings:** 1,062 ETH (~$3.3M)  
  

**MEV Recipient Address 2:** [Rocket Pool Node Distributor](https://intel.arkm.com/explorer/address/0x573Db3Aed219EfD4D2cDABC0D00366E7B80F910E) (received 276 ETH from the exploit): [0x573Db3Aed219EfD4D2cDABC0D00366E7B80F910E](https://etherscan.io/address/0x573Db3Aed219EfD4D2cDABC0D00366E7B80F910E)

**Rocket Pool Validator Owner Address (identified, not yet contacted):**  
[0x3b6fc5cc2feefc357212617930aedac9493288af](https://etherscan.io/address/0x3b6fc5cc2feefc357212617930aedac9493288af)

  
**Holdings:** 276 ETH (~$880K)  
  

**Total captured by MEV:** 1,299 ETH (~$4.13M)  
  

**Fund Movement Transaction (to MEV Address 1):**
[0x14d2725f4cac331740b053ae49176cec780b556e4aacc3a9f70d77644e97a2a7](https://etherscan.io/tx/0x14d2725f4cac331740b053ae49176cec780b556e4aacc3a9f70d77644e97a2a7)

  
Makina didn't threaten. They negotiated.  
  
**Makina's On-Chain Message Transaction 1:**  
[0xc5c5898eaf8c9ac7bee2c28eb971e8c5fee51c9ecdaf48b42c3357186c0235bf](https://etherscan.io/tx/0xc5c5898eaf8c9ac7bee2c28eb971e8c5fee51c9ecdaf48b42c3357186c0235bf)

**Makina's On-Chain Message Transaction 2:**
[0xfe12d36617e2d1d6ab43716159ad7737606837fe9ea0cb781054f6f3c4fea52f](https://etherscan.io/tx/0xfe12d36617e2d1d6ab43716159ad7737606837fe9ea0cb781054f6f3c4fea52f)

  
**Sent to both MEV addresses. Polite. Professional. Offering 10% bounty:** 
  

_"The 1,023 ETH you received has come from a smart contract exploit. We do not believe this was intentional on your part. Return 920.7 ETH, keep 102.3 ETH as whitehat bounty."_

  
**Recovery Wallet:**
[0x62244C74e1d09b3D86EF7342d354b5D7770bDE10](https://etherscan.io/address/0x62244C74e1d09b3D86EF7342d354b5D7770bDE10)

  
A 24-hour deadline, which has since expired with no response.  
  
**[But recovery efforts are underway](https://x.com/makinafi/status/2014079031423930710):**

Makina is working to recover ~1,023 ETH from the MEV builder. Outreach efforts to identify the owner of Rocket Pool validator (0x3b6fc...). Dialectic is transferring $104,491 in LP fees inadvertently earned during the exploit back to affected users. They are targeting Monday, January 26th to reactivate redemptions after patch audit completes. They’re also deprecating the DUSD/USDC Curve pool entirely and moving to Uniswap.

**Meanwhile, the original attacker's address? Empty. Front-run before they could collect a single wei. Bet they thought they were about to score, but MEV operators said otherwise.**

  
_When the MEV bots steal from the thieves and the protocol negotiates with the bots instead of the original hacker, who exactly is the victim and who's the accomplice?_  
  
### Six Audits, One Blindspot

  

_Makina's security resume wasn't thin._  
  

**Six audits. Five different firms. Five months of scrutiny.**  
  
**[Enigma Dark](https://github.com/Enigma-Dark/security-review-reports/blob/main/2025-07_Invariant_Testing_Engagement_Makina_Finance_Makina_Core.pdf):** Makina-Core Fuzz/Invariant Testing (July 2025)

**[SigmaPrime](https://github.com/sigp/public-audits/blob/master/reports/makina/review.pdf):** Makina-Core & Makina-Periphery (August 2025)

**[ChainSecurity](https://www.chainsecurity.com/security-audit/makina-core):** Makina-Core (September 2025)

**[ChainSecurity](https://www.chainsecurity.com/security-audit/makina-periphery):** Makina-Periphery (September 2025)

**[Cantina](https://cantina.xyz/competitions/2adf7150-27ba-4cba-86a2-bd8ea175e7da):** CTF Competition (September 18 - October 15, 2025)

**[OtterSec](https://ottersec.notion.site/Sampled-Public-Audit-Reports-a296e98838aa4fdb8f3b192663400772?p=2a284d4e41468027b796e222fbbb8939&pm=s):** Makina-Core & Makina-Periphery (November 2025)

_Everything audited. Everything passed. Everything except the thing that mattered._

**[Cantina's CTF competition](https://cantina.xyz/competitions/2adf7150-27ba-4cba-86a2-bd8ea175e7da):** A live bug bounty where hackers attack real contracts for cash prizes - ran from September 18 to October 15, 2025.

Participants could exploit anything they found. Keep the funds if the exploit was valid.

Except for a list of explicitly excluded attack vectors.  
  

**[From the Cantina scope document](https://cantina.xyz/competitions/2adf7150-27ba-4cba-86a2-bd8ea175e7da):**

_"Losses caused by oracle price/liquidity pool manipulation, where an unchecked synchronous deposit is used."_

_"Any loss of funds or share price inconsistency caused by faulty instructions."_

**That first line. Word for word. The exact attack that drained $4.13 million three months later.**

Not a warning buried in the appendix. Listed front and center in the out-of-scope section.

The auditors drew a circle around the attack vector, labeled it 'out of scope,' and moved on.

**[July-November 2025](https://docs.makina.finance/):** Core infrastructure audited and approved

  
**[September 29, 2025](https://makinafi.substack.com/p/makinas-pre-launch-machines-are-going):** Season 0 launches. DUSD, DETH, DBIT go live.

  
**[October 15, 2025](https://cantina.xyz/competitions/2adf7150-27ba-4cba-86a2-bd8ea175e7da):** Cantina CTF ends. Oracle manipulation explicitly excluded from scope.

  
**[October 27, 2025](https://makinafi.substack.com/p/makina-protocol-launch-the-machines):** Season 1 begins. Dialectic transitions from passive Morpho lending to active management.

  
**Post-October 2025:** [DUSD deployed into Curve pools](https://makinafi.substack.com/p/makina-protocol-launch-the-machines). Share price oracle goes live pulling spot prices with zero delays. [Permissionless AUM](https://x.com/nn0b0dyyy/status/2013472538832314630), [no TWAP, no access control](https://x.com/nn0b0dyyy/status/2013472544494625050), oracle manipulation sitting in production, six weeks from detonation.  
  
**[January 19, 2026](https://x.com/PeckShieldAlert/status/2013468943193645085):** Exploit occurs.  
  

_The vulnerability wasn't in the audited code._  
  

**It was in the integration deployed after the audits finished.**  
  

Responsibility gets murky when you trace the vulnerability.  
  
Makina designed the system. Built the MachineShareOracle. Created updateTotalAum() as a permissionless function. Allowed Operators to deploy arbitrary strategies with [pre-approved Weiroll commands](https://www.chainsecurity.com/security-audit/makina-core).

**One of those pre-approved commands was part of the exploit:** [calc_withdraw_one_coin() on Curve pools](https://x.com/DefimonAlerts/status/2013550327425900970).

_Dialectic, the Operator and Makina's strategic design partner, [chose which pools to deploy into and manages the strategy through their risk framework](https://makinafi.substack.com/p/operator-deep-dive-dialectic)._

**The [accountForPosition() function in Caliber](https://x.com/Phalcon_xyz/status/2013506550493782222)? Makina's code.**

The [](https://www.chainsecurity.com/security-audit/makina-core) pre-approved Weiroll commands? Included [calc_withdraw_one_coin() on Curve pools](https://x.com/DefimonAlerts/status/2013550327425900970).

The oracle? [No time delay, no TWAP, no access control.](https://x.com/nn0b0dyyy/status/2013472544494625050)

**Makina was described by investors as infrastructure where:**  "Every new protocol integration no longer requires new code, new audits, nor does it introduce new attack vectors."

_Flexibility was the selling point. Deploy to any protocol. No custom adapters. No waiting for audits._

  
**That flexibility became the attack surface.**

  
[$100 million TVL](https://defillama.com/protocol/makina?tvl=true) at time of the exploit.

  
The damage was contained. The warning signs weren't.  
  

Cantina listed oracle manipulation as out of scope in their CTF. The Curve pool integration was deployed after that CTF ended.  
  
**The exploit used the exact attack vector Cantina had excluded from examination.**  
  

_When auditors explicitly exclude the attack vector that eventually drains your protocol, then call it "out of scope" instead of "unacceptable risk," are they protecting themselves or warning you?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_Six audits couldn't stop what nobody asked them to examine._

  
**Makina built a flexible execution engine marketed on the premise that new integrations wouldn't introduce new attack vectors, then got drained through an integration deployed after every audit signed off.**  
  
[The Cantina CTF](https://cantina.xyz/competitions/2adf7150-27ba-4cba-86a2-bd8ea175e7da) literally listed oracle manipulation via spot prices as out of scope - not because it wasn't a risk, but because nobody wanted responsibility for it.  
  
The audits did their job. They verified the code worked as written. They confirmed the core contracts were secure.  
  
What they didn't do - what they explicitly avoided doing - was question whether the design itself was fundamentally unsafe.  
  
_When your security model depends on assuming external price feeds won't be manipulated within the same transaction, you're not building institutional-grade infrastructure. You're building an honor system with bytecode._

  
**Dialectic, one of DeFi's most respected asset managers, chose the pools. Makina built the oracle.**  
  
The vulnerability lived in the space between them - deployed live, processing $100 million in TVL, three months after the last auditor closed their report.  
  
The funds remain frozen while Makina works contacts at MEV infrastructure providers, hoping that whoever front-ran the original attacker decides cooperation beats keeping the money.  
  
Flexibility was marketed as safe.

  
Auditors wrote "not our problem" next to the exact attack that succeeded.

  
**MEV bots front-ran the exploit and captured most of the funds while the protocol scrambled to respond.**  
  

_Did we build the future of finance, or just a faster arena where automation beats human response time and the quickest code wins regardless of intent?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
