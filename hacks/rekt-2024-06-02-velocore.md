---
tags:
  - sector/bridge
  - sector/dex
  - sector/infra
  - sector/lending
  - sector/privacy
  - sector/token
  - has/audit
  - vuln/arithmetic/underflow
  - vuln/logic/fee-calculation
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/known-pattern
title: "Velocore - Rekt"
protocol: "[[Velocore]]"
date: 2024-06-02
loss_usd: 6800000
auditors:
  - "[[Zokyo]]"
  - "[[Hacken]]"
  - "[[Scalebit]]"
source: "https://rekt.news/velocore-rekt"
excerpt: "The velo in Velocore proved too fast and furious, as the L2 DEX lost over $6.8 million in a devastating exploit on June 2nd across its pools on Linea and zkSync."
genome:
  - "[[underflow]]"
  - "[[fee-calculation]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[known-pattern]]"
  - "[[bridge-message-validation]]"
  - "[[fee-accounting]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# Velocore - Rekt

> **Loss:** $6,800,000 | **Date:** 2024-06-02 | **Audited by:** Zokyo, Hacken, Scalebit

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/velocore-header.png)




_Velocore's high-speed Defi ambitions screech to a halt._

  

**The velo in Velocore proved too fast and furious, as the L2 DEX lost over $6.8 million in a devastating exploit on June 2nd across its pools on Linea and zkSync.**

  

A vulnerability in Velocore's Balancer-style CPMM contract allowed an attacker to manipulate fee calculations, ultimately draining a sizable chunk of liquidity.  
  
_The hack led the Linea team to halt block production, which has since resumed._

  

