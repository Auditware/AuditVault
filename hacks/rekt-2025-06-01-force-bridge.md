---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/lending
  - sector/privacy
  - sector/stable
title: "Force Bridge - Rekt"
protocol: "[[Force Bridge]]"
date: 2025-06-01
loss_usd: 3760000
auditors:
source: "https://rekt.news/force-bridge-rekt"
excerpt: "Force Bridge on Nervos Network dies the day after announcing its own funeral. $3.76M gone in an attack that didn’t exploit a bug - it exploited control. Someone had the keys and someone knew the timin"
genome:
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Force Bridge - Rekt

> **Loss:** $3,760,000 | **Date:** 2025-06-01 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/force-bridge-rekt-header.png)






_Timing this perfect usually costs extra._

  

**Force Bridge just hemorrhaged $3.76 million in what might be crypto's most suspicious "coincidence" this year.**

  

One day the protocol announces its retirement plans.

  

The next day, attackers drain it dry.

  

June 1st brought attackers who somehow gained access control privileges and drained the protocol across two chains.

  

The successful attack followed a failed attempt just six hours earlier, suggesting either remarkable persistence or intimate knowledge of the system's vulnerabilities.

  

**Funds disappeared through Tornado Cash and FixedFloat while [Magickbase](https://x.com/magickbase/status/1929375666396418247), not the official Nervos team, managed all public communications about the incident.**

  

_Maybe this timing is just crypto's cruel sense of irony - or maybe some sunsets are more controlled than they appear?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Magickbase](https://x.com/magickbase/status/1929375666396418247), [The Block](https://www.theblock.co/post/356535/hackers-drain-over-3-million-in-crypto-from-nervos-networks-force-cross-chain-bridge-say-security-analysts), [Cyvers](https://x.com/CyversAlerts/status/1929428359856935185), [Hacken](https://x.com/hackenclub/status/1929451310060892202), [Extractor](https://x.com/extractor_web3/status/1929444219757756584)_

  

**May 31st: [Magickbase may have published](https://x.com/magickbase/status/1928871653934837987) Force Bridge's obituary.**

  

"As the ecosystem grows, we're shifting our focus to UTXO-native innovation, Web5 architecture, Fiber Network" - the strategic pivot that protocols announce when it's time to move on.

  

[Force Bridge's sunset window](https://sunset.forcebridge.com/): June 1st through November 30th. Users had months to withdraw.

  

June 1st: Someone had other plans.

  

Magickbase - Nervos' key infrastructure partner and Force Bridge manager [according to the Block](https://www.theblock.co/post/356535/hackers-drain-over-3-million-in-crypto-from-nervos-networks-force-cross-chain-bridge-say-security-analysts) - surfaces late in the day on June 1st, [frantically tweeting about "abnormal activity"](https://x.com/magickbase/status/1929375666396418247).

  

_Force Bridge itself? No Twitter account. No public voice. Just a protocol that speaks through others._

  

**A few hours later, the damage report lands: $3.76 million gone across Ethereum and BNB Chain.**

  

[Cyvers paints the picture](https://x.com/CyversAlerts/status/1929428359856935185): 257.8K USDT, 539.09 ETH, 898.3K USDC, 60.4K DAI, and 0.79 WBTC - all converted to ETH and fed straight into Tornado Cash.

  

But here's where it gets interesting.

  

The successful attack wasn't the first attempt. They had many failed transactions before finally succeeding. Same attacker, same target, different outcome.

  

**Most hackers don't get do-overs in broad daylight - unless they're remarkably confident nobody's watching.**

  

_So, was this just luck - or something more deliberate?_

  

### Tracing the Footsteps  
  
_[Hacken's blockchain forensics painted a picture](https://x.com/hackenclub/status/1929451310060892202) of methodical preparation._

  

**A day before the exploit, our mystery attacker funded through KuCoin - withdrawing 0.1237 ETH to address on May 31st.**

  

**Funding transaction on Ethereum:** [0x0da4f731d05fce5358eb61115f71dad002d6b8b0c414d3269d8e45e7fa297e4d](https://etherscan.io/tx/0x0da4f731d05fce5358eb61115f71dad002d6b8b0c414d3269d8e45e7fa297e4d)

**Attacker address on Ethereum:**
[0x1998C6d25212194eBf9BB919b87D40b2Dc8aa8b9](https://etherscan.io/address/0x1998c6d25212194ebf9bb919b87d40b2dc8aa8b9)

The attacker also funded a wallet to execute an attack on BSC.  
  
**Funding transaction on BSC:**
[0xa29463be9b81b126d22bb2f6e8001ed36f0bbd71f2b2da763a538e732e747c25](https://bscscan.com/tx/0xa29463be9b81b126d22bb2f6e8001ed36f0bbd71f2b2da763a538e732e747c25)

**Attacker address on BSC:**
[0x1998c6d25212194ebf9bb919b87d40b2dc8aa8b9](https://bscscan.com/address/0x1998c6d25212194ebf9bb919b87d40b2dc8aa8b9?__cf_chl_rt_tk=2_K_D_McPwLYfi0hnvZDkuRwjkxvaphPIZgAnzFqXGE-1748972178-1.0.1.1-mNVaS2lSJAVoXlYx_430xD1YwxEOl6ajMDmqiZFG1IQ)

  

The funding happened [a day before an announcement](https://x.com/magickbase/status/1928871653934837987) that the [Force Bridge would be officially sunsetting](https://sunset.forcebridge.com/). Nothing to see here right?

  

Then, June 1st brought the opening act: multiple failed attempts on Ethereum, before the attack was able to be executed.

  
**Attacked Force Bridge Address on Ethereum:**  
[0x63A993502e74828ddba5710327AFC6dc78d661b2](https://etherscan.io/address/0x63a993502e74828ddba5710327afc6dc78d661b2)

  

**Example Failed Attack Transaction on Ethereum:**
[](https://t.co/ctNSJR31Az) [0x69104f6b14faa6d77ae9837f6d5d01134b2af0e620d54a0723fdd931b40a87c7](https://etherscan.io/tx/0x69104f6b14faa6d77ae9837f6d5d01134b2af0e620d54a0723fdd931b40a87c7)

  

**Successful Attack Transaction 1 on Ethereum ($2.69 million):** 
[](https://t.co/ctNSJR31Az) [0x6b6fbd9d6beef56d2a4f0d14852beea381764b962d7d73ecd216b9fd991299a1](https://etherscan.io/tx/0x6b6fbd9d6beef56d2a4f0d14852beea381764b962d7d73ecd216b9fd991299a1)

  

**Successful Attack Transaction 2 on Ethereum ($437k):**
[0x9859b6cbb2764a6cb86450cd7b514f54766b461735da081195226265d72a75fa](https://etherscan.io/tx/0x9859b6cbb2764a6cb86450cd7b514f54766b461735da081195226265d72a75fa)

  

**Total stolen on Ethereum: $3.127 million.**

  

But this was just the opening chapter of the attack, as the exploit continued on BSC.

  

_Then there were also multiple failed attempts on BSC, before the attack was finally executed._

  

**Example Failed Attack Transaction on BSC:**
[0x57a8d7b0fe1ad8b9159a37a09b3379e82cc85eb047528a5cef09dbf98b881357](https://bscscan.com/tx/0x57a8d7b0fe1ad8b9159a37a09b3379e82cc85eb047528a5cef09dbf98b881357)

**Attacked Force Bridge Address on BSC:**
[0x8215c949F2025B84629041903aDe8394f0a080c6](https://bscscan.com/address/0x8215c949f2025b84629041903ade8394f0a080c6)

  

**Attack Transaction 1 ($571k):**
[0x4c7e83126e9327fe62cb8e3dab72121062eaf213852fd581e7ada43c93ea58a4](https://bscscan.com/tx/0x4c7e83126e9327fe62cb8e3dab72121062eaf213852fd581e7ada43c93ea58a4)

  

**Attack Transaction 2 ($63k):**
[0x555b07899ea87be062a7df84220b38fdf93aded10ad09229e9265bed5753744b](https://bscscan.com/tx/0x555b07899ea87be062a7df84220b38fdf93aded10ad09229e9265bed5753744b)

  

**Total stolen on BSC: $634k**
  

**Total stolen across both chains: $3.76 million.**

  

_Once inside, the execution was textbook efficient._

  

Everything stolen was converted to ETH and pushed through the usual suspects.

  

Tornado Cash handled the bulk of the laundering, while FixedFloat picked up the overflow.

  

No complex DeFi machinations. No elaborate flash loan schemes. Just point, click, and vanish.

  

_By the time [Magickbase announced their "investigation" the next day](https://x.com/magickbase/status/1929480862698987786), the funds had already completed their digital disappearing act through crypto's favorite washing machines._

  

**Meanwhile, the official Nervos Foundation chose a different messaging strategy entirely.**

  

Instead of addressing the $3.76 million elephant in the room, [they posted a "casual reminder"](https://x.com/RunningCKB/status/1929964455049281617) about CKB being "operated by a wide network of users, miners and full nodes" - a decentralized system "beyond anyone's control" that "can't be shut down."

  

Nothing says "we're not responsible" quite like emphasizing how decentralized and uncontrollable your network is right after your main bridge gets drained.

  

The Foundation pivoted straight to talking up Meepo, RGB++, and Fiber Network - the future of CKB development.

  

**Force Bridge? Ancient history. Time to move on.**
  
_When your protocol dies the day after you announce its funeral, who's really writing the obituary?_

  

### The Smoking Gun  
  

_The blockchain doesn't lie, and Force Bridge's death throes tell a story._

  

**Many exploits follow a simple script - hacker finds bug, drains contract, runs away with money.**

  

Force Bridge's attacker had a different playbook entirely.

  

They systematically unlocked token after token. Each unlock demanded [admin-level access to functions](https://x.com/extractor_web3/status/1929444219757756584) that regular users can't touch.

  

This wasn't someone breaking down the door. This was someone who already had the keys.

  

**Access control exploits happen when the wrong people get admin privileges - essentially becoming temporary protocol owners who can call restricted functions like unlock(), withdraw(), or transferOwnership().**

  

No fancy coding required. Just the right credentials - stolen keys, social engineering, or someone on the inside.

  

The timing, the preparation, the test runs, the immediate sunset announcement - it all reeks of someone who knew exactly which buttons to push and when.

  

Could be an incredibly lucky hacker with perfect timing.

  

**Could be someone who didn't need luck at all.**

  

_When the locksmith is the one robbing the vault, do you still call it a break-in?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_Some exits are messier than others._

  

**Force Bridge vanished with barely a whimper - no official account to mourn its passing, no grand post-mortem to explain the $3.76 million disappearing act.**

  

Just [Magickbase's barely 300-follower Twitter account](https://x.com/magickbase) mumbling damage control into the void.

  

The protocol that lived in the shadows died the same way, leaving users to piece together the wreckage from blockchain breadcrumbs and security firm alerts.

  

Don't hold your breath for answers - protocols that sunset themselves the day before getting drained rarely volunteer detailed explanations.

  

**Some bridges burn down in spectacular fashion, but Force Bridge chose a quieter cremation.**

  

_When the people running the funeral parlor are the same ones who called the hearse, should anyone be surprised by the timing?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
