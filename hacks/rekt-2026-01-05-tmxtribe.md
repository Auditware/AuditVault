---
tags:
  - blockchain/arbitrum
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/perpetuals
  - sector/privacy
  - sector/stable
  - sector/staking
  - vuln/reentrancy/single-function
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
  - novelty/known-pattern
title: "TMXTribe - Rekt"
protocol: "[[Tmxtribe]]"
date: 2026-01-05
loss_usd: 1400000
auditors:
source: "https://rekt.news/tmztribe-rekt"
excerpt: "$1.4 million lost on TMXTribe due to a logic bug. The team wallets deployed contracts during the exploit, never paused, and continue deploying days later. Meanwhile, complete radio silence from the te"
genome:
  - "[[single-function]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[known-pattern]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
---
# TMXTribe - Rekt

> **Loss:** $1,400,000 | **Date:** 2026-01-05 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/tmxtribe-rekt-header.png)





_Thirty-six hours is plenty of time to stop a bleeding protocol – or plenty of time to let it bleed out._

  
**TMXTribe, a GMX fork promising perpetual futures trading on Arbitrum, [watched $1.4 million drain](https://x.com/DefimonAlerts/status/2008275261754642727) through [unverified contracts](https://x.com/certikalert/status/2008360565010559045) while [the team offered bounties](https://arbiscan.io/tx/0xb31a0e8b0ed3a370493f6f63c01600cee62e1d4df2af159c9ff22fc2d8adccf4), upgraded contracts, and did everything except the one thing that might have helped: hitting pause.**  
  
An exploit loop that [turned minting and staking logic into a systematic drainage pump](https://x.com/certikalert/status/2008360565010559045).  
  
No security audit to be found anywhere either.  
  
**[Thirty-six hours of active exploitation](https://x.com/extractor_web3/status/2008447536239894854) without a single emergency pause.**  
  
Then [funds bridged to Ethereum via Across](https://arbiscan.io/address/0x763a67e4418278f84c04383071fc00165c112661#crosschaintx) and [disappeared into Tornado Cash](https://x.com/extractor_web3/status/2008447536239894854).  
  
As of 4 days after the exploit, TMX has not said a word about it publicly.  
  
**No post-mortem, no user compensation plan, no acknowledgment on their [Twitter account](https://x.com/TMXdex) that $1.4 million just walked out the door.**  
  

_Was this incompetence so profound it became indistinguishable from malice, or malice so brazen it disguised itself as incompetence?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Defimon Alerts](https://x.com/DefimonAlerts/status/2008275261754642727), [CertiK](https://x.com/certikalert/status/2008360565010559045), [Extractor by Hacken](https://x.com/extractor_web3/status/2008447536239894854), [QuillAudits](https://x.com/QuillAudits_AI/status/2008459614711386457)_

**[DefimonAlerts flagged the first signs of trouble on January 5th](https://x.com/DefimonAlerts/status/2008275261754642727), "GMX fork TMXTribe has been hacked on Arbitrum."**  
  
[CertiK Alert flagged it hours after the drainage started](https://x.com/certikalert/status/2008360565010559045): an unverified contract with a fatal flaw in its LP staking and swapping mechanics.

**The [attack pattern was methodical](https://x.com/QuillAudits_AI/status/2008459614711386457):**

_Mint and stake TMX LP tokens using USDT._

_Swap the deposited USDT for USDG (the protocol's internal stablecoin)._

_Unstake the LP tokens._

_Sell/drain the acquired USDG._

_Repeat._

**No complex flash loan choreography. No oracle manipulation. No re-entrancy tricks.**

Just a loop that the contract's logic couldn't detect, couldn't stop, and couldn't prevent from running again.

And again.

And again.

_[The exploiter's address](https://arbiscan.io/address/0x763a67e4418278f84c04383071fc00165c112661) – labeled "Tribe Perpetual Exploiter" on Arbiscan – executed this sequence across 36 hours._  
  
**The root cause? Flawed logic in how the unverified contract handled minting, staking, and swapping. No checks. No balances. No circuit breakers.**

Just open doors and an attacker patient enough to walk through them systematically.

[QuillAudits later documented](https://x.com/QuillAudits_AI/status/2008459614711386457) what every security researcher already knew: unverified contracts are time bombs. You can't audit what you can't see. You can't trust what you can't verify.

TMXTribe may have chosen to deploy critical infrastructure without verification. Without an audit. Without the basic hygiene that separates legitimate protocols from exit opportunities.

**The result? $1.4 million in systematic drainage across 36 hours while the team watched, deployed contracts, and did everything except hit pause or even publicly acknowledge that they have been exploited.**

_When your smart contract logic treats exploit loops like valid transactions, is it really a hack or just a withdrawal with extra steps?_  
  
### The Stolen Loot Trail  
  
_The attack didn't need complexity to succeed, just an unverified contract with no guardrails._

**The exploiter's main address executed the systematic drainage loop across 36 hours, converting stolen assets into ETH.**

**Exploiter Address (Arbitrum):**  
[0x763a67E4418278f84c04383071fC00165C112661](https://arbiscan.io/address/0x763a67e4418278f84c04383071fc00165c112661)

**Initial Funding Transaction (January 3rd):** [0xaa789bba4dbf761f427de69277fcdeaaa75894f219e2bb44c6fcf40eb68d95d8](https://arbiscan.io/tx/0xaa789bba4dbf761f427de69277fcdeaaa75894f219e2bb44c6fcf40eb68d95d8)

Over the next 48 hours, [the exploiter address would execute 502 transactions](https://arbiscan.io/address/0x763a67e4418278f84c04383071fc00165c112661), systematically dismantling TMXTribe's liquidity.

**[Internal transactions showed the extraction pattern](https://arbiscan.io/address/0x763a67e4418278f84c04383071fc00165c112661#internaltx):** convert drained assets to ETH, batch them, prepare for bridging.  
  
_[Some of the most notable transactions were systematic batches](https://arbiscan.io/address/0x763a67e4418278f84c04383071fc00165c112661#internaltx) of 94.13 ETH ($309,451), 62.57 ETH ($205,704), 57.47 ETH ($188,945), and 47.05 ETH ($154,697) moving through the blockchain like clockwork, each representing hundreds of thousands in stolen funds finding their exit route._

**Secondary Exploiter Address:**  
[0x16Ed3AFf3255FDDB44dAa73B4dE06f0c2E15288d](https://arbiscan.io/address/0x16Ed3AFf3255FDDB44dAa73B4dE06f0c2E15288d#tokentxns)

This address ran the same exploit loop in parallel. [Token transfers](https://arbiscan.io/address/0x16Ed3AFf3255FDDB44dAa73B4dE06f0c2E15288d#tokentxns) show it minting TMX LP with USDT, swapping for USDG, unstaking, and draining repeatedly – the identical attack pattern playing out on a second front.  
  
_All roads led to Ethereum, but not directly to Tornado Cash. First came Across Protocol – the bridge that would move the stolen funds off Arbitrum._

**Bridge Transaction 1 (260 WETH - $821k):**  
[0xa060241eaee611c801c043fd38bac7e0d979e76106b64c2ad431f628a4a64e16](https://arbiscan.io/tx/0xa060241eaee611c801c043fd38bac7e0d979e76106b64c2ad431f628a4a64e16)

**Bridge Transaction 2 (3.419912 WBTC - $312k):**  
[0xf003f6f833dca32dff39697f3bcee4875b7e45d61cf3ba9cd5bab66011ed3e60](https://arbiscan.io/tx/0xf003f6f833dca32dff39697f3bcee4875b7e45d61cf3ba9cd5bab66011ed3e60)

**Bridge Transaction 3 (15.939846 WETH - $50k):**  
[0x6a845d0971b9c4255797530d93257318cfa8bcd04d680490c15b9573316c0d0d](https://arbiscan.io/tx/0x6a845d0971b9c4255797530d93257318cfa8bcd04d680490c15b9573316c0d0d)

Once on Ethereum, the funds landed at [the original exploiter’s address](https://etherscan.io/address/0x763a67e4418278f84c04383071fc00165c112661)  – just under $1.2 million in stolen assets ready for the final step.

Then came Tornado Cash. The [exploiter systematically deposited the stolen ETH into the mixer](https://etherscan.io/address/0x763a67e4418278f84c04383071fc00165c112661), obscuring the trail. The standard final step for anyone who knows they're never returning a single dollar.

_By the time security researchers were documenting the exploit, the money was already gone. Not hidden in some warm wallet waiting to be negotiated. Not sitting in exchanges that might freeze assets._

**Gone. Atomized into Tornado Cash's privacy fog.**

**Exploiter's Current Balance:** 0.00664 ETH (~$21)

**Everything else:** Laundered, mixed, untraceable.

[Extractor by Hacken tracked it all in real-time](https://x.com/extractor_web3/status/2008447536239894854). Funds bridged to Ethereum. Deposited to Tornado Cash. Standard operating procedure for someone who knew exactly what they were doing and had zero intention of returning anything.

**The blockchain remembers every transaction, but Tornado Cash makes sure nobody can follow them home.**

_When the money's already in the mixer, what exactly are you negotiating for?_

### Too Little, Too Late, Too Gone  
  

_While the funds were bridging to Ethereum and disappearing into Tornado Cash, TMXTribe finally made a move._  
  

**Not a pause. Not a circuit breaker. Not an emergency shutdown.**

  
Instead they sent a message.  
  

**On-chain, the team [reached out to the exploiter addresses with a standard bounty offer](https://x.com/extractor_web3/status/2008448464175145152):** Keep 20%, return 80%, and we'll call it even.  
  
**The plea, permanently inscribed on Arbitrum for anyone to read:**  
[0xb31a0e8b0ed3a370493f6f63c01600cee62e1d4df2af159c9ff22fc2d8adccf4](https://arbiscan.io/tx/0xb31a0e8b0ed3a370493f6f63c01600cee62e1d4df2af159c9ff22fc2d8adccf4)  
  
_The exploiter's response? Silence. Not even the courtesy of a "no."_  
  
**Meanwhile, the blockchain tells a different story.**  
  

**Because the wallet that sent the bounty message:**  
[0x33392e39325013e81874ca7b76326858ec179543](https://arbiscan.io/address/0x33392e39325013e81874ca7b76326858ec179543)

And also spent some time deploying contracts.  
  
**January 5th, 7:02 AM UTC - the [first contract deployment](https://arbiscan.io/tx/0xb4c0631e40d0be8aa0f53baf886530c36ab36aac2591c2d1dbcf237e158b2565) creates a new contract:**  
[0xb4c0631e40d0be8aa0f53baf886530c36ab36aac2591c2d1dbcf237e158b2565](https://arbiscan.io/tx/0xb4c0631e40d0be8aa0f53baf886530c36ab36aac2591c2d1dbcf237e158b2565)  
  
**Immediately followed by an [upgrade transaction](https://arbiscan.io/tx/0x3b2115e4404ced00b6b25bb4c53fe6433e0770a9623cd264ac08866b2bd965e5) targeting the following contract:** [0x3AfdbeF553d5c92817da37096bb2e47daeEF951d](https://arbiscan.io/address/0x3AfdbeF553d5c92817da37096bb2e47daeEF951d)

_The contract deployments continued on January 5th…_

**10:49 AM:** [Another contract deployed](https://arbiscan.io/tx/0xebeb6c99bc071731feb0499263d9f382e042db20053566262f68050e5d390f10).  
  
**10:49 AM:** [Another Contract Upgrade](https://arbiscan.io/tx/0x7a8f6f07f5363aced25bd92e9db58e2b7f13e0186cd1b4332db845ff9d13d607) (Targeting the same contract as the 1st upgrade transaction).  
  
**10:49  AM:** [Yet another Contract Upgrade](https://arbiscan.io/tx/0x1720064d11f27097da42df400239b7190c9651fbf827186c3a6b3ba92af89f58) (Targeting the same contract as the 1st upgrade transaction).  
  
**12:08 PM:**  [Another contract](https://arbiscan.io/tx/0xb744702fa1ec5ad78b16c8efcca4fba9127618793f93aea87ab2b2843b57336d). [Another upgrade](https://arbiscan.io/tx/0x869923f011f33389e5c646fefde2d6cb920e5d045b4b7a5681b7645a70688c7b).

**1:46 PM:** The [bounty message goes out to the exploiter](https://arbiscan.io/tx/0xb31a0e8b0ed3a370493f6f63c01600cee62e1d4df2af159c9ff22fc2d8adccf4).

**1:57-8 PM:** [Another contract created](https://arbiscan.io/tx/0xe1044a40f35836a9a3447f95ee8293559c7efa33da3ca7bb42aface441270cd6). Two more upgrades were executed.  
  
[Upgrade 1](https://arbiscan.io/tx/0x25e305cf8fb4eee1129f32f4f81594b763f83c2b379e372a6326bc6b32d12b6c)

[Upgrade 2](https://arbiscan.io/tx/0x590a0f3b674f03dc237c4087e3b57ec78133ba714ce973a2854eaaa7e8577061)

**2:16 PM:** [Another contract deployment](https://arbiscan.io/tx/0x00ecde945266cf7b4b008ec0c0f4ecd2114922bcf3e64de3cab7ae2556e8b8fb). [Another upgrade](https://arbiscan.io/tx/0xad6dcba7c64ddefc395e6ca8e4ba76f9103bb9d7ef8d772fe6ef70a2c0a4f896).

**2:19 PM:** [Another contract deployment](https://arbiscan.io/tx/0x28d3b275420b1e4363f07d26a96dc0fe8801492ae7dff3e985a812f51cc26ca2). [Another upgrade](https://arbiscan.io/tx/0x5e29c9f3bfc7a136346b1cb4405e29dec4dffd26b9ea53c7c50da963d93abff5).

**3:06 PM:**  [Another contract deployment](https://arbiscan.io/tx/0xc0a93d4abb6755f10206f0ac3fc7e43934a47955c0c4576d36085f50558e29aa). [Another upgrade](https://arbiscan.io/tx/0x242a3452e94b748f3c78ec35bfaa82767c6d81e0a0c485e0d80513608387d0c9).  
  
**3:06 PM:**  [Another contract deployment](https://arbiscan.io/tx/0xdbf487df946d951238eab7d23f766206607a2b89079cd6f41e6ae5dc3e88eefb). [Another upgrade](https://arbiscan.io/tx/0x0a16bb923501b24b23b96f0d7fd53ea6f222d2a3bb46739233a3e7a49c9fac4c).  
  
**Then 2 days later on January 7th, between 7:50 AM and 7:51 AM UTC:**  [Another Contract created](https://arbiscan.io/tx/0x81f8646bbf6b07f2fa984f5db877fcf0b2716edde7c1209466a05eef5f5bf5dd), followed by 2 upgrades.  
  
[Upgrade 1](https://arbiscan.io/tx/0x8e4753ab725eaad2e49722ea968e5ef00fa12a61002ddc63dd1d023bf0428467)

[Upgrade 2](https://arbiscan.io/tx/0x3ba000348760eada8b5f407f05f6313665e64a02664e5a1c709373dffebb0ac6)

**The team wasn't absent. They were present, active, deploying contracts and executing upgrades throughout the 36-hour window. What they weren't doing was the one thing that might have stopped it: hitting pause.**

[Every upgrade transaction is visible on Arbiscan](https://arbiscan.io/address/0x33392e39325013e81874ca7b76326858ec179543). Every contract deployment timestamped and permanent.

The evidence doesn't show a team scrambling after the fact – it shows a team working methodically through an exploit they apparently couldn't or wouldn't stop.

And here's the strangest part: [that wallet is still active](https://arbiscan.io/address/0x33392e39325013e81874ca7b76326858ec179543). Not abandoned. Not gone dark. Still operational.

_So what were they upgrading? What were they building while the protocol hemorrhaged $1.4 million? And why deploy contract after contract, upgrade after upgrade, without once triggering an emergency pause?_

**Thirty-six hours of active exploitation. Thirty-six hours of watching funds drain. Thirty-six hours without implementing the most basic defense any DeFi protocol should have: an emergency pause function.**

No circuit breaker triggered. No admin intervention. No attempt to halt the bleeding until it was far too late to matter.

[Extractor by Hacken could not have stated it better with brutal clarity](https://x.com/extractor_web3/status/2008448464175145152): "exploit was ongoing for about 36 hours and TMX have not taken any actions to contain it."

_But the blockchain says they were taking actions. Just not the ones that would have saved user funds._

**While the funds were already gone, [the team's wallet kept working](https://arbiscan.io/address/0x33392e39325013e81874ca7b76326858ec179543). Kept deploying. Kept upgrading contracts.**

Still active days after the exploit.  
  
The protocol's communication? Silent.  
  
Their original [TMXTribe account](https://x.com/TMXTribe) was deleted when checking on January 6th, but popped back up on January 7th, [with one tweet](https://x.com/TMXTribe/status/2008937126667116661), and a suspicious link that [gets flagged as a likely phishing link](https://www.ipqualityscore.com/threat-feeds/malicious-url-scanner/%20http%3A%2F%2Fclaim-tmc.vercel.app).  
  
Meanwhile, their other [Twitter account TMXdex](https://x.com/TMXdex) remains active – just posting nothing about the $1.4 million dollar hole in their treasury.  
  
**The wallet speaks. The contracts deploy. The upgrades execute. But the words? Those stay locked behind a silence that somehow says more than any statement could.**

_When you're present enough to upgrade contracts but absent enough to never explain why $1.4 million vanished, what exactly are you present for?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_Sometimes the line between catastrophic incompetence and calculated exit is too blurred to matter._  
  

**TMXTribe had every warning sign blinking red before a single dollar was stolen: unverified contracts, no security audit, a GMX fork that inherited none of GMX's security rigor.**  
  
Then came the 36-hour exploitation window where the team did everything except stop it.

  
The bounty offer was sent while funds were already mixing.

  
**The contract upgrades deployed while the protocol bled.**

  
Was the negotiation the math of damage control or a mirage?

  
**Days later:** No statement, no compensation plan, no accountability – just digital ghosts and $1.4 million worth of lessons written in immutable transaction logs.

  
**The blockchain recorded everything except the one thing that would have answered all the questions – and maybe leaving that question unanswered was the whole point.**

  
_When the code is open-source but the explanation stays closed, who's really benefiting from decentralization?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
