---
tags:
  - sector/dex
  - sector/stable
  - impact/loss-of-funds/direct-drain
  - impact/privilege-escalation/ownership-transfer
title: "Whale Hunter's Payday"
protocol: "[[Whale Hunter S Payday]]"
date: 2024-08-20
loss_usd: 55470000
auditors:
source: "https://rekt.news/whale-hunters-payday"
excerpt: "When phishing for whales, sometimes you land a big one. A crypto whale found themselves $55.47 million lighter after falling victim to a sophisticated phishing attack targeting their Maker vault."
genome:
  - "[[direct-drain]]"
  - "[[ownership-transfer]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# Whale Hunter's Payday

> **Loss:** $55,470,000 | **Date:** 2024-08-20 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/whalehunter-payday-header.png)



_When phishing for whales, sometimes you land a big one._

  

**A crypto whale found themselves $55.47 million lighter after falling victim to a sophisticated phishing attack targeting their Maker vault.**  
  

On August 20, [ZachXBT noticed something phishy](https://t.me/investigations/150), when a whopping 55.47 million DAI had vanished from a single wallet.  
  
The whale, perhaps sensing something was amiss, attempted to withdraw their funds to safer waters.  
  
But it was too late, the ownership had already changed and the transaction failed.

  
**A digital fortune had evaporated in the blink of an eye, serving as a very expensive lesson in the dangers lurking in crypto's deep waters.**  
  
_How did this whale fall for such an elaborate trap and end up on the phisher's menu?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [ZachXBT](https://t.me/investigations/150), [CertiK](https://x.com/certikalert/status/1826116902432944390?s=61), [The Block](https://www.theblock.co/post/312326/hacking-55-million-dai-inferno-drainer), [Lookonchain](https://x.com/lookonchain/status/1826161475049894198)_

  

**The attack played out like a masterclass in digital sleight of hand.**

  

Our unfortunate whale inadvertently signed an unknown transaction, unknowingly handing over the keys to 55.47 million DAI.  
  
The attacker, [armed with control](https://x.com/certikalert/status/1826116902432944390?s=61) of the victim's externally owned account (EOA), set their sights on the real prize: a Maker Vault.

  

With the finesse of a seasoned angler, the attacker transferred ownership of the victim's DSProxy, a smart contract allowing multiple calls in a single transaction, to their own address.  
  
_This clever maneuver allowed them to change the vault's owner address and withdraw 55,473,618 DAI stablecoins directly into their wallet._

  

**Hook, line and sinker.**

  

**Victim's address:**
[0xf2B889437F243396b29E829908b5d8ebE2e13048](https://etherscan.io/address/0xf2b889437f243396b29e829908b5d8ebe2e13048)

  

**Phishing address:**
[0x0000db5c8B030ae20308ac975898E09741e70000](https://etherscan.io/address/0x0000db5c8b030ae20308ac975898e09741e70000)

  

**Attacker's withdrawal address:**
[0x5D4b2A02c59197eB2cAe95A6Df9fE27af60459d4](https://etherscan.io/address/0x5d4b2a02c59197eb2cae95a6df9fe27af60459d4)

  

**The main heist transaction:** [0xf70042bf3ae7c22f0680f8afa078c38989ed475dfbe5c8d8f30a50d4d2f45dc4](https://etherscan.io/tx/0xf70042bf3ae7c22f0680f8afa078c38989ed475dfbe5c8d8f30a50d4d2f45dc4)

  

Lookonchain [reported that the attacker](https://x.com/lookonchain/status/1826161475049894198) had already begun laundering their ill-gotten gains.

  
By the time of reporting, 27.5 million DAI had been swapped for 10,625 ETH.  
  
**In these murky waters, even skilled crypto divers struggle to retrieve what's been lost to the depths.**  
  
_Will the remaining funds be recovered or are they destined to sleep with the fishes?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




**This incident serves as another stark reminder of the dangers lurking in the crypto depths.**

  

_Phishing attacks continue to be a preferred method for malicious actors, with CertiK reporting nearly $498 million lost to such attacks in the first half of 2024 alone._

  

Jingyi Guo, an analyst at Blocksec, [highlighted the likelihood](https://www.theblock.co/post/312326/hacking-55-million-dai-inferno-drainer) that the victim had signed a phishing transaction, given their failed attempts to invoke the DSProxy after the ownership change.

  

**One errant click is all it takes and it can cost you dearly.**

  

_As the crypto seas become increasingly treacherous, users are urged to implement stronger security measures._  
  
Multi-factor authentication, hardware wallets and a healthy dose of paranoia are becoming as essential as a life jacket on a sinking ship.

  

For now, this whale's tale serves as a cautionary story for all who swim in these waters.  
  

The next time you're about to sign a transaction, remember that there's always a bigger phish out there and it might just be waiting for you to take the bait.

  
**In the grand ocean of crypto, even the mightiest whales aren't safe from a well-crafted lure.**  
  
_As phishing attacks evolve and predators grow bolder, is there any safe harbor left in the turbulent seas of crypto?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
