---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/privacy
  - has/audit
  - vuln/oracle/missing-circuit-breaker
  - fix/add-circuit-breaker
  - novelty/variant
title: "ArcadiaFi - Rekt"
protocol: "[[Arcadiafi]]"
date: 2025-07-15
loss_usd: 3600000
auditors:
  - "[[Pashov Audit Group]]"
source: "https://rekt.news/arcadiafi-rekt"
excerpt: "An attacker used crafted swapData to trigger arbitrary calls through a trusted rebalancer contract, draining $3.6 million from user vaults. The exploit hit during a pause cool down, leaving ArcadiaFi "
genome:
  - "[[missing-circuit-breaker]]"
  - "[[add-circuit-breaker]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[chainlink-round-completeness]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[pyth-oracle-completeness]]"
---
# ArcadiaFi - Rekt

> **Loss:** $3,600,000 | **Date:** 2025-07-15 | **Audited by:** Pashov Audit Group

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/arcadiafi-rekt.png)










_Credit: [Peckshield](https://x.com/peckshield/status/1678263478774013952), [Certik](https://x.com/CertiKAlert/status/1944982279882997819), [ArcadiaFi](https://x.com/ArcadiaFi/status/1944984622183370867), [Cyvers Alerts](https://x.com/CyversAlerts/status/1945043365340270936), [Chaofan Shao](https://x.com/shoucccc/status/1945022619063144856), [Pashov Auditing Group](https://x.com/PashovAuditGrp/status/1945467861654290433)_

  

**The attack didn’t begin with an exploit. It began with misdirection.**

On July 14th, someone deployed two suspicious contracts that triggered ArcadiaFi's automated circuit breakers, [completely pausing the protocol](https://basescan.org/tx/0x23c3796c42dbca0148975729a5f2dddf539c4c7a8284289e12190fbd5a6c091b).

The team scrambled to analyze the contracts, running simulations and security checks for hours. After finding no immediate threat, they [unpaused the protocol](https://basescan.org/tx/0x38b744e967e6d6ed8870619ac2f35b6d5612a396eaf3ba981ed754c7395c310d) at 1:05 PM UTC.

What they didn't realize was that this pause-unpause cycle had locked them into a cooldown period - they couldn't pause again for hours, even if they wanted to.

_[CertiK's alerts started buzzing](https://x.com/CertiKAlert/status/1944982279882997819) late in the evening on July 14th - multiple suspicious transactions draining ArcadiaFi on Base._  
  

**Their Twitter alert cut straight to the bone: "~$1.6M from @ArcadiaFi, likely through arbitrary 'swapdata' on its rebalancer contract."**

  

Nine minutes later, [ArcadiaFi's team surfaced](https://x.com/ArcadiaFi/status/1944984622183370867) with damage control mode activated: "The team is aware of unauthorized transactions via a Rebalancer. Remove all permissions for asset managers."

  

Classic DeFi panic protocol - acknowledge the bleeding, tell users to run for the exits, promise more information "will follow."

  

The attacker wasn't finished.

  

ArcadiaFi was still figuring out what hit them [when Cyvers Alerts noticed an additional $1 million was stolen](https://x.com/CyversAlerts/status/1945043365340270936), bringing the final tally to $3.6 million.

  

**Standard exit strategy followed - convert everything to ETH on Base, bridge to Ethereum mainnet, then split the loot across multiple addresses because nothing says "legitimate transaction" like immediately fragmenting stolen funds.**  
  
_But how exactly did a simple rebalancing function turn into a $3.6 million withdrawal slip?_  
  
### The Exploit Breakdown

  

_[ArcadiaFi's official post-mortem](https://arcadiafinance.notion.site/Arcadia-Post-Mortem-14-07-2025-23104482afa780fdb291cd3f41b7fc99) and [Chaofan Shou's technical breakdown](https://x.com/shoucccc/status/1945022619063144856) revealed just how badly the protocol had been outmaneuvered._

  

**The attack was surgical precision wrapped in financial chaos.**  
  

The attacker started by taking three Morpho flashloans worth approximately $1.5 billion - enough liquidity to make the entire operation look legitimate to ArcadiaFi's health checks.

  

Nobody bothered validating swapData parameters, so any jackass with a keyboard could jam arbitrary calldata into what was supposed to be routine swap instructions.

  

**ArcadiaFi's permission system made it even worse.**

  

You had this cute little setup where only Accounts could call Rebalancer.executeAction(), and only the Rebalancer could call Account.flashAction().

  

Looked bulletproof on paper.

  

**The vulnerability path was crystal clear once you knew where to look:**

  

_RebalancerSpot.rebalance() → AccountV1.flashAction() → actionTarget.executeAction() → _swap() → _swapViaRouter() → router.call(data)_  
  

Nowhere in this call chain were the router addresses validated. The attacker simply registered their malicious contract as both the router and a whitelisted ArcadiaAccount, then used the trusted Rebalancer context to drain victim accounts.  
  

Here's the genius part: they repaid all the victim's debt first using the flashloan, making the account "healthy" so the transaction would succeed instead of triggering failsafes.

  

Four hops later, the attacker owned the victim account completely.

  

Withdraw everything, repay the flashloan, walk away rich.

  

**Clean, simple, devastating.**  
  
_So where did all that stolen ETH actually end up?_

  
### The Attacker’s Trail  
  
_The attacker didn't just stumble onto this vulnerability._  
  
**Tornado Cash provided the seed funding at 10:58 PM UTC on July 14th, with fresh ETH landing precisely when needed.**  
  
**Initial Funding:**
[0xf5300504d25e930bd0e11e968d2d77a3c8effe1c56e583150226be084375ee3c](https://etherscan.io/tx/0xf5300504d25e930bd0e11e968d2d77a3c8effe1c56e583150226be084375ee3c)

  

The real attack began at 4:05 AM UTC on July 15th - exactly when ArcadiaFi was locked out of their own pause mechanism.  
  
**Primary Attacker Address:**
[0x0fa54e967a9cc5df2af38babc376c91a29878615 ](https://basescan.org/address/0x0fa54e967a9cc5df2af38babc376c91a29878615)

**Targeted Contracts are as follows…**

  

_[GoPlus Security identified](https://x.com/GoPlusSecurity/status/1945211812456370239) the distinction between the vulnerable rebalancer and the actual target contracts in their post-exploit analysis._

  

**Victim Contract (RebalancerSpot):**[](https://basescan.org/address/0xC729213B9b72694F202FeB9cf40FE8ba5F5A4509)
[0xC729213B9b72694F202FeB9cf40FE8ba5F5A4509](https://basescan.org/address/0xC729213B9b72694F202FeB9cf40FE8ba5F5A4509)

  

The RebalancerSpot contract is where the hole was: SwapLogic._swapViaRouter() lived here, and with it, an unchecked router.call(data).

  

**Exploited Contract:**[](https://basescan.org/address/0x9529e5988ced568898566782e88012cf11c3ec99)
[0x9529e5988ced568898566782e88012cf11c3ec99](https://basescan.org/address/0x9529e5988ced568898566782e88012cf11c3ec99)

A specific Arcadia Account contract that held LP positions and was targeted for fund extraction.

  
**Attack Contract used in First Wave:**
[0x6250DFD35ca9eee5Ea21b5837F6F21425BEe4553 ](https://basescan.org/address/0x6250dfd35ca9eee5ea21b5837f6f21425bee4553)

**First Wave of Exploit Transactions ($2.5M):**
[0x06ce76eae6c12073df4aaf0b4231f951e4153a67f3abc1c1a547eb57d1218150](https://basescan.org/tx/0x06ce76eae6c12073df4aaf0b4231f951e4153a67f3abc1c1a547eb57d1218150)
[0x0b9bed09d241cef8078e6708909f98574c33ee06abcc2f80bc41731cd462d60b ](https://basescan.org/tx/0x0b9bed09d241cef8078e6708909f98574c33ee06abcc2f80bc41731cd462d60b)

_25 minutes later, a fresh contract was deployed to rip out another $1 million - while ArcadiaFi was still scanning the wreckage from round one._  
  
**Attack Contract used in Second Wave:**
[0x1DBC011983288B334397B4F64c29F941bE4DF265](https://basescan.org/address/0x1DBC011983288B334397B4F64c29F941bE4DF265)

  

**Second Wave Exploit Transactions (Additional $1M+):**

  

_[Multiple transactions](https://x.com/CyversAlerts/status/1945043365340270936) brought total damage to $3.6 million._

  

The attacker weaponized ArcadiaFi's own trust mechanisms against itself - each rebalancing call became a potential vault raid through carefully crafted swapData parameters.

  

With 840 ETH secured from the first wave, the funds bridged to Ethereum mainnet via Across Protocol, then scattered across multiple addresses.

  

**Bridge Transaction:** [0x3a6ec9625dbfd0482781f9c8eaa93def78ffc2a73df3de5ffc650723b9b57211  ](https://etherscan.io/tx/0x3a6ec9625dbfd0482781f9c8eaa93def78ffc2a73df3de5ffc650723b9b57211)

_With the money trail documented and the technical autopsy complete, the obvious question emerged: what did all those audits actually cover?_  
  
### After the Cards Fell

  

_[Four audits](https://github.com/arcadia-finance/arcadia-finance-audits/tree/main/audits-v2), one massive blind spot._

  

**Trust Security, Sherlock, Pashov Group, and Renascence Labs all took their shots at ArcadiaFi's codebase over the past two years.**

  

Between them, they found plenty of issues - Sherlock alone caught 6 medium and 3 high severity bugs that got patched up nice and clean.

  

Problem is, three of them never looked at the thing that actually mattered.

  

[Trust Security's Q4 2023 audit](https://github.com/arcadia-finance/arcadia-finance-audits/blob/main/audits-v2/TRUST%20SECURITY_Q42023.pdf) covered AccountV1, Registry, asset modules, oracle modules - everything except the Rebalancer.

  

[Sherlock's Q1 2024 security review](https://github.com/arcadia-finance/arcadia-finance-audits/blob/main/audits-v2/SHERLOCK_Q12024.pdf) focused on the lending-v2 and accounts-v2 repos, found their issues, called it a day.

  

[Renascence Labs' June 2024 audit](https://github.com/arcadia-finance/arcadia-finance-audits/blob/main/audits-v2/Arcadia%20-%20Renascence%20Audit%20Report.pdf) scope didn't include any rebalancing-related contracts.

  

[Pashov Group's Q3 2024 audit](https://github.com/arcadia-finance/arcadia-finance-audits/blob/main/audits-v2/PASHOV%20GROUP_Q32024_SPOT%20%26%20UNIV4.pdf) was different though.

  

Their scope actually included the Rebalancer, plus RebalanceLogic and SwapLogic.

  

For the first time, someone was looking at the code that would eventually drain $3.6 million.

  

_Rekt News reached out to Pashov Auditing Group, and they were refreshingly transparent about what happened._

  

**Pashov had audited the exact SwapLogic._swapViaRouter() function and initially flagged the missing input validation as a potential attack vector.**

  

But they couldn't imagine a scenario where a registered Account could be used to exploit itself mid-rebalance.

  

"We did log it as an issue, that there is an attack vector, but then couldn't exploit it, so we closed it," a Pashov team member explained. "I believe it didn't get to the client (Arcadia), as it was in 'closed' issues."

  


  

Publicly, they [acknowledged the miss in their own post](https://x.com/PashovAuditGrp/status/1945467861654290433): "Arcadia Finance was exploited due to an unchecked external call in SwapLogic._swapViaRouter()."

  

_The issue stayed internal, and $3.6 million later proved the attack path was more viable than anticipated._

  

**Meanwhile, behind the scenes, some interesting conversations were happening.**

  

Word leaked that [ArcadiaFi attempted to negotiate with the attacker](https://basescan.org/tx/0x97cdd4a7ec02088b63291a1484d275f6e9279eac972ea069637a060e72b6362b) - the classic "please sir, can we have some of our money back" routine that's become standard protocol for major exploits.

  

Details remain scarce, but the fact that negotiations were even attempted suggests the team knew exactly who they were dealing with.  
  

[ArcadiaFi sent an on-chain message](https://basescan.org/tx/0x97cdd4a7ec02088b63291a1484d275f6e9279eac972ea069637a060e72b6362b) offering a 10% white-hat bounty if the attacker returned the funds within 24 hours.

  

**Those talks apparently went nowhere, proving once again that successful hackers rarely feel generous about returning their hard-earned loot.**

  

_When your security strategy relies on auditors checking boxes they never opened, what exactly are you paying for?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)






_Permission systems are only as strong as their weakest abstraction._

  

**ArcadiaFi built a beautiful access control architecture - Accounts could call Rebalancers, Rebalancers could call Accounts, everything locked down tight with proper authorization checks.**

  

But they forgot the cardinal rule: in smart contracts, data is code - especially when no one’s watching.

  

The swapData parameter became a trojan horse, smuggling arbitrary execution past every security gate they'd carefully constructed.  
  
But the real masterpiece was the psychological operation - using ArcadiaFi's own security mechanisms against them, locking them out of their emergency brakes at the exact moment they needed them most.

  

Four audits later, the most critical vault management function remained a blind spot - either out of scope entirely or somehow invisible to experienced security researchers.

  

**$3.6 million vanished through a permission escalation so seamless it could’ve been a feature - if it wasn’t an exploit.**

  

_When your most trusted component becomes your biggest liability, how do you tell the difference between a feature and a backdoor?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
