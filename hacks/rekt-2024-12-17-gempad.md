---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - sector/lending
  - has/audit
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
title: "GemPad - Rekt"
protocol: "[[Gempad]]"
date: 2024-12-17
loss_usd: 1900000
auditors:
  - "[[ContractWolf]]"
source: "https://rekt.news/gempad-rekt"
excerpt: "The perfect digital heist - missing reentrancy guards on Gem Pad let an attacker snatch roughly $1.9 million in locked tokens across three chains. Several protocols left wondering if their lock box pr"
genome:
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reentrancy-guard]]"
---
# GemPad - Rekt

> **Loss:** $1,900,000 | **Date:** 2024-12-17 | **Audited by:** ContractWolf

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/gempad-rekt-header.png)



_Missing reentrancy guards turned GemPad's secure lock box into a perfect heist target._

  

**What started as a quiet night across Ethereum, BNB Chain, and Base networks exploded into chaos, as roughly $1.9 million worth of locked tokens found an unauthorized exit.**

  

Several projects watched helplessly as their supposedly secured assets slipped through GemPad's fingers, victims of DeFi's most notorious exploit pattern.

  

BPay, Munch, Nutcoin, and others scrambled to calm their communities while GemPad raced to patch the vulnerability.

  

**The protocol swiftly acknowledged the breach and began working with affected projects, but their stolen liquidity had already scattered across chains.**

  
_How many more protocols need to learn that security isn't just about having locks, but making sure they actually work?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [OkLink](https://x.com/OKLink/status/1868951677623210063), [GemPad](https://x.com/TheGemPad/status/1868977192157204726), [Cyvers Alerts](https://x.com/CyversAlerts/status/1869000606955782305), [pennyplayer](https://x.com/pennysplayer/status/1869025663963091421), [BPay](https://x.com/bpay_token/status/1869023927869014461), [Munch Protocol](https://x.com/MunchToken/status/1869004820419334615), [AnonFi](https://x.com/AnonFiOfficial/status/1869029433966756172), [NutCoin](https://x.com/NutcoinOrg/status/1869004157811585431), [FOMO](https://x.com/FOMOGlobal/status/1869007102058131677), [LOA](https://x.com/secretcoin1848/status/1869015517543252451), [Hemera Trading](https://x.com/hemeratrading/status/1868993898850173335), [Dub Token](https://x.com/TheDubToken/status/1868978338750251012), [Alien Base](https://x.com/AlienBaseDEX/status/1868943734559141956)_

  

**Sometimes the most devastating flaws hide in plain sight, waiting for the right pair of eyes to notice them.**  
  
Like a jeweler examining a suspect gem, scrutiny reveals what casual glances miss.

  

