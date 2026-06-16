---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/gaming
  - sector/lending
  - sector/privacy
  - sector/stable
  - sector/token
  - vuln/arithmetic/precision-loss
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/variant
title: "zkLend - Rekt"
protocol: "[[Zklend]]"
date: 2025-02-11
loss_usd: 9570000
auditors:
source: "https://rekt.news/zklend-rekt"
excerpt: "A rounding error exploit bled $9.57M from zkLend vaults on Starknet. After Railgun showed them the door, the attacker ignored their Valentine's Day bounty deadline, letting the stolen funds sit idle. "
genome:
  - "[[precision-loss]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[variant]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
---
# zkLend - Rekt

> **Loss:** $9,570,000 | **Date:** 2025-02-11 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/zkLend-rekt-header.png)



_Looks like someone skipped math class at zero-knowledge school._

  

**zkLend just learned the hard way that fancy cryptography can't save you from basic arithmetic.**

  

Whether you call it a rounding error or precision loss, the result is the same-zkLend got drained for $9.57M by an attacker who knew exactly where to find the mathematical weak spot.

  

While their devs were busy flexing Starknet integration, someone walked in and started printing money with a calculator.

  

Over 2,200 ETH, along with USDC, STRK, and USDT, vanished faster than a dev’s promises during a rugpull-totaling $9.57M.

  

**Starknet's latest "secured by math" narrative just got an expensive reality check.**

  

_When your protocol bleeds $9.57M because someone remembered their grade school decimals, maybe it's time to dust off that calculator?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [zkLend](https://x.com/zkLend/status/1889424818967371779), [Starkware](https://x.com/StarkWareLtd/status/1889688012881121285), [CertiKAlert](https://x.com/CertiKAlert/status/1889589451451670832), [SlowMist](https://slowmist.medium.com/in-depth-analysis-of-zklend-hack-linked-to-eralend-hack-fba4af9b66ef), [coincu](https://coincu.com/322061-zklend-hack-linked-to-2023-eralend-attacker/), [Vitalik Buterin](https://x.com/VitalikButerin/status/1889995280524681393), [Cos](https://x.com/evilcos/status/1889912794390339802)_

