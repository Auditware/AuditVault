---
tags:
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - sector/vault
  - has/audit
  - trigger/governance-vote
title: "ResupplyFi - Rekt"
protocol: "[[Resupplyfi]]"
date: 2025-06-25
loss_usd: 9800000
auditors:
  - "[[ChainSecurity]]"
  - "[[Electi]]"
source: "https://rekt.news/resupplyfi-rekt"
excerpt: "$9.8M lost in just 2 hours after ResupplyFi deployed a new market when someone donated pocket change to manipulate their fresh vault's exchange rate to zero. Attacker then drained the entire market us"
genome:
  - "[[governance-vote]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# ResupplyFi - Rekt

> **Loss:** $9,800,000 | **Date:** 2025-06-25 | **Audited by:** ChainSecurity, Electi

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/resupply-rekt-header.png)


_Hours matter in DeFi - and for ResupplyFi, two hours was all it took to turn a governance celebration into a $9.8 million funeral._

  

**June 25th started with excitement over their latest market launch.**
  
Their lending protocol got hit by an attacker who transformed a donation of crvUSD into a $9.8 million loan using nothing but mathematical sleight of hand and a vault so fresh it still had that new deployment smell.

  

By evening, BlockSec was tweeting damage reports while the attacker vanished with enough stolen funds to buy a mansion.

  

**This wasn't some sophisticated exploit requiring months of research.**

  

Just an old-school ERC4626 donation attack hitting a market deployed mere hours before the bloodbath.

  

ResupplyFi had governance votes, audit reports, and all the usual DeFi compliance checkboxes.

  

**What they didn't have was protection against someone donating pocket change to manipulate their exchange rates into mathematical oblivion.**

  

