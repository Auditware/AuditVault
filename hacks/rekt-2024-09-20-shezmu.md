---
tags:
  - sector/dex
  - sector/gaming
  - sector/lending
  - sector/privacy
title: "Shezmu - Rekt"
protocol: "[[Shezmu]]"
date: 2024-09-20
loss_usd: 4900000
auditors:
source: "https://rekt.news/shezmu-rekt"
excerpt: "Shezmu's vault became the latest battleground where $4.9 million vanished faster than a mirage in the desert. But in a twist worthy of a crypto thriller, the saga unfolded not with a bang, but with a "
genome:
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[upgrade-safety]]"
---
# Shezmu - Rekt

> **Loss:** $4,900,000 | **Date:** 2024-09-20 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/shezmu-rekt-header.png)







_Shezmu's vault became the latest battleground where $4.9 million vanished faster than a mirage in the desert._

  

**But in a twist worthy of a crypto thriller, the saga unfolded not with a bang, but with a negotiation.**

  

On September 20th, Shezmu found itself in the crosshairs of an opportunistic hacker who had stumbled upon a critical flaw - a vault accepting collateral that could be minted by anyone.

  

With this vulnerability, the attacker managed to borrow an arbitrary amount of ShezUSD, draining millions from the protocol.

  

**Yet, in a move that would make even the most seasoned poker players sweat, Shezmu called the hacker's bluff.**

  

They laid their cards on the table: return the funds for a 10% bounty and walk away scot-free, or face the full force of the law within 24 hours.

  

The hacker, unfazed, countered with a demand for 20%.

  

**In a game of crypto chicken, Shezmu blinked first, agreeing to the 20% bounty.**

  
_In a world where code is law, but negotiation saves the day, who really holds the winning hand - the hacker with the loot, or the protocol with the flexibility to bend?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Chaofan Shou](https://x.com/shoucccc/status/1837228053862437244), [Shezmu](https://x.com/ShezmuTech/status/1837234208533569547)_

  

**Chaofan Shou, co-founder of blockchain analytics firm Fuzzland, [sounded the alarm](https://x.com/shoucccc/status/1837228053862437244):**

_"ShezmuTech has been hacked / rugged. ~$4.9M worth of $ShezUSD stolen."_

  

The culprit? A vault with a gaping vulnerability - it accepted collateral that could be minted by anyone.

  
This fatal flaw allowed the attacker to borrow an arbitrary amount of ShezUSD, effectively printing money faster than Jerome Powell on a sugar rush.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/shezmu-exploit.png)

**Just 17 days before the exploit, on September 3rd, Shezmu had deployed a contract upgrade:**
[0x8db5356ec348a991adaadfd7f366d72eccafcb0113c7ac31f1dddde9c8c3f81e](https://etherscan.io/tx/0x8db5356ec348a991adaadfd7f366d72eccafcb0113c7ac31f1dddde9c8c3f81e)

  

Did this upgrade introduce the vulnerability? Or did it merely fail to patch an existing one?  
  
In the fast-paced world of DeFi, even routine upgrades can become ticking time bombs.  
  
_A trail of addresses and transactions emerged, painting a clearer picture of the exploit:_

  

**Attack Contract:**
[0xEd4B3d468DEd53a322A8B8280B6f35aAE8bC499C  ](https://etherscan.io/address/0xed4b3d468ded53a322a8b8280b6f35aae8bc499c)

**Shezmu Attacker (created contract):**  
[0xA3a64255484aD65158AF0F9d96B5577F79901a1D  ](https://etherscan.io/address/0xa3a64255484ad65158af0f9d96b5577f79901a1d)

**Attack Contract created:**
[0x39328ea4377a8887d3f6ce91b2f4c6b19a851e2fc5163e2f83bbc2fc136d0c71](https://etherscan.io/tx/0x39328ea4377a8887d3f6ce91b2f4c6b19a851e2fc5163e2f83bbc2fc136d0c71)

  

The attacker didn't just stumble upon a vulnerability; they crafted a bespoke contract to exploit it.  
  
Sometimes in the world of DeFi, your greatest threat might be the anonymous dev next door.  
  
But even the most carefully laid plans can go awry in the volatile realm of crypto.

  

**During the exploit, Chaofan Shou [noticed something interesting](https://x.com/shoucccc/status/1837228626330407227):**  
  
_“Due to low liquidity, these $4.9M worth of $ShezUSD are swapped to only $700K.”_  
  
Could a master heist have been foiled by market mechanics?  
  
As news of the attack spread like wildfire through the crypto-sphere, Shezmu's team didn't waste a moment.

  

Within hours, Shezmu's team sprang into action, [issuing a statement](https://x.com/ShezmuTech/status/1837234208533569547) urging users to steer clear of the dApp while they investigated.

  

_Shezmu [reached out to the attacker](https://x.com/ShezmuTech/status/1837257349125525786) with an offer they hoped couldn't be refused: a 10% bounty in exchange for the safe return of the funds._

  
**The message was clear - play ball, and we'll call it a white-hat hack. Refuse, and face the full force of the law.**  
  
But our hacker wasn't about to fold so easily.

  

The [on-chain conversation](https://etherscan.io/tx/0xcea70ac1b61ee8e5a4cb7d1551ca1d48f196a09fd814b5017baeafcfcd3dcc47) unfolded with surprising civility, considering millions were at stake.

  

Threats of legal action met with polite rebuttals, and in the end, a deal was struck.

Shortly after, the funds began trickling back.

  

Shezmu confirmed recovering the stolen funds, minus the agreed-upon bounty, and stated a post-mortem is forthcoming.

  
**Stolen Funds Returned:**
[0x058a453abb03803aacfcc94cbeb410ceb56aa8aa2edb4ad3efa3e78522980cba](https://etherscan.io/tx/0x058a453abb03803aacfcc94cbeb410ceb56aa8aa2edb4ad3efa3e78522980cba)

  
_The community watched in real-time as a potential catastrophe transformed into a masterclass in crisis management._  
  
**In the aftermath, Shezmu emerged battered but not beaten.**  
  
But here's where the plot thickens. Remember that low liquidity mentioned earlier? Turns out, it might have been the key to this whole resolution.

  

As Chaofan Shou, our eagle-eyed first responder, pointed out:

_"Due to low liquidity, these $4.9M worth of $ShezUSD are swapped to only $700K."_

  

Suddenly, that 20% bounty on the full $4.9 million starts looking pretty attractive, doesn't it?

  

**In the end, was it the threat of legal action, the allure of a hefty bounty, or a hacker's change of heart that saved the day?**

  

_Or perhaps, it was the cold, hard math of a liquidity crunch that turned our black hat white._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)






_While Shezmu’s swift negotiation saved the day, it can't erase the glaring oversight in their security practices._  
  
**Shezmu failed to scrutinize their September 3rd contract upgrade, leaving the door wide open for an enterprising hacker.**

  

In the end, was it skill or luck that kept Shezmu from total ruin?  
  
Their hasty 20% bounty might have saved millions, but it's a band-aid on a bullet wound.  
  
And the soundtrack to this all-too-familiar scene?  
  
Cue the broken record music - another exploit after an upgrade.  
  
**In DeFi, yesterday's patch is tomorrow's exploit, and every upgrade is a roll of the dice.**

  

_In a world where code is law, but human error is constant, who's really in control - the devs, the auditors, or the hackers waiting in the wings?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
