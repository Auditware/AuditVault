---
tags:
  - blockchain/arbitrum
  - blockchain/ethereum
  - blockchain/optimism
  - sector/bridge
  - sector/lending
  - sector/stable
  - vuln/access-control/uninitialized-owner
  - novelty/variant
title: "Pike Finance - Rekt"
protocol: "[[Pike Finance]]"
date: 2024-04-30
loss_usd: 1900000
auditors:
source: "https://rekt.news/pike-rekt"
excerpt: "Pike Finance swims in turbulent waters, storage vulnerability nets hackers over $1.9 million in multiple attacks."
genome:
  - "[[uninitialized-owner]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[initializer-auth]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
---
# Pike Finance - Rekt

> **Loss:** $1,900,000 | **Date:** 2024-04-30 | **Audited by:** unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/pike-header.png)








_Pike Finance swims in turbulent waters, storage vulnerability nets hackers over $1.9 million in multiple attacks._

  

**The latest exploit caught by [Chain Aegis](https://twitter.com/ChainAegis/status/1785561599543271861) on April 30, resulted in the loss of over $1.6 million in ARB, OP and ETH. [Pike Finance confirmed](https://twitter.com/PikeFinance/status/1785572875124330644) shortly after.** 
  
This incident followed a previous exploit related to a [USDC vulnerability](https://mirror.xyz/pikefinance.eth/M1ToE42vwEHuE6xlz0dVRQwPT0xpaRtpIIw2arOdBAM) reported just days earlier.

  
Pike Finance [acknowledged the initial attack](https://twitter.com/PikeFinance/status/1783989069212799321), but it wasn’t enough.  
  

Unfortunately, the actions taken by Pike Finance after the initial exploit left the protocol open to further attack.  
  
**Another attack that could have been prevented.**  
  
_Does Pike Finance have what it takes to navigate these troubled waters?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)




_Credit: [Quill Audits](https://quillaudits.medium.com/decoding-pike-finance-exploit-quillaudits-40a1662d3f8a), [Pike Finance](https://twitter.com/PikeFinance/status/1785572875124330644?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1785572875124330644%7Ctwgr%5E40c19a8f2aaaf04cc7f8d7d2583d46f0b3d6ca56%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fwww.cryptopolitan.com%2Fpike-finance-hit-1-6m-in-second-hack-days%2F), [Chain Aegis](https://twitter.com/ChainAegis/status/1785561599543271861)_  
  
**Fool me once, shame on you. [Fool me twice](https://www.youtube.com/watch?v=KjmjqlOPd6A), shame on me.**  
  

Pike Finance got played for the fool, falling victim not once, but twice to exploits that allowed attackers to seize control and siphon funds from the protocol.

  

Pike is a universal liquidity market that enables lending and borrowing using native assets directly on their respective blockchains, eliminating the need for wrapping and cross-chain transfers.

  

_[According to Pike Finance](https://twitter.com/PikeFinance/status/1785708269258019074), the initial exploit on April 26 was caused by weak security measures in Pike's contract functions when handling CCTP transfers._  
  
**During protocol pausing attempts, an added dependency in the code altered storage layout and moved the initialized variable, causing contract misbehavior.**

  

Seizing this opportunity, attackers upgraded spoke contracts without admin access, successfully siphoning off funds.  
  
The upgraded implementation contract of the target contract has a vulnerability, which allows the attacker to initialize and then steal the owner permissions.

  

**In addition to the attack on Ethereum, the attacker also carried out attacks on Arbitrum and Optimism.**  
  
_The two attacks stemmed from the same smart contract vulnerability, which allowed the attacker to override the contract._ 
  

**Attack Process by [Quill Audits](https://quillaudits.medium.com/decoding-pike-finance-exploit-quillaudits-40a1662d3f8a):**
-   The attacker exploited the initialize function in the original contract, adding their address to the _isActive variable.
    
-   Taking advantage of unprotected initializer functions, the attacker bypassed security measures meant to prevent multiple executions.
    
-   By leveraging version numbers, the attacker consumed and blocked reusable numbers, enabling them to execute new initialization steps with each upgrade.
- Finally, the attacker performed an upgradeToAndCall, implementing a malicious version of the contract and successfully breaching Pike Finance's security.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/pike-exploit.png)

**April 26 Attack on Arbitrum**

  


Attacker:  
[0xAdaF1626aEC26A7937aE7d1Fa0664e6E0904C1d0  
](https://arbiscan.io/address/0xadaf1626aec26a7937ae7d1fa0664e6e0904c1d0)

Target Contract:
[0x7856493B59cdb1685757A6DcCe12425F6a6666a0](https://arbiscan.io/address/0x7856493b59cdb1685757a6dcce12425f6a6666a0)

  

  
Attack Transaction:  
[0x979ad9b7f5331ea8034305a83b5cd50aea88adec395fff8298dd90eb1b87667f](https://arbiscan.io/tx/0x979ad9b7f5331ea8034305a83b5cd50aea88adec395fff8298dd90eb1b87667f)

  

**April 30 Attack on Multiple Networks**

  

Attacker:
[0x19066f7431df29a0910d287c8822936bb7d89e23](https://etherscan.io/address/0x19066f7431df29a0910d287c8822936bb7d89e23)

  

Attack contract:
[0x1da4bc596bfb1087f2f7999b0340fcba03c47fbd](https://etherscan.io/address/0x1da4bc596bfb1087f2f7999b0340fcba03c47fbd)

  

Target contract:
[0xfc7599cffea9de127a9f9c748ccb451a34d2f063](https://etherscan.io/address/0xfc7599cffea9de127a9f9c748ccb451a34d2f063)

  

Attack Transaction on Optimism:
[0x19066f7431df29a0910d287c8822936bb7d89e23](https://optimistic.etherscan.io/address/0x19066f7431df29a0910d287c8822936bb7d89e23)

  

Attack Transaction on Arbitrum Transaction: [0x19066f7431df29A0910d287C8822936Bb7D89E23](https://arbiscan.io/address/0x19066f7431df29A0910d287C8822936Bb7D89E23)

  


Attack Transaction on Ethereum:  
[0xe2912b8bf34d561983f2ae95f34e33ecc7792a2905a3e317fcc98052bce66431  
](https://etherscan.io/tx/0xe2912b8bf34d561983f2ae95f34e33ecc7792a2905a3e317fcc98052bce66431)

**There are no [public audits](https://docs.pike.finance/v/dev/development/security-and-audit) or [bug bounty programs](https://docs.pike.finance/v/dev/bug-bounty/bug-bounty-program) for Pike Finance, both sections in their site docs state “Coming soon”.**  
  
_They have yet to even update their [contracts page](https://docs.pike.finance/v/dev/development/protocol-contracts) and currently just list the test net contracts._  
  
Pike had a [community presale](https://mirror.xyz/pikefinance.eth/n_E5tyife6TkWP2aaC1OlJnC2JDA6__pMqztVKkVcqY) for their native PIU token at the end of March that generated $6.45 million.  
  
They reached out to the initial exploiter on April 26 in an [onchain message](https://etherscan.io/idm?addresses=0xb1ea97c9f68978905fb1bf5089e71a073bc4f5c8,0xadaf1626aec26a7937ae7d1fa0664e6e0904c1d0&type=1).

  

They are offering a [20% reward](https://twitter.com/PikeFinance/status/1785572875124330644) for the return of the funds, or information leading to the recovery of funds.

  
In addition, a report and plan to make users whole will be provided at a later time.  
  
**According to many responses to the [exploit announcement](https://twitter.com/PikeFinance/status/1785572875124330644), many users want their presale funds back, which appear to be unaffected at this time.**  
  
_Will the team get their act together, or end up doggy-paddling in a sea of mistrust?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_Pike Finance’s security woes raises red flags and makes one wonder, are they winging it or sinking it?_

  

The absence of public audits and bug bounty programs, coupled with their failure to secure contracts after the initial exploit, paints a picture of negligence.

  

**The slow response to the first attack enabled a second, putting its user base at risk, thanks to the sheer carelessness in handling the contracts.**

  

Investors, particularly those who participated in the $6.45 million token presale, are understandably worried.

  

Pike's delayed updates and vague promises of a "report and plan" do little to ease their fears.

  

**Can Pike navigate these stormy waters, or will their cavalier attitude towards security sink them?**

  

_Only time will tell if Pike Finance can right the ship or if they'll serve as yet another cautionary tale of cutting corners in the world of crypto security._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
