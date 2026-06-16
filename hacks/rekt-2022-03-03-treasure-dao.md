---
tags:
  - sector/governance
  - sector/nft
title: "Treasure DAO - REKT"
protocol: "[[Treasure Dao]]"
date: 2022-03-03
loss_usd: 1400000
auditors:
source: "https://rekt.news/treasure-dao-rekt"
excerpt: "Swiggity swooty, somebody plundered the Treasure DAO booty. ~$1.4M worth of NFTs has been stolen from the largest NFT marketplace on Arbritrum, leaving the OpenSea competitor stranded in deep water."
genome:
  - "[[access-roles]]"
  - "[[governance-voting-power-snapshot]]"
---
# Treasure DAO - REKT

> **Loss:** $1,400,000 | **Date:** 2022-03-03 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/03/treasureheader.png)

**Swiggity swooty, somebody plundered the Treasure DAO booty.**

~$1.4M worth of NFTs has been stolen from the largest NFT marketplace on Arbritrum, leaving the OpenSea competitor stranded in deep water. 

Treasure DAO has advised users to delist their NFTs, and the chase to track down the pseudonymous pirate has begun.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**The thefts were made possible due to a logic bug in the Marketplace’s _buyItem_ function, which allowed existing listings to be “bought” for no fee.**

_[harry.eth](https://twitter.com/sniko_/status/1499202361180442627) pointed out that:_

>buyItem doesn't check quantity is > 0... exploiter calls buyItem() with zero quantity, pays 0, still receives NFT

**As well as the [simple fix](https://twitter.com/sniko_/status/1499206885987258368) which would have prevented the attack:**

>require(_quantity > 0, “Cannot buy zero”);

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/03/treasure-code.png)

**Shortly after the bug began to be exploited, the marketplace was paused and transactions started to fail.** 

_Co-founder John [Pattern](https://twitter.com/jpatten__/status/1499184767480512512) said:_

>We will cover the costs of the exploit-I will personally give up all of my Smols to repair this.

Examples of NFT listings taken can be seen on Treasure DAO’s Marketplace via, for example, the [Smol Brains](https://twitter.com/SmolBrainsNFT) collection’s [recent activity](https://marketplace.treasure.lol/collection/smol-brains?tab=activity&activitySort=time). The project’s floor price is approximately 2.5k MAGIC, worth over $9k at the time of the exploit. 

Following the news, the price of [MAGIC](https://www.coingecko.com/en/coins/magic) dipped by around a third, but has since stabilised, down around 10% compared to before the incident.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**In the hours since the attack, on-chain investigators believe they have [linked](https://twitter.com/gspdnsobaka/status/1499221626642223104) one of the exploiter accounts to ENS and Binance addresses.**

Many NFTs are also [being returned](https://twitter.com/Br0keboy96/status/1499240212001857536), suggesting that the threat of doxxing is dissuading the attacker from keeping the illiquid stolen assets. 

_Treasure DAO eventually released [a statement on Twitter](https://twitter.com/Treasure_DAO/status/1499386558230769664?s=20&t=DFLBLU7R6FN90jR_ATuaBA):_

>Thank you to the community for your support during the marketplace exploit. It was a difficult moment, but your support speaks volumes about the resilience of the $MAGIC  community.

>We are heads down focused on finding the 50 NFTs that remain stolen and making buyers whole.

**Given the almost instant rally in the token price, and the community [response](https://twitter.com/Whale_Drop/status/1499257211637440521), it looks like this incident won’t be sinking the project.**  

_But considering the [dirt being dug up](https://twitter.com/zachxbt/status/1496460811895820293) on those involved with the project, and the amateur error that led to the loss, perhaps Treasure DAO users should seek riches elsewhere…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
