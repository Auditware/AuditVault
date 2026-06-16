---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/launchpad
  - sector/multisig
  - sector/privacy
  - sector/token
  - sector/vault
title: "Truebit - Rekt"
protocol: "[[Truebit]]"
date: 2026-01-08
loss_usd: 26200000
auditors:
source: "https://rekt.news/truebit-rekt"
excerpt: "First major hack of 2026, as TrueBit was drained for $26.2 million through an overflow in unverified bytecode. The same attacker hit Sparkle weeks prior. Old code keeps bleeding - the archives have cl"
genome:
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
---
# Truebit - Rekt

> **Loss:** $26,200,000 | **Date:** 2026-01-08 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/truebit-rekt-header.png)






_Five years of silence. One transaction. [$26.2 million gone](https://etherscan.io/tx/0xcd4755645595094a8ab984d0db7e3b4aabde72a5c87c4f176a030629c47fb014)._

  
**[Truebit's proxy contract sat on Ethereum like a time capsule](https://etherscan.io/address/0x764c64b2a09b09acb100b80d8c505aa6a0302ef2) - unverified bytecode, no published audits, and a bonding curve that [Banteg flagged as a "rug zone" back in 2021](https://x.com/banteg/status/1389032239162347521).**

  
At the time, apparently the warning was not enough. [Rekt covered it back then](https://rekt.news/big-if-truebit). But fast forward to almost 5 years later, someone finally took action on it.

  
On January 8th, 2026, [Truebit became DeFi's first major bloodletting of the new year](https://www.theblock.co/post/384861/truebit-26-million-exploit) when [an attacker minted over 240 million TRU tokens](https://etherscan.io/tx/0xcd4755645595094a8ab984d0db7e3b4aabde72a5c87c4f176a030629c47fb014), burned them for real ETH, and repeated the cycle until 8,535 ETH had been siphoned into Tornado Cash.  
  

The function they called to do it? [Literally named "Attack.](https://x.com/TheDeFiDan/status/2009299459050496249)"  
  

Truebit’s token - [TRU collapsed 100% in hours](https://www.coingecko.com/en/coins/truebit-protocol) - from $0.16 to effectively zero - while the protocol's slogan mocked from [their Twitter page](https://x.com/Truebitprotocol): "Don't just trust, verify."  
  

**[PeckShield traced the wallet to the same address that hit Sparkle protocol for 5 ETH](https://x.com/PeckShieldAlert/status/2009450865942552926) - twelve days earlier. A serial hunter, methodically working through DeFi's abandoned architecture.**  
  

_When your slogan demands verification but your code hides behind bytecode, who exactly was supposed to do the verifying?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Banteg](https://x.com/banteg/status/1389032239162347521), [The Block](https://www.theblock.co/post/384861/truebit-26-million-exploit), [TheDefiDan](https://x.com/TheDeFiDan/status/2009299459050496249), [CoinGecko](https://www.coingecko.com/en/coins/truebit-protocol), [Peckshield](https://x.com/PeckShieldAlert/status/2009450865942552926), [Cyvers](https://x.com/CyversAlerts/status/2009305178277654894), [William Li](https://x.com/hklst4r/status/2009314260460146917), [BlockScope](https://x.com/BlockscopeCo/status/2009316411253116967), [Truebit](https://x.com/Truebitprotocol/status/2009328032813850839), [BlackY](https://x.com/blackyxbt/status/2009564056374640796), [0xkaka](https://x.com/0xkaka1379/status/2009438499842502823), [AstraSec](https://x.com/AstraSecAI/status/2009596295456174557), [szansky](https://x.com/szansky/status/2009530441112461725), [Extractor by Hacken](https://x.com/extractor_web3/status/2009354234542870702), [deebeez](https://x.com/deeberiroz/status/2009303848091836791), [stormblessed](https://x.com/storming0x/status/2009301066005758291), [Anthropic](https://red.anthropic.com/2025/smart-contracts/), [metaphantacy](https://x.com/zmtO21/status/2001585158106026270), [Lookonchain](http://lookonchain)_

**[Cyvers caught it first on January 8th](https://x.com/CyversAlerts/status/2009305178277654894) - 8,535 ETH draining from TrueBit's Purchase contract in a single sweep.**  
  

Three minutes later, [TheDeFiDan spotted what would become the exploit's dark punchline](https://x.com/TheDeFiDan/status/2009299459050496249) - the attacker's function was literally labeled "Attack" in the transaction call.  
  

Security researchers piled in. [William Li dropped preliminary analysis noting](https://x.com/hklst4r/status/2009314260460146917) this was "a very old contract deployed ~5 years ago" and that "old contracts are getting more popular among attackers now."  
  
[BlockScope traced the attacker's funding back to November](https://x.com/BlockscopeCo/status/2009316411253116967), suggesting weeks of preparation via Rhino.fi.  
  

**[PeckShield's alert landed the hardest](https://x.com/PeckShieldAlert/status/2009450865942552926):** The same wallet that drained Sparkle protocol twelve days prior. Not an opportunist - a specialist.

**Two hours passed before TrueBit acknowledged anything.** 
  

_**[The official response finally arrived](https://x.com/Truebitprotocol/status/2009328032813850839):** "Today, we became aware of a security incident involving one or more malicious actors. The affected smart contract is [0x764C64b2A09b09Acb100B80d8c505Aa6a0302EF2](https://etherscan.io/address/0x764c64b2a09b09acb100b80d8c505aa6a0302ef2) and we strongly advise the public not to interact with this contract until further notice."_  
  

No technical details. No acknowledgment of the $26.2 million walking out the door. Just boilerplate and a promise to coordinate with law enforcement.  
  

[A second attacker had jumped in too](https://x.com/hklst4r/status/2009314260460146917) - someone who allegedly celebrated in a group chat while extracting roughly $250,000 in copycat profits.  
  

The TRU token didn't crash. It evaporated. [From $0.16 to $0.000000018](https://www.coingecko.com/en/coins/truebit-protocol). Liquidity pools emptied faster than holders could exit, leaving wallets full of worthless tokens and DEX traders staring at 100% losses.  
  

**First major hack of 2026, and January wasn't even two weeks old.**

  
_But how does a pricing function on a five-year-old contract suddenly return zero for billion-token mint requests?_  
  
### The Math That Couldn't Add  
  

_[TrueBit's exploited contract was deployed in 2021](https://etherscan.io/address/0x764c64b2a09b09acb100b80d8c505aa6a0302ef2) with a simple premise - [mint TRU with ETH, burn TRU for ETH](https://x.com/blackyxbt/status/2009564056374640796)._  
  
**A bonding curve mechanic where minting got progressively more expensive as supply increased.** 
  

The selling side worked differently. TrueBit would buy back tokens at 12.5% of the highest minting price - [a detail Banteg had flagged](https://x.com/banteg/status/1389032239162347521) during [TrueBit’s chaotic 2021 launch](https://rekt.news/big-if-truebit) as a "rug zone."

  
Almost five years later, someone finally pulled the trigger.  
  

[The vulnerability lived in getPurchasePrice(uint256 amount)](https://x.com/blackyxbt/status/2009564056374640796) - the function calculating how much ETH a user needed to mint TRU tokens.  
  
_For normal inputs, it worked fine. For absurdly large inputs - amounts far beyond any reasonable supply - [the math broke](https://x.com/blackyxbt/status/2009564056374640796)._  
  

**[A classic issue in older Solidity](https://x.com/0xkaka1379/status/2009438499842502823). Compiler version v0.5.3 predates automatic overflow checks - addition operations don't verify whether results exceed maximum values.**  
  
SafeMath protected multiplication and division throughout the contract, but one addition slipped through unguarded.
  
When the attacker passed astronomical values into the minting function, that [unprotected addition overflowed](https://x.com/AstraSecAI/status/2009596295456174557). The result wrapped around to near-zero.

  
Cost to mint 240,442,509 TRU tokens: essentially nothing.

  
**The [attack contract executed a brutal loop](https://etherscan.io/tx/0xcd4755645595094a8ab984d0db7e3b4aabde72a5c87c4f176a030629c47fb014#eventlog) (Loop is in the Event Log):**  
  

_Call `getPurchasePrice()` with a massive amount - receive zero as the cost._
_Mint billions of TRU tokens for almost nothing._
_Approve and transfer tokens to the Purchase contract._
_Burn the tokens, receive real ETH at the 12.5% buyback rate._
_Repeat with even larger amounts._

  

**[Five iterations in a single transaction](https://x.com/blackyxbt/status/2009564056374640796). No price impact between steps because it all happened atomically.**

  
No supply cap stopped it. No per-transaction limit slowed it. The contract just kept minting and burning until 8,535 ETH had migrated from the protocol's reserves to the attacker's wallet.

  
**[AstraSecAI summarized it cleanly:]**(https://x.com/AstraSecAI/status/2009596295456174557) "A reminder that one missed check is all it takes."

  
The source code was never verified on Etherscan - [only bytecode visible to the public](https://x.com/szansky/status/2009530441112461725).  
  
**Anyone wanting to audit it first had to decompile. The attacker clearly did their homework.**

  
_With the protocol drained and the math exposed, where did $26.2 million go next?_ 
  
### The Loot Trail  
  

_[BlockScope traced the attacker's wallet funding back to November 2025](https://x.com/BlockscopeCo/status/2009316411253116967). Weeks of prep work before pulling the trigger._  
  

**Attacker's Primary Address:**
[0x6c8ec8f14be7c01672d31cfa5f2cefeab2562b50](https://etherscan.io/address/0x6c8ec8f14be7c01672d31cfa5f2cefeab2562b50)

**Funding Transaction (December 6, 2025):**
[0xf173f0ed341d3106c1f2eda4704a5e5e9e12c8cf896eb525948624841e7d7ad](https://etherscan.io/tx/0xf173f0ed341d3106c1f2eda4704a5e5e9e12c8cf896eb525948624841e7d7ad3)

Across Protocol delivered the seed money on December 6th. Whoever did this had patience - and a bridge.  
  

**The Victim - TrueBit Protocol: Purchase Contract:**
[0x764C64b2A09b09Acb100B80d8c505Aa6a0302EF2](https://etherscan.io/address/0x764c64b2a09b09acb100b80d8c505aa6a0302ef2)

Deployed roughly five years ago. Unverified bytecode. No published audits. Sitting on Ethereum like an unlocked vault.  
  

**Attack Contract:**
[0x1de399967b206e446b4e9aeeb3cb0a0991bf11b8](https://etherscan.io/address/0x1de399967b206e446b4e9aeeb3cb0a0991bf11b8)

[According to Extractor by Hacken, the malicious contract was deployed in the same block](https://x.com/extractor_web3/status/2009354234542870702) as the exploit via private mempool - block position 3 for deployment, position 4 for execution. No front-running opportunities. Clean sequencing.

  
**Primary Attack Transaction:**
[0xcd4755645595094a8ab984d0db7e3b4aabde72a5c87c4f176a030629c47fb014](https://etherscan.io/tx/0xcd4755645595094a8ab984d0db7e3b4aabde72a5c87c4f176a030629c47fb014)

  
_One transaction. [Five mint-burn cycles](https://x.com/blackyxbt/status/2009564056374640796). 8,535 ETH extracted. Contract left with approximately 16 ETH._

  
**Post-exploit, [the funds scattered immediately](https://x.com/extractor_web3/status/2009355138562208177).**  
  
**Original Attacker’s Wallet:**  
[0x6C8EC8f14bE7C01672d31CFa5f2CEfeAB2562b50](https://etherscan.io/address/0x6c8ec8f14be7c01672d31cfa5f2cefeab2562b50)

  
**Laundering Wallet 1:**
[0x273589ca3713e7becf42069f9fb3f0c164ce850a](https://etherscan.io/address/0x273589ca3713e7becf42069f9fb3f0c164ce850a)

  
**Laundering Wallet 2 (Middle Man Wallet):**
[0x3b58192943ee6f9ae92d54dd1ef378cfd519862a](https://etherscan.io/address/0x3b58192943ee6f9ae92d54dd1ef378cfd519862a)

  
**Laundering Wallet 3 (Another Middle Man Wallet):**
[0x62afdd1bd84f6b152572404be90679ae58eb4862](https://etherscan.io/address/0x62afdd1bd84f6b152572404be90679ae58eb4862)

**Laundering Wallet 4:**
[0xD12f6E0fa7FBF4e3A1c7996E3F0Dd26AB9031a60](https://etherscan.io/address/0xd12f6e0fa7fbf4e3a1c7996e3f0dd26ab9031a60)

[Lookonchain confirmed on January 10th](https://x.com/lookonchain/status/2010186981582807444) that the attacker deposited all 8,535 ETH into Tornado Cash - the entire haul is now laundered.  
  
**Tornado Cash Laundering Wallet:**  
[0xD841C52B68c5dB133078ABa039bd9EAF19b0b135](https://etherscan.io/address/0xd841c52b68c5db133078aba039bd9eaf19b0b135)

  

**Once the primary exploit landed on-chain, the vulnerability was public. [MEV bots and copycat attackers piled in](https://x.com/deeberiroz/status/2009303848091836791) to grab whatever scraps remained.**  
  
_The [second attacker left a smaller footprint](https://x.com/hklst4r/status/2009314260460146917) but [they were not alone](https://x.com/deeberiroz/status/2009303848091836791)._

  
**Second Attacker’s Wallet (~$253K - Not known to be involved in the first attack):**  
[0xc0454E545a7A715c6D3627f77bEd376a05182FBc](https://etherscan.io/address/0xc0454e545a7a715c6d3627f77bed376a05182fbc)

How opportunistic, they saw the primary exploit land and jumped in for scraps.  
  

**[PeckShield connected the primary wallet to something bigger](https://x.com/PeckShieldAlert/status/2009450865942552926):** The same address drained Sparkle protocol twelve days earlier for approximately 5 ETH.  
  

5 ETH to 8,535 ETH. A 1,700x escalation in under two weeks.  
  

**Not a one-time opportunist. But a possible hunter, working through a target list.**  
  

_With half the funds already mixed and the other half sitting in known wallets, what does TrueBit's collapse tell us about DeFi's growing graveyard of abandoned code?_  
  
### Relic Hunters  
  

_TrueBit isn't an isolated incident. It's the latest entry on a growing kill list._

  
**[Balancer bled $128 million on November 3rd](https://rekt.news/balancer-rekt2) when rounding errors in five-year-old Composable Stable Pools turned into a precision heist across multiple chains.**

  
[Yearn's yETH lost $9 million on November 30th](https://rekt.news/yearn-rekt3) - a forgotten stableswap pool with "novel math" that nobody maintained minted tokens to infinity.

  
[Abracadabra watched $1.8 million walk out the door on October 4th](https://rekt.news/abracadabra-rekt3) through "deprecated" CauldronV4 contracts that were labeled as legacy but never actually turned off.

  
Aevo (formerly known as Ribbon Finance), [surrendered $2.7 million in December](https://rekt.news/aevo-rekt) via a proxy admin vulnerability in old vaults.

  
_[Rari Capital hemorrhaged ~$2 million in December from a multisig takeover](https://x.com/zmtO21/status/2001585158106026270) on a protocol that had already ceased operations._

  
**Now TrueBit joins the list at $26.2 million - bytecode nobody verified, audits nobody published, math nobody checked.**

  
**stormblessed, a former Yearn developer, [voiced what others were thinking](https://x.com/storming0x/status/2009301066005758291):** “Another victim of legacy code? It’s going to keep happening."

  
[The advice?](https://x.com/storming0x/status/2009301066005758291) “Teams should assume old code its being actively looked at and either deprecate/sunset or reaudit.”

  
_[Anthropic's research added fuel to the fire](https://red.anthropic.com/2025/smart-contracts/). Their AI agents, when pitted against 405 previously exploited smart contracts, autonomously achieved $4.5 million in successful exploits - including contracts deployed after the models' knowledge cutoff._

  
**The bar for finding bugs in old code has never been lower. The rewards have never been higher.**

  
TrueBit's attacker didn't need sophisticated new techniques. They needed patience, time to reverse-engineer unverified code, and a target list of contracts that nobody was watching anymore.

  
Five years of dormancy. One month of preparation. One transaction to drain it all.

  
No recovery plan has been announced. No compensation timeline. [Their most recent update on January 9th mentioned](https://x.com/Truebitprotocol/status/2009644207443746867) they have “engaged additional resources to strengthen tracing and recovery.”  
  
**Maybe they should have engaged what really mattered - their own infrastructure.**  
  

_How many more loaded contracts are sitting on Ethereum and other networks right now, waiting for someone curious enough to read the bytecode?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_"Don't just trust, verify" aged like milk left on a bonding curve._

  
**TrueBit launched in chaos back in 2021 - stealth deployment, confused investors, [Banteg warning about rug zones](https://x.com/banteg/status/1389032239162347521) in their tokenomics.**  
  
Five years later, that chaos came home to collect $26.2 million.  
  

No audits published. No source code verified. No team watching the old contracts while they built whatever came next.  
  

**The attacker did exactly [what the slogan demanded](https://x.com/Truebitprotocol). They verified. They found the overflow. They extracted every last ETH the math would give them.**  
  

DeFi keeps shipping new products while legacy infrastructure rots in production. [Balancer](https://rekt.news/balancer-rekt2), [Yearn](https://rekt.news/yearn-rekt3), [Abracadabra](https://rekt.news/abracadabra-rekt3), [Aevo](https://rekt.news/aevo-rekt), and [Rari Capital](https://x.com/zmtO21/status/2001585158106026270) - the archives have become a shopping list for anyone with patience and a decompiler.  
  

TrueBit's contract sat dormant for almost half a decade. One attacker. One transaction. One month of planning for a lifetime payout.  
  

**The hunter who drained TrueBit started with 5 ETH from Sparkle and graduated to 8,535 ETH in under two weeks. They're still out there, and odds are they might not be done shopping.**  
  

_If legacy code is worth killing, maybe it's worth a bounty to find out who's doing the killing?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