_When your lending protocol gets annihilated by a textbook donation attack, maybe someone should start reading the textbook?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Blocksec Phalcon](https://x.com/Phalcon_xyz/status/1938061381288530243), [Peckshield](https://x.com/peckshield/status/1938061948647817647), [ResupplyFi](https://x.com/ResupplyFi/status/1938092252431036491), [Chaofan Shou](https://x.com/shoucccc/status/1938093875471507629), [Beosin](https://x.com/Beosin_com/status/1938122347262996516), [TenArmor](https://x.com/TenArmorAlert/status/1938103402078290077), [CoinBench](https://coinsbench.com/from-1-wei-to-10m-reusd-anatomy-of-a-resupplypair-exploit-9e97748fdce1), [Tony Ke](https://x.com/tonykebot/status/1938071437585338623), [Decrypt](https://decrypt.co/327148/hacker-drained-9-6-million-from-defi-stablecoin-protocol-resupply), [OKX Explorer](https://x.com/okxexplorer/status/1938077045600489821), [Certik](https://x.com/CertiKAlert/status/1938127545221648862), [Michael Egorov](https://x.com/newmichwill/status/1938216817970811308), [Aero](https://x.com/0xAero8/status/1938399214901342542), [Leviathan News](https://x.com/leviathan_news/status/1938400137765658970), [Quill Audits](https://www.quillaudits.com/blog/hack-analysis/resupply-hack-analysis)_

  
 **_[The article has been updated. After conversations with both audit firms & ResupplyFi, the scope situation proved more complex than initially understood. We appreciate the professional dialogue with all parties. Rekt remains committed to accurate reporting & supporting builders.]_** 

**ResupplyFi's disaster movie started late in the day with [BlockSec Phalcon dropping the first bomb](https://x.com/Phalcon_xyz/status/1938061381288530243).**

  

"Alert! Phalcon system detected an attack transaction to @ResupplyFi caused ~9.8M USD loss."

  

A few moments later, [PeckShield confirmed the worst](https://x.com/peckshield/status/1938061948647817647) - another protocol got rekt.

  

By the time the security cavalry arrived with their damage assessments, the attacker had already completed their digital heist and disappeared into crypto's favorite washing machine.

  

_[BlockSec didn't mince words](https://x.com/Phalcon_xyz/status/1938073001087652021) about the culprit: "Yet another lending protocol exploited via exchange rate manipulation on low-liquidity-even empty-markets!"_

  

**Empty markets. Fresh deployments. Classic ERC4626 donation attacks.**

  

ResupplyFi had stumbled into DeFi's most predictable tragedy - launching an unprotected vault and watching someone else cash out first.

  

Two hours after confirming the bloodbath, [ResupplyFi finally surfaced](https://x.com/ResupplyFi/status/1938092252431036491) with their damage control statement: "Resupply has experienced an exploit in the wstUSR market. The affected contract has been identified and paused."  
  
**Paused. Past tense. After $9.8 million had already walked out the door.**

  

_Ready to see how a modest donation became a multi-million dollar withdrawal slip?_  
  
### The Mathematics of Mayhem  
  
_ResupplyFi's incident reads like a textbook case study in why empty ERC4626 vaults could be financial suicide machines._

  

**Step one:** Target a freshly deployed market. According to [Chaofan Shou](https://x.com/shoucccc/status/1938093875471507629), the cvcrvUSD vault had been live for exactly two hours - barely enough time for the deployment transaction to cool down, let alone accumulate any meaningful liquidity.

  

**Step two:** Execute the donation attack. As [Beosin](https://x.com/Beosin_com/status/1938122347262996516) and [TenArmor](https://x.com/TenArmorAlert/status/1938103402078290077) detailed, the attacker transferred 2,000 crvUSD directly to the vault controller, then minted just 1 wei of shares. This created a share price so astronomically inflated it broke ResupplyFi's exchange rate mathematics. ([Technical breakdown by CoinBench here](https://coinsbench.com/from-1-wei-to-10m-reusd-anatomy-of-a-resupplypair-exploit-9e97748fdce1))

  

**Step three:** Watch the protocol commit financial suicide. According to [Tony Ke's analysis](https://x.com/tonykebot/status/1938071437585338623), ResupplyFi calculated exchange rates using the formula 1e36 / oracle.getPrices(). When the oracle correctly reported the inflated vault price (2*10^36), the division rounded down to zero due to floor division.

  

_Exchange rate equals zero. Loan-to-value ratio equals zero. Borrowing limits? What borrowing limits?_

  

According to [OKX Explorer](https://x.com/okxexplorer/status/1938077045600489821), the attacker deposited 1 wei of cvcrvUSD as collateral and borrowed $10 million reUSD - the protocol's entire available liquidity.

  
As [Cyvers detailed it in Decrypt’s piece on the exploit](https://decrypt.co/327148/hacker-drained-9-6-million-from-defi-stablecoin-protocol-resupply): "The attacker manipulated token prices, triggering a bug (zero exchange rate) in Resupply's smart contract, letting them borrow a ton of money for almost nothing."

  

ResupplyFi's smart contracts had just approved an almost $10 million loan backed by pocket lint.  
  
**Sometimes the most devastating attacks are the most predictable ones.**

  

_How do you trace a crime that leaves every fingerprint on an immutable ledger?_  
  
### The Blockchain Autopsy

  

_Every heist needs funding, and this one started where many do - Tornado Cash._  
  
**Funding from Tornado Cash:**
[0x1962eb353a37ca816a6d967279dfdb005a640fe3b22ccb9e00939fe5810d8fb5](https://etherscan.io/tx/0x1962eb353a37ca816a6d967279dfdb005a640fe3b22ccb9e00939fe5810d8fb5)

  

The attacker's preparation was pretty straight forward.

  

Fund the operation through crypto's premier mixer, deploy a couple of contracts, then execute the mathematical massacre with surgical precision.  
  
According to [CoinsBench's detailed analysis](https://coinsbench.com/from-1-wei-to-10m-reusd-anatomy-of-a-resupplypair-exploit-9e97748fdce1), the exploit began with the deployment of two specialized contracts at the start of the attack transaction. These weren't off-the-shelf tools - they were purpose-built for this specific heist.

  
_Attack Contracts are as follows…_

  

**Helper Contract 1(simple ETH receiver):**
[0xf90da523a7c19a0a3d8d4606242c46f1ee459dc7](https://etherscan.io/address/0xf90da523a7c19a0a3d8d4606242c46f1ee459dc7)

  

**Main Exploit Contract(orchestrated the entire attack):** [0x151aa63dbb7c605e7b0a173ab7375e1450e79238](https://etherscan.io/address/0x151aa63dbb7c605e7b0a173ab7375e1450e79238)

  

_Attacker Addresses are as follows…_

  

**Attacker’s Primary Address:**
[0x6D9f6E900ac2CE6770Fd9f04f98B7B0fc355E2EA](https://etherscan.io/address/0x6d9f6e900ac2ce6770fd9f04f98b7b0fc355e2ea)

  

**Attacker’s Second Address (Holding $5.5 Million):**
[0x31129a5c13306A48E827e851D44E19Ca07d4928A](https://etherscan.io/address/0x31129a5c13306a48e827e851d44e19ca07d4928a)

**Attacker’s Third Address (Holding $3.9 Million):**
[0x886f786618623ffFB2be59830A47661Ae6492E16](https://etherscan.io/address/0x886f786618623fffb2be59830a47661ae6492e16)

According to [CertiK](https://x.com/CertiKAlert/status/1938127545221648862), the attacker split the stolen funds between these two addresses - approximately $5.5 million to one wallet and $4 million to another, suggesting either profit-sharing with collaborators or enhanced laundering through multiple distribution paths.

  

**The exploit transaction:** [0xffbbd492e0605a8bb6d490c3cd879e87ff60862b0684160d08fd5711e7a872d3](https://etherscan.io/tx/0xffbbd492e0605a8bb6d490c3cd879e87ff60862b0684160d08fd5711e7a872d3)

  

**Targeted Contract:**
[0x6e90c85a495d54c6d7e1f3400fef1f6e59f86bd6](https://etherscan.io/address/0x6e90c85a495d54c6d7e1f3400fef1f6e59f86bd6#internaltx)

**Targeted Contract Created a couple of hours before the exploit:**
[0x852eca15a9fd352817346915f7bc8817d46de349bd7a8fc6ee73c7b66ec9ab41](https://etherscan.io/tx/0x852eca15a9fd352817346915f7bc8817d46de349bd7a8fc6ee73c7b66ec9ab41)

  

The transaction itself unfolds like a precision heist manual.

  

According to [QuillAudits' analysis](https://www.quillaudits.com/blog/hack-analysis/resupply-hack-analysis), flash loan a modest 4,000 USDC from Morpho. Swap for crvUSD via Curve. Execute the donation attack that breaks the math. Borrow 10 million reUSD with worthless collateral. 

**Convert everything back to ETH. Repay the flash loan. Keep the change.**
  
_When protocols promise security but deliver mathematical malpractice, who's really responsible for the cleanup?_

  

### Crisis Management Classics

  

_ResupplyFi's post-hack performance hit every note in DeFi's crisis management playbook._

  

**First came the damage assessment - $9.8 million gone, but hey, "only the wstUSR market was impacted and the protocol continues to function as intended."**

  

Then the investigation announcements. "A full post-mortem will be shared as soon as a complete analysis of the situation has been conducted."

  

[Michael Egorov from Curve felt compelled](https://x.com/newmichwill/status/1938216817970811308) to distance himself: "There is no single person from Curve working on that project... don't generalize to Curve please."

  

Fair enough - when your protocol gets nuked via donation attack, the last thing you want is guilt by association.

  

_With the damage done, attention turned to damage control and user compensation._

  

**Meanwhile, the insurance fund quietly started covering losses. The cleanup effort expanded significantly when C2tP, from Convex, [contributed $1.4 million of personal funds](https://etherscan.io/tx/0x18884d0a608f6431fb4d5efa308afc1920d0f09d9691e5e22e849de61719b626) to cover user losses, followed by [another $810,000 from Convex](https://etherscan.io/tx/0x1c6c24cbe0d090a953dc1df7ecae8403f6d5b317e0127048f9aacf22e2e5336e).**

  

Combined with initial treasury payments of approximately $600,000, over $2.8 million has been repaid toward the $9.5 million loss.

  

[C2tP's personal sacrifice drew widespread praise](https://x.com/leviathan_news/status/1938400137765658970), with the community noting "It's the kind of person he is" while acknowledging that user LP funds remained safe and untouched.

  

**The gesture highlighted both the human cost of protocol failures and the lengths some developers will go to protect their users.**

  

Yet it also exposed an uncomfortable truth: when protocols fail, individual heroism becomes the last line of defense against user losses.

  

The insurance pool mechanism sparked heated Discord and Twitter debates, with users discovering they'd joined without fully understanding how it worked.

  

**As one community member observed: ["Folks joined the INSURANCE pool not reading how it worked. Insurance pool was used to cover bad debt."](https://x.com/0xAero8/status/1938399214901342542)**

  

_When protocols depend on individual developers to save users from losses, is that risk management or just crossing your fingers?_

### Audit Autopsy

  


_[ResupplyFi underwent security reviews](https://github.com/resupplyfi/resupply/tree/main/audits) by [ChainSecurity](https://github.com/resupplyfi/resupply/blob/main/audits/ChainSecurity_Resupply_Resupply_audit.pdf) and [yAudit] (now known as Electi)(https://github.com/resupplyfi/resupply/blob/main/audits/rsup_yaudit_report.pdf) roughly 3-4 months before the hack - and this is where the story gets complicated._

  
**Initially, both audit firms claimed the exploited market was outside their scope, deployed after their reviews concluded.**

  

But after [ResupplyFi's post-mortem](https://mirror.xyz/0x521CB9b35514E9c8a8a929C890bf1489F63B2C84/ygJ1kh6satW9l_NDBM47V87CfaQbn2q0tWy_rtp76OI) challenged this narrative, a three-way conversation between Rekt News, the audit firms, and ResupplyFi revealed a more nuanced truth.*

  

The vulnerable code pattern was actually in scope and audited.

  

According to ChainSecurity: "The code of the vaults which were later deployed were in scope of the audits, the deployment of those vaults and ensuring that they are securely initialized wasn't in scope."

  

_The firm's trust model assumed "meaningful collateral" would be present on deployment - an assumption that proved problematic._

  

**Electi confirmed they were "in the same boat" and clarified their position: "the deployment was not in scope but the underlying issue which is the price calculation rounding down to zero was in scope."**

  

The gap appears to be between code review and deployment validation.

  

As ChainSecurity noted, "it isn't standard yet to validate/audit deployments" - a potential blind spot when protocols deploy markets with different initialization parameters than anticipated.

  

The situation highlights the complexity of security responsibilities in DeFi - where does the auditor's job end and the protocol's operational security begin?

  

**Both audit firms reviewed functional code that worked as designed, but deployment with zero collateral created conditions that enabled the exploit.**

  

_When audited code meets unexpected deployment scenarios, who's responsible for connecting those dots?_

  

***_[Details from three-way conversation between Rekt News, ChainSecurity, Electi, and ResupplyFi team members]_**


![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_ResupplyFi's exploit reads like a DeFi case study in what happens when textbook vulnerabilities meet real money._
  
**Deploy vulnerable vault, ignore donation attack vectors, watch attacker turn spare change into retirement money. The math was simple - the oversight was expensive.**

  

Governance proposals passed, audit badges collected, markets launched. Everything looked professional until someone donated pocket money and borrowed the bank.

  

Whether you call it an ERC4626 donation attack, vault inflation attack, or empty market rounding bug - the vulnerability remains the same: documented exploits with documented solutions.  
  
The post-mortem and subsequent conversations revealed the complexity of audit scope and deployment validation - questions about where responsibility lies when code passes review but deployments create unexpected vulnerabilities.

  

ResupplyFi's experience shows how documented vulnerabilities can still slip through development processes.

  

**Two hours. Almost ten million dollars. One vulnerability that slipped through the cracks.**

  

_When sophisticated audit processes still leave room for exploitation, what does that tell us about the current state of DeFi security?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
