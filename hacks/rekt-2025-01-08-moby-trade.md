---
tags:
  - blockchain/arbitrum
  - blockchain/bitcoin
  - blockchain/ethereum
  - sector/bridge
  - sector/stable
  - impact/loss-of-funds/direct-drain
  - impact/privilege-escalation/ownership-transfer
  - precondition/insider
title: "Moby Trade - Rekt"
protocol: "[[Moby Trade]]"
date: 2025-01-08
loss_usd: 1003080
auditors:
source: "https://rekt.news/mobytrade-rekt"
excerpt: "When your private keys become the white whale, who's really hunting whom? Moby Trade loses roughly $1 million to a compromised key, while white hats rescue $1.47M from the depths. Some lessons of the "
genome:
  - "[[direct-drain]]"
  - "[[ownership-transfer]]"
  - "[[insider]]"
  - "[[bridge-message-validation]]"
  - "[[oracle-freshness]]"
  - "[[upgrade-safety]]"
  - "[[circuit-input-range-check]]"
---
# Moby Trade - Rekt

> **Loss:** $1,003,080 | **Date:** 2025-01-08 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/moby-rekt-header.png)


_In the vast ocean of DeFi, Moby Trade's pursuit of protocol security ended like Captain Ahab's obsession - with their control slipping beneath the waves._

  

**On January 8th, a private key leak led to just over $1 million in assets swimming away faster than digital plankton through a whale's baleen.**

  

Yet this tale harbors two predators - the original attacker who harpooned their way through ETH and BTC, and a whitehat crew who managed to rescue $1.47M USDC from further depths.  
  
One smelled blood in the water, the other threw a life raft.

  

**Through the murky waters of proxy contracts, from Arbitrum's depths to Ethereum's shores, a trail of transactions reveals how quickly security can sink.**

  

