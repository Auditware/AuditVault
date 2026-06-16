---
tags:
  - blockchain/ethereum
  - blockchain/solana
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/nft
  - sector/oracle
  - sector/stable
  - vuln/oracle/stale-price
  - impact/data-corruption/price-manipulation
  - trigger/first-deposit
  - trigger/price-manipulation
  - novelty/known-pattern
title: "Loopscale - Rekt"
protocol: "[[Loopscale]]"
date: 2025-04-26
loss_usd: 5800000
auditors:
source: "https://rekt.news/loopscale-rekt"
excerpt: "Sixteen days after launch, Loopscale lost $5.8M to a basic oracle manipulation. Audits flagged the vulnerability, but they claimed all critical issues fixed. Users trusted them. All funds returned. Is"
genome:
  - "[[stale-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[first-deposit]]"
  - "[[trigger/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[circuit-input-range-check]]"
---
# Loopscale - Rekt

> **Loss:** $5,800,000 | **Date:** 2025-04-26 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01//loopscale-rekt-header.png)






_Sixteen days. That's all it took for Loopscale to join crypto's hall of shame._

  

**Fresh off their launch party, the Solana lending protocol watched helplessly as an attacker drained $5.8 million through their gaping oracle vulnerability on April 26.**

  

One stale price feed was all it took - the digital equivalent of leaving your vault combination taped to the front door. With an audit report warning about oracle validation issues, Loopscale's team somehow found time to market but apparently not time to patch.

  

Their attacker didn't need a PhD in blockchain vulnerabilities - just a basic playbook: mess with collateral prices, grab under-collateralized loans, empty the vaults, bridge the loot, and vanish into crypto's shadowy corners.

  