Velocore has offered a 10% bug bounty to the hacker, who has yet to respond.

  
**The actions by Linea’s team to halt the chain due to the [exploit is posing Centralization concerns](https://x.com/Julia_Hexican/status/1797329629704810719).**

  
Despite undergoing multiple audits, Velocore's protocol still had an exploitable flaw.

  
_What's next for Velocore, a comeback or a permanent pit stop?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Officer CIA](https://x.com/officer_cia/status/1797068809959854340), [Beosin](https://x.com/BeosinAlert/status/1797247874528645333), [Linea](https://x.com/LineaBuild/status/1797283402745573837), [Velocore](https://velocorexyz.medium.com/velocore-incident-post-mortem-6197020ec3e9)_

  

**The ever vigilant crypto gumshoe [Officer CIA was the first to spot something fishy](https://x.com/officer_cia/status/1797068809959854340) with Velocore’s liquidity pools.**

  

According to the [post-mortem from Velocore](https://velocorexyz.medium.com/velocore-incident-post-mortem-6197020ec3e9), the attacker sourced funds from Tornado Cash, bridged over to execute the dastardly exploit, and then deposited the ill-gotten gains back into Tornado Cash.

  

The flurry of transactions started with the attacker directly invoking velocore__execute() to simulate huge withdrawals and jack up the feeMultiplier. With that jacked-up multiplier inflating effectiveFee1e9 past 100%, the villain executed a flash loan to scoop up most of the tokens and contract the pool.

  
_Finally, a small single-token withdrawal minted an egregiously large amount of liquidity tokens due to an underflow error, allowing the drainer to easily repay the flash loan and skip town with $6.8 million in ETH._

  

According to an [analysis of the incident from Beosin](https://x.com/BeosinAlert/status/1797247874528645333), the LP Pool lacks permission verification. The attacker directly invoke the velocore__execute function (0xec378808) of the LP contract with a carefully constructed parameter to manipulate the feeMultiplier parameter of the contract.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/velocore-exploit.png)
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/velocore-exploit2.png)

The value of feeMultiplier affects the number of tokens exchanged. The attacker then used the manipulated feeMultiplier parameter to call the execute function (0xd3115a8a) again through the router contract to drain funds from the LP pool.

  

**Attacker Address:**
[0x8cdc37ed79c5ef116b9dc2a53cb86acaca3716bf](https://lineascan.build/address/0x8cdc37ed79c5ef116b9dc2a53cb86acaca3716bf)

  
**Exploited Contracts:**  
[0xed4e130f6f9e68918996f7e1e46a3306b3e12cec](https://lineascan.build/address/0xed4e130f6f9e68918996f7e1e46a3306b3e12cec)

  
[0xb7f6354b2cfd3018b3261fbc63248a56a24ae91a](https://lineascan.build/address/0xb7f6354b2cfd3018b3261fbc63248a56a24ae91a)

  
[0xc030fba4b741b770f03e715c3a27d02c41fc9dae](https://lineascan.build/address/0xc030fba4b741b770f03e715c3a27d02c41fc9dae)

[0xf7f76b30a301524fe76508546B1e3762eF2B9267](https://explorer.zksync.io/address/0xf7f76b30a301524fe76508546B1e3762eF2B9267)

**Attack Transaction 1:** 
[0xed11d5b013bf3296b1507da38b7bcb97845dd037d33d3d1b0c5e763889cdbed1](https://lineascan.build/tx/0xed11d5b013bf3296b1507da38b7bcb97845dd037d33d3d1b0c5e763889cdbed1)

  

**Attack Transaction 2:**
[0x37434e674efc4e7cfeed7746095301ace5636028906fe548b786ead286e35eb0](https://lineascan.build/tx/0x37434e674efc4e7cfeed7746095301ace5636028906fe548b786ead286e35eb0)

  

**Attack Transaction 3:**
[0x4156d73cadc18419220f5bcf10deb4d97a3d3f7533d63ba90daeabc5fd11ba17](https://explorer.zksync.io/tx/0x4156d73cadc18419220f5bcf10deb4d97a3d3f7533d63ba90daeabc5fd11ba17)

  


**Final Fund Destination (Before Tornado Cash):**
[0xe4062fcade7ac0ed47ad794028967a2314ee02b3  
](https://etherscan.io/address/0xe4062fcade7ac0ed47ad794028967a2314ee02b3)

_During the exploit, Linea team halted the sequencer to prevent additional funds bridging out, due to the inability to get in contact with Velocore. “This was the last resort action to protect users on Linea”, the network [wrote on X](https://x.com/LineaBuild/status/1797283402745573837)._

  

While Linea stated its goal was to eventually take away the ability to halt the network from its team once significant decentralization had occurred, the protocol defended the decision to halt the chain.

  

"Most L2s, including Linea, still rely on centralized technical operations which can be leveraged to protect ecosystem participants. Linea's core value is a permissionless, censorship-resistant environment so it was not a decision we took lightly," [the network wrote](https://x.com/LineaBuild/status/1797283561596424296).

  

[Velocore has initiated negotiations](https://etherscan.io/tx/0xf0c87a1dd3fc9bac1c50f37dba4fe81ca8aab3a0aa30e52c23a26929f2688444) with its attacker to recover the $6.8 million in stolen ETH, they are offering 10% as a white hat bug bounty reward.

  

**According to official documents, Velocore claims to have undergone [three rounds of audits](https://docs.velocore.xyz/security-and-contract-address/three-rounds-of-audits), completed by Zokyo, Hacken and Scalebit in August of 2023.**

  

_With their pedal stuck to the metal on insecure code, Velocore has driven itself into a ditch, do they have enough horsepower left to get themselves out?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**For a protocol that boasted multiple audits and solidified security, Velocore is now looking more like a rusty junker left for scrap after this $6.8 million drain.**

  

While dangling a 10% bug bounty carrot, Velocore has yet to lure the hacker out from their Tornado Cash hideout.

_At this rate, the team may need to invest in psychic mediums to communicate with the drainer from the other side._  
  
The question is whether this was an isolated crash, or just the first fender bender in a longer line of recurring collisions for Velocore.

  

**With so many blindspots somehow missed in their audit cycle, cautious crypto travelers may want to steer clear until this project gets completely overhauled from the chassis up.**  
  
_Maybe Velocore finds a way to get their motors humming again or will this exploit force them to permanently park their DeFi dreams in the junker lot?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
