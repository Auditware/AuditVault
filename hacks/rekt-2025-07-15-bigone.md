---
tags:
  - blockchain/bitcoin
  - blockchain/bsc
  - blockchain/ethereum
  - blockchain/solana
  - blockchain/tron
  - sector/bridge
  - sector/lending
  - sector/stable
  - trigger/flash-loan
  - precondition/flash-loan-available
  - precondition/insider
title: "BigONE - Rekt"
protocol: "[[Bigone]]"
date: 2025-07-15
loss_usd: 27000000
auditors:
source: "https://rekt.news/bigone-rekt"
excerpt: "Supply chain attack hit BigONE for $27 million when attackers compromised production servers and reprogrammed withdrawal systems to approve unauthorized drains. No private keys stolen - just someone w"
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[insider]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[upgrade-safety]]"
---
# BigONE - Rekt

> **Loss:** $27,000,000 | **Date:** 2025-07-15 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/bigone-rekt.png)

_Supply chains make excellent attack vectors when nobody's watching the backdoor._

  

**BigONE discovered this truth the hard way on July 15th, watching $27 million vanish through compromised infrastructure that turned their production servers into unauthorized withdrawal terminals.**

  

No private keys stolen. No flash loan wizardry. No complex smart contract exploits.

  

Just someone who figured out how to rewrite the rules from inside BigONE's own network, modifying account and risk control logic to transform legitimate withdrawal functions into a personal ATM.

  

