---
tags:
  - blockchain/arbitrum
  - sector/bridge
  - sector/dex
  - sector/multisig
  - sector/stable
  - impact/loss-of-funds/direct-drain
  - precondition/insider
title: "Orange Finance - Rekt"
protocol: "[[Orange Finance]]"
date: 2024-01-07
loss_usd: 843500
auditors:
source: "https://rekt.news/orange-finance-rekt"
excerpt: "First significant hack of 2025. Orange Finance got squeezed for $843.5k after their 'multi-sig' turned out to be uni-sig. Their contract is no longer Orange, their security was never golden. Another p"
genome:
  - "[[direct-drain]]"
  - "[[insider]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
---
# Orange Finance - Rekt

> **Loss:** $843,500 | **Date:** 2024-01-07 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/orangefinance-rekt-header.png)



_Orange Finance squeezed out $843.5k to kick off 2025._

  

**Private keys - the gift that keeps on giving to opportunistic hackers hunting for low-hanging fruit.**

  

Somewhere between Tuesday night's darkness and Wednesday morning's light, Orange Finance's admin keys slipped through fingers like digital butter, leaving their Arbitrum-based protocol ripe for plucking.

  

Christmas may be over, but someone still found their way into Orange's stocking, upgrading contracts and draining funds faster than a New Year's champagne toast.

  

