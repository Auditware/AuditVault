---
tags:
  - blockchain/arbitrum
  - blockchain/bitcoin
  - blockchain/ethereum
  - blockchain/optimism
  - sector/gaming
  - sector/token
title: "Bedrock - Rekt"
protocol: "[[Bedrock]]"
date: 2024-09-25
loss_usd: 2000000
auditors:
source: "https://rekt.news/bedrock-rekt"
excerpt: "Bedrock just got a lesson in why you should always double-check your math homework. In a twist that would make even a quantum physicist's head spin, their uniBTC vault decided to play fast and loose w"
genome:
  - "[[access-roles]]"
  - "[[upgrade-safety]]"
---
# Bedrock - Rekt

> **Loss:** $2,000,000 | **Date:** 2024-09-25 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/bedrock-rekt-header.png)




_Bedrock just got a lesson in why you should always double-check your math homework._  
  
**In a twist that would make even a quantum physicist's head spin, their uniBTC vault decided to play fast and loose with exchange rates, turning Ethereum deposits into a Bitcoin bonanza.**  
  

This digital alchemy managed to transmute $2 million into thin air bon September 25th, before anyone could say "smart contract audit."

  

**The vulnerability, spread across 8 blockchain networks like a particularly virulent strain of crypto-pox, allowed users to mint uniBTC faster than a money printer on steroids.**

  
_In the aftermath of yet another DeFi debacle, we're left pondering: when "code is law" fails, does it default to "finders, keepers"?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Dedaub](https://x.com/dedaub/status/1839443676986278053), [Bedrock  ](https://x.com/Bedrock_DeFi/status/1839479965685100780)_

**In the high-stakes game of DeFi whack-a-mole, Dedaub just scored a critical hit.**

  