**[zkLend broke the news themselves](https://x.com/zkLend/status/1889424818967371779) on February 11th - at least they could spot a catastrophe after it happened.**

  

[StarkWare's damage control](https://x.com/StarkWareLtd/status/1889688012881121285) squad swooped in the next morning with the classic "not our circus, not our monkeys" defense - core tech intact, just the application layer bleeding millions.

  

[CertiKAlert started peeled back the layers](https://x.com/CertiKAlert/status/1889589451451670832) on the exploit mechanics - revealing how our mathematical mastermind turned a single lending_accumulator variable into their personal money printer.

  

The exploit showcases precise mathematical manipulation - starting with a single wei deposit into an empty market.

  

_Our mathematical virtuoso [spotted a gaping hole in zkLend's token accounting](https://slowmist.medium.com/in-depth-analysis-of-zklend-hack-linked-to-eralend-hack-fba4af9b66ef) - their lending_accumulator was about as precise as a drunk darts player._

  

**Using flash loans like a financial accordion, they squeezed the lending_accumulator from 1.0 to 851.0 in a single transaction. Each loan repayment inflated the number further, until it hit the magic target: 4.069297906051644020.**

  

By [manipulating this accumulator](https://x.com/CertiKAlert/status/1889589451451670832) to 4.069297906051644020 (because who doesn't love a good 18-decimal precision number?), they created their own money printer.

  

Deposit 4.069297906051644021 wstETH, get 2 wei back, then withdraw 6.103946859077466029 wstETH - spending just 1 wei in the process.

  

The attacker turned this numerical sleight-of-hand into a $9.57M payday, proving that sometimes the biggest exploits don't need fancy zero-day vulnerabilities - just a calculator and a keen eye for misplaced decimals.

  
The attacker didn't drain zkLend manually-they deployed a custom attack contract to orchestrate the exploit.

  

_Through a series of flash loan transactions, they artificially inflated the lending accumulator to an extreme value, exploiting rounding errors to mint free tokens at will._

  

**Let's follow the money through their mathematical maze…**  
  
### Starknet Phase

  

**Attacker on Starknet:**
[0x04d7191dc8eac499bac710dd368706e3ce76c9945da52535de770d06ce7d3b26](https://voyager.online/contract/0x04d7191dc8eac499bac710dd368706e3ce76c9945da52535de770d06ce7d3b26)

  

**Attack Contract:**
[0x0193da87dc0b317f8418ae0c8fb3e0301698ed2d1a4047191d4641ddabc1e2bf](https://voyager.online/contract/0x0193da87dc0b317f8418ae0c8fb3e0301698ed2d1a4047191d4641ddabc1e2bf)

  

**zkLend Market Targeted in Attack:**  
[0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05](https://voyager.online/contract/0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05)

  

### Bridging to Ethereum

  
**Attacker Bridged 1801 ETH to Ethereum:**
[0xee7887af574928f92cc80384cd9febb41aa4f18c97133c974206f8a2b9baba09](https://voyager.online/message/0xee7887af574928f92cc80384cd9febb41aa4f18c97133c974206f8a2b9baba09)

**Bridge Transaction on Ethereum:**
[0xe107aca6535c8b67356dfa2d741bb3d4c4374f558b58a70f8e34e4c1bf1328e7](https://etherscan.io/tx/0xe107aca6535c8b67356dfa2d741bb3d4c4374f558b58a70f8e34e4c1bf1328e7)

  

**Attacker on Ethereum:**
[0x645c77833833A6654F7EdaA977eBEaBc680a9109](https://etherscan.io/address/0x645c77833833a6654f7edaa977ebeabc680a9109)

  

While [zkLend assembled their crisis management squad](https://x.com/zkLend/status/1889536602701259036) - their stolen funds took a scenic tour through Railgun's privacy mixer.

  
### Laundering Attempts

  

**Attacker sends 706.4 ETH to a 2nd Address:**
[0x1262d9cebafe097e8e7223f685238ef4ef87bcf8b1fe5e2c13e60ef226f78f97](https://etherscan.io/tx/0x1262d9cebafe097e8e7223f685238ef4ef87bcf8b1fe5e2c13e60ef226f78f97)

  

**Attacker’s Address used for Railgun:**
[0xCf677c7520E02acA89BC70431eAC891e94273E8a](https://etherscan.io/address/0xcf677c7520e02aca89bc70431eac891e94273e8a)

  

**Deposit to Railgun (706.4 WETH):** [0x7309db8034a421a319dc7073a41da4679f93a1a4bab8793c026666837e7846d4](https://etherscan.io/tx/0x7309db8034a421a319dc7073a41da4679f93a1a4bab8793c026666837e7846d4)

  

**Railgun rejects Attacker Transaction:**  [0xf185675b2c2000d1d39f189594be223b78e389cc229b4ec4051b810b920bb125](https://etherscan.io/tx/0xf185675b2c2000d1d39f189594be223b78e389cc229b4ec4051b810b920bb125)

  

Plot twist: Railgun's exclusion policies sent the funds right back to sender - a showcase of privacy pools done right.

  

**No backdoors needed - just a one-hour cooling period where smart contracts play judge and jury. If your funds smell funny, you get an automatic return to sender.**

  

_Even [Vitalik gave a nod to this one](https://x.com/VitalikButerin/status/1889995280524681393), pointing out how privacy pools can maintain integrity without compromising user rights. Don't like the rules? Fork your own pool - just good luck finding users._

  

**Current score: $8M still parked in this wallet:**
[0x645c77833833A6654F7EdaA977eBEaBc680a9109](https://etherscan.io/address/0x645c77833833a6654f7edaa977ebeabc680a9109)

**With almost $720k shuffled like a half-hearted game of three-card monte in a 2nd wallet:**
[0x0B7D061D91018AaB823A755020e625FfE8B93074](https://etherscan.io/address/0x0b7d061d91018aab823a755020e625ffe8b93074)

  

**Another $19k here:**
[0xcd1c290198E12c4c1809271e683572FBF977Bb63](https://etherscan.io/address/0xcd1c290198e12c4c1809271e683572fbf977bb63)

  

_As the chaos unfolded..._

  

**zkLend's response post incident followed the well-worn "dear ser hacker" playbook.**

  

[Six hours after the exploit](https://x.com/zkLend/status/1889515118368829559), they [slid the attacker an onchain message](https://etherscan.io/tx/0xe04a7954d440906344f3f5b4c65b358625af2d393bc88942d6f46636e4080067) with the standard 10% white hat offer - return 3,300 ETH by 00:00 UTC on February 14th or we’ll prosecute you.  
  
The deadline passed without a response. Instead of returning the funds, the attacker sat tight while [zkLend released their post-mortem](https://x.com/zkLend/status/1890389052492509362) - not through any professional channel, but via an unverified Google Drive link.  
  

The document makes bold claims of FBI and Homeland Security involvement, but like their security measures, their choice of platform raises eyebrows.

  

When you're dealing with a $9.57M exploit, maybe skip the sketchy links and spring for a proper publication?

  

**Here's where things get interesting - [according to SlowMist's in-depth analysis](https://slowmist.medium.com/in-depth-analysis-of-zklend-hack-linked-to-eralend-hack-fba4af9b66ef), on-chain evidence reveals the zkLend attacker is directly linked to the [EraLend reentrancy exploit of July 2023](https://rekt.news/eralend-rekt/).**

  

_Before hitting zkLend, the attacker used their Starknet address to test transactions with three Layer 1 Ethereum addresses._  
  
**Starknet Address:**
[0x04d7191dc8eac499bac710dd368706e3ce76c9945da52535de770d06ce7d3b26](https://voyager.online/contract/0x04d7191dc8eac499bac710dd368706e3ce76c9945da52535de770d06ce7d3b26)

  

**L1 ETH Addresses:**
[0xd95b3c1e638ce3cdc070ad6d4f385c61e2ee8662](https://etherscan.io/address/0xd95b3c1e638ce3cdc070ad6d4f385c61e2ee8662)

[0x93920786e0fda8496248c4447e2e082da69b6c40](https://etherscan.io/address/0x93920786e0fda8496248c4447e2e082da69b6c40)

[0x34e5dc779cb705200e951239b6a89aaf5c7dbfc1](https://etherscan.io/address/0x34e5dc779cb705200e951239b6a89aaf5c7dbfc1)

  

Two of these L1 addresses - [0x9392](https://etherscan.io/address/0x93920786e0fda8496248c4447e2e082da69b6c40) and [0x34e5](https://etherscan.io/address/0x34e5dc779cb705200e951239b6a89aaf5c7dbfc1) - were previously used to receive funds from the EraLend attack.

  

_This isn't just a similar exploit - it's the same operator, back for seconds._

  

**While this specific wallet has been active since June 2024, earlier linked addresses [show connections](https://x.com/evilcos/status/1889912794390339802) to EraLend’s exploiters, suggesting a repeat player with a familiar playbook.**

  

zkLend's post-mortem [suggests the attacker's trail extends beyond EraLend](https://x.com/zkLend/status/1890389052492509362), naming OnyxDAO, Yei Finance, Channels Finance, and Starlay Finance as previous targets.

  

But while the EraLend connection is backed by verifiable on-chain evidence, these additional claims come without transaction links or proof.

  

Until zkLend provides receipts, these connections remain speculative at best.

  

_zkLend was audited twice by Nethermind - [once in May 2022](https://github.com/NethermindEth/PublicAuditReports/blob/1d6264507e7ba835eff2fa14499acc2729b9b84c/NM0058-FINAL_ZKLEND.pdf) for their Cairo 0 contracts and [again in September 2023](https://github.com/NethermindEth/PublicAuditReports/blob/1d6264507e7ba835eff2fa14499acc2729b9b84c/NM0097-FINAL_ZKLEND.pdf) for Cairo 1._

  

**[According to zkLend](https://x.com/zkLend/status/1890389052492509362), "no critical issues were found in either report."**

  

But the fatal rounding error that cost them $9.57M somehow slipped through.

  

The [post-mortem describes](https://x.com/zkLend/status/1890389052492509362) it as three "individually harmless" design details that became lethal in combination - empty market deposits, accepted "donations," and withdrawal rounding.

  

Whether these issues existed during the audits or snuck in through later changes remains unclear - zkLend's Google Drive post-mortem conveniently skips that detail.

  

But one thing's certain - "audited" doesn't mean "invulnerable," especially when decimal points are involved.

  
**Between flawed math implementations and inadequate safeguards, zkLend's saga reads like a cautionary tale of what happens when you skip the basics in pursuit of the cutting edge.**

  

_When a privacy mixer has better input validation than your protocol, maybe it's time to reconsider your priorities?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)



_Layer 2s were supposed to be crypto's promised land - where advanced math meets bulletproof security._

  

**Instead, we're watching protocols get rekt by the same basic arithmetic that trips up first-year coding students.**

  

zkLend's $9.57M stumble proves that even the fanciest zero-knowledge proof can't protect you from a misplaced decimal point.

  

While Starknet's core tech remains unscathed, their ecosystem just got an expensive lesson in the basics.

  

Perhaps it's time for DeFi protocols to spend less time flexing their L2 credentials and more time double-checking their math homework.

  

**The race to build the future of finance continues - calculator batteries not included.**

  

_How many decimal places does it take to reach the bottom of DeFi's math class?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
