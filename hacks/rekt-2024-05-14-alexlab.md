---
tags:
  - blockchain/bitcoin
  - blockchain/bsc
  - sector/bridge
  - sector/gaming
  - sector/multisig
  - sector/oracle
  - has/audit
  - vuln/dependency/upgradeable-contract
  - precondition/insider
  - novelty/variant
title: "AlexLab - Rekt"
protocol: "[[Alexlab]]"
date: 2024-05-14
loss_usd: 4300000
auditors:
  - "[[CoinFabrik]]"
source: "https://rekt.news/alexlab-rekt"
excerpt: "AlexLab, the self-proclaimed finance layer on Bitcoin, had a few layers stripped, as a compromised private key led to a $4.3 million exploit on AlexLab’s XLink bridge on the BNB network."
genome:
  - "[[upgradeable-contract]]"
  - "[[insider]]"
  - "[[variant]]"
  - "[[bridge-message-validation]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[upgrade-safety]]"
---
# AlexLab - Rekt

> **Loss:** $4,300,000 | **Date:** 2024-05-14 | **Audited by:** CoinFabrik

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/alexlab-header.png)












_Another day, another private key was compromised._

  

**AlexLab, the self-proclaimed finance layer on Bitcoin, had a few layers stripped, as a compromised private key led to a $4.3 million exploit on AlexLab’s XLink bridge on the BNB network.**

  