[OKLink's vigilant team](https://x.com/OKLink/status/1868951677623210063) first caught the sparkle of something wrong – multiple protocols bleeding liquidity through the same flaw.

  

Their analysis revealed a critical oversight in GemPad's lock contract: missing reentrancy protection on the withdrawal function, leaving locked assets vulnerable to a classic sleight of hand.

  

_[GemPad confirmed the exploit soon after](https://x.com/TheGemPad/status/1868977192157204726), acknowledging their security locks had been breached and immediately began working with security partners to investigate._

  

**[Cyvers Alerts later confirmed](https://x.com/CyversAlerts/status/1869000606955782305) the scope of the attack, tracking the draining of digital assets across multiple chains as the attacker methodically emptied one lock box after another.**  
  

[Pennyplayer's analysis](https://x.com/pennysplayer/status/1869025663963091421) revealed the elegant simplicity of the attack: a classic reentrancy exploit targeting the collectFees function.

  

The attacker crafted malicious tokens that triggered callbacks during transfers, creating LP locks essentially for free.

  

_With each reentrant call, they could withdraw the locked LP amount, turning GemPad's security mechanism against itself._

  
**Attack transactions by [Blocksec  
](https://app.blocksec.com/explorer/security-incidents?hash=0x2bb6d2ca3b52a01ff9ec01c931f68762ded9a05693ea65d911a20602eea02763&key=214)**

**Attacker address on Mainnet:**

[0xFDd9b0A7e7e16b5Fd48a3D1e242aF362bC81bCaa](https://etherscan.io/address/0xfdd9b0a7e7e16b5fd48a3d1e242af362bc81bcaa)

  
**Attacker address on BSC:**  

[0xFDd9b0A7e7e16b5Fd48a3D1e242aF362bC81bCaa](https://bscscan.com/address/0xfdd9b0a7e7e16b5fd48a3d1e242af362bc81bcaa)

  

**Attacker address on Base:**

[0xFDd9b0A7e7e16b5Fd48a3D1e242aF362bC81bCaa](https://basescan.org/address/0xfdd9b0a7e7e16b5fd48a3d1e242af362bc81bcaa)

  

**Attack Contract on Mainnet:**  

[0x8e18Fb32061600A82225CAbD7fecF5b1be477c43](https://etherscan.io/address/0x8e18fb32061600a82225cabd7fecf5b1be477c43)

  

**Attack Contract on BSC:**

[0x8e18Fb32061600A82225CAbD7fecF5b1be477c43](https://bscscan.com/address/0x8e18fb32061600a82225cabd7fecf5b1be477c43)

  

**Attack Contract on Base:**

[0x8e18Fb32061600A82225CAbD7fecF5b1be477c43  ](https://basescan.org/address/0x8e18fb32061600a82225cabd7fecf5b1be477c43)

_While Base chain still holds a portion of the stolen funds, the rest have already vanished into crypto's favorite mixing service – another digital heist dissolving into the blockchain._

  

**The casualties stacked up quickly. [BPay](https://x.com/bpay_token/status/1869023927869014461) and [Munch Protocol](https://x.com/MunchToken/status/1869004820419334615) watched their liquidity vanish, while [AnonFi halted](https://x.com/AnonFiOfficial/status/1869029433966756172) all token trading.**

  

[Nutcoin's team demanded answers](https://x.com/NutcoinOrg/status/1869004157811585431) as their locks were drained, and [FOMO Network could only watch](https://x.com/FOMOGlobal/status/1869007102058131677) as their pools emptied.

  

[The Law of Attraction Coin](https://x.com/secretcoin1848/status/1869015517543252451) and [Hemera Trading AI](https://x.com/hemeratrading/status/1868993898850173335) scrambled to calm their communities, while [Dub Token](https://x.com/TheDubToken/status/1868978338750251012) faced the ripple effects through [Alien Base's ALB/DUB farm](https://x.com/AlienBaseDEX/status/1868943734559141956).

  

_GemPad's approach to security painted an interesting picture._

  

**Their platform offered a no-code token creation system - [five pre-audited templates](https://gempad.gitbook.io/the-gempad/token-creator/token-creation-portal-audits) ranging from Simple to Ultimate, each with [ContractWolf's](https://contractwolf.io/) stamp of approval.**

  

Projects could point, click, and launch their token [without touching a line of code](https://gempad.gitbook.io/the-gempad).

  

While democratizing token creation might have been the goal, this plug-and-play approach to security proved meaningless when the underlying lock mechanism failed.

  

**While pre-audited templates might make token creation accessible to all, they mean nothing if the foundation beneath them crumbles.**

  

_When one lock breaks and several protocols fall, how many more dominoes are silently waiting their turn?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)



_Missing reentrancy guards turned a trusted vault into a systemic cascade of failures._

  

**Projects rushing to secure their assets behind GemPad's locks found themselves victims of crypto's oldest exploit pattern.**

  

Audited templates and no-code solutions promised security through simplicity, yet failed to protect against a vulnerability as old as DeFi itself.

  

Multiple protocols learned the hard way that outsourcing security doesn't mean outsourcing responsibility.

  

GemPad's swift response and commitment to affected projects shows promise, but their reputation as a trusted platform now hangs by a thread.

  

**Teams building on borrowed trust might want to check their foundations before the next domino starts to wobble.**

  

_Your lock box provider just got their locks picked – still feeling secure about those custody solutions?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
