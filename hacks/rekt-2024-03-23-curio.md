---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/gaming
  - sector/governance
  - sector/rwa
  - sector/token
  - vuln/governance/proposal-manipulation
  - novelty/variant
title: "Curio - REKT"
protocol: "[[Curio]]"
date: 2024-03-23
loss_usd: 16000000
auditors:
source: "https://rekt.news/curio-rekt"
excerpt: "Curio's MakerDAO-based smart contract on Ethereum was exploited for $16 million, due to a critical vulnerability involving voting power privileges."
genome:
  - "[[proposal-manipulation]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
---
# Curio - REKT

> **Loss:** $16,000,000 | **Date:** 2024-03-23 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/curio-header.png)

_Stormy Spring breach._

  

**Curio's MakerDAO-based smart contract on Ethereum was exploited for $16 million, due to a critical vulnerability involving voting power privileges.**




  

Curio [broke the news](https://twitter.com/curio_invest/status/1771635979192774674) first, highlighting that the incident only affected the ecosystem on the Ethereum side and all Polkadot side and Curio Chain contracts remain secure.

  

_The exploit wasn't limited to minting and manipulating governance. It extended into sophisticated financial strategies involving token swaps and cross-chain transfers._

  



  

**The exploiter is still holding 996 Billion [CGT](https://www.coingecko.com/en/coins/curio-governance-token). The total loss is significant, but difficult to calculate, because of the limited market liquidity of CGT.**

  

_Could this just be the beginning of storm season?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Curio](https://twitter.com/curio_invest/status/1771635979192774674), [Hacken](https://twitter.com/hackenclub/status/1772288833565950194)_

  

The Curio Ecosystem, known for bridging the gap between tradfi and defi through tokenized real-world assets, got thunderstruck for a $16M loss over the spring weekend.

  

**On March 23, 2024, CurioDAO Association [announced](https://twitter.com/curio_invest/status/1771635979192774674) its voting protocol experienced an exploit involving a smart contract based on MakerDAO’s fork.**

  

Hacken posted a [thread](https://twitter.com/hackenclub/status/1772288831439413404) outlining the cause of the exploit.

  

As Hacken explained:

  

_The attack was initiated through the "cook" function of an attack contract, which played a crucial role in leveraging the "IDSChief" and "IDSPause" contracts to execute a governance manipulation and mass token minting scheme._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/curio-exploit.png)

The attacker leveraged this vulnerability by acquiring a small number of CGT tokens, thereby gaining access to elevate their voting power within the project’s contract.

  

**By locking these tokens and voting, they gained control, allowing them to execute a delegate call to a malicious contract.**

  

The exploit not only involved minting tokens and manipulating governance but also complex financial strategies such as token swaps and cross-chain transfers, likely in an attempt to distribute and disguise the origin of the minted tokens..

  

_The various swaps and transfers indicate a methodical plan to distribute and perhaps obscure the trail of the minted tokens across multiple platforms and blockchains._

  

Attacker Address: [0xdaAa6294C47b5743BDafe0613d1926eE27ae8cf5](https://etherscan.io/address/0xdaAa6294C47b5743BDafe0613d1926eE27ae8cf5)

  

Attacker Transaction: [0x4ff4028b03c3df468197358b99f5160e5709e7fce3884cc8ce818856d058e106](https://etherscan.io/tx/0x4ff4028b03c3df468197358b99f5160e5709e7fce3884cc8ce818856d058e106)

  

[Attack Visualization on Metaseluth.](https://metasleuth.io/result/eth/0x4ff4028b03c3df468197358b99f5160e5709e7fce3884cc8ce818856d058e106)

  

Despite the incident within the CurioDAO, the impact was confined to the Ethereum side of Curio’s technology stack.

  

**CurioDAO released an [exploit recovery strategy](https://investcurio.medium.com/curiodaos-recovery-plan-1255427f35de) on March 25, highlighting a 2 stage compensation plan:**

  

_-   The Curio team will release a new token CGT 2.0 instead of the current CGT token that is susceptible to exploit attacks._
    
_-   A funds compensation program related to the second token in the liquidity pools will be launched. The compensation program will consist of 4 consecutive stages, each lasting for 90 days._
    

  

They will be developing and deploying a patch to address the identified vulnerability in the voting power privilege access control. Claiming this patch will undergo rigorous testing to ensure its effectiveness in mitigating similar exploits in the future.  
  
Along with that, they plan to enhance Curio DAO's smart contract security through upgrades that enforce stricter access controls, audit the code, and add extra layers of security validation to avoid future exploits.

  

**No known audits could be found and it appears Curio may be doing their security in house.**

  

_It was mentioned in the exploit recovery strategy, Curio is relying on internal expertise and leveraging best practices in smart contract development and security auditing._

  

Curio DAO is offering a reward structure to white hat hackers, based on proceeds from the initial recovery phase, 10% of the proceeds recovered during the first week and 5% after that, until May 25th.

  

_Do you believe Curio would have been better protected by having external audits, instead of keeping things in house?_








![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)
_Spring brought more than just flowers for Curio, not only wiping out $16M, but essentially retiring their original CGT token._

On the bright side, CurioDAO's two-stage compensation plan with a new token, CGT 2.0,may patch things up a bit.  

  
_While Curio claims the exploit was contained to their Ethereum playground, the exploiter is still sitting on 996 Billion CGT tokens._

**Maybe the attacker just got started and will find a way to swap across chains for a complex financial game.**


Will Curio's promise to revamp smart contract security calm any brewing distrust? Time will tell.

If they’re going to keep security in-house, it may not be the best strategy, as highlighted by this attack.  
  

**Launching projects into the wild without proper security due diligence is setting yourself up for failure.**

  

_Are finding risks after the fact becoming too common, or just an indication that the industry needs to invest more in preventive measures and proactive security strategies?_


![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