[Certik Alert caught](https://twitter.com/CertiKAlert/status/1790432967422083329) a suspicious transaction affecting AlexLab on May 14th, with initial evidence pointing to a private key compromise.  
  
AlexLab did not [officially confirm](https://twitter.com/ALEXLabBTC/status/1790815791832498291) the exploit until the next day, where they stated that the misappropriated Alex Assets have been moved by the exploiter to major exchanges, where the assets were frozen by the exchanges.  
  
**They offered a bounty equivalent to 10% of the stolen funds, with an expiration of May 18th at 0800 UTC.**

  
_Why did they wait a day until they made an official announcement about the exploit?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)







_Credit: [Certik](https://twitter.com/CertiKAlert/status/1790432967422083329), [AlexLab](https://twitter.com/ALEXLabBTC/status/1791020176332230988), [ImmuneBytes](https://twitter.com/ImmuneBytes/status/1790704640692236553), [Chain Aegis](https://app.chainaegis.com/result?type=bsc&search=0x27055ae433e9dcb30f6ebcc1a374cf5cc03c484e)_

  
**The AlexLab team became aware of an exploit using compromised private keys obtained via a phishing attack.**

  

In their official security update, they highlighted that the exploiter conducted a targeted attack, taking over as the admin of [one of the vaults](https://explorer.hiro.so/txid/0x17d6c0f925134dbb75fa74d61dff9c20e681f37c834a7125717307af6825e4c6?chain=mainnet) associated with ALEX liquidity pool.  
  
_With the vault keys in hand, the attacker went buck wild, draining approximately 13.7 million STX from the [compromised coffers](https://explorer.hiro.so/txid/SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-vault-v1-1?chain=mainnet)._

  

Around 3 million of those pilfered STX were rapidly shot out to various centralized exchanges in a blatant cash-out attempt.  
  
**The Alex team mobilized and managed to recover all aBTC, sUSDT, xBTC, xUSD, ALEX, atALEX, and a handful of other assets from the vault.**

  

However, a sizable chunk of that STX loot managed to slip through the exchanges' hands before they could freeze the funds.  

_According to further analysis by ImmuneBytes, the [Deployer address](https://bscscan.com/address/0xb3955302e58fffdf2da247e999cd9755f652b13b) carried out four malicious upgrades to the proxy contract associated with AlexLabs._  
  
The upgrades caused the address of the bridge endpoint contract to change to unverified bytecode.  
  
**Attacker address:**
[0x27055aE433E9DCb30f6EbCC1A374Cf5CC03C484E](https://bscscan.com/address/0x27055aE433E9DCb30f6EbCC1A374Cf5CC03C484E)

  
Within an hour after the upgrade, the following withdrawals were made under these attack transactions.  
  
**Attack Transaction 1:**
[0x94746d33792aeb27d2066b6d8f3c8a8c7410fe15c9500059f35e0b21c9bfb416](https://bscscan.com/tx/0x94746d33792aeb27d2066b6d8f3c8a8c7410fe15c9500059f35e0b21c9bfb416)

  

**Attack Transaction 2:**
[0x47e123af93add709bc2516f6a5db057dfbb1d66a75b693cd7980cd3eb28c7357](https://bscscan.com/tx/0x47e123af93add709bc2516f6a5db057dfbb1d66a75b693cd7980cd3eb28c7357)

  

A total of $4.3 million worth of digital assets were transferred to the following addresses.

  

**Stolen Funds sent to Address 1:**
[0xA747aF2a527E72cE303353b458a1c51eBCd53188](https://bscscan.com/address/0xa747af2a527e72ce303353b458a1c51ebcd53188)

  

**Stolen Funds sent to Address 2:**
[0x27055aE433E9DCb30f6EbCC1A374Cf5CC03C484E](https://bscscan.com/address/0x27055ae433e9dcb30f6ebcc1a374cf5cc03c484e)

  

_A portion of the stolen funds have been identified and are in the process of being recovered from one CEX._ 
  

AlexLab is actively working through the required processes with other CEXs to claw back additional funds.

  

They are now locked in a heated process of trying to retrieve the remaining STX and shared the [current forensic data](https://docs.google.com/spreadsheets/d/1soFi1f-6pIscJIbaDzq_71LiEZ-B1_RO1CcD8hr8W24/edit#gid=52390640) with all relevant CEXs.

  

**Since there is no assurance that all stolen funds will be recovered, they are [evaluating deployment of ALEX reserves](https://twitter.com/ALEXLabBTC/status/1791017896010789011) held by AlexLab Foundation towards funding of a treasury grant program to support their community impacted by the attack**.

  

_In the meantime, they've got another Hail Mary in the works, [possibly proposing](https://twitter.com/ALEXLabBTC/status/1791017896010789011) that the Stacks community straight-up burn the unrecovered STX sitting in the exploiter's wallets, then reissue fresh tokens to the impacted users._

  

AlexLabs is [currently working](https://twitter.com/ALEXLabBTC/status/1790824414130618443) with all relevant parties on a detailed post-mortem report, which we will share with you very soon.  
  
**ImmuneBytes and [Chain Aegis have indicated](https://app.chainaegis.com/result?type=bsc&search=0x27055ae433e9dcb30f6ebcc1a374cf5cc03c484e) that the attacker involved in this exploit was also involved in the attack on [Mars Defi 412](https://twitter.com/Mars_DeFi412).**  
  
Mars Defi 412 was attacked in a [price manipulation attack](https://app.chainaegis.com/result?type=bsc&search=0x306174B707EbF6d7301a0BCd898ae1666Ec176ae) for $100k on April 16th.

  
AlexLab’s [Security Audit page](https://docs.alexgo.io/bitcoin-bridge/security-audits) highlights that the Bitcoin Bridge is audited by CoinFabrik, covering both the contracts and the backends. The smart contracts are also subject to a [bug bounty](https://immunefi.com/bounty/alex/) program on Immunefi.  
  
**But it was a compromised private key that ultimately tried to blow up the lab, audits and bug bounties became an afterthought at that point.**  
  
_The $4.3 million-dollar question remains: Just how did this sly exploiter manage to phish or finagle those highly-coveted vault keys?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)





_The AlexLab team has their work cut out unraveling this $4.3 million private key caper._

  

While they've managed to recover some assets and freeze funds, millions are still sitting in the exploiter's shady wallets.

  

Their proposed solutions of treasury grants and token reissuance show they're pulling out all the stops to make impacted users whole.

  

**But at the end of the day, that won't undo the damage of sloppy opsec that enabled this breach in the first place.**  
  
_The day-long delay to make the exploit public is concerning._  
  
As investigators dig deeper into the phishers' tricks or if this is a potential inside job, this saga will be a case study in the perils of private key mishandling.

  

The crypto Wild West is an unforgiving place, one mistake is all it takes for your vault to get looted.  
  
_AlexLab can audit and bug bounty till the cows come home, but they'd be wise to quickly implement multi-sig and other robust key management practices._  
  
Otherwise, their shiny "finance layer" risks getting stripped bare by the next opportunistic vault raider.  
  
**A raider who may be a repeat offender and is not afraid to use different attack vectors, who could be next?**

  
_The game of crypto cat-and-mouse wages on._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
