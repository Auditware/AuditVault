---
tags:
  - sector/staking
title: "Bittensor - Rekt"
protocol: "[[Bittensor]]"
date: 2024-07-02
loss_usd: 8000000
auditors:
source: "https://rekt.news/bittensor-rekt"
excerpt: "On July 2, Bittensor's blockchain enlightenment was rudely interrupted by a $8 million hack, due to a compromised PyPi Package Manager. As validators meditated on their nodes, an attacker silently dra"
genome:
  - "[[access-roles]]"
  - "[[reward-accounting]]"
---
# Bittensor - Rekt

> **Loss:** $8,000,000 | **Date:** 2024-07-02 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/bittensor-header.png)










_On July 2, Bittensor's blockchain enlightenment was rudely interrupted by a $8 million hack, due to a compromised PyPi Package Manager._  
  
**As validators meditated on their nodes, an attacker silently drained their wallets faster than you can say "om."**

  

The path of the TAO led straight to the hacker's wallet, with approximately 32,000 [TAO](https://www.coingecko.com/en/coins/bittensor) tokens making an unauthorized journey.

  
**The Bittensor team swiftly responded to the situation by immediately halting all network operations, taking decisive action to address the issue at hand.**

  
The network entered "safe mode," allowing blocks to be produced but preventing any transactions from being processed.  
  
This measure was taken to prevent further losses and protect users while a thorough investigation is conducted.

  

The incident led to a swift 15% decline in the value of the TAO token, demonstrating that in blockchain, as in life, everything flows... including market cap.  
  
**[According to Bittensor’s Telegram](https://t.me/taobittensor/312157), users and stakers are fine. It's just the owners of some validators, subnets and miners that were drained.**

  
_Ready to unpack this clusterbleep of cosmic proportions?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Bittensor](https://blog.bittensor.com/bittnesor-community-update-july-3-2024-45661b1d542d), [ZachXBT  
](https://t.me/investigations/138)_

**Bittensor [initially announced](https://discord.com/channels/799672011265015819/830075335084474390/1257822050702069760) in their Discord that a number of their wallets were attacked, going on to state that they’re investigating and have halted all on-chain transactions as a precaution.**  
  
The attack on Bittensor's blockchain unfolded with the precision of a well-practiced qigong routine.  
  

Over a mere 3-hour span, the attacker managed to compromise multiple high-value wallets, making off with approximately 32,000 TAO tokens.  
  
As the Bittensor team scrambled to respond, the crypto community's favorite on-chain sleuth was already on the case.

  


**Shortly after the theft, [ZachXBT identified the address](https://t.me/investigations/138) that stole the funds:**

  
[5FbWTraF7jfBe5EvCmSThum85htcrEsCzwuFjG3PukTUQYot  
](https://x.taostats.io/account/5FbWTraF7jfBe5EvCmSThum85htcrEsCzwuFjG3PukTUQYot#transfers)

_Zach, ever the crypto detective, [may have tied it to a previous incident](https://t.me/investigations/131) on June 1st, where a TAO holder [had over 28k TAO stolen](https://x.taostats.io/extrinsic/3086433-0007), worth $11.2M at the time of the theft._  
  
The day after the attack, the Opentensor Foundation (OTF) [dropped their post-mortem](https://blog.bittensor.com/bittnesor-community-update-july-3-2024-45661b1d542d), revealing the root cause of the attack was a compromised PyPi Package Manager.  
  
**Here's how this digital dumpster fire unfolded:**

  

-   A malicious package, masquerading as a legitimate Bittensor package, snuck its way into PyPi version 6.12.2.
    
-   This trojan horse contained code designed to steal unencrypted coldkey details.
    
-   When unsuspecting users downloaded this package and decrypted their coldkeys, the decrypted bytecode was sent to a remote server controlled by the attacker.
    

  

The vulnerability affected users who downloaded the Bittensor PyPi package between May 22 and May 29, or used Bittensor==6.12.2, and then performed certain operations like staking, unstaking, transferring, delegating, or undelegating.

  

In response to the attack, the Bittensor team quickly put the chain into "safe mode”, halting all transactions while continuing to produce blocks.  
  
_This swift action may have prevented further losses, but it also highlighted the centralized control the team maintains over the supposedly decentralized network._  
  
**The OTF has taken immediate steps to mitigate the damage:**

  

-   Removed the malicious 6.12.2 package from the PyPi Package Manager repository.
    
-   Conducted a thorough review of Subtensor and Bittensor code on Github.
    
-   Worked with exchanges to trace the attacker and potentially salvage funds.
    

  

**Moving forward, the OTF has promised enhanced package verification, increased outside audit frequency, improved security standards, and increased monitoring moving forward.** 
  
_The OTF stated that the incident did not affect the blockchain or Subtensor code, and the underlying Bittensor protocol remains uncompromised and secure._  
  
They have also been working with several exchanges, providing them with details of the attack in order to trace the attacker and potentially salvage funds.

  

_As the dust settles, the community is left pondering how the malicious package slipped through PyPi's defenses and whether this attack is linked to the June 1st theft._  
  
**It seems in the world of Bittensor, the path to enlightenment is paved with some empty wallets.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)






_The Bittensor hack exposes a critical vulnerability in the crypto ecosystem, the reliance on third-party package managers._

  

**While blockchain protocols themselves may be secure, the tools developers use to interact with them can become unexpected points of failure.**

  

This incident raises questions about the security practices of PyPi and other package repositories that the crypto community depends on.

  

_The timing and similarity to the June 1st theft can't be ignored._

  

**Are these isolated incidents, or is there a more widespread campaign targeting Bittensor and similar projects?**

  

As the OTF works with exchanges to trace the stolen funds, the community watches with bated breath, hoping for a recovery that rarely comes in the wake of such hacks.

  

Bittensor's swift action in halting the network demonstrates the double-edged nature of centralized control in "decentralized" projects.

  

While it may have prevented further losses, it also highlights the fragility of the system.  
  
**In the Tao of crypto, the only constant is change and occasionally, an $8 million vanishing act.** 
  

_As Bittensor reflects on its security practices, will they find true blockchain enlightenment or are they destined to keep laying down these expensive stepping stones on the path to a more perfect protocol?_


![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
