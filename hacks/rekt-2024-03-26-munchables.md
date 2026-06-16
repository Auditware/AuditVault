---
tags:
  - blockchain/avalanche
  - sector/multisig
  - has/audit
  - vuln/dependency/upgradeable-contract
  - impact/privilege-escalation/ownership-transfer
  - novelty/variant
title: "Munchables - REKT"
protocol: "[[Munchables]]"
date: 2024-03-26
loss_usd: 62500000
auditors:
  - "[[Entersof]]"
source: "https://rekt.news/munchables-rekt"
excerpt: "The Blast L2 Big Bang award-winning project Munchables was exploited for $62.5M by a rogue dev. Funds retrieved from dev within a few hours in a rollercoaster ride of a day."
genome:
  - "[[upgradeable-contract]]"
  - "[[ownership-transfer]]"
  - "[[variant]]"
  - "[[upgrade-safety]]"
---
# Munchables - REKT

> **Loss:** $62,500,000 | **Date:** 2024-03-26 | **Audited by:** Entersof

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/munchables-header.png)


_Rogue dev tried to turn Munchables into Lunchables._

  

**The Blast L2 Big Bang award-winning project Munchables was exploited for $62.5M by a rogue dev. Funds retrieved from dev within a few hours in a rollercoaster ride of a day.**

  

