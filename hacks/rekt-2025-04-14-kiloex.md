---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/oracle
  - sector/perpetuals
  - sector/privacy
  - impact/data-corruption/price-manipulation
  - impact/loss-of-funds/direct-drain
  - trigger/price-manipulation
title: "KiloEx - Rekt"
protocol: "[[Kiloex]]"
date: 2025-04-14
loss_usd: 7491500
auditors:
source: "https://rekt.news/kiloex-rekt"
excerpt: "Oracle manipulation 101 - check your damn validation. KiloEx lost almost $7.5 million when their MinimalForwarder contract accepted any forged signature without verification. The attack hit Base, BNB "
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[direct-drain]]"
  - "[[trigger/price-manipulation]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[pyth-oracle-completeness]]"
---
# KiloEx - Rekt

> **Loss:** $7,491,500 | **Date:** 2025-04-14 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01//kiloex-rekt.png)



_KiloEx just learned the hard way that fancy multi-chain deployments don't protect you from basic security flaws._

  

**Their multi-chain perpetual protocol lost almost $7.5 million after an attacker slid into their oracle's code with a wallet funded through Tornado Cash.**

  

One minute you're celebrating your Binance backing, the next you're begging a faceless hacker to accept a 10% bounty and return your users' funds.

  

While the team was busy expanding across Base, BNB Chain, and Taiko, they somehow missed the gaping hole in their oracle implementation that practically screamed "rob me."

  

**The attacker didn't need some novel zero-day exploit - just the digital equivalent of walking through an unlocked front door.**

  

