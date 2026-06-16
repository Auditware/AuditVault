---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/gaming
  - sector/lending
  - sector/multisig
  - sector/privacy
  - sector/stable
  - sector/token
  - impact/loss-of-funds/direct-drain
title: "Credix - Rekt"
protocol: "[[Credix]]"
date: 2025-08-04
loss_usd: 4500000
auditors:
source: "https://rekt.news/credix-rekt"
excerpt: "Six days of setup, minutes of execution. A compromised Credix admin account minted worthless acUSDC tokens, borrowed $4.5 million against phantom collateral, then shipped everything to Ethereum. Someo"
genome:
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Credix - Rekt

> **Loss:** $4,500,000 | **Date:** 2025-08-04 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/credix-rekt-header.png)



_Six days. That's how long someone with compromised admin access had to plan their $4.5 million heist._  
  

**Someone with the keys to the kingdom decided the kingdom was theirs for the taking, using bridge privileges to mint unbacked tokens and drain liquidity pools across Sonic's freshest DeFi protocol.**  
  

Bridge permissions transformed into a personal mint button. The attacker didn't break the system - they convinced it they owned it.

  

What Credix called a "security breach" was really administrative betrayal wrapped in technical jargon.

  

**The protocol promised full recovery while $4.5 million sat comfortably in Ethereum wallets, freshly laundered through cross-chain bridges.**  
  

_When your most trusted administrator becomes your biggest liability, who's really running the show?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Credix](https://x.com/CrediX_fi/status/1952296077308428311), [Cyvers](https://x.com/CyversAlerts/status/1952299850650747079), [SlowMist](https://x.com/SlowMist_Team/status/1952312873822396712), [Peckshield](https://x.com/peckshield/status/1952317721271488693), [Blockscope](https://x.com/BlockscopeCo/status/1952397315861250328), [CertiK](https://x.com/CertiKAlert/status/1952325010649174176)_

  