**The protocol's damage control playbook unfolded predictably - another private key compromise, another protocol's funds finding a new home.**

  
_When will DeFi protocols learn that private keys make better presents for hackers than security solutions?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Orange Finance](https://mirror.xyz/0x6FA2aF9a4d6fFe654361F713780963C10412e7c3/gN17YMrLhKKg9YT9a391U74pWr9IhqBUDWUqDyDamjE), [Peckshield](https://x.com/PeckShieldAlert/status/1876927206372638819)_

**The digital heist unfolded like clockwork on a quiet Tuesday night.**

  

Orange Finance's team found themselves watching helplessly as their admin access slipped into unauthorized hands.

  

The attacker, armed with a compromised private key, wasted no time exercising their newfound powers.

  

A swift contract upgrade later, and Orange Finance's protocols transformed into well-oiled extraction machines.

  

_"The contract is no longer Orange," the [team announced grimly](https://x.com/0xOrangeFinance/status/1876863611458801890)._

  

PeckShield [quickly amplified the warning](https://x.com/PeckShieldAlert/status/1876927206372638819), urging users to steer clear of the compromised protocols and revoke their approvals.  
  
**But it was too late, the protocol was already squeezed to a pulp.**

  

_Here is how they got juiced…_  
  

**Attacker Address:**
[0x496e5a7ba67735c7ee5eb81ef07b65b909a31345](https://arbiscan.io/address/0x496e5a7ba67735c7ee5eb81ef07b65b909a31345)

  

**Attack Contract:**
[0x17c8eA17F174B5fa49D5090933ff28cE2DF10a3c](https://arbiscan.io/address/0x17c8eA17F174B5fa49D5090933ff28cE2DF10a3c)

  


_The [Attack Sequence](https://mirror.xyz/0x6FA2aF9a4d6fFe654361F713780963C10412e7c3/gN17YMrLhKKg9YT9a391U74pWr9IhqBUDWUqDyDamjE) as follows…_

  

**Initial Token Sweep:**
[0x093673927fc38783d37717b4bd14693c29035fceff6a0c7747db21e88c4ea28f](https://arbiscan.io/tx/0x093673927fc38783d37717b4bd14693c29035fceff6a0c7747db21e88c4ea28f)

  

**SYK Rewards Drain:**
[0x855625c6775b0acd5048b0c94466f76c3c361e2269445e66ae7ae352f04f538f](https://arbiscan.io/tx/0x855625c6775b0acd5048b0c94466f76c3c361e2269445e66ae7ae352f04f538f)

  

**Vault Access Removal:**
[0x14535a9c8e7d5fa2c94de52067a3cf93369273517532e0a06871ddceb3e67dd7](https://arbiscan.io/tx/0x14535a9c8e7d5fa2c94de52067a3cf93369273517532e0a06871ddceb3e67dd7)

  

**Stryke Position Burns:**

  

**Batch 1:**
[0xad0d094c8ea32110ee3bc00d9ba040a79f5ba411296cef5e9b4d25a2c2e2a888](https://arbiscan.io/tx/0xad0d094c8ea32110ee3bc00d9ba040a79f5ba411296cef5e9b4d25a2c2e2a888)

  

**Batch 2:**
[0x1bab3323ed9d1bdea9f57809e47b93b0fc0cd154e003e96812c333dedd74c500](https://arbiscan.io/tx/0x1bab3323ed9d1bdea9f57809e47b93b0fc0cd154e003e96812c333dedd74c500)

  

**Asset Transfers (WETH-USDC):**
[0xecd160e3027b7bdd23423358f68b25eaaee08a9156f745390e14c7b7e9363195](https://arbiscan.io/tx/0xecd160e3027b7bdd23423358f68b25eaaee08a9156f745390e14c7b7e9363195)

  

**Approval Exploitation:**
[0xe31cc5011c7c4ee0720674a38147f9d4765f09e138c4f1d15c45079e2b5507b3](https://arbiscan.io/tx/0xe31cc5011c7c4ee0720674a38147f9d4765f09e138c4f1d15c45079e2b5507b3)

  

**Final Token Swaps:**
[0x38e5199e52eb602b48c7b63e818939908590d341e0b348c208decab146d0e556](https://arbiscan.io/tx/0x38e5199e52eb602b48c7b63e818939908590d341e0b348c208decab146d0e556)

**Attacker move funds to another address:**  
[0xeB0f537A7a1C3E38d4F57026982c11F6886233D7](https://arbiscan.io/address/0xeb0f537a7a1c3e38d4f57026982c11f6886233d7)

**Then makes their exit through Stargate:**  
[0x02bb823d37158314680e39354d690f9182c540f6f345bacc5f4c147b60483876](https://arbiscan.io/tx/0x02bb823d37158314680e39354d690f9182c540f6f345bacc5f4c147b60483876)

  
  **The protocol’s juice was squeezed and bottled-here’s the final pulp tally:**

  

[Uniswap WETH-USDC](https://arbiscan.io/address/0xe1B68841E764Cc31be1Eb1e59d156a4ED1217c2C): $135,709.63

[Uniswap USDC-ARB](https://arbiscan.io/address/0x708790D732c5886D56b0cBBEd7b60ABF47848FaA): $100,278.28

[Uniswap USDC-WBTC](https://arbiscan.io/address/0x01E371c500C49beA2fa985334f46A8Dc906253Ea): $83,546.96

[Uniswap BOOP-WETH](https://arbiscan.io/address/0x3D2692Bb38686d0Fb9B1FAa2A3e2e5620EF112A9): $20,109.71

[Pancake WETH-USDC](https://arbiscan.io/address/0x5f6D5a7e8eccA2A53C6322a96e9a48907A8284e0): $259,376.45

[Pancake USDC-ARB](https://arbiscan.io/address/0xE32132282D181967960928b77236B3c472d5f396): $65,917.20

[Pancake USDC-WBTC](https://arbiscan.io/address/0x22dd31a495CafB229131A16C54a8e5b2f43C1162): $146,541.50

[Sushi WETH-USDC](https://arbiscan.io/address/0x49F60f02B45087ed99EcC4dE63D0337db0d0c6BF): $15,519.62

[Sushi USDC-WBTC](https://arbiscan.io/address/0x5bb109E834A4e4c5422526f0f3d42783031BA80d): $4,414.83

[OrangeDistributor](https://arbiscan.io/address/0x38e4157345bd2c8cf7dbe4b0c75302c2038ab7ec): $12,142.71614

  

**Deposit losses:** $783,966.93

**Losses due to approvals:** $47,447.26

**Unclaimed SYK reward losses:** $12,142.71614  
  
**Total losses:** $843,556.90

  

_With the damage done and assets flowing out, Orange Finance shifted into recovery mode._

  

**Their [initial response](https://x.com/0xOrangeFinance/status/1876863611458801890) followed the familiar incident response playbook: a warning to users against protocol interaction, instructions for contract approval revocations, [and finally](https://x.com/0xOrangeFinance/status/1876900633002852847), a [negotiation attempt](https://mirror.xyz/0x6FA2aF9a4d6fFe654361F713780963C10412e7c3/gN17YMrLhKKg9YT9a391U74pWr9IhqBUDWUqDyDamjE) with their attacker.**

  

"If you respond positively to our offer within 24 hours, we guarantee that no law enforcement agencies will be involved, and the matter will be treated as a white-hat hack."

  

[Their follow-up investigation](https://mirror.xyz/0x6FA2aF9a4d6fFe654361F713780963C10412e7c3/gN17YMrLhKKg9YT9a391U74pWr9IhqBUDWUqDyDamjE) revealed a string of operational failures - not only no monitoring framework and inadequate processes for privileged access, but most critically, their supposedly secure multi-sig wallet configured to execute with a single signature.

  

Now Orange Finance [promises a detailed spreadsheet](https://mirror.xyz/0x6FA2aF9a4d6fFe654361F713780963C10412e7c3/gN17YMrLhKKg9YT9a391U74pWr9IhqBUDWUqDyDamjE) documenting each user's losses, as if tabulating the damage makes it hurt less.

  

**Meanwhile, their investigation into how the private key leaked continues - presumably right after they figure out why leaving a door unlocked might lead to theft.**

  

_How many more protocols need to learn that a multi-sig wallet is only as strong as its configuration?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_Private key compromises continue to plague DeFi with mechanical regularity, each incident following the same script - vulnerability, exploit, investigation, report._

  

**Yet protocols keep treating basic security like an optional upgrade rather than the foundation it needs to be.**

  

Orange Finance's follow-up investigation reads like a "what not to do" manual in protocol security.

  

No monitoring framework, no proper access controls, and a multi-sig wallet with all the security of a garden fence.

  

All while users watch their funds vanish faster than their faith in Web3.

  

**The team promises spreadsheets tracking losses and investigations into leaked keys, but these administrative band-aids can't stop the bleeding of bad security practices.**

  

_When your contract is "no longer Orange," how long until your whole protocol starts to rot?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