Munchables was [quick to report](https://twitter.com/_munchables_/status/1772739713687752761) that they were compromised on March 26, tracking movements and attempting to stop the transactions.

  

Rumors swirled in the Web3 security community about the possibility that Munchables [accidentally hired](https://twitter.com/PopPunkOnChain/status/1772746208047518025) a North Korean developer who never transferred ownership of the smart contracts back to the team.

  

_ZachXBT [went on offense](https://twitter.com/zachxbt/status/1772843238539325947) against the rogue dev, in a turn of events that may have saved the day for Munchables and those affected by the exploit._

  

This is the second attack on a Blast protocol in under a week. [Super Sushi Samurai](https://rekt.news/sss-rekt/) was sliced just a few days ago for $4.8M.  
  
**Blast is still a young chain and clearly going through some growing pains, pretty dangerous considering they quickly generated [$1.24B TVL](https://defillama.com/chain/Blast), already surpassing Avalanche.**

  

_Will Blast continue their upward trend or could we continue to see further exploits that could threaten the trust and stability of the entire ecosystem?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [ZachXBT](https://twitter.com/zachxbt/status/1772843238539325947), [Munchables](https://twitter.com/_munchables_/status/1772739713687752761), [Pop Punk](https://twitter.com/PopPunkOnChain/status/1772746208047518025), [quit.q00t.eth](https://twitter.com/0xQuit/status/1772764460647846273), [Pacman](https://twitter.com/PacmanBlur/status/1772871466935013701)_

  


The Munchables exploit, resulting in a staggering $62.5M loss, appears to have been meticulously planned by the rogue dev since the initial deployment of the project's smart contract.

  

**Upon [closer investigation](https://twitter.com/0xQuit/status/1772764460647846273) by quit.q00t.eth, it was revealed that the Munchables contract was a dangerously upgradeable proxy, and it had been upgraded from an [unverified implementation address](https://blastscan.io/address/0x910ffc04a3006007a453e5dd325babe1e1fc4511).**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/munchables-proxy.png)


The Munchables contract was soon upgraded to a new version with appropriate checks to prevent users from withdrawing more than they had deposited.

  

_However, prior to this upgrade, the attacker managed to manipulate the contract's storage slots and assign themselves a deposited balance of 1,000,000 Ether._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/munchables-1mileth.png)

**The scammer used manual manipulation of storage slots to assign himself an enormous Ether balance before changing the contract implementation to one that appears legit. Then he simply withdrew that balance once TVL was juicy enough.**

  
Attacker Address: [0x6e8836f050a315611208a5cd7e228701563d09c5](https://blastscan.io/address/0x6e8836f050a315611208a5cd7e228701563d09c5)

  


Contract upgraded March 21: [0xea1d9c0d8de4280b538b6fe6dbc3636602075184651dfeb837cb03f8a19ffc4f  
](https://blastscan.io/tx/0xea1d9c0d8de4280b538b6fe6dbc3636602075184651dfeb837cb03f8a19ffc4)

A few hours after the attack, in an interesting turn of events, ZachXBT, [outed the rogue dev](https://twitter.com/zachxbt/status/1772843238539325947).

  

_Four different devs hired by the Munchables team and linked to the exploiter are likely all the same person. They recommended each other for the job, regularly transferred payments to the same two exchange deposit addresses and funded each other's wallets._

  

**Github Usernames:**

-   [NelsonMurua913](https://github.com/nelsonmurua913/nelsonmurua913)
    
-   Werewolves0493 (Can no longer be found)
    
-   BrightDragon0719 (Can no longer be found)
    
-   [Super1114](https://github.com/super1114/super1114)
    

  

**Payment addresses:**

[0x4890e32a6A631Ba451b7823dAd39E88614f59C97](https://etherscan.io/address/0x4890e32a6a631ba451b7823dad39e88614f59c97)

[0x6BE96b68A46879305c905CcAFFF02B2519E78055](https://etherscan.io/address/0x6be96b68a46879305c905ccafff02b2519e78055)

[0x9976Fe30DAc6063666eEA87133dFad1d5ec27c5E](https://etherscan.io/address/0x9976fe30dac6063666eea87133dfad1d5ec27c5e)

  

**Exchange deposit address:**

[0x84e86b461a3063ad255575b30756bdc4d051a04b](https://etherscan.io/address/0x84e86b461a3063ad255575b30756bdc4d051a04b)

[0xe362130d4718dc9f86c802ca17fe94041f1cfc77](https://etherscan.io/address/0xe362130d4718dc9f86c802ca17fe94041f1cfc77)

  

**11 minutes later, [Munchables announced](https://twitter.com/_munchables_/status/1772846122236862789) that the developer had agreed to share the keys for the full Munchables funds without any conditions.**

  

_Duo Nine highlighted that ZachXBT [scared the rogue dev](https://twitter.com/DU09BTC/status/1772850062156267967) so much, he gave the keys back._

  

Roughly $60.5M funds transferred back to Munchables:

  
Transaction 1: [0x69f271f90204ae993200f54676c922fe5ee3e5020a16ae34f589f52d923857f1](https://blastscan.io/tx/0x69f271f90204ae993200f54676c922fe5ee3e5020a16ae34f589f52d923857f1)

  

Transaction 2: [0x381d57aa2d959ff9580ad61cc6549ae3c026eed9ee5b2ea10f9601a186c49a13](https://blastscan.io/tx/0x381d57aa2d959ff9580ad61cc6549ae3c026eed9ee5b2ea10f9601a186c49a13)

  

Transaction 3: [0x62a148877957cbf1ae89cafa144496d99239ee900a3b90194249e6baaa3ddc2f](https://blastscan.io/tx/0x62a148877957cbf1ae89cafa144496d99239ee900a3b90194249e6baaa3ddc2f)

  
Pacman [broke the news](https://twitter.com/PacmanBlur/status/1772871466935013701) that the funds had been secured in a multisig by Blast core contributors. He went on to [shout out ZachXBT](https://twitter.com/PacmanBlur/status/1772873911354404938) and [samczsun](https://twitter.com/PacmanBlur/status/1772880342661120472) for their support behind the scenes.  
  
**There were rumors within the Web3 community suggesting the rogue dev might be [linked to Lazarus](https://www.coindesk.com/tech/2024/03/27/munchables-exploited-for-62m-ether-linked-to-rogue-north-korean-team-member/), a North Korean hacking group. While there's no official confirmation, this speculation raises intriguing questions about the attacker's motives and methods.**

  
_Another controversial topic that was floated by the community around the exploit, was the possibility of [rolling back](https://twitter.com/search?q=munchables%20rollback&src=typed_query) the Blast chain, which immediately raised decentralization concerns._

  

Since the funds were returned, the [chain rollback idea](https://twitter.com/odysseas_eth/status/1773027262578741305) was dead in the water, but the conversation did open up a can of worms.  
  
There was an audit completed [March 2024](https://2940425202-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FTntovqRqNnTMbN2jq0Oh%2Fuploads%2FaVhzla1IV0zr1Dpputcm%2FMunchables%20Smart%20Contract%20Audit%20Report.pdf?alt=media&token=e6ede26c-b649-45d7-835f-5f94d623fe94) by Entersof. Password for Audit: ESMunc@24!  
  
**Not that the audit helped much with this matter as rogue dev is usually not in the gameplan.**

  
Some of these exploit stories are filled with villains and victims, with the occasional hero in the mix.  
  
_Did the heroes save the day this time around?_




![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)
_What could have been the biggest hack of 2024, ended up being an inside job that did not clearly go as planned thanks to some vigilante justice._

  

**The CEO of Pixecraft Studios [mentioned giving the dev](https://twitter.com/coderdannn/status/1772820871478223074) a trial hire in 2022, which didn’t even last a month, due to the dev being sketchy af.**

  

After that incident, they [changed their hiring practices](https://twitter.com/coderdannn/status/1772831783270445146) and now collaborate exclusively with trusted recruiters who conduct background checks on candidates. They recommend all crypto teams adopt similar measures to avoid bad actors found on public job boards.

  

_Whether to dox or not is a hot topic. While the debate over doxxing continues within the crypto community, it's clear that in cases like the Munchables exploit, the practice may serve as a powerful deterrent against malicious actors and protect the integrity of DeFi platforms._

  

As the space evolves, finding a balance between maintaining privacy and ensuring accountability will be crucial in fostering trust among users.

  

With ZachXBT being on the case and already having leads, people chatting about simply modifying chain state or rolling back and the rogue dev having no way to transfer funds without being caught, it is no surprise that the exploiter got checkmated so quickly.  
  
**But, this situation could have gone in a different direction and things could have gotten uglier than they ended up. What if Blast ended up rolling back the chain, [assuming that they even can?  
](https://twitter.com/functi0nzer0/status/1772774643671212221)**
  
This was the 2nd attack on Blast in under a week. It's essential for other protocols on the network to reassess their security measures and remain vigilant against similar threats.

  

_Will the chain become known as a Blast from the past?_


![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