**[Credix broke their own bad news first](https://x.com/CrediX_fi/status/1952296077308428311), admitting to a "security breach" while promising details "soon."**

  

Four minutes later, [they disabled their website to prevent new deposits](https://x.com/CrediX_fi/status/1952297149418647734), suggesting users withdraw directly from contracts - corporate speak for "we've lost control of our own platform."

  

[Cyvers spotted the bleeding fifteen minutes after Credix's initial confession](https://x.com/CyversAlerts/status/1952299850650747079), tracking multiple suspicious transactions as an attacker funded by Tornado Cash drained approximately $2.64 million from the protocol.
  
After investigating further, [Cyvers revealed the total loss](https://x.com/CyversAlerts/status/1952312839726588064) was estimated at $4.5 million.

  

[Most funds had already bridged back to Ethereum](https://x.com/CyversAlerts/status/1952299850650747079) before security firms could even sound their alarms.

  

_Security firms swarmed the scene, each delivering their own autopsy of the carnage._

  

**[SlowMist revealed the smoking gun](https://x.com/SlowMist_Team/status/1952312873822396712): six days earlier, Credix's multisig had granted both Admin and Bridge roles to the attacker through their ACLManager contract.**  
  
**Role Granted:**
[0x0cc3520951a2b41281dcc9a0d37ef3f7f139b75675d83ae72e3b8e903334f35e](https://sonicscan.org/tx/0x0cc3520951a2b41281dcc9a0d37ef3f7f139b75675d83ae72e3b8e903334f35e)

  

[PeckShield painted the fuller picture](https://x.com/peckshield/status/1952317721271488693): the compromised admin account held every key that mattered: POOL_ADMIN, BRIDGE, ASSET_LISTING_ADMIN, EMERGENCY_ADMIN, and RISK_ADMIN privileges.  
  
**Compromised Admin Account:**  
[0xF321683831Be16eeD74dfA58b02a37483cEC662e](https://sonicscan.org/address/0xF321683831Be16eeD74dfA58b02a37483cEC662e)

  

Armed with the BRIDGE role, the attacker minted unbacked acUSDC tokens from thin air, then borrowed against this phantom collateral to drain $4.5 million in real assets.

  

The blockchain doesn't lie about motives, but it rarely explains how trust turns to theft.  
  
**What it does reveal is exactly how someone turns administrative access into a money printer.**

  

_How do you rob a bank when you already have the keys to the vault?_

  
### The Mint Machine

  

_Forget fancy exploits - this was basic privilege abuse with devastating results._

  

**[Blockscope tracked the mechanics](https://x.com/BlockscopeCo/status/1952397315861250328): the attacker used their BRIDGE role to mint unbacked acUSDC directly in the Pool, then borrowed against it to drain liquidity.**

  

[PeckShield confirmed the same pattern](https://x.com/peckshield/status/1952317721271488693): BRIDGE role abuse that enabled minting worthless acUSDC tokens, then systematically borrowing an estimated $4.5 million in real pool assets against this phantom collateral.

  

[SlowMist watched the attacker conjure tokens from nothing](https://x.com/SlowMist_Team/status/1952312873822396712), then drain the fund pool until it hit zero.

  

The protocol's own systems couldn't distinguish between legitimate and fabricated collateral.

  

Credix's lending mechanisms approved millions in loans against tokens that existed only in the attacker's bridge transactions, treating minted-from-nothing acUSDC like genuine assets.

  

**No private keys leaked, no smart contracts broken - just someone with god-mode access who decided today was payday.**

  

_When you can mint money and approve your own loans, why bother with actual crime?_  
  
### The Stolen Loot Trail  
  
_The stolen $4.5 million didn't vanish overnight - it took six days of careful preparation._

  

**The blockchain tells the story of an attacker who played the long game, setting up administrative access nearly a week before striking.**

  

**Setup Transaction (Attacker was granted a role 6 days prior):** [0x0cc3520951a2b41281dcc9a0d37ef3f7f139b75675d83ae72e3b8e903334f35e](https://sonicscan.org/tx/0x0cc3520951a2b41281dcc9a0d37ef3f7f139b75675d83ae72e3b8e903334f35e)

  

**Attacker's Address:**
[0xF321683831Be16eeD74dfA58b02a37483cEC662e](https://sonicscan.org/address/0xf321683831be16eed74dfa58b02a37483cec662e)

_Attack Transactions are as follows._

  

**Main Attack Transaction:** [0xe2501b4bb580b2ff6e59e68c0de50fd716bf2d096e1647c70f826bbd1352624d](https://sonicscan.org/tx/0xe2501b4bb580b2ff6e59e68c0de50fd716bf2d096e1647c70f826bbd1352624d)

  

**Additional Attack Transaction:** [0x713015811887d6c9886d08427a7415a7bcbbdca4b8c0e2dfa4970f0ab339d07f](https://sonicscan.org/tx/0x713015811887d6c9886d08427a7415a7bcbbdca4b8c0e2dfa4970f0ab339d07f)

  
[Blockscope confirmed the stolen funds were swapped to USDC](https://x.com/BlockscopeCo/status/1952397725040836806) and bridged to Ethereum via deBridge.  
  
The cross-chain bridge became an escape hatch, not a transfer mechanism.

  
[CertiK tracked the funds](https://x.com/CertiKAlert/status/1952325010649174176) across three initial wallets.

  

**Attacker’s Primary Ethereum Wallets:**
[0xea39a99090d7f8f7f8f9a88dd730c452dcd6dbba](https://etherscan.io/address/0xea39a99090d7f8f7f8f9a88dd730c452dcd6dbba)
[0xc4662b3313333d18a3f49aee24972185114150b6](https://etherscan.io/address/0xc4662b3313333d18a3f49aee24972185114150b6)
[0xf321683831be16eed74dfa58b02a37483cec662e](https://etherscan.io/address/0xf321683831be16eed74dfa58b02a37483cec662e)

The attacker later consolidated funds into a fourth address, showing they weren't done moving money around.  
  
**Attacker’s 4th Ethereum Wallet:**
[0x14C49c7C3992F3dD4bb001aAe5eaE52972eD7aC7](https://etherscan.io/address/0x14c49c7c3992f3dd4bb001aae5eae52972ed7ac7)

[Blockscope also deployed watchtowers to monitor the wallets in real-time](https://x.com/BlockscopeCo/status/1952398109184582085), but tracking dormant funds is like watching paint dry - until it suddenly isn't.  
  
**By the time security firms were sounding alarms, the attacker was already counting Ethereum-based profits while Credix scrambled to understand what had just happened to their treasury.**

  

_When someone steals your entire liquidity pool and vanishes across chains, what exactly do you tell your users?_  
  
### The Recovery Promise

  

_Credix's crisis management played out like a textbook case of "promise first, figure out how later."_

  

**Hours after confirming the hack, [Credix dropped their boldest claim yet](https://x.com/CrediX_fi/status/1952322730294186082): "All users funds will be recovered in full within 24-48 hours."**

  

No explanation of how. No details about reserves.

  

Just a blanket guarantee that somehow, magically, $4.5 million would reappear in user accounts while the actual stolen funds sat untouched in Ethereum wallets.

  

The timeline was ambitious for a protocol that had just learned someone with admin access had been quietly setting up their heist for nearly a week.

  

_Meanwhile, users found themselves locked out of deposits while [being told by Credix to withdraw directly from smart contracts](https://x.com/CrediX_fi/status/1952297149418647734) - because apparently trusting the frontend was now off the table._

  

**[Credix said they would share details](https://x.com/CrediX_fi/status/1952296077308428311) "soon" while providing exactly zero information about how their multisig had been compromised or why someone with bridge privileges had been left unsupervised for six days.**  
  
A few hours later, [Credix announced](https://x.com/CrediX_fi/status/1952433067337130105) they had "reached successful parley with the exploiter who agreed to return the funds within the next 24-48 hours" - apparently in exchange for the exploiter keeping some portion paid from Credix's treasury (exact details were not revealed).

  
[They offered to airdrop affected users](https://x.com/CrediX_fi/status/1952433067337130105) their share of assets within the same timeframe.  
  
**Convenient how quickly they managed to negotiate with someone who had just stolen $4.5 million from them.**

  

_When your recovery timeline is shorter than your investigation timeline, are you solving the problem or just buying time?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)






_Six days of preparation, $4.5 million stolen, and we still don't know how the attacker got those admin keys in the first place._  
  

**Credix joins a growing list of protocols learning that the biggest threat isn't coming from outside their walls - it's already sitting at the conference table with full system access.**  
  

Smart contracts get audited, code gets reviewed, but somehow the humans with god-mode privileges keep turning into the very criminals DeFi was supposed to eliminate.  
  

While security firms dissect transaction logs and trace fund flows, nobody's asking how someone with admin access decided to become a $4.5 million problem.  
  

Code quality improves every cycle, but the person behind the keyboard apparently doesn't.  
  
The attacker used legitimate bridge functionality to mint unbacked tokens, then borrowed real assets against phantom collateral - turning Credix's own infrastructure into a personal money printer.  
  

**The blockchain recorded every detail of Credix's exploitation except the one thing that matters most - the moment trust turned to betrayal.**

  

_In an industry built to eliminate human intermediaries, why do the humans we need most keep becoming our biggest liability?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