_In DeFi's treacherous seas, when a protocol's private keys become its white whale, who really becomes the hunter - and who becomes the hunted?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Chaofan Shou](https://x.com/shoucccc/status/1877036766776967459), [Moby Trade](https://medium.com/moby-trade/moby-post-mortem-report-growth-plan-504ad5b0dd35), [Tony Ke](https://x.com/tonykebot/status/1877240684266295373)_

  

**Just as Ahab's obsession with the white whale left him blind to the dangers of the hunt, Moby Trade's faith in their key management left them exposed to predators lurking in the depths.**  
  
The first ripples of trouble broke the surface when [Chaofan Shou spotted movement](https://x.com/shoucccc/status/1877036766776967459) in the depths - Moby Trade had their hull breached.

  

[Moby's initial response](https://x.com/Moby_trade/status/1877096336140677458) floated somewhere between damage control and a lesson in humility:

  

_"We want to emphasize that it was not a security issue related to the protocol's smart contracts - hackers attempted to steal funds by simply upgrading existing smart contracts using stolen proxy private keys."_

  

**Translation: "Our keys were stolen, but hey, at least our smart contracts worked as intended!"**

  

Behind the scenes, a carefully orchestrated attack was already in motion.

  

Like any skilled hunter, they first tested their harpoon on Arbitrum Sepolia before striking mainnet's depths.  
  
**Attacker Testing the Waters:**  
[0x2a566D111d0a5Be888FEC5F3834434Af3245Bb1b](https://sepolia.arbiscan.io/address/0x2a566d111d0a5be888fec5f3834434af3245bb1b)

  
At the helm of this exploit sat a compromised admin key - the digital equivalent of leaving your ship's wheel unattended in pirate-infested waters.

  

The assault began with a swift transfer of ownership, setting off a chain of events that would drain two vaults.

  

**Like a methodical predator, the attacker struck first at the S_VAULT before circling back thirty minutes later for the M_VAULT.**

  

_Here's how the ship went down…_

  

**Attacker Address:**
[0x2a566D111d0a5Be888FEC5F3834434Af3245Bb1b](https://arbiscan.io/address/0x2a566d111d0a5be888fec5f3834434af3245bb1b)

  

**Transfer of Ownership:**
[0x9da34da770f1e9c5d5e176578b32710d8e288587d8401582f34a9631edf9be4b](https://arbiscan.io/tx/0x9da34da770f1e9c5d5e176578b32710d8e288587d8401582f34a9631edf9be4b)

  

**S_VAULT Attack Transactions:**

  

**30,180 USDC:**
[0xfb260f58332034fe203a41b031c41b8461f469e46d5632b33b328f22aed1fb42](https://arbiscan.io/tx/0xfb260f58332034fe203a41b031c41b8461f469e46d5632b33b328f22aed1fb42)

  

**0.074 wBTC($6,776):**
[0xa64829baf5b83fb6fbebcac334f2c73f6d8ec31a4c8b210538e32105c8ca8566](https://arbiscan.io/tx/0xa64829baf5b83fb6fbebcac334f2c73f6d8ec31a4c8b210538e32105c8ca8566)

  

**0.786 wETH ($2,376):**
[0x15890f9b4db381875d2e1e606f5c0b39540295f2af7ab34abe4dd4722dde18d2](https://arbiscan.io/tx/0x15890f9b4db381875d2e1e606f5c0b39540295f2af7ab34abe4dd4722dde18d2)

  

**M_VAULT Attack Transactions:**

  

**206.97 ETH ($625,302):**
[0x78b8900134bb345c16694096a43532d513dffdbeb3f7e154ac280377c35351b8](https://arbiscan.io/tx/0x78b8900134bb345c16694096a43532d513dffdbeb3f7e154ac280377c35351b8)

  

**3.70 wBTC ($338,446):**
[0x39e21d38087de0d31a3e6bdae42c2431211c3773ca8ea96956062de393dfa291](https://arbiscan.io/tx/0x39e21d38087de0d31a3e6bdae42c2431211c3773ca8ea96956062de393dfa291)

  

_But the attacker made a fatal mistake - they left an unprotected upgradeToAndCall function in their wake._

  

**Enter SEAL911, proving that not all heroes wear capes - some just write better smart contracts and have cooler tech.**

  

The white hat team spotted the vulnerable upgrade function faster than a shark smells blood, deploying their own implementation to rescue $1.47M USDC that was still at risk.

  

As [Tony Ke from SEAL911](https://x.com/tonykebot/status/1877240684266295373) put it: "We just automatically hacked the hacker!"  
  
**$1.47M USDC Rescue:**
[0xa247fb0c2a641ad09f3c798c754662ee46ec56ebebc85c17afa397fdeaafe64a](https://arbiscan.io/tx/0xa247fb0c2a641ad09f3c798c754662ee46ec56ebebc85c17afa397fdeaafe64a)

  

_A race against time [left SEAL911 just 30 seconds behind the original attacker](https://x.com/tonykebot/status/1877240698031800749) - close, but not close enough to save the WETH, WBTC and USDC already lost to the depths._  
  

**The final damage report as of press time:**

  

**207.78 wETH:** $627,678

**3.774 wBTC:** $345,222

**USDC:** $30,180

**Total stolen:** $1,003,080

**Amount rescued by SEAL911:** $1,470,191

  

For the complete trail of over 35 addresses used to disperse the stolen funds, see Moby's [detailed post-mortem](https://medium.com/moby-trade/moby-post-mortem-report-growth-plan-504ad5b0dd35).

  

**Before finally bridging through Stargate to Ethereum:**
[0x6a92d4840309f447922114a349984a1d09a51470](https://arbiscan.io/address/0x6a92d4840309f447922114a349984a1d09a51470)

  

_The waters cleared slowly - first an [incident report](https://x.com/Moby_trade/status/1877329987323432976), then a [post-mortem](https://medium.com/moby-trade/moby-post-mortem-report-growth-plan-504ad5b0dd35) revealing the wreckage._

  
**The protocol detailed their damage control as follows.**  
  
OLP depositors could withdraw their deposits once systems normalized, funded by the team treasury, while options traders would see their positions either compensated at "most favorable value" or returned intact.

  

Although, their [journey to Berachain mainnet](https://x.com/Moby_trade/status/1877109740133822486) has been "a little bit" shifted.

Meanwhile, somewhere in the depths of Arbitrum, stolen funds float through Stargate to safer waters.  
  
**Some lessons of the sea, like lost keys and lost limbs, only need to be learned once.**

_Perhaps they're hoping to find their private keys swimming back upstream?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_SEAL911's rescue operation proves that in DeFi, sometimes you need a white hat to catch a black hat._

  

**But when will protocols learn that private keys make better bait than security solutions?**

  

In DeFi’s waters, private keys aren’t just bait - they’re chum. And the sharks are always circling.

  

The crypto seas remain as dangerous as ever, where one protocol's vulnerability becomes another team's rescue mission.

  

At least this time, some white hats were there to throw a life preserver.

  

**Perhaps next time Moby Trade will remember - in DeFi's ocean, your private keys aren't the only thing that can get harpooned.**  
  
_In these waters, who's really the whale - the protocol that lost its keys, or the predators waiting for the next leak?_


![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
