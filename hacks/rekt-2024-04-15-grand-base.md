---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/gaming
  - sector/rwa
  - sector/token
  - precondition/insider
title: "Grand Base - REKT"
protocol: "[[Grand Base]]"
date: 2024-04-15
loss_usd: 2000000
auditors:
source: "https://rekt.news/grand-base"
excerpt: "Thieves in the night take advantage of Open House as RWA protocol on Base leaves the front door unlocked. Grand Base slammed in $2m exploit due to a deployer wallet private key leak."
genome:
  - "[[insider]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
---
# Grand Base - REKT

> **Loss:** $2,000,000 | **Date:** 2024-04-15 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/grandbase-header.png)



_Thieves in the night take advantage of Open House as RWA protocol on Base leaves the front door unlocked._

  

**Grand Base slammed in a $2m exploit due to a deployer wallet private key leak.**  
  
The breach was first disclosed by a protocol admin in the [Grand Base Telegram channel](https://t.me/grandbase_fi/15354).

  

The admin warned users that the token contract is no longer safe, advising them to immediately cease all swapping or interaction with the contract, and to remove their funds from any associated liquidity pools.  
  
Peckshield took the [first swing](https://twitter.com/PeckShieldAlert/status/1779791627827270125) at announcing the exploit publicly.

  

_Stepping up to the plate 6 hours later, in a [subsequent post on X](https://twitter.com/grandbase_fi/status/1779842048234840261), Grand Base staff claimed they had tracked the wallets of the hacker and were in talks with centralized exchanges to freeze any funds the attacker tried to move."_

  

Coinbase’s L2 is still going through growing pains. While they still had their training wheels on back in August, memecoin [BALD rugged holders](https://rekt.news/bald-rekt/) for $23m.  
  
Less than 2 weeks later, [RocketSwap was compromised](https://rekt.news/rocketswap-rekt/) for $869k, thanks to private keys that were allegedly stolen in a bruteforce attack on the project’s server.  
  
**Since then, Base has been hitting it out of the park, [hovering around $1.5b](https://defillama.com/chain/Base) in TVL and currently ranked #6 in all chains.**

  

_Was somebody waiting for baseball season to start back up to start stealing bases again?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Grand Base](https://twitter.com/grandbase_fi/status/1779842048234840261), [De.Fi](https://twitter.com/De_FiSecurity/status/1779880709122826421), [Peckshield](https://twitter.com/PeckShieldAlert/status/1779791627827270125)_

  

In the early hours of April 15th, at approximately 3AM UTC, GB, a token issued by Grand Base, experienced a [drastic price movement](https://www.dextools.io/app/en/base/pair-explorer/0x284ddada0b71f2d0d4e395b69b1013dbf6f3e6c1?t=1713208415869) that led to an over 90% dump.

  

**Due to a [security breach](https://twitter.com/De_FiSecurity/status/1779880709122826421) of their deployer's wallet, the exploiter was able to mint & sell roughly 32.5m GB tokens.**  
  
Before the minting attack, Grand Base had a [maximum cap of 50 million](https://docs.grandbase.io/grand-token/tokenomics) GB tokens.

  

Malicious transactions the scammer executed in order to mint tokens:

  

Transaction 1:

[https://basescan.org/tx/0xe8b0af9a2c7a3482958792d620328aa780097788fc18e1b7e1328a4a459132d0](https://basescan.org/tx/0xe8b0af9a2c7a3482958792d620328aa780097788fc18e1b7e1328a4a459132d0)

  

Transaction 2:

[https://basescan.org/tx/0x74237dfd7ac0e251311c71ff2c2536b146eeb68c465d47325bdd4517f34a7259](https://basescan.org/tx/0x74237dfd7ac0e251311c71ff2c2536b146eeb68c465d47325bdd4517f34a7259)

  

Afterwards, many swaps were made in order to exchange the tokens to ETH:

[https://basescan.org/address/0xcfe5f1bae0da05ffe9c9c73411b8ec1a286350fc](https://basescan.org/address/0xcfe5f1bae0da05ffe9c9c73411b8ec1a286350fc)

  

In the end, ETH on BASE was bridged to Ethereum:

  

Transfer 1:

[https://basescan.org/tx/0x519acbeb333fd43dead8bc66faa4d419d310d6bf8011a056ce279d26845da70d](https://basescan.org/tx/0x519acbeb333fd43dead8bc66faa4d419d310d6bf8011a056ce279d26845da70d)

  

Transfer 2:

[https://basescan.org/tx/0x66334af4901b7d4e5e536c17fee41431aee3bde03c6da823d4d9dd5adc43aa92](https://basescan.org/tx/0x66334af4901b7d4e5e536c17fee41431aee3bde03c6da823d4d9dd5adc43aa92)

  

Stolen funds are currently sitting in 2 wallets.  
  
Wallet 1:

[https://debank.com/profile/0xd8c21702b74d14b68f2580e28c10ecc53304c274](https://debank.com/profile/0xd8c21702b74d14b68f2580e28c10ecc53304c274)

  

Wallet 2:

[https://debank.com/profile/0xb124546f9f89f178a785d539d299e372b9dc1ec6](https://debank.com/profile/0xb124546f9f89f178a785d539d299e372b9dc1ec6)

  

The [CTO took to Telegram](https://t.me/grandbase_fi/25223) to provide some further insight into the exploit:  
  
_“One of our dev had his PC hacked, the LP wallet was accessible via this PC, with control over our token contract and liquidity pool. This wallet also had the authority to mint new tokens, and proceeded to do so before the market selling them all.”_  
  

The CTO went on to state that the underlying dapp code is secure and can be easily forked. They claim to have intimate knowledge of every line of the codebase. However, the GB token itself will need to be relaunched following the exploit.  
  
_According to the Docs on the Grandbase site, details on their contracts will be published very soon, this was last updated 6 months ago._  
  
**Missing with their contracts are audits. Not a single audit can be found.**

  
With no audits or contract information in sight, it's clear that Grand Base has struck out when it comes to security.  
  
_Will they step up to the plate and address these issues or continue to leave their users vulnerable to future exploits?_


![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)
**The market has recently been going through a rollercoaster ride, experiencing dramatic highs and stomach-churning lows, leaving investors on the edge of their seats as they navigate the wild twists and turns of the volatile landscape.**  
  
While Base is trying to onboard the normies to crypto, suspicious incidents like this serve as a black eye that may deter some users.  
  
_The Grand Base team did initially announce the exploit to their Telegram community._  
  
**Why did the team take 6 hours to announce on X that they were compromised?**

  

Amidst the turbulent market conditions, timely and transparent communication becomes even more critical in maintaining trust within the community.

  

_The delay in publicly announcing the exploit on relevant channels may raise questions about the protocol's commitment to keeping its users well-informed and protected._

  

As Grand Base moves forward, it is crucial for the team to address the lack of contract audits and outdated information, ensuring that security measures are strengthened and user confidence is restored.

  
**Only time will reveal if Grand Base can effectively absorb the learnings from this experience, taking the essential precautions to safeguard against future incidents, or if they'll fall into a cycle of repeating past mistakes, exposing themselves to additional security risks.**  
  
_Will they show up with their A game or continue to strike out?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