**Now Loopscale joins crypto's endless conga line of hacked protocols - sliding into their attacker's DMs with bounty offers while tweeting reassurances like a pilot smiling through engine failure.**

  
_When will protocols learn that flashy launches mean nothing if your security is held together with digital duct tape?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Loopscale](https://x.com/LoopscaleLabs/status/1916183179469246626), [Mary Gooneratne](https://x.com/marygooneratne/status/1916189553494315010), [Max N.](https://x.com/greyswan_/status/1916227201067872263), [Sean Hu](https://x.com/seanhu001/status/1916378332696056270), [Bill Papas](https://x.com/bill_papas_12/status/1916240921189904483), [Phat Bear](https://x.com/0xphatbear/status/1916357067721609556)_

  
**Stale prices and undercollateralized loans - a match made in DeFi hell.**

  

Loopscale [slammed the brakes on their markets](https://x.com/LoopscaleLabs/status/1916190858463805611) and [announced the exploit](https://x.com/LoopscaleLabs/status/1916183179469246626) - but by then, the vaults were already bleeding out.

  

Mary Gooneratne, [Loopscale's co-founder chimed in](https://x.com/marygooneratne/status/1916189553494315010), "an attacker took out a series of undercollateralized loans on the protocol, exploiting the Loopscale USDC and SOL Vaults for ~$5.8M."

  

The exploit's surgical precision would be impressive if it weren't so damn predictable.  
  
_While Loopscale scrambled to contain the situation, Max N. had [already spotted the smoking gun](https://x.com/greyswan_/status/1916227201067872263) - the attacker simply deployed a malicious price feed and called Loopscale's own create_loan function, elegantly sidestepping security measures with the digital equivalent of a counterfeit ID._

  

**How many times must this lesson be learned?**

  

Price oracle manipulation has been one of DeFi’s oldest tricks in the book - and somehow, protocols still keep leaving the back door wide open.

  

The attack stripped [roughly 12% of Loopscale's total value](https://x.com/marygooneratne/status/1916189553494315010) in minutes, exploiting a pricing flaw that [Loopscale later admitted was an isolated issue](https://x.com/LoopscaleLabs/status/1916230435291713786) with how they handled RateX-based collateral in their newly launched SOL and USDC Genesis vaults.

  

RateX's founder [Sean Hu wasted no time distancing his protocol](https://x.com/seanhu001/status/1916378332696056270) from the carnage: "Based on our investigation, the Loopscale incident has been confirmed as an oracle attack. RateX's protocol itself has no security issues." Translation: don't blame our price feed - blame the idiots who implemented it.

  

**But the truly impressive part? The attacker didn't need to hack Loopscale's code - they simply reverse-engineered it from the binary.**

  
In the digital world, obscurity isn't security.

  

As Twitter user [Bill Papas explained](https://x.com/bill_papas_12/status/1916240921189904483), the attacker could extract Loopscale's Interface Description Language from the deployed binary, then analyze transaction patterns to recreate functionality locally - essentially reading the lock's blueprint while everyone thought it was safely hidden.

  

**Closed source doesn't mean secure. It just means your vulnerabilities are hidden until they're catastrophically exploited.**  
  
_But when a protocol gets dissected this easily, one has to wonder - was this just lazy security, or something more convenient?_

  

### Following the Money  
  
_The attack took place on Solana, then the funds were bridged to Ethereum through Wormhole._ 
  
**Loopscale Exploiter 1 (Used to move funds to Ethereum):**  
[4QsqugQcrCuSVzU9WjeLDoR6HaaSZtMEZr5JCyxwHgCV](https://solscan.io/account/4QsqugQcrCuSVzU9WjeLDoR6HaaSZtMEZr5JCyxwHgCV)

  

**Loopscale Exploiter 2 (Used to exploit protocol on Solana):**  
[C1QyPYoWQiueqhtLeaG5Nhkv1LJ8oweBNCbfGJ3LprYT](https://solscan.io/account/C1QyPYoWQiueqhtLeaG5Nhkv1LJ8oweBNCbfGJ3LprYT)

  

_Theft activity by Loopscale Exploiter 2 on Solana._  
  
**Attack Transaction 1 ($1.5 million USDC):**  
[https://solscan.io/tx/2Cti6x4wMw2CCvDwQYa4JvnHZAeQaSu6krAtMnBjx9mxHpr3LTmbRDwZs21fjRiwU2Z5dV4BTJbkjaD7E2mxrRrq](https://solscan.io/tx/2Cti6x4wMw2CCvDwQYa4JvnHZAeQaSu6krAtMnBjx9mxHpr3LTmbRDwZs21fjRiwU2Z5dV4BTJbkjaD7E2mxrRrq)

  

**Attack Transaction 2 ($1.5 million USDC):**  
[https://solscan.io/tx/55dmSjy4Whjfqbfp8LwRduzTwz1fDeLu6aj8STqDXeiezZneNJwr2XiX3Qy7yWb2G2DL3d991ACD6sejNkQ7eH5Q](https://solscan.io/tx/55dmSjy4Whjfqbfp8LwRduzTwz1fDeLu6aj8STqDXeiezZneNJwr2XiX3Qy7yWb2G2DL3d991ACD6sejNkQ7eH5Q)

  

**Attack Transaction 3 ($1.5 million USDC):**  
[https://solscan.io/tx/XxksDRzx1KFVJpUzVCFDjRCXJcUzwbdTRYPmHQzZwmzYS6DptV8qAJxU2CGAXhxyPvWLPitFCAuPA6ASBG5beub](https://solscan.io/tx/XxksDRzx1KFVJpUzVCFDjRCXJcUzwbdTRYPmHQzZwmzYS6DptV8qAJxU2CGAXhxyPvWLPitFCAuPA6ASBG5beub)

  

**Attack Transaction 4 ($1.226.7 million USDC):**
[https://solscan.io/tx/2SkCkmX2Q8R7W7RDzgfc6ZFCmYgehmENw72sgTQLfNLHGupNdPDeNkW6S7qCNgYtintFcxhkBCsyf81XA9NSF2RJ](https://solscan.io/tx/2SkCkmX2Q8R7W7RDzgfc6ZFCmYgehmENw72sgTQLfNLHGupNdPDeNkW6S7qCNgYtintFcxhkBCsyf81XA9NSF2RJ)

  
_With the loot secured, the attacker swiftly converted USDC to SOL before making their cross-chain journey._

  
**Swapped USDC for SOL:** 
[https://solscan.io/tx/bR4YweLndnAAUX3DxwSfSqQNZcTgjdhnamLg35hF7tKzMnTPEzHvyAyQJtsAooKwgXY68tBuZzptc2R4aCqLz7H](https://solscan.io/tx/bR4YweLndnAAUX3DxwSfSqQNZcTgjdhnamLg35hF7tKzMnTPEzHvyAyQJtsAooKwgXY68tBuZzptc2R4aCqLz7H)

  

**Transfer stolen funds from Loopscale Exploiter Address 2 to Loopscale Exploiter Address 1 ($5.792 million in SOL - 39474.5 SOL):**  
[https://solscan.io/tx/4uG4fVWmxXuZXNxw2BLWfTFVFbU4aYoqJ6PTntcD2dvRG9wL8csJraZ1MXYK8HjLWp5Wc6k3bwSfgcK861KTigN7](https://solscan.io/tx/4uG4fVWmxXuZXNxw2BLWfTFVFbU4aYoqJ6PTntcD2dvRG9wL8csJraZ1MXYK8HjLWp5Wc6k3bwSfgcK861KTigN7)

  
_Loopscale Exploiter 1 transferred the funds through Wormhole in 3 transactions._  
  
**Wormhole Transaction 1 (5000 SOL - $735k):**
[https://solscan.io/tx/4KHQphm8CSS9YxgDiKgAfsLmTceFLYD8f9JEiaoZZRi7RQxfL3kPY4MD9GXuazeG6eyebChuupkQBA93ufh41QU2](https://solscan.io/tx/4KHQphm8CSS9YxgDiKgAfsLmTceFLYD8f9JEiaoZZRi7RQxfL3kPY4MD9GXuazeG6eyebChuupkQBA93ufh41QU2)

**Wormhole Transaction 2 (10000 SOL - $1.47M):**
[https://solscan.io/tx/FcafMbKHC4e1bArfsWJTDDgYtqktWTLeptmBnpGpSKZTdkSFYUJqtffwmvV1PQTX7Vfxp1EjHdjWMFcw1VWahTH](https://solscan.io/tx/FcafMbKHC4e1bArfsWJTDDgYtqktWTLeptmBnpGpSKZTdkSFYUJqtffwmvV1PQTX7Vfxp1EjHdjWMFcw1VWahTH)

  
**Wormhole Transaction 3 (20000 SOL - $2.96 million):**
[https://solscan.io/tx/5XzyPcvEL8JRD4B8rZcQxKCAi3FtxFYmGBjaWw5rSAu3ET3Z59RHuJafSJebeazZ3xDZDj9Qum8EubRchzN1Gm1e](https://solscan.io/tx/5XzyPcvEL8JRD4B8rZcQxKCAi3FtxFYmGBjaWw5rSAu3ET3Z59RHuJafSJebeazZ3xDZDj9Qum8EubRchzN1Gm1e)

  

_Meanwhile on Ethereum… most of the stolen funds have been returned after the negotiation._
  
**Stolen Funds Returned Transaction 1 ($737k):**
[0x4a5772b6249e080235c473558559156a3c97017f7af6be6aff0d5a95b5dc72f0](https://etherscan.io/tx/0x4a5772b6249e080235c473558559156a3c97017f7af6be6aff0d5a95b5dc72f0)

**Stolen Funds Returned Transaction 2 ($1.47 million):**
[0x17f799be2c200473822afd8175fc1adc281ab361d50d98ebf9e2fd08555595ce](https://etherscan.io/tx/0x17f799be2c200473822afd8175fc1adc281ab361d50d98ebf9e2fd08555595ce)

  

**Stolen Funds Returned Transaction 3 ($2.96 million):**
[0xa92ff591cad42bd2886ef5040e702c8540ed7c302d7b507dbf237d0353407860](https://etherscan.io/tx/0xa92ff591cad42bd2886ef5040e702c8540ed7c302d7b507dbf237d0353407860)

  

**Back on Solana, [Loopscale Exploiter 1](https://solscan.io/account/4QsqugQcrCuSVzU9WjeLDoR6HaaSZtMEZr5JCyxwHgCV) transferred 4,464 SOL ($664k) back to Loopscale:**
[66YqTDPxYukrPtwfPbXv3utHKi2KfqvXXf3De3Km5eQ9GjSbY2kYe1yBk4zVj371fH8BjT9CCPqv4w4wQXnRaxei](https://solscan.io/tx/66YqTDPxYukrPtwfPbXv3utHKi2KfqvXXf3De3Km5eQ9GjSbY2kYe1yBk4zVj371fH8BjT9CCPqv4w4wQXnRaxei)

With every coin accounted for, the money trail ended - but the real drama was just beginning.

_What does it say about DeFi security when the ransom notes are part of the incident response plan?_

### The Negotiation and Aftermath  
  
_Loopscale's post-exploit playbook hit all the classics._

  

**First came the damage control. Markets halted. Users reassured. Bridges and exchanges are notified.**

  

The protocol even managed to [re-enable loan repayments and loop closing within hours](https://x.com/LoopscaleLabs/status/1916230435291713786) - though vault withdrawals remain locked while they "investigate."

  

Then, the inevitable ransom note. Like desperate parents trying to negotiate with a kidnapper.  
  
**[Loopscale sent their exploiter](https://x.com/LoopscaleLabs/status/1916460302704509372) the crypto equivalent of a handwritten plea:**

  

_"We are aware that you exploited a vulnerability in Loopscale's pricing system earlier today... We'd like to offer you a whitehat agreement in exchange for returning 90% of the exploited funds (35,527 SOL)... we agree to allow you to retain a bounty of 10% of the funds (3,947 SOL) and release you from any and all liability."_

  

The [dramatic 24 hour countdown clock](https://x.com/LoopscaleLabs/status/1916460302704509372) was included, but the exploiter wasn't buying the standard 10% offer.

  

[Their counter-proposal](https://etherscan.io/idm?addresses=0xc44196101491bd4e31905d0fe9027d68ad5a5329,0xc9d30e520af584d0867ffc71de162f1c09987fe8&type=1) arrived with characteristic audacity:

  

"We are agreeable to collaborating with you to reach a white hat agreement. However, we would like to negotiate the bounty percentage; our expectation is 20%."

  

_To demonstrate their "good faith," they immediately returned the 5,000 SOL ($735k) bridged in their first transaction._

  

**A clever psychological play - return the smallest portion while holding the remaining millions hostage.**

  

[The attacker made it clear](https://etherscan.io/idm?addresses=0xc44196101491bd4e31905d0fe9027d68ad5a5329,0xc9d30e520af584d0867ffc71de162f1c09987fe8&type=1) that the 20,000 SOL in Wormhole’s limbo was no longer their responsibility, leaving Loopscale to navigate the next steps with the bridge themselves.

  

By Sunday morning, after negotiations began, the first two bridged amounts mysteriously found their way back to Loopscale - $2.2 million returned while $2.96 million sat in bridge limbo.

  

Finally on early Tuesday morning, the exploiter sent back the previously frozen 20,000 SOL ($2.96 million), putting an end to the caper.  
  
By April 29, Loopscale confirmed that all stolen funds had been returned - a rare happy ending in DeFi's exploit theater.  
  
_Following the successful negotiations, [Loopscale assured that](https://x.com/LoopscaleLabs) “Users will incur no loss of deposits from this incident. Additional details (including information on vault withdrawals) to follow.”_  
  

**While the team publicly offered a 10% bounty during negotiations, they remain suspiciously silent about whether the exploiter will receive compensation for returning the loot, even when Rekt News reached out, they’re keeping it under wraps for now.**

  

All's well that ends well? Not quite.

  

Just because a heist ends with returned funds doesn't mean the vault was ever secure.

  

One Twitter user, Phat Bear, [said the quiet part out loud](https://x.com/0xphatbear/status/1916357067721609556): "While Loopscale was transparent about the issue, this was still a severe exploit. You guys opened the Genesis vaults with very high cap ($40M total), but did not conduct a thorough audit on them first."

  

The $40 million in Genesis vaults wasn't an oversight - it was a [deliberate threshold set by a protocol](https://blog.loopscale.com/posts/genesis) that had just emerged from beta, apparently confident their security was bulletproof despite warnings in their audit.

  

**[OShield's audit](https://github.com/oshieldio/Publications/blob/main/Loopscale/loopscale-v1.md) warned about oracle validation, but also [reported that it was fixed](https://x.com/greyswan_/status/1916227204075180385).**

  

_When your protocol claims 'all critical issues fixed' while leaving the door wide open, is it incompetence or hubris that's really to blame?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_Sixteen days post-launch, Loopscale learned the most expensive lesson in DeFi: audits aren't suggestions, they're survival manuals._

  

**Despite recovering all user funds, the reputational damage can't be so easily patched with a GitHub commit.**  
  
But time will tell, as their response to the hack and successful negotiations may be their saving grace.

  

No amount of promised transparency or future post-mortems can erase the fact that they launched a protocol holding millions in user funds while their oracle validation was as robust as a paper umbrella in a hurricane.  
  
The protocol's security architecture crumbled against an attack vector older than most NFT collections.

  

**The bitter irony? [Documentation claimed](https://docs.loopscale.com/resources/faq#has-loopscale-been-audited) "all critical and high-risk issues identified have been fixed" right before an attacker casually exploited the exact vulnerability type their audit had flagged.**

  

_Will protocols ever realize that ignoring security risks today is setting the stage for their own downfall tomorrow?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