_When will protocols learn that having "Kilo" in your name doesn't automatically give you the heavyweight security needed in DeFi's bloodsport arena?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Chaofan Shou](https://x.com/shoucccc/status/1911862514440376446), [Cyver’s Alerts](https://x.com/CyversAlerts/status/1911867270852227131), [KiloEx](https://x.com/KiloEx_perp/status/1911899600849617330), [SlowMist](https://x.com/SlowMist_Team/status/1911991384254402737), [ScaleBit](https://x.com/scalebit_/status/1912025236654215435)_

  

**Price manipulation? More like price annihilation.**

  

Security engineer [Chaofan Shou sounded the first alarm](https://x.com/shoucccc/status/1911862514440376446) on April 14th - "KiloEx_perp is hacked. $6M+ loss already. Likely due to price oracle access control issues."

  

Minutes later, [Shou confirmed the fatal flaw](https://x.com/shoucccc/status/1911882201211568479) - "Anyone can change Kilo's price oracle."

  

Twenty minutes after Shou's alert, [Cyvers Alerts confirmed the bloodbath](https://x.com/CyversAlerts/status/1911867270852227131) - "$7M HACK ALERT" across multiple chains.

  

The attack had already metastasized from BNB to Base to Taiko, funds draining like a punctured artery.  
  

**[KiloEx acknowledged the security incident](https://x.com/KiloEx_perp/status/1911899600849617330) hours later, suspending platform usage and working with security partners to trace the flow of funds.**

  

_Ready to measure just how lightweight KiloEx's security really was?_  
  
### Inside the Exploit  
  
_No fancy zero-day needed when the front door's wide open._

  

**KiloEx made stealing almost $7.5M easier than creating a new crypto wallet.**

  

[SlowMist's autopsy](https://x.com/SlowMist_Team/status/1911991384254402737) reads like a comedy of errors.  
  
Their "security" boiled down to a MinimalForwarder contract with security so minimal it didn't bother checking who was actually calling it.

  

[Four contracts linked together](https://x.com/SlowMist_Team/status/1911991384254402737) like a flimsy paper chain, each assuming the other would check IDs.

  

_KiloPriceFeed trusts Keeper. Keeper trusts PositionKeeper. PositionKeeper trusts MinimalForwarder._

  

**And MinimalForwarder? MinimalForwarder? It trusts anyone with a forged signature and zero data validation.**

  

The attacker walked right in, cranked ETH prices down to $100, opened leveraged longs, then jacked prices to $10,000. Cash out. Repeat.

  

Base chain alone hemorrhaged $3.12 million through a hole so obvious it might as well have had a neon sign.

  

**Don't blame the [Pyth Network’s](https://x.com/PythNetwork) oracle for this mess. KiloEx's implementation made a TSA checkpoint look airtight by comparison.** 
  

_How does a $7.5 million heist move through crypto's dark alleys without leaving footprints?_  
  
### Following the Stolen Loot

  

_Tornado Cash, crypto's favorite mixer turned digital laundromat._

  

**That's where our attacker's wallet first popped onto the blockchain radar on April 13th - a full day before turning KiloEx into their personal money printer.**  
  
**Funding from Tornado Cash:**  
[0xa0fa4ab8ded0c07085d244e1981919b440f78b609e1cf8d7f8ee32d358dfdf46](https://etherscan.io/tx/0xa0fa4ab8ded0c07085d244e1981919b440f78b609e1cf8d7f8ee32d358dfdf46)

  

The exploiter knew exactly what they were doing.

  

Base, BNB Chain, Taiko, opBNB - all hit with precision timing that would make Swiss watchmakers jealous.

  

Same vulnerability, different chains, just under $7.5M gone.  
  

**Attacker's Addresses on Ethereum:**
[0x00fac92881556a90fdb19eae9f23640b95b4bcbd](https://etherscan.io/address/0x00fac92881556a90fdb19eae9f23640b95b4bcbd)

  

After receiving funding through Tornado Cash on Mainnet, the exploiter began their massacre…  
  
**Attacker’s Address on Base:**  
[0x00fac92881556a90fdb19eae9f23640b95b4bcbd](https://basescan.org/address/0x00fac92881556a90fdb19eae9f23640b95b4bcbd)

  

**Base Attack Transaction 1 ($3.13M):**  [0x6b378c84aa57097fb5845f285476e33d6832b8090d36d02fe0e1aed909228edd](https://basescan.org/tx/0x6b378c84aa57097fb5845f285476e33d6832b8090d36d02fe0e1aed909228edd)

  

**Base Attack Transaction 2 ($187k):**
[0xde7f5e78ea63cbdcd199f4b109db2a551b4462dec79e4dba37711f6c814b26e6](https://basescan.org/tx/0xde7f5e78ea63cbdcd199f4b109db2a551b4462dec79e4dba37711f6c814b26e6)

  
**Base Attack Transaction 3 ($11k):**
[0xf0fcce0807a82041d050a60461e187f0e81a6f7fbda69bb600c04049d924e138](https://basescan.org/tx/0xf0fcce0807a82041d050a60461e187f0e81a6f7fbda69bb600c04049d924e138)

**Attacker’s Address on BNB:**  
[0x00fac92881556a90fdb19eae9f23640b95b4bcbd](https://bscscan.com/address/0x00fac92881556a90fdb19eae9f23640b95b4bcbd)

  
**BNB Attack Transaction ($893k):**
[0x1aaf5d1dc3cd07feb5530fbd6aa09d48b02cbd232f78a40c6ce8e12c55927d03](https://bscscan.com/tx/0x1aaf5d1dc3cd07feb5530fbd6aa09d48b02cbd232f78a40c6ce8e12c55927d03)

**BNB Attack Transaction 2 ($10k):**  
[0x38b25be14b83fd549d5e0b29ba962db83d41f5f9072d0eac4f692fa8e7110bc0](https://bscscan.com/tx/0x38b25be14b83fd549d5e0b29ba962db83d41f5f9072d0eac4f692fa8e7110bc0)

  

**Attacker’s Address on opBNB:**  
[0x00fac92881556a90fdb19eae9f23640b95b4bcbd](https://opbnbscan.com/address/0x00fac92881556a90fdb19eae9f23640b95b4bcbd)

**opBNB  Attack Transaction 1 ($2.9M):**  [0x79eb28ae21698733048e2dae9f9fe3d913396dc9d93a0e30d659df6065127964](https://opbnbscan.com/tx/0x79eb28ae21698733048e2dae9f9fe3d913396dc9d93a0e30d659df6065127964)

  

**opBNB Attack Transaction 2 ($205.5k):**
[0xcfc679a66f1d2966dbe83bb827409c40f29f881c20128107ae73e93ab55c65e4](https://opbnbscan.com/tx/0xcfc679a66f1d2966dbe83bb827409c40f29f881c20128107ae73e93ab55c65e4)

  
**opBNB Attack Transaction 3 ($14k):**
[0x783d56ce53af6d59c7c4be374ff48a66257733fadf5905526b5862a54917889f](https://opbnbscan.com/tx/0x783d56ce53af6d59c7c4be374ff48a66257733fadf5905526b5862a54917889f)

  

**Attacker’s Address on Taiko:**  
[0x00faC92881556A90FdB19eAe9F23640B95B4bcBd](https://taikoscan.io/address/0x00fac92881556a90fdb19eae9f23640b95b4bcbd#asset-multichain)

  
**Attack Transaction on Taiko ($41k):**  
[0x9bce6e105cea138fe9fb1e4bfb63fe90d21817db9d2cc6d1bf7697317430215b](https://taikoscan.io/tx/0x9bce6e105cea138fe9fb1e4bfb63fe90d21817db9d2cc6d1bf7697317430215b)

**Attacker’s Address on Manta:**  
[0xd43b395efad4877e94e06b980f4ed05367484bf3](https://pacific-explorer.manta.network/address/0x551f3110f12c763D1611d5A63B5F015d1c1a954C)

  
**Attack Transaction on Manta ($100k):**  
[0x06074831103a1e91c7b6dcb3b641cf4b79bfa208ea75e99cf9b5100d60a82df5](https://pacific-explorer.manta.network/tx/0x06074831103a1e91c7b6dcb3b641cf4b79bfa208ea75e99cf9b5100d60a82df5)

  

_The following address was used to bridge funds …_

  

**Ethereum Address 1:**
[0x551f3110f12c763D1611d5A63B5F015d1c1a954C](https://etherscan.io/address/0x551f3110f12c763d1611d5a63b5f015d1c1a954c)

  

**Total Stolen: Roughly $7,491,500**

  

By the time SlowMist's MistTrack flagged these addresses, the digital getaway car was already crossing blockchain bridges.

  

zkBridge, deBridge, Meson - the shadowy cross-chain infrastructure that once promised DeFi's borderless future now serves as the perfect escape route for stolen funds.

  

**[KiloEx immediately urged](https://x.com/KiloEx_perp/status/1911899600849617330) "all partner protocols and platforms to blacklist this address" while they worked with security partners to trace funds. A familiar script in DeFi's theater of exploits.**

  

_When your security gets violated this badly, what's left besides sending a strongly worded letter to the blockchain void?_  
  
### The Aftermath  
  
_"We regret to inform you that the KiloEx Vault has been exploited." No shit._

  

**KiloEx's response hit all the classics - suspend trading, blacklist addresses, trace funds.**

  

The digital equivalent of installing home security after the robbers already left with your TV.

  

[The next day came the technical revelation](https://x.com/KiloEx_perp/status/1912131572750582236) everyone already knew: "The vulnerability has been identified and is expected to be fixed soon."

  

Congrats on the discovery that your front door was hanging off its hinges.

  

Then the [ritual hostage negotiation letter](https://x.com/KiloEx_perp/status/1912080346063282651). Return 90% of the stolen $7.5M, keep 10% as your "whitehat bounty," and we'll even tweet about your cooperation! How generous.

  

**[Their message to the attacker](https://x.com/KiloEx_perp/status/1912080346063282651) oozed desperation disguised as strength:**

  

_"Our investigation, supported by law enforcement, cybersecurity agencies, and multiple exchanges & bridge protocols, has uncovered critical information about your activities."_

  

Translation: Please give our money back.  
  

The attacker's response? Complete silence so far. Their wallets sit undisturbed, $7.5M heavier.

  

[KiloEx filed a police report in Hong Kong](https://x.com/KiloEx_perp/status/1912850992653283655) and claims to be working with both Criminal Division, Cybercrime Unit, and SlowMist.  
  
They're freezing positions based on pre-hack snapshots and promising compensation plans while sending on-chain messages to the hacker.

  

**Strangely, [KiloEx felt compelled to address](https://x.com/KiloEx_perp/status/1912850992653283655) "rumors suggesting KiloEx may have been involved in the hack" - rumors that barely existed before they mentioned them.**

  

_Why draw attention to an inside job theory nobody was pushing?_

  
Was [KiloEx audited](https://docs.kiloex.io/kiloex/about-kiloex/audit)? Yes.  
  
[5 Audits](https://docs.kiloex.io/kiloex/about-kiloex/audit) since June 2023.  
  
Did the audits help prevent this exploit? No.

  

ScaleBit - KiloEx's most recent audit partner ([March 2025](http://scalebit.xyz/reports/20250321-XKilo-Token-Final-Audit-Report.pdf)) - mastered the [art of the sympathetic sidestep](https://x.com/scalebit_/status/1912025236654215435).

  

They were "deeply saddened" about the incident [while clarifying](https://x.com/scalebit_/status/1912025236654215435) that "the root cause falls outside the scope of our audit."

  

**How convenient that the exact vulnerability that matters seems to be "out of scope."**  
  
_If your security audit doesn't cover the front door, what exactly are you paying for?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)



_Oracle manipulation - the exploit that launched a thousand post-mortems._

  
**KiloEx joins the ever-growing graveyard of protocols that chose multi-chain deployment before securing their front door.** 
  
KiloEx deployed across four chains with the MinimalForwarder sitting unguarded at the gateway to $7.5 million in user funds.

  

Five audits later, and the protocol still managed to miss what tried to sink their battleship.  
  

**Expansion to multiple chains before fixing basic security? Pure crypto.**  
  

Patching code after $7.5M disappears? Too little, too late.

  
Users don't care about post-mortems when their funds are gone.  
  
**They care about security that actually works, not "deeply saddened" audit partners with convenient scope blindness.**

  
_What good is a MinimalForwarder when it forwards your entire treasury to hackers?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