These [code sleuths uncovered a ticking time bomb](https://x.com/dedaub/status/1839443676986278053) in Bedrock's uniBTC vault contracts - a vulnerability so juicy it practically had dollar signs for eyes.

  

We're talking about a $75 million treasure chest spread across at least 8 different chains, just waiting for someone to pick the lock.

  

Dedaub, channeling their inner Paul Revere, didn't waste time.

  

_They fired off alerts to Bedrock on Twitter and speed-dialed SEAL 911, all while the crypto world slumbered, blissfully unaware of the impending chaos._ 
  
**But in the world of DeFi, time waits for no dev.**

  

While Bedrock's team was likely dreaming of lambos and tropical islands (or just, you know, sleeping), the vulnerability transformed from potential threat to actual disaster.

  

A mere two hours after Dedaub's digital distress signal, the exploit hit.

  

A swarm of opportunists, realized that Bedrock's smart contract was practically begging to be milked.

_The damage? A cool $2 million vanished faster than you can say "decentralized finance."_  
  
**But here's the kicker - with uniBTC's $75 million market cap on Ethereum alone, this could have been just the tip of a very expensive iceberg.**  
  
As the blockchain detectives pieced together the digital crime scene, they found themselves staring at a vulnerability so basic, it would make a first-year coding student blush.

  

According to the [post mortem](https://mirror.xyz/0xF3c0C25090ae1458FC152947Aab57253cB8E0F0F/7dqKrAfS20rr3m_zuCwN80lChYTB0Cniie5IrdiC9ZQ), the vulnerability in Bedrock's smart contracts was more complex than a simple miscalculation.

  

At its core, the issue stemmed from a failure to properly handle native tokens on non-native BTC chains.

  

_The crux of the problem lay in the SigmaSupplier contract, which didn't register NATIVE_BTC._

  

**This oversight caused the total supply to always register as zero, effectively neutering the caps restriction mechanism designed to prevent unauthorized minting.**

  

With this safeguard unknowingly disabled, the Vault contract's checks were rendered toothless.

  

The result? A wide-open door for users to mint uniBTC tokens using native tokens on non-native BTC chains - a process that should have been impossible by design.

  

In essence, Bedrock's smart contracts were playing by the wrong rulebook, allowing users to mint uniBTC in ways the protocol never intended.

  

It wasn't so much a mathematical error as a fundamental mishandling of token types and chain interactions.  
  
_This mishandling opened the floodgates for a series of exploits across multiple chains._  
  
**The vulnerable vault contract [deployed on September 25th](https://etherscan.io/tx/0x39d910b499899eb14282c4d7b849d53b1fb1db3139522cad6d1a77e22c6410b6), allowed an ETH to uniBTC exchange at a 1:1 rate.**  
  
In one brazen example, an attacker minted 30.8 uniBTC using 30.8 ETH and promptly sold 28.8 uniBTC for 27.8 WBTC in a single transaction.  
  
**Exploiter Address:**  
[0x2bFB373017349820dda2Da8230E6b66739BE9F96  ](https://etherscan.io/address/0x2bfb373017349820dda2da8230e6b66739be9f96)

**Attack Transaction:**
[0x725f0d65340c859e0f64e72ca8260220c526c3e0ccde530004160809f6177940](https://etherscan.io/tx/0x725f0d65340c859e0f64e72ca8260220c526c3e0ccde530004160809f6177940)

And this was just one of many such attacks that collectively drained $2 million from the protocol.  
  
Adding insult to injury, Bedrock's response was slower than a sloth on sedatives.

  

It took them [over 2 hours to publicly acknowledge the exploit](https://x.com/Bedrock_DeFi/status/1839479965685100780) after Dedaub sounded the alarm, and [nearly 4.5 hours to finally pause](https://mirror.xyz/0xF3c0C25090ae1458FC152947Aab57253cB8E0F0F/7dqKrAfS20rr3m_zuCwN80lChYTB0Cniie5IrdiC9ZQ) the vulnerable smart contracts.

  

_In the lightning-fast world of DeFi, that's an eternity - plenty of time for the digital horses to bolt, the stable to burn down, and the ashes to cool._

  

**And in a twist that would make any security expert facepalm, this upgrade didn't undergo an audit.**

  

In the world of DeFi, skipping an audit is like going skydiving and deciding parachutes are optional.  
  
It's a bold strategy, Cotton. Let's see if it pays off for 'em.  
  
The fallout was swift. As word spread faster than a viral meme, the DeFi community sprang into action.

  

_Pendle, holding a significant chunk of uniBTC, hit the brakes on their platform faster than you can say "not my bags."_

  

**Meanwhile, Bedrock's team, finally shaken from their slumber, scrambled to pause the vulnerable contracts.**

  

But in crypto time, where fortunes are made and lost in the blink of an eye, their response felt like watching paint dry.

  

The damage was done. Across eight chains - Ethereum, BNBChain, Arbitrum, Optimism, Mantle, Mode, BOB, and ZetaChain - the vulnerability left its mark.

  

**A total of [125 exploiters](https://docs.google.com/spreadsheets/d/1IYGasQCCvpmhBQ8p9ArvY3Mu07WWDd1XjM9tEwHHUbM) (because why let one person have all the fun?) had their field day.**

  

In the end, Bedrock was left holding the bag, facing a $1.8 million hole in their liquidity and a whole lot of explaining to do.  
  
As they say in the crypto world: another day, another exploit.  
  
But this time, the price of skipping an audit came with a hefty price tag.

  

**If Bedrock itself can crumble so easily, what kind of foundation are we really building on?**

  
_And in the rush to mint the next big thing, are we creating bedrock or just burying landmines?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_In the aftermath of Bedrock's $2 million face-palm moment, we're left shaking our heads in disbelief._

  

**How does an unaudited upgrade slip through the cracks of a protocol handling millions?**

  

Can they rebuild trust after this prehistoric-level security oversight?

  

In the fast-paced world of DeFi, even the most solid foundations can shake.

  

**Bedrock's fumble serves as a stark reminder: in the rush to innovate, we might just be building castles on quicksand.**

  

_As we watch this saga unfold, one can't help but wonder: in the annals of crypto history, will Bedrock be remembered as a cornerstone, or just another stepping stone on the path to "doing better"?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
