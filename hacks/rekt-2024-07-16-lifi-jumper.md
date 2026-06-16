---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/stable
  - novelty/variant
title: "LiFi/Jumper - Rekt"
protocol: "[[LiFi]]"
date: 2024-07-16
loss_usd: 9730000
auditors:
source: "https://rekt.news/lifi-jumper-rekt"
excerpt: "Infinite approvals... the ultimate leap of faith strikes again. LiFi protocol lost $9.73M to an attack draining addresses that had previously approved infinite permissions to the protocol's contracts "
genome:
  - "[[variant]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
  - "[[upgrade-safety]]"
---
# LiFi/Jumper - Rekt

> **Loss:** $9,730,000 | **Date:** 2024-07-16 | **Audited by:** n/a

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/Lifi-rekt-header.png)













_Infinite approvals... the ultimate leap of faith strikes again._ 

**LiFi protocol lost $9.73M to an attack draining addresses that had previously approved infinite permissions to the protocol's contracts across multiple chains.**
  

Shortly after the alarm was raised by security firm [CertiK](https://x.com/CertiKAlert/status/1813189183533383713), the LiFi team [acknowledged the hack roughly an hour later](https://x.com/lifiprotocol/status/1813207291778215955).

  

Jumper Exchange, which is powered by LiFi's services, also [informed their users about the exploit](https://x.com/JumperExchange/status/1813207462679400682) and [appears to be unaffected as of now](https://x.com/JumperExchange/status/1813249644396150827).

  

Both LiFi and Jumper urged users to check whether their addresses were affected and [revoke approvals via revoke.cash](https://revoke.cash/).  
  
**What's more concerning is that LiFi suffered from an [almost identical exploit back in March 2022](https://blog.li.fi/20th-march-the-exploit-e9e1c5c03eb9), losing $600K from 29 wallets.**

  

_Why did a known bug make it to production on a live protocol... again?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [CertiK](https://x.com/CertiKAlert/status/1813189183533383713), [Nick L. Franklin](https://x.com/0xNickLFranklin/status/1813193007262539784), [Peckshield](https://x.com/PeckShieldAlert/status/1813231231510978851), [LiFi](https://x.com/lifiprotocol/status/1813207291778215955), [Jumper Exchange](https://x.com/JumperExchange/status/1813207462679400682), [Rivanorth](https://blog.rivanorth.com/hack-explained-socket)_

  

**Five days is all it took for history to repeat itself.**  
  
On July 11th, [a new contract facet was added](https://etherscan.io/tx/0x058ffc047f2c621991c65facf62073848433e6a50b4673db59179cb018e91dc2) to the LiFi protocol.  
  
This new contract contained a vulnerable function that lacked proper validation.

  
_[As Nick L. Franklin pointed out](https://x.com/0xNickLFranklin/status/1813193007262539784) that the attack was due to a lack of validation in the "swap" function of the new contract facet added to the protocol._

  

The vulnerable contract failed to properly check the call target and call data, allowing an exploiter to perform a "call injection" attack.

  

**This enabled the attacker to execute arbitrary functions using the permissions granted to the LiFi contract.**

  

Because of this, users who approved the contract for infinite approvals lost their tokens.  
  
**LiFi router set this implementation recently:**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/Lifi-exploit2.png)

**Attacker's address:**
[0x8B3Cb6Bf982798fba233Bca56749e22EEc42DcF3](https://etherscan.io/address/0x8b3cb6bf982798fba233bca56749e22eec42dcf3)

  

**Affected contract addresses:**
**EVM Chains:**  [0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae](https://etherscan.io/address/0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae)
**zkSync:** [0x341e94069f53234fE6DabeF707aD424830525715](https://explorer.zksync.io/address/0x341e94069f53234fE6DabeF707aD424830525715)
**Linea:**  [0xDE1E598b81620773454588B85D6b5D4eEC32573e](https://explorer.linea.build/address/0xDE1E598b81620773454588B85D6b5D4eEC32573e)
**Metis:**  [0x24ca98fB6972F5eE05f0dB00595c7f68D9FaFd68](https://explorer.metis.io/address/0x24ca98fB6972F5eE05f0dB00595c7f68D9FaFd68)

  

Funds stolen include USDT, USDC, and DAI totalling approximately $9.73M, which were subsequently swapped for 2,857 ETH.  
  
The stolen assets have been [distributed to multiple wallets](https://x.com/PeckShieldAlert/status/1813231231510978851) controlled by the attacker.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/Lifi-exploit.png)

**As the [$3.3M Socket protocol hack on January 16th](https://rekt.news/socket-rekt/) shows, cross-chain bridges and aggregators continue to be prime targets for blackhats.**  
  
_Let me know if this sounds familiar?_  
  
The Attacker targeted wallets that had [granted infinite approvals](https://blog.rivanorth.com/hack-explained-socket) to Socket contracts exploiting a recently added route to their bridging contract.  
  
**Peckshield provided some [further analysis on the hack](https://x.com/peckshield/status/1813206767578263921) and seen a direct parallel to the previous attack on LiFi:**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/Lifi-doubleexploit.png)

_In the [post-mortem of the previous exploit](https://blog.li.fi/20th-march-the-exploit-e9e1c5c03eb9), LiFi stated “We then implemented a whitelist to only allow calls to approved DEXs. Our contract was upgraded to include this new whitelist functionality, and swaps were reenabled. On top of that, we have disabled infinite approvals by default.”_ 
  
  
No word on the most recent contract facet being audited.  
  
**Looks like this fell between the cracks, proving once again that in DeFi, yesterday's patch is tomorrow's exploit.**  
  
_With millions at stake, how many more "infinite approvals" will it take before users stop playing Russian roulette with their assets?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


**Infinite approvals: The gift that keeps on grifting.**

  

_Despite LiFi's response that only wallets affected were set to infinite approvals and represented only a very small number of users, the magnitude of the loss suggests otherwise._

  

It's hard to believe that so many users would be vulnerable if infinite approvals weren't commonplace.

With nearly $10M stolen, this will have been a costly lesson in approvals hygiene for many.

  

**Without a regular revoking detox [using a tool such as revoke.cash](https://revoke.cash/), token approvals sit waiting for a live (or forgotten) project to be exploited.**

  

However, all this could have simply been avoided by not making risky, unaudited upgrades to an existing protocol contract.

  

Infinite approvals to upgradeable contracts should come with warnings by every wallet

  

**Maybe it's time to start questioning those "infinite" permissions.**

  

_Have you checked your approvals lately?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
