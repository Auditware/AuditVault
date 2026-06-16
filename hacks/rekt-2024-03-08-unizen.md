---
tags:
  - sector/dex
  - sector/lending
  - sector/stable
  - has/audit
  - vuln/dependency/upgradeable-contract
  - novelty/variant
title: "Unizen - Rekt"
protocol: "[[Unizen]]"
date: 2024-03-08
loss_usd: 21000000
auditors:
  - "[[Halborn]]"
  - "[[Verichains]]"
source: "https://rekt.news/unizen-rekt"
excerpt: "March 8th, $2.1M was stolen in multiple attacks on the ETH-based DEX shortly after a contract upgrade to their DEX aggregation contract."
genome:
  - "[[upgradeable-contract]]"
  - "[[variant]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[upgrade-safety]]"
---
# Unizen - Rekt

> **Loss:** $21,000,000 | **Date:** 2024-03-08 | **Audited by:** Halborn, Verichains

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/unizen-header.png)

  





_Not such a zen weekend for Unizen_

  

**March 8th, $2.1M was stolen in multiple attacks on the ETH-based DEX shortly after a contract upgrade to their DEX aggregation contract.**

  

Cyvers [sounded the alarm](https://x.com/CyversAlerts/status/1766198047459996129?s=20) during the March 8th attack. Unizen [acknowledged](https://twitter.com/unizen_io/status/1766304585319338407) the hack 7 hours later.

  

_The attacks happened over a period of a few hours, leaving some users in the dark, believing the DEX was down due to the upgrade, not [finding out](https://twitter.com/skwertrade/status/1766262488277073981) until after the fact._ 
  


RevokeCash [urged users to check](https://twitter.com/RevokeCash/status/1766347444760224041) whether their address was affected and revoke approvals via [their dedicated tool](https://twitter.com/RevokeCash/status/1747352408022245790).

  

**Upgradeable contracts are a common red flag for attacks. Highlighted recently by attacks on [Socket](https://rekt.news/socket-rekt/), last year’s [Safemoon](https://rekt.news/safemoon-rekt/) and [Level Finance](https://rekt.news/level-finance-rekt/) to name a few.**

  
_Did another protocol rush to upgrade a contract without due diligence, setting themselves up for an exploit?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

  



_Credit: [Cyvers](https://x.com/CyversAlerts/status/1766198047459996129?s=20), [SunWeb3Sec](https://github.com/SunWeb3Sec/DeFiHackLabs?tab=readme-ov-file#20240309-unizenio---unverified-external-call), [Martin Granstrom](https://x.com/MartinGranstrom/status/1766426988590354473?s=20), [Blocksec](https://x.com/Phalcon_xyz/status/1766274000534004187?s=20), [Chain Aegis](https://twitter.com/ChainAegis/status/1766356885635277307), [Blockfence](https://twitter.com/blockfence_io/status/1767274525664714764)_

  

****Multiple [attackers](https://x.com/Phalcon_xyz/status/1766274000534004187?s=20) took advantage of an unverified [external call vulnerability](https://github.com/SunWeb3Sec/DeFiHackLabs?tab=readme-ov-file#20240309-unizenio---unverified-external-call) shortly after a DEX [Aggregation contract upgrade](https://etherscan.io/tx/0x858c71876a5ad43ffe27f227ad01979f3bd5de95e66194e98cea41f53a43ef59) upgrade on Unizen.**** 
  
The upgrade was meant to [reduce the cost](https://twitter.com/unizen_io/status/1766015367762337845) of ETH gas fees, except something else was reduced.  
  
  
  

_Users that had interacted with and approved a higher spending limit for certain tokens, were taken advantage of by a malicious actor that stole user funds. [Resulting in a robbery](https://x.com/MartinGranstrom/status/1766426988590354473?s=20) worth more than $2.1M._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/unizen-exploiter.png)




Attacker 1: [0xb660cae1a59336676ea1887b15eb3c0badb90d78](https://etherscan.io/address/0xb660cae1a59336676ea1887b15eb3c0badb90d78)

  

Attack Contract 1: [0xb660cae1a59336676ea1887b15eb3c0badb90d78](https://etherscan.io/address/0xb660cae1a59336676ea1887b15eb3c0badb90d78)

Attack Transaction: [0xc12a4155c2c90707138e4aef8883c8f724371145823e2f661f19b93e5b3a9d6e](https://etherscan.io/tx/0xc12a4155c2c90707138e4aef8883c8f724371145823e2f661f19b93e5b3a9d6e)

  



  

Attacker 2: [0xc596523b77ceb9567279B572c653ECF4BA763CB7](https://etherscan.io/address/0xc596523b77ceb9567279B572c653ECF4BA763CB7)

  

Attack Contract 2: [0x90a7482dD7fA28865f440EC0c3B783775AC01266](https://etherscan.io/address/0x90a7482dd7fa28865f440ec0c3b783775ac01266)

  

A total of 14 attack transactions were carried out.

  
Attack Address 3: [0xd440b92739f86b00d1135b5eea871751433da2d7](https://etherscan.io/address/0xd440b92739f86b00d1135b5eea871751433da2d7)

  

Attacked Contract 3: [0x2f744f784000de0b8f1a7da3f0021ad56c09ce1a](https://etherscan.io/address/0xd3f64baa732061f8b3626ee44bab354f854877ac)

  

Attack Transaction: [0x30fef86a72ea7e1109ffeae572439995c78561ffeb968dcbd61c609efc60fdd9](https://etherscan.io/tx/0x30fef86a72ea7e1109ffeae572439995c78561ffeb968dcbd61c609efc60fdd9)

  



  

Attacker 4: [0x4e2ce48f0b5d97bfd4be3f6c7b6479db1aa5b365](https://etherscan.io/address/0x4e2ce48f0b5d97bfd4be3f6c7b6479db1aa5b365)

  

A total of 13 attack transactions were carried out.

  
The flow of funds can be found [here](https://metasleuth.io/result/eth/0x30fef86a72ea7e1109ffeae572439995c78561ffeb968dcbd61c609efc60fdd9).

  

Stolen funds were sent to this [address](https://etherscan.io/address/0xb660cae1a59336676ea1887b15eb3c0badb90d78).  
  
Not helping matters, the X feed filled with phishing spam posts tagging Unizen, burying the news of the hack. Unizen [caught the spam](https://x.com/unizen_io/status/1766333674491134442?s=20) situation shortly after.

  

**Unizen [addressed the community](https://twitter.com/unizen_io/status/1766304585319338407) 7 hours after the attack, offering to address concerns and start the healing process for their community.**

  
The protocol’s CTO went into [further detail](https://twitter.com/MartinGranstrom/status/1766426988590354473), highlighting the gas optimization upgrade was a minor bug with great consequences.  
  

_2 days after the hack, Unizen [sent several](https://twitter.com/unizen_io/status/1766768232147652918) onchain messages addressing a “Security Professional”, offering a 20% bounty to return the funds._ 
  

On-chain Messages:

[0x13f8220624f61cfb002489821eeba9df392150285147c1aaf816f283ae7cc43e](https://etherscan.io/tx/0x13f8220624f61cfb002489821eeba9df392150285147c1aaf816f283ae7cc43e)

[0x351906b2406282042c7396ea960b7a52d305658097e3f25bae79be4cdbb7c311](https://etherscan.io/tx/0x351906b2406282042c7396ea960b7a52d305658097e3f25bae79be4cdbb7c311)

[0x015b7fd22c027abb9c237a4ecb3862b7c3f2acb857fe93175e4a6c8265d38857](https://etherscan.io/tx/0x015b7fd22c027abb9c237a4ecb3862b7c3f2acb857fe93175e4a6c8265d38857)

[0x0dc8ce3e98d006cd1ba446544b289d960477347e8826efa788d6b879a59cd09d](https://etherscan.io/tx/0x0dc8ce3e98d006cd1ba446544b289d960477347e8826efa788d6b879a59cd09d)

[0xcbdba5e11d3becfe80f8fd710d04fd068ad722289869459a7ce4f1e7123e5946](https://etherscan.io/tx/0xcbdba5e11d3becfe80f8fd710d04fd068ad722289869459a7ce4f1e7123e5946)

[0xdcfed8e883eec7f913c452b2ed0da29f3504722479400053482cddd7797f883f](https://etherscan.io/tx/0xdcfed8e883eec7f913c452b2ed0da29f3504722479400053482cddd7797f883f)

[0xd5d684f3f61de25bd04b8434bb9af23658377350dee16ed2575d377426cebd89](https://etherscan.io/tx/0xd5d684f3f61de25bd04b8434bb9af23658377350dee16ed2575d377426cebd89)

**A few hours later, [Unizen announced](https://twitter.com/unizen_io/status/1767075963475505522) they will reimburse losses below $750,000 with USDC or USDT. CEO and Founder, Sean Noga loaned the protocol with his personal funds.**

They even posted a video in the same announcement on how to revoke spend limit approvals on the Unizen platform. Where was this the day of the attack?

Later in the day, the [CTO announced](https://twitter.com/MartinGranstrom/status/1766898480386101440)  that they have enough evidence to proceed with the post-mortem.  
  
_Adding that an upgrade was patched to the gas optimization contract. Claiming they will invest a lot more in ensuring the security with every upgrade introduced, no matter the risk assessments and internal reviews._

But one of the crooks may not be finished.

**Caught by [Blockfence](https://twitter.com/blockfence_io/status/1767274525664714764) on March 11th, one of the attackers may have moved on to their next onchain sleight of hand.**

They deposited 128 ETH of stolen loot in an LP on [Uniswap](https://etherscan.io/address/0x6e0f802d987cb4f12038562166034a7414666be1#tokentxns), with the [Yoink](https://etherscan.io/address/0xf557568d5d813febae96a5764a392369bfa31c70) token.

_They even left a [message](https://etherscan.io/idm?addresses=0xc596523b77ceb9567279b572c653ecf4ba763cb7,0x0000000000000000000000000000000000000001&type=1) stating all profits from highly profitable trading strategies will be reinvested into Yoink. Did you mean to say hacking strategies?_

  
Halborn and Verichain audited Unizen's DEX Aggregator in 2022, no documentation can be found for an audit on the recent upgrade.  
  
**Do you think this attack could have been prevented with an audit to their recent upgrade?**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




**Another external call vulnerability and another attack on an upgradeable contract, when will this madness end?**

  


_A costly mistake that could have been prevented with thorough testing and auditing._  
  
Blackhats have to be foaming at the mouth with a checklist of upcoming contract upgrades just waiting to pounce and run away with the loot.

**The team's response may have been slow to keep their community updated, but it was refreshing how they handled the situation a few days later.**

Users have already started to pour in to [Unizen's Telegram](https://t.me/unizen_io)  and on X, thanking them for  starting the reimbursement process, it appears they are following through so far.

Not every hacked protocol reimburses users who get robbed. If the hack was a bigger hit, do you think they still would?

_Ensuring the security with every upgrade will surely be watched by blackhats waiting to pounce._

**Will Unizen continue to follow through and live up to their name?**


![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
