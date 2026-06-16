---
tags:
  - blockchain/ethereum
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/staking
  - sector/token
  - sector/vault
  - impact/loss-of-funds/direct-drain
title: "Yearn - Rekt III"
protocol: "[[Yearn]]"
date: 2025-11-30
loss_usd: 9000000
auditors:
source: "https://rekt.news/yearn-rekt3"
excerpt: "A forgotten yETH pool led to Yearn’s 3rd exploit since 2021. Attacker minted to infinity and drained $9 million in one transaction. Legacy code nobody maintained became a legacy problem somebody else "
genome:
  - "[[direct-drain]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# Yearn - Rekt III

> **Loss:** $9,000,000 | **Date:** 2025-11-30 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/yearn-rekt3-header.png)











_There was an almost forgotten pool on Yearn with novel math still processing millions._  
  
**Then someone broke the invariant, deposited dust and minted to infinity.**

  

Yearn's forgotten yETH relic - a product so abandoned even the team forgot to turn it off - [minted 235,443,031,407,908,519,912,635,443,025,109,143,978,181,362,622,575,235,916 tokens out of thin air](https://x.com/phalcon_xyz/status/1995430697478361268).

  

That's not a typo and it is a number so huge, you could probably see it from space.

  

[$9 million vanished in a single transaction](https://app.blocksec.com/explorer/tx/eth/0x53fe7ef190c34d810c50fb66f0fc65a1ceedc10309cf4b4013d64042a0331156) while [1,000 ETH slipped through Tornado Cash](https://x.com/Togbe0x/status/1995247948033405210).

  

**[Yearn's V2 and V3 vaults remained untouched](https://x.com/yearnfi/status/1995259652288729315) - small comfort for a protocol now sitting at three exploits and counting.**

  
_When legacy math can mint infinity, is the real exploit the code - or the culture that ships it?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Blocksec](https://x.com/phalcon_xyz/status/1995430697478361268), [Togbe](https://x.com/Togbe0x/status/1995247948033405210), [yearn](https://x.com/yearnfi/status/1995259652288729315), [Peckshield](https://x.com/PeckShieldAlert/status/1995311852310675537), [Defi Chad](https://x.com/defichad/status/1995517495738781838), [Banteg](https://github.com/banteg/yeth-exploit/blob/main/report.pdf), [William Li](https://x.com/hklst4r/status/1995319273456009274), [Blockscout](https://x.com/blockscout/status/1995356773369168319), [BanklessTimes](https://www.banklesstimes.com/articles/2025/12/01/yearn-finance-yeth-pool-loses-9m-in-exploit/)_

  

**November 30th started with [Togbe noticing something odd](https://x.com/Togbe0x/status/1995240261816070482).**

  

[Heavy interactions with Tornado Cash](https://x.com/Togbe0x/status/1995240261816070482). LST tokens moving in unusual patterns across Yearn, Rocket Pool, Origin, and Dinero.

  

[Then the numbers started breaking](https://x.com/Togbe0x/status/1995250249766744338) - yETH supply minted to infinity.

  

_Not an exploit in progress. Already done._

  

**[By the time Peckshield dropped the alert](https://x.com/PeckShieldAlert/status/1995311852310675537), millions were already gone.**

  

[The attack occurred at 21:11 UTC](https://x.com/yearnfi/status/1995344733154250993) - a single atomic transaction that minted approximately [235 trillion yETH tokens](https://x.com/defichad/status/1995517495738781838) and drained the pool completely.

  

[Yearn's Twitter acknowledgment came shortly after the damage was done](https://x.com/yearnfi/status/1995259652288729315): "We are investigating an incident involving the yETH LST stableswap pool. Yearn Vaults (both V2 and V3) are not affected."

  

Almost six hours of silence before the real numbers landed.

  

[$8 million from the yETH stableswap pool](https://x.com/yearnfi/status/1995344745045069909). Another [$0.9 million from the yETH-WETH pool on Curve](https://x.com/yearnfi/status/1995344745045069909).

  

**Total Damage:** $9 million.

  

_Around [1,000 ETH ($3 million) had already been laundered through Tornado Cash](https://x.com/PeckShieldAlert/status/1995311852310675537)._

  

**The rest at the time - roughly $6 million - [sat in the attacker's wallet](https://x.com/PeckShieldAlert/status/1995311852310675537).**

  

[Yearn spun up a war room](https://x.com/yearnfi/status/1995344756940104160) with SEAL911 and ChainSecurity.

  

[They compared the complexity to the recent Balancer hack](https://x.com/yearnfi/status/1995344768830963736) - another precision exploit that turned rounding errors into retirement money. Initial analysis indicated this wasn't going to be a quick explanation.  
  
This was not the first time yearn was exploited.  
  
First they were hit with an [$11 million flash loan attack back in 2021](https://rekt.news/yearn-rekt).  
  
[Followed by an attack in 2023](https://rekt.news/yearn2-rekt), where an attacker exploited a misconfiguration in the project’s yUSDT token contract.

  

**The irony of the 3rd exploit was sharp: [someone doing casual research stumbled across an exploit](https://x.com/Togbe0x/status/1995240261816070482) in a product Yearn had essentially forgotten existed.**

  

_When casual research flags what established processes didn't catch, makes one wonder which legacy products need eyes on them?"_

  

### The Math That Broke

  

_yETH wasn't just any pool - it was a custom stableswap built on complex math-heavy logic for liquid staking token aggregation._

  

**Separate code from Yearn's vaults. No shared infrastructure with V2 or V3. An isolated product with novel invariant calculations that nobody was actively maintaining.**

  

The attack required surgical precision.

  

According to [Banteg from yearn’s post-mortem](https://github.com/banteg/yeth-exploit/blob/main/report.pdf) and [William Li's technical breakdown](https://x.com/hklst4r/status/1995319273456009274), the attacker didn't exploit the math - they weaponized it.

**Step One:** Break the pool's reality.

_[The attacker hammered the pool](https://github.com/banteg/yeth-exploit/blob/main/report.pdf) with remove_liquidity(0) calls - withdrawals of nothing that still triggered recalculations._

**Virtual balances shifted without any actual assets moving. Combine that with update_rates() calls and the [rounding asymmetry between pow_up and pow_down functions](https://github.com/banteg/yeth-exploit/blob/main/report.pdf), and you've got a slowly corrupting invariant.**

Each iteration drifted the relationship between balance sum (Σ) and balance product (Π) further from sanity.

Throw in OETH's rebasing behavior - where balances change automatically - and the invariant stopped representing anything real.

Final withdrawal state: [Σ = 0, Π = 0, supply = 0.](https://github.com/banteg/yeth-exploit/blob/main/report.pdf)

Physically impossible. Mathematically toxic. But the code didn't check.

**Step Two:** Trigger the detonation.

_[The attacker then deposited dust](https://x.com/phalcon_xyz/status/1995430697478361268) - literal pocket change. 1 wei of wstETH, 1 wei of rETH, 1 wei of cbETH, and 9 wei of mETH. Total value: essentially nothing._

**This triggered calc_supply(), a Newton-Raphson solver designed to calculate how many LP tokens to mint. The function tried to solve for a value that satisfied the corrupted invariant.**

[When the amplification factor (A = 4.5 × 10²⁰) met the impossible Σ/Π relationship](https://github.com/banteg/yeth-exploit/blob/main/report.pdf), [](https://x.com/hklst4r/status/1995344276847513816) the solver hit an unchecked arithmetic underflow.

**The calculation:**  s' = (A*Σ - s*r) / (A - PREC)

When AΣ < sr, the numerator goes negative. In EVM arithmetic, negative wraps to 2²⁵⁶, creating a number around 10⁷⁷.

The solver iterates toward "convergence" on a massive value.

**Result:** [D_new ≈ 2.3544 × 10⁵⁶](https://github.com/banteg/yeth-exploit/blob/main/report.pdf)

_The pool minted exactly that many yETH tokens directly to the attacker's address._

**Not a clever economic attack. Not an oracle manipulation. Just broken math executing exactly as written - calculating the "correct" answer to an impossible question.**

The attacker used the counterfeit LP tokens to drain real assets through single-asset withdrawals.

[Helper contracts deployed minutes before the attack handled the heavy lifting](https://x.com/blockscout/status/1995356773369168319), then self-destructed to erase the bytecode trail.

One transaction. One block. Pool emptied.

[Banteg's post-mortem](https://github.com/banteg/yeth-exploit/blob/main/report.pdf) confirmed what analysts suspected: this was an unchecked underflow in a Newton solver triggered by a corrupted invariant state.

**The kind of bug that sits dormant until someone finds exactly the right sequence of operations to detonate it.**

  

_Fragile math and forgotten maintenance made the exploit inevitable - but what did the attacker do once the pool cracked open?_

  

### Follow the Trail  
  
_The attacker didn't materialize from nowhere with a $9 million payday._

  

**The seed money came through Railgun thirty minutes before execution.**

  

**Funding Transaction:** [0x68f88d2ffcef1ceafde26fc290cf1d31ff9a461b4ee2aeb68da8aa9cf70e600c](https://etherscan.io/tx/0x68f88d2ffcef1ceafde26fc290cf1d31ff9a461b4ee2aeb68da8aa9cf70e600c)

  

**Primary Attacker Address:**
[0xa80D3F2022F6Bfd0B260bF16D72CaD025440C822](https://etherscan.io/address/0xa80D3F2022F6Bfd0B260bF16D72CaD025440C822)

**Secondary Attacker Address:**  
[0xFb63aa935Cf0a003335dCE9Cca03c4F9c0fa4779](https://etherscan.io/address/0xfb63aa935cf0a003335dce9cca03c4f9c0fa4779)

  

**Main Attack Contract (Self-Destructed):**
[0xB8e0A4758Df2954063Ca4ba3d094f2d6EdA9B993](https://etherscan.io/address/0xb8e0a4758df2954063ca4ba3d094f2d6eda9b993)

**Secondary Attack Contract (Helper Contract):**  
[0xbb2789b418fA18f9526bA79fa7038d4e6d753f73](https://etherscan.io/address/0xbb2789b418fa18f9526ba79fa7038d4e6d753f73)

  

**Attack Transaction:** [0x53fe7ef190c34d810c50fb66f0fc65a1ceedc10309cf4b4013d64042a0331156](https://etherscan.io/tx/0x53fe7ef190c34d810c50fb66f0fc65a1ceedc10309cf4b4013d64042a0331156)

  

One transaction. Dust deposit. Infinite mint. Pool drain. Self-destruct.

  

_The exploited pool - yETH's custom stableswap - went from operational to empty in a single block._

  
**The Exploited yETH Pool:**
[0x69accb968b19a53790f43e57558f5e443a91af22](https://etherscan.io/address/0x69accb968b19a53790f43e57558f5e443a91af22)

  

Around 1,000 ETH (~$3M) went straight into Tornado Cash - ten deposits, 100 ETH each. No hesitation, no cool‑down period. Just the attacker laundering funds inside the same block as the exploit.  
  
**Attacker’s Loot Wallet (the one that handled both the Tornado flows):**
[0x3e8e7533dcf69c698Cf806C3DB22f7f10B9B0b97](https://etherscan.io/address/0x3e8e7533dcf69c698cf806c3db22f7f10b9b0b97)

_You can see the Tornado pipeline directly in the exploit transaction’s internal calls - all on Etherscan - showing the attacker batching ten 100‑ETH deposits straight into Tornado Cash from this wallet._

  
**Internal calls inside the exploit TX:**  
[Internal Calls on Etherscan](https://etherscan.io/address/0x3e8e7533dcf69c698cf806c3db22f7f10b9b0b97#internaltx) 

Together, these traces show exactly how the attacker chained the exploit, the liquidity drain, and the obfuscation into a single, atomic sequence - one block, start to finish, clean exit.

But not everything stayed stolen.

  

With help from Plume and Dinero teams, Yearn managed to claw back $2.33 million (857.49 pxETH) in a coordinated recovery operation.

  

**Recovery Transaction:** [0x0e83bb95bb9d05fb81213b2fad11c01ea671796752e8770b09935f7052691c35](https://etherscan.io/tx/0x0e83bb95bb9d05fb81213b2fad11c01ea671796752e8770b09935f7052691c35)

  

A decent grab-back, but still leaving a big chunk out in the wild.  
  
**The Primary Attacker Address is still sitting on $3.84 million:**
[0xa80D3F2022F6Bfd0B260bF16D72CaD025440C822](https://debank.com/profile/0xa80d3f2022f6bfd0b260bf16d72cad025440c822)

  

**Roughly a third laundered, a quarter recovered, and the rest left marooned, for now…**

  

_When your exploit leaves a cleaner paper trail than most legitimate DeFi transactions, who's really anonymous?_

  

### The Product Nobody Remembered

  

_yETH wasn't just old code. It was abandoned code still running in production._

  

**[Banteg laid it out plainly](https://x.com/banteg/status/1995477006666830299): "It was a separate product with quite complex/novel math; it doesn't share any code with vaults."**

  

Completely isolated architecture. Custom invariant calculations that no other protocol used.

  

A meta-aggregator for liquid staking tokens that Yearn had essentially stopped maintaining while V2 and V3 vaults continued getting active development and security attention.

  

The contrast was brutal.

  

_Yearn's V2 and V3 vaults - the products people actually used - [remained untouched throughout the exploit](https://x.com/yearnfi/status/1995259652288729315). Those systems had ongoing audits, active monitoring, and continuous development._

  

**They worked exactly as designed while the legacy yETH pool imploded.**

  

yETH? That was the relic nobody thought about until it started bleeding millions.

  

The [vulnerability targeted an outdated version of the yETH token contract](https://www.banklesstimes.com/articles/2025/12/01/yearn-finance-yeth-pool-loses-9m-in-exploit/), not the newer vault infrastructure that Yearn currently promotes.

  

_Legacy contract. Still live. Still processing millions. Just not on anyone’s radar._

  

**The exploit didn’t exploit a clever new vulnerability in modern code.**

  

It exposed something worse - a forgotten product with novel math running unattended until someone bothered to read the contract closely enough to break it.

  

The flaw was simple in concept but catastrophic in effect: a legacy minting logic bug, a forgotten contract running old math, abandoned but live.

  

**Yearn’s response was textbook damage control:** Spin up the war room, coordinate with Plume and Dinero for a partial recovery, and reassure users that active products were safe.

  

**The problem wasn't the response - it was that yETH had been running for years without anyone asking whether legacy products should still be operational.**

  

_When separate code becomes out of sight, out of mind, who makes sure the old systems stay safe?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)







_Another reminder that forgotten code has a long memory._

  

**$9 million vanished through a product nobody remembered to deprecate, drained by math nobody thought to sanity-check, in a pool nobody was actively monitoring.**

  

The V2 and V3 vaults kept humming - proof that when Yearn focuses on something, it works.

  

The danger wasn’t in the active products - it was in the ones still online after the team moved on.

  

Legacy code isn't just technical debt; it's a loaded gun in the codebase waiting for someone curious enough to find the trigger.

  

yETH proved that isolation protects active products but abandons the forgotten ones to anyone willing to read the source.

  

**Three exploits. Three different attack vectors. Three lessons that somehow never stick.**

  

_If code is valuable enough to keep running, it's valuable enough to maintain - and if it's not worth maintaining, how many more loaded guns are sitting in DeFi's abandoned repositories?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