**While exchanges obsess over wallet security and cold storage protocols, BigONE learned that the most dangerous threats don't pick locks - they reprogram the vault itself.**

  
_When your production environment becomes someone else's playground, who's really running your exchange?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [CertiK](https://x.com/CertiKAlert/status/1945338052311965760), [Blockchain Insights](https://x.com/BlockscopeCo/status/1945369224563532158), [BigONE](https://bigone.zendesk.com/hc/en-us/articles/48916067512345-BigONE-Security-Incident-Disclosure-and-Progress-Update-July-16), [SlowMist](https://x.com/SlowMist_Team/status/1945346830222680330), [Lookonchain](https://x.com/lookonchain/status/1945360349269778527), [ZachXBT](https://x.com/zachxbt/status/1945365902133727266)_

  

**[CertiK spotted the bleeding](https://x.com/CertiKAlert/status/1945338052311965760) late in the evening on July 15th, tracking multiple large token outflows from BigONE's hot wallet address while $4 million in ETH and various tokens accumulated in the attacker's coffers.**

  

Hours later, [Blockchain Insights delivered the devastating tally](https://x.com/BlockscopeCo/status/1945369224563532158): a multichain massacre spanning Bitcoin, Ethereum, TRON, BSC, and Solana - $27 million hemorrhaging across five different blockchains simultaneously.

  

Earlier in the day, [BigONE posted](https://x.com/BigONEexchange/status/1945204423761818084) a "system maintenance" announcement hours before anyone knew they'd been gutted.

  

**By late evening, reality could no longer be disguised, as [BigONE announced](https://x.com/BigONEexchange/status/1945348811590607319): "Security Incident: unauthorized access to our hot wallet."**

  

_When your "maintenance window" coincides perfectly with your worst nightmare, is it damage control or just terrible timing?_  
  
### The Attack  
  
_July 15th turned into BigONE's worst nightmare in digital real-time._

  

**Funds started vanishing across five different blockchains as attackers executed their carefully planned heist.**

  

[The damage was systematic and massive](https://bigone.zendesk.com/hc/en-us/articles/48916067512345-BigONE-Security-Incident-Disclosure-and-Progress-Update-July-16): 120 BTC, 350 ETH, 8.54M USDT across multiple chains, 20,730 XIN, 9.7 billion SHIB, 538K DOGE, 1 WBTC, 15.7M CELR, 25,487 UNI, and 16,071 LEO tokens drained from BigONE's hot wallet infrastructure.

  

The stolen funds [flowed to multiple addresses](https://x.com/SlowMist_Team/status/1945346830222680330):

  

**Bitcoin:**
[bc1qwxm53zya6cuflxhcxy84t4c4wrmgrwqzd07jxm](https://bitcoinexplorer.org/address/bc1qwxm53zya6cuflxhcxy84t4c4wrmgrwqzd07jxm)

  

**Ethereum:**
[0x9Bf7a4dDcA405929dba1FBB136F764F5892A8a7a  ](https://etherscan.io/address/0x9bf7a4ddca405929dba1fbb136f764f5892a8a7a)

**BSC:**
[0x9Bf7a4dDcA405929dba1FBB136F764F5892A8a7a](https://bscscan.com/address/0x9bf7a4ddca405929dba1fbb136f764f5892a8a7a)

  

**TRON:**
[TKKGH8bwmEEvyp3QkzDCbK61EwCHXdo17c](https://tronscan.org/#/address/TKKGH8bwmEEvyp3QkzDCbK61EwCHXdo17c)

  

**Solana:**
[HSr1FNv266zCnVtUdZhfYrhgWx1a4LNEpMPDymQzPg4R](https://explorer.solana.com/address/HSr1FNv266zCnVtUdZhfYrhgWx1a4LNEpMPDymQzPg4R)

  

[Lookonchain tracked the conversion](https://x.com/lookonchain/status/1945360349269778527): attackers quickly exchanged stolen assets for 120 BTC ($14.15M), 23.316M TRX ($7.01M), 1,272 ETH ($4M), and 2,625 SOL ($428K).

  

But here's where it gets spicy: the attack infrastructure had been prepared in advance before the final strike.

  

**Someone either spent serious time studying BigONE's production environment, or they already had backstage passes to the show.**

  

_What kind of attacker bypasses the front door, rewrites the script, and exits stage left with the vault?_

  

### Under the Hood

  

_This wasn't your garden-variety exchange hack with leaked private keys or exploited smart contracts._

  

**Someone rewrote BigONE's playbook from the inside.**

  
Supply chain attacks don't require lock-picking skills - just patience and access to the right toolbox.

  

[SlowMist revealed the attack vector](https://x.com/SlowMist_Team/status/1945346830222680330): a supply chain attack that compromised BigONE's production network, allowing attackers to modify the operational logic of account and risk control servers.

  

Translation? They didn't break into the vault - they convinced the vault they were authorized personnel.

  

_[The attack didn't involve private key leaks](https://x.com/SlowMist_Team/status/1945346830222680330) - all private keys remained secure throughout the breach, making this a pure infrastructure compromise._

  

**Risk controls? Gone. Business logic? Rewritten to rubber-stamp every withdrawal as totally legit.**

  

Why break down the door when you can reprogram the lock?

  

BigONE's servers started treating unauthorized drains like routine Tuesday transactions.

  

No encryption cracking required. No smart contract gymnastics. Just convince the machines that theft equals normal operations.

  

**[BigONE confirmed the attack path had been identified and contained](https://bigone.zendesk.com/hc/en-us/articles/48916067512345-BigONE-Security-Incident-Disclosure-and-Progress-Update-July-16), ensuring no further losses would occur.**

  

_When your security model assumes threats come from outside, what happens when the enemy is already inside your build pipeline?_

  
  

### Spin Cycle

  

_BigONE's crisis response unfolded in stages._

  

**[Maintenance announcement first](https://bigone.zendesk.com/hc/en-us/articles/48904202807705-Announcement-on-System-Upgrade-Maintenance-2025-7-16). Nothing to see here, just routine upgrades while millions drain across five blockchains.**

  

[Hours later](https://x.com/BigONEexchange/status/1945348811590607319): "unauthorized access to our hot wallet." Clean. Vague. Blame-free.

  

Then security firms started talking. Suddenly it became a ["third-party attack targeting our hot wallet"](https://bigone.zendesk.com/hc/en-us/articles/48916067512345-BigONE-Security-Incident-Disclosure-and-Progress-Update-July-16) - because admitting your production servers got owned sounds more sophisticated than "someone walked through our unlocked digital door."

  

[The exchange promised full compensation](https://bigone.zendesk.com/hc/en-us/articles/48916067512345-BigONE-Security-Incident-Disclosure-and-Progress-Update-July-16) using internal reserves including BTC, ETH, USDT, SOL, and XIN, with external borrowing to restore liquidity for other affected tokens.

  

Meanwhile, [ZachXBT dropped into the conversation](https://x.com/zachxbt/status/1945365902133727266) with uncomfortable allegations about BigONE processing volumes from pig butchering and romance scams - complete with a deposit address that had [handled $60 million in fraud proceeds](https://x.com/zachxbt/status/1945397521888763954).  
  
**Suspect Address:**  
[16jAfbpfRzFvagiP5hzBPrYF9YhUhQuq9h](https://blockexplorer.one/bitcoin/mainnet/address/16jAfbpfRzFvagiP5hzBPrYF9YhUhQuq9h)

  

**[BigONE's response](https://x.com/BigONEexchange/status/1945399143050145948)? "We successfully froze a portion of the assets involved and have been actively cooperating with several law enforcement agencies."**

  

_When your exchange gets hacked and the main controversy becomes your compliance failures, what does that say about your priorities?_

  
### The Laundromat Spins Twice

  

_[ZachXBT wasn't finished](https://x.com/zachxbt/status/1945400735782342890) dropping receipts._

  

**He served up a seven-month timeline of the same pig butchering group funneling millions through BigONE's platform uninterrupted.**

  

[ZachXBT fired back](https://x.com/zachxbt/status/1945400735782342890): "They used the same account for 7 months uninterrupted.....

  

Now the same pig butchering group uses a new BIGONE deposit address that has received $4.5M from scams over the past week."

  

**Fresh Suspect Address:**
[1MWq9iNRe3MfYCq3j7439JDyooczqGBnR5](https://blockexplorer.one/bitcoin/mainnet/address/1MWq9iNRe3MfYCq3j7439JDyooczqGBnR5)

_Was this business as usual for BigONE's compliance department?_

  

The evidence was damning. Romance scams, investment frauds, pig butchering operations - all flowing through BigONE's systems while compliance teams apparently napped at their desks.

  

Even after getting hacked for $27 million, the same scam networks simply switched addresses and kept processing dirty money through the platform.

  

**Convenient excuse when the blockchain already tells the whole story.**

  

_When your exchange becomes crypto's favorite laundromat, is getting hacked really the worst thing that can happen to your reputation?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)





_BigONE got schooled in the art of digital warfare by someone who understood that the deadliest attacks don't break systems - they become them._

  

**$27 million vanished through compromised build pipelines while compliance teams counted dirty money from romance scammers.**

  

The attackers didn't need to crack BigONE's vault - they convinced it to open itself.

  

Why fight the system when you can just reprogram it? Exchanges spend fortunes on wallet security and smart contract audits while leaving their deployment pipelines wide open for digital hitchhikers.

  

**BigONE's promises of "full compensation" ring hollow when the same platform that got outmaneuvered by hackers was apparently outmaneuvered by money launderers for months beforehand.**

  

ZachXBT's receipts paint a picture of an exchange that prioritized volume over verification, processing over protection.

  

The blockchain doesn't lie, even when the press releases do. Seven months of scam proceeds.

  

**Sixty million in dirty deposits. Fresh addresses spinning up immediately after the hack to continue the cycle.**

  

_In an industry built on trustless systems, why do we keep trusting exchanges that can't tell the difference between legitimate users and organized crime syndicates?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
