---
tags:
  - blockchain/ethereum
  - sector/dex
  - sector/gaming
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - has/audit
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
  - fix/use-multi-oracle
title: "Uwulend - Rekt"
protocol: "[[Uwulend]]"
date: 2024-06-10
loss_usd: 19400000
auditors:
  - "[[Peckshield]]"
source: "https://rekt.news/uwulend-rekt"
excerpt: "The velo in Velocore proved too fast and furious, as the L2 DEX lost over $6.8 million in a devastating exploit on June 2nd across its pools on Linea and zkSync."
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[use-multi-oracle]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Uwulend - Rekt

> **Loss:** $19,400,000 | **Date:** 2024-06-10 | **Audited by:** Peckshield

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/uwulend-header.png)





_UwuLend, a lending protocol launched by Frog Nation's former CFO [Sifu](https://x.com/0xSifu), was hacked for $19.4 million due to an oracle manipulation attack._  
  
**The attack, [first identified by Cyvers](https://x.com/CyversAlerts/status/1800139071857316328), utilized a series of three transactions within six minutes to convert stolen $WBTC and $DAI into $ETH after being funded from Tornado Cash.**

  

UwuLend [acknowledged the exploit roughly](https://x.com/UwU_Lend/status/1800159455767843009) an hour later, pausing the protocol while the team investigated the situation.  
  

_The $19.4 million in drained capital was swiftly moved across two Ethereum addresses in a blitz strike choreographed with criminal precision._  
  
For a protocol that had recently passed a robust security audit, this blindsiding exploit represented a nightmarish rug pull from the UwuLend depositors' perspective.  
  
**In light of the exploit, skeptics can't help but raise an eyebrow at Sifu's involvement.**  
  
_With his history of controversies, the question on everyone's mind is, has the former Frog Nation CFO orchestrated yet another masterful deception in the crypto realm?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Cyvers Alerts](https://x.com/CyversAlerts/status/1800139071857316328), [UwuLend](https://x.com/UwU_Lend/status/1800159455767843009), [Nick Franklin](https://x.com/0xNickLFranklin/status/1800184254481277324), [CRV Hub](https://x.com/0xcrv_hub/status/1800270842086986184)_

  

**Uwulend’s contract is a fork version of AAVE V2, but they changed the oracle fallback logic to borrow assets at one rate and liquidate them at an artificially inflated rate [as seen here](https://contract-diff.xyz/?address=0x05bfa9157e92690b179033ca2f6dd1e86b25ea4d&chain=0).**  
  
According to [root cause analysis by Nick Franklin](https://x.com/0xNickLFranklin/status/1800184254481277324), the exploit took advantage of a price discrepancy in UwuLend's oracles.  
  

To manipulate the price, the attacker utilized a flash loan. UwuLend's fallback oracle calculated prices based on the state of several Curve pools.  
  
_The attacker could manipulate the pool states by making large trades with the borrowed tokens._

  
**This manipulated the price feed, allowing the attacker to borrow sUSDe at 0.99 but liquidate positions at the inflated 1.03 rate.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/Uwulend-exploit.png)

**Attacker:**
[0x841ddf093f5188989fa1524e7b893de64b421f47](https://etherscan.io/address/0x841ddf093f5188989fa1524e7b893de64b421f47)


**Attack transactions:**

[0x242a0fb4fde9de0dc2fd42e8db743cbc197ffa2bf6a036ba0bba303df296408b](https://etherscan.io/tx/0x242a0fb4fde9de0dc2fd42e8db743cbc197ffa2bf6a036ba0bba303df296408b)

  
[0xb3f067618ce54bc26a960b660cfc28f9ea0315e2e9a1a855ede1508eb4017376](https://etherscan.io/tx/0xb3f067618ce54bc26a960b660cfc28f9ea0315e2e9a1a855ede1508eb4017376)

[0xca1bbf3b320662c89232006f1ec6624b56242850f07e0f1dadbe4f69ba0d6ac3](https://etherscan.io/tx/0xca1bbf3b320662c89232006f1ec6624b56242850f07e0f1dadbe4f69ba0d6ac3)

  

**The stolen funds are parked in the following two addresses:**

 

[0x48d7c1dd4214b41eda3301bca434348f8d1c5eb6](https://etherscan.io/address/0x48d7c1dd4214b41eda3301bca434348f8d1c5eb6)

[0x050c7e9c62bf991841827f37745ddadb563feb70](https://etherscan.io/address/0x050c7e9c62bf991841827f37745ddadb563feb70)

_One person was hit harder than most, [Michael Egorov](https://x.com/newmichwill) the founder of Curve was robbed of just over 23.5 million CRV ($9.85M) that he deposited into UwuLend._

  

The attacker deposited the tokens into Curve’s Llama Lend and borrowed just over 8 million crvUSD ($8.11M).  
  
**[Thanks to the diligent lenders](https://x.com/CurveFinance/status/1800269737563451705) of crvUSD in LlamaLend's CRV market, the [hacker's position was fully hard-liquidated](https://x.com/0xcrv_hub/status/1800270842086986184) as the lenders repaid the debt, being one of the little silver lining of this event by proving the robustness of the platform.**
  

The situation and effects are being unpacked and analyzed in real time in the [Curve Social Telegram](https://t.co/JBZk54WjMu) channel.
  
_Sifu [extended an on-chain olive branch](https://etherscan.io/tx/0x31e5c9a15ce5697c9680cfdeaf5eda60379923d751d3b5eb685b28448d083f97) to the attacker, proposing a 20% white hat bounty if they cooperate by June 12, 17:00 UTC._  
  
Post-deadline, the bounty will shift gears, rewarding anyone who can expose and help bring the exploiter to justice.  
  
**Someone else sent an [onchain message to the hacker](https://etherscan.io/tx/0x172697658fc3c5c12c44595c9ea2e47b69bcb7d7ef4a7044097b537cfb05386c) with instructions on how to move the funds without getting caught.**  
  
_The same address has [sent messages in the past](https://etherscan.io/address/0x81d012ed8fc3b868bb163e4c89346545818c2404) to the exploiter of [Gala Games](https://rekt.news/gala-games-rekt/), [PlayDapp](https://www.theblock.co/post/277334/crypto-gaming-platform-playdapp-loses-290-million-worth-of-tokens-in-two-exploits-elliptic) and [Exactly Protocol](https://rekt.news/exactly-protocol-rekt/) to name a few._  
  
  
UwuLend was [audited by Peckshield](https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-UWU-v1.0.pdf), who [characterized the code](https://medium.com/uwu-lend/peckshield-publishes-exemplary-audit-of-uwu-lend-code-7c8ddfe002d7) as “well designed and engineered,” with “no high-severity or critical issues” detected.  
  
**How did such a critical oracle vulnerability go uncaught by the auditors?**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_The $19.4 million UwuLend exploit leaves more questions than answers._

  

**Despite a recent security audit, a seemingly elementary oracle vulnerability paved the way for one of 2024's most bizarre thefts.**

  

With the attacker's identity still shrouded in mystery, suspicion has fallen on Sifu, who appears to be a common thread in multiple crypto crime scenes.

  

_Questions linger about UwuLend's choice to rely on DEX prices as a fallback oracle._

  

As conspiracy theories swirl, it remains unclear if the UwuLend attack was an unfortunate lapse in security or something more nefarious.  
  
**The overlapping breadcrumb trail of Sifu's involvement, the unorthodox oracle design, and the enigmatic on-chain instruction adds further intrigue.**

  

_Who is the shadowy figure instructing exploiters and are there other cryptic connections that have yet to be uncovered or is it just somebody trying to exploit the attacker?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
