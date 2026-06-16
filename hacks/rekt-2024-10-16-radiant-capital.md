---
tags:
  - blockchain/arbitrum
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/multisig
  - trigger/flash-loan
  - precondition/flash-loan-available
  - precondition/insider
title: "Radiant Capital - Rekt II"
protocol: "[[Radiant Capital]]"
date: 2024-10-16
loss_usd: 53000000
auditors:
source: "https://rekt.news/radiant-capital-rekt2"
excerpt: "Radiant Capital gets a $53M haircut. Thought multi-sigs were safe? Think again. Radiant's 'robust' 3/11 setup crumbled like a house of cards. Exploited twice in 2024, the future of Radiant looks about"
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[insider]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[upgrade-safety]]"
---
# Radiant Capital - Rekt II

> **Loss:** $53,000,000 | **Date:** 2024-10-16 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/radiant-capital-header.png)



_Radiant Capital's future has dimmed following a catastrophic security breach._  
  

**The multi-chain lending protocol suffered a devastating attack that drained over $53 million from user wallets.**  
  
It appears that compromised private keys left Radiant's defenses in tatters.  
  

Markets frozen, users reeling, damage still being tallied and this will be one hell of a post-mortem.  
  
**This marks the second major incident for Radiant in 2024, following a [$4.5 million flash loan exploit](https://rekt.news/radiant-capital-rekt/) earlier this year.**  
  

_Could this be the final nail in Radiant Capital's coffin, or can they somehow rise from these ashes?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Ancilia](https://x.com/AnciliaInc/status/1846606649009885515), [Radiant Capital](https://x.com/RDNTCapital/status/1846634050100039881), [Hacken](https://x.com/hackenclub/status/1846624371252556119)_

  
**The attack on Radiant Capital unfolded with surgical precision, exploiting a critical weakness in the protocol's multi-signature setup.**  
  
Blockchain security firm [Ancilia first spotted suspicious activity](https://x.com/AnciliaInc/status/1846606649009885515) on Radiant's BSC contract, warning users to revoke approvals as $16M had already vanished.

  

Radiant Capital remained silent for two hours before [finally acknowledging the attack](https://x.com/RDNTCapital/status/1846634050100039881) on BSC and Arbitrum.

  

They announced collaborations with security firms and paused markets on Base and Mainnet.  
  
_Radiant also recommended [revoking access](https://revoke.cash/) to the following contracts:_

  

**ARB:**
[0xF4B1486DD74D07706052A33d31d7c0AAFD0659E1](https://bscscan.com/address/0xf4b1486dd74d07706052a33d31d7c0aafd0659e1)

  

**BSC:** 
[0xd50Cf00b6e600Dd036Ba8eF475677d816d6c4281](https://bscscan.com/address/0xd50cf00b6e600dd036ba8ef475677d816d6c4281)

**BASE:**
[0x30798cFe2CCa822321ceed7e6085e633aAbC492F](https://basescan.org/address/0x30798cfe2cca822321ceed7e6085e633aabc492f)

  

**ETH:**
[0xA950974f64aA33f27F6C5e017eEE93BF7588ED07](https://etherscan.io/address/0xA950974f64aA33f27F6C5e017eEE93BF7588ED07)

  This was no ordinary hack, but a masterclass in exploiting centralized control points within decentralized finance.

  

**Radiant's security hinged on an 11-signer multi-sig wallet, a setup that should have provided robust protection.**

  

However, the devil was in the details: only 3 signatures were required to execute transactions. This low threshold proved to be Radiant's Achilles' heel.

  

_The attacker, demonstrating an alarming level of access, managed to gain control of at least 3 of these signers._

  

**With this foothold, they swiftly executed a three-step plan that would make any black hat hacker proud:**

  

-   Transfer ownership of the lending pools to their malicious contract
    
-   Upgrade the implementation of the lending pools
    
-   Drain funds from the compromised pools
    

  

Despite Radiant's use of a MultiSig wallet for security, the attacker managed to gain control and execute a meticulously planned exploit.  
  
The attack unfolded across multiple chains, with evidence suggesting weeks of preparation.

  

**The attacker's first move was to transfer ownership of the Pool Provider contract, which manages Radiant's various lending pools, to a malicious contract.**  
  
_This attack was executed on both BSC and Arbitrum:_

  

**Attack Transaction on BSC:**
[0xd97b93f633aee356d992b49193e60a571b8c466bf46aaf072368f975dc11841c](https://bscscan.com/tx/0xd97b93f633aee356d992b49193e60a571b8c466bf46aaf072368f975dc11841c)

  

**Attack Transaction on ARB:**
[0x7856552db409fe51e17339ab1e0e1ce9c85d68bf0f4de4c110fc4e372ea02fb1](https://arbiscan.io/tx/0x7856552db409fe51e17339ab1e0e1ce9c85d68bf0f4de4c110fc4e372ea02fb1)

  

**Attacker Address 1:**
[0x0629b1048298AE9deff0F4100A31967Fb3f98962  
  ](https://bscscan.com/address/0x0629b1048298ae9deff0f4100a31967fb3f98962)
**Attacker Address 2:**
[0x97a05becc2e7891d07f382457cd5d57fd242e4e8  
  ](https://arbiscan.io/address/0x97a05becc2e7891d07f382457cd5d57fd242e4e8)
  
  The exploiter used DEXs such as 1inch, ParaSwap, PancakeSwap, and Odos to swap for some ETH and BNB, before moving funds to the following wallets.  
  
**Stolen funds moved to Address on ARB:**
[0x8B75E47976C3C500D0148463931717001F620887  
  ](https://arbiscan.io/address/0x8b75e47976c3c500d0148463931717001f620887)
**Stolen funds moved to Address on BSC:**
[0xcF47c058CC4818CE90f9315B478EB2f2d588Cc78](https://bscscan.com/address/0xcf47c058cc4818ce90f9315b478eb2f2d588cc78)

  

_The malicious contract, used as the implementation for the proxy upgrade, was deployed 14 days ago on several chains._

  

**Malicious Contract on BSC:**
[0x57ba8957ed2ff2e7AE38F4935451E81Ce1eEFbf5  
  ](https://bscscan.com/address/0x57ba8957ed2ff2e7ae38f4935451e81ce1eefbf5)
**Malicious Contract on ARB:**
[0x57ba8957ed2ff2e7AE38F4935451E81Ce1eEFbf5](https://arbiscan.io/address/0x57ba8957ed2ff2e7ae38f4935451e81ce1eefbf5)

  

This two-week gap between deployment and execution suggests a carefully orchestrated plan, with the attacker biding their time for the perfect moment to strike.

  

_Interestingly, [blockchain data revealed by Hacken](https://x.com/hackenclub/status/1846624373161013388) point to an attempted exploit on Arbitrum six days prior to the successful attack._

  

**Failed Attack on ARB:**
[0xab34055320676b35d4c6c5936dabc4101b45eda0d66b94ee02f10a96e8a1dd45](https://arbiscan.io/tx/0xab34055320676b35d4c6c5936dabc4101b45eda0d66b94ee02f10a96e8a1dd45)

  

This failed attempt provides insight into the attacker's persistence and willingness to refine their approach.

  

Moreover, the same malicious contract was deployed on Ethereum and Base, though these weren't utilized in the attack.

  

**Malicious Contract on ETH:**
[0x3C2Bc83Dcd293Cc8a23526A37aaeEdD83eBd62de  
  ](https://etherscan.io/address/0x3c2bc83dcd293cc8a23526a37aaeedd83ebd62de)
**Malicious Contract on BASE:**
[0x57ba8957ed2ff2e7AE38F4935451E81Ce1eEFbf5  
  ](https://basescan.org/address/0x57ba8957ed2ff2e7ae38f4935451e81ce1eefbf5)

The attacker's ambition wasn't limited to a two-chain heist. Malicious contracts lay dormant on Ethereum and Base, like digital time bombs waiting for their moment.  
  
It seems our enterprising hacker had dreams of a cross-chain apocalypse, thwarted only by Radiant's belated realization that they were being gutted like a fish.  
  
This wasn't just an attack, it was a master class in DeFi demolition.  
  
**Our "friend" came prepared with a Swiss Army knife of exploits, ready to carve up Radiant's entire multi-chain buffet.**

  

_In this multi-chain feast of vulnerabilities, who's next on the menu?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_Radiant Capital's multi-chain dreams have turned into a cross-chain nightmare._  
  
**With over $53 million evaporating faster than you can say "not your keys" the protocol's future looks about as bright as a black hole.**  
  

This isn't just a flesh wound – it's a full-body amputation.  
  
Radiant's "robust" 3-of-11 multisig turned out to be as secure as a paper lock on a bank vault.  
  
_The attacker didn't just find a chink in the armor; they waltzed through the front door with VIP access._

  

**The hacker's two-week preparation period suggests they had more patience than Radiant had security.**

  

While the protocol was busy expanding across chains, the attacker was meticulously laying out the welcome mat for their own personal heist party.

  

Radiant's second major incident this year begs the question: is this a case of lightning striking twice, or just shoddy electrical wiring?

  

**With their reputation now resembling Swiss cheese, Radiant faces an uphill battle to regain user trust – if there's anyone left to trust them.**  
  
_As users flee the smoldering ruins of yet another DeFi disaster, will they ever feel safe venturing into multi-chain protocols that forgot to install the guard rails?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
