---
tags:
  - sector/gaming
  - sector/lending
  - sector/multisig
  - sector/restaking
  - sector/stable
  - has/audit
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/variant
title: "PrismaFi - REKT"
protocol: "[[PrismaFi]]"
date: 2024-03-28
loss_usd: 11600000
auditors:
  - "[[PrismaFi]]"
source: "https://rekt.news/prismafi-rekt"
excerpt: "PrismaFi fell victim to a flash loan attack, resulting in a loss of 3258 wstETH tokens, valued at approximately $11.6 million."
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[variant]]"
  - "[[flashloan-callback-auth]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# PrismaFi - REKT

> **Loss:** $11,600,000 | **Date:** 2024-03-28 | **Audited by:** PrismaFi

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/prismafi-header.png)


_PrismaFi, the self-described end game for liquid restaking, is the first restaking platform to be gamed._

  

**PrismaFi fell victim to a flash loan attack, resulting in a loss of 3258 wstETH tokens, valued at approximately $11.6 million.**

  


Cyvers [caught the exploit](https://twitter.com/CyversAlerts/status/1773312535338340598) quickly on March 28th, alerting PrismaFi to check their TroveManager contract.

  

PrismaFi [commented soon after](https://twitter.com/PrismaFi/status/1773316945430852058), informing the community that Core engineering contributors will pause the protocol and investigate. [Soon after](https://twitter.com/PrismaFi/status/1773322085776900569), PrismaFi instructed vault owners to disable delegate approvals.  
  
_Around 4 hours later, [PrismaFi announced](https://twitter.com/PrismaFi/status/1773371030129524957) that the protocol was paused by the emergency multisig and the remaining funds are safe. They also stated mkUSD and ULTRA, as stablecoins, are overcollateralized and are not at risk._

  

**[Decurity detected](https://twitter.com/DecurityHQ/status/1773321552378950092) a [copy-cat exploit](https://etherscan.io/address/0x2b80bf785b4739527b7b9515c0f39cf1772fa109) that someone deployed, but not yet used.**

  

The market has been waking up from its extended winter, but with that, the attacks are increasing.  
  
PrismaFi is a fork of the [Liquity Protocol](https://twitter.com/LiquityProtocol), with some changes to the code. Liquity [claims the exploit](https://twitter.com/LiquityProtocol/status/1773359489401413734) on Prisma is not replicable on Liquity.  
  
_With restaking being a hot trend lately and this being the first exploit on a restaking protocol, could restaking exploits become a hot trend as well?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Cyvers](https://twitter.com/CyversAlerts/status/1773312535338340598), [Prisma Finance](https://twitter.com/PrismaFi/status/1773316945430852058), [Decurity](https://twitter.com/DecurityHQ/status/1773321552378950092), [ExVul](https://twitter.com/EXVULSEC/status/1773371169837555742), [Nick Franklin](https://twitter.com/0xNickLFranklin/status/1773354670351597995)_

  

**According to ExVul's [root cause analysis](https://twitter.com/EXVULSEC/status/1773371169837555742), the exploit occurred due to a vulnerability in the MigrateTroveZap contract. This contract is designed to automate the migration process between different versions of Trove Managers for the same collateral.**

  

The contract's onFlashloan() function lacked proper input validation, allowing the attacker to manipulate input data. By doing so, the attacker could trigger the closeTrove and openTrove functions on arbitrary addresses, even those not owned by the attacker.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/prismafi-opentrove1.png)



In the exploit transaction, the attacker targeted a specific address and closed its trove, resulting in the MigrateTroveZap contract being refunded with 1745 wstETH.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/prismafi-opentrove2.png)


Subsequently, the attacker opened a new trove, spending 463 wstETH.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/prismafi-opentrove3.png)

After the onFlashloan callback execution, around 1282 wstETH remained in the MigrateTroveZap contract. The attacker then opened their own trove and called MigrateTroveZap to migrate it, using the remaining 1282 wstETH for their own trove. Finally, the attacker closed the trove and extracted the profits from the exploit. 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/prismafi-opentrove4.png)

**The exploiter was able to gain $11.6M after several successful attacks.**

  
Attacker Contract: [0xD996073019c74B2fB94eAD236e32032405bC027c](https://etherscan.io/address/0xd996073019c74b2fb94ead236e32032405bc027c)

  

Attacker Address: [0x7E39E3B3ff7ADef2613d5Cc49558EAB74B9a4202](https://etherscan.io/address/0x7e39e3b3ff7adef2613d5cc49558eab74b9a4202)

  

Attack Transaction: [0x00c503b595946bccaea3d58025b5f9b3726177bbdc9674e634244135282116c7](https://etherscan.io/tx/0x00c503b595946bccaea3d58025b5f9b3726177bbdc9674e634244135282116c7)

  

Funds transferred to:

[0x5d0064f3B54C8899Ab797445551058Be460C03C6](https://etherscan.io/address/0x5d0064f3b54c8899ab797445551058be460c03c6)

[0x57f7033F84894770F876bf64772E7EBA48990D65](https://etherscan.io/address/0x57f7033f84894770f876bf64772e7eba48990d65)

[0x2d413803a6eC3Cb1ed1a93BF90608f63b157507a](https://etherscan.io/address/0x2d413803a6ec3cb1ed1a93bf90608f63b157507a)

[Attack flow of funds can be found here](https://metasleuth.io/result/eth/0x7E39E3B3ff7ADef2613d5Cc49558EAB74B9a4202?source=ace6e88f-222a-4a94-90ca-095efbdb7355).






  

_One of the addresses where funds were sent, [left a message](https://etherscan.io/tx/0xc2825fd6dd05e8ec9f271d63efdebd06e78296afc0813c65788790567916d209) stating “this is a white hat rescue” and asked to contact someone to offer a refund._

  

**Nick Franklin [highlighted](https://twitter.com/0xNickLFranklin/status/1773354670351597995) that 5 days before the attack, [an address](https://etherscan.io/address/0x56a201b872b50bbdee0021ed4d1bb36359d291ed) approved the MigrateTroveZap contract for migration [here](https://etherscan.io/tx/0xdab673a34d5e4958dbea79e1f491919bd6f1eac2863b098df45e3e1802b039e0) and [here](https://etherscan.io/tx/0x5142c25f3a9bca7c78a1f659b73d08b92c4f7071318008606a96e44cf28a661b). Could this have been prevented?**

  

PrismaFi has [indicated further steps](https://twitter.com/PrismaFi/status/1773371030129524957) will include a Post-Mortem and attempts to retrieve funds. No word on a timeline.

  
There were 3 audits conducted, [MixBytes](https://github.com/prisma-fi/audits/blob/main/audit-mixbytes.pdf) in September 2023, [Nomoi](https://github.com/prisma-fi/audits/blob/main/audit-nomoi.pdf) in early 2024 and [Zellic](https://github.com/prisma-fi/audits/blob/main/audit-zellic.pdf) in July of 2023. Since the MigrateTroveZap contract migration was within the past week, there is no word on this particular contract being audited recently.

  

**With a trail of audits in its wake, PrismaFi's MigrateTroveZap contract may have slipped through the cracks.**

  

_Do you think PrismaFi did their due diligence?_


![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)
_In the high-stakes world of DeFi, even the "end game" can be gamified._

  

The PrismaFi exploit marks the first known attack on a restaking protocol, possibly opening Pandora's box for future incidents.

  

**A part of the story may have yet to unfold, the [copy-cat exploit](https://etherscan.io/address/0x2b80bf785b4739527b7b9515c0f39cf1772fa109) someone deployed, but have yet to use. Could this be foreshadowing?**

  

As restaking platforms gain traction, the DeFi community must stay sharp, prioritizing security and constant vigilance against emerging threats.

  

The PrismaFi incident serves as another cautionary tale, reminding us that hype and growth can attract bad actors and vigilantes eager to exploit vulnerabilities.  
  
Granted, new innovations come from experimenting, but trial running in real time, with real funds, as opposed to doing everything possible in a testing environment is a dangerous game.  
  
**As we chase innovation, maybe we are gambling too much with the security of users' funds.**

  
_Will we learn from our mistakes or continue to play Russian Roulette with our digital fortunes?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
