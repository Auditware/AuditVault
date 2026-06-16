---
tags:
  - blockchain/ethereum
  - sector/dex
  - sector/lending
  - sector/multisig
  - sector/oracle
  - sector/privacy
  - sector/stable
  - impact/loss-of-funds/direct-drain
title: "Infini - Rekt"
protocol: "[[Infini]]"
date: 2024-02-24
loss_usd: 49500000
auditors:
source: "https://rekt.news/infini-rekt"
excerpt: "The perfect DeFi hack. No flash loans, no zero-days. Just a rogue dev who built a backdoor, waited 114 days, then drained $49.5M from Infini with admin privileges. Same old story, new-age incompetence"
genome:
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
---
# Infini - Rekt

> **Loss:** $49,500,000 | **Date:** 2024-02-24 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/infini-rekt-header.png)



_Trustworthy neobank? More like neoBUNK._  
  
**Infini founder Christian unwittingly transferred contract authority to a developer who vanished with $49.5 million.**

  

First Tornado Cash for anonymity. Then a 114-day hibernation period. And when the time came - precision execution, USDC drained, swapped to DAI, then flipped to ETH in minutes.

  

Onchain evidence points to a rogue developer who maintained admin privileges months after completing their work, patiently waiting for the TVL to fatten before striking.

  

One Ethereum from Tornado Cash [kickstarted the assault](https://etherscan.io/tx/0x03db8172ada9778e168fb1903d513782161d3e63a57004244d9437de89c68741) that drained Infini's entire vault.

  

**Christian pivoted to crisis mode, pledging personal funds to cover losses while withdrawal requests piled up by the minute.**

  

_When did we start treating smart contract handovers with less scrutiny than apartment security deposits?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [LookOnChain](https://x.com/lookonchain/status/1893869666717585756), [YAM](https://x.com/yieldsandmore/status/1893871757666275587), [BlockSec](https://x.com/BlockSecTeam/status/1893879953118134589), [Christian](https://x.com/Christianeth/status/1893885666557411712), [Infini](https://x.com/0xinfini/status/1893973307596435871), [Decrypt](https://decrypt.co/307513/crypto-neo-bank-infini-50-million-exploit)_

  

**Late Sunday evening, an inconspicuous transaction sparked what would become Infini's nightmare.**

  

The first signs of trouble weren’t subtle. On-chain watchers quickly noticed something was off.

  

[LookOnChain first spotted](https://x.com/lookonchain/status/1893869666717585756) the anomaly, “A newly created wallet spent 49.5M $DAI to buy 17,696 $ETH at $2,798 in the past hour.”

  

[YAM followed with confirmation](https://x.com/yieldsandmore/status/1893871757666275587) just a few minutes later:, "$50m of Infini Earn Funds just got hacked, into [Torn-sourced addy](https://etherscan.io/address/0x3ac96134fb0e42a52d33045aee50b89790f05ed0). Funds were taken from Morpho MEVCapital Usual USDC Vault. "

  

[BlockSec chimed in](https://x.com/BlockSecTeam/status/1893879953118134589), "A sad day: an attack on an unverified contract on Ethereum."

  

_Sad indeed for everyone except the attacker._

  

**Christian, Infini's founder, [confirmed the exploit](https://x.com/Christianeth/status/1893885666557411712) with a characteristically Chinese mix of poetic resignation and damage control: "A friend once joked that I had been having too smooth sailing along the way. I said that I was always ready for the first disaster, but I didn’t expect that I would be the one to run into trouble right after ByBit.**

  

My personal private key has not been leaked, so there is no need to worry too much. I was negligent when transferring the authority before. It is ultimately my responsibility.”

  

The official Infini Twitter account remained conspicuously silent - waiting nearly 8 hours [before acknowledging the hack](https://x.com/0xinfini/status/1893973307596435871) with corporate platitudes: "We're deeply sorry for the concern this causes - our team is working around the clock to investigate."

  

Meanwhile, 49.5 million dollars had already vanished into the ether.

  

_No flash loans. No price manipulation. Just god-mode admin access and a clean getaway._

  

**The smoking gun?**

  

**Exploiter’s Contract Address:**  [0x9A79f4105A4e1A050Ba0b42F25351D394fA7E1DC](https://etherscan.io/address/0x9a79f4105a4e1a050ba0b42f25351d394fa7e1dc)

  

**Created by:**
[0xc49b5e5b9da66b9126c1a62e9761e6b2147de3e1](https://etherscan.io/address/0xc49b5e5b9da66b9126c1a62e9761e6b2147de3e1)

This wasn’t just an exploit-it was a trap, wired into the contract from day one.

**[According to QuillAudits' forensic analysis](https://decrypt.co/307513/crypto-neo-bank-infini-50-million-exploit), the attack boiled down to compromised access and privilege escalation:**

_“The hacker gained access to a private key associated with the account [0xc49b…e3e1](https://etherscan.io/address/0xc49b5e5b9da66b9126c1a62e9761e6b2147de3e1). This account had been granted a special role (0x8e0b) that enabled them to withdraw all funds from the vault.”_

With this unchecked privilege, the exploiter drained funds from MEV Capital’s Usual USDC vault in two swift transactions.

### Execution & Laundering

_After 114 days of patience, the attacker struck with precision._

**Fund attack address with [1 ETH from Tornado Cash](https://etherscan.io/tx/0x03db8172ada9778e168fb1903d513782161d3e63a57004244d9437de89c68741).**

Deploy malicious contract, disguised as part of Infini’s vault system.

Grant admin privileges (role 0x8e9b) to withdraw assets.

**Drain $49.5M in USDC across two transactions:**

**First Transaction:** [0xacf84c5944f662a4fcf783806993d713a150994932008e72e4e47a58d6665f7f](https://etherscan.io/tx/0xacf84c5944f662a4fcf783806993d713a150994932008e72e4e47a58d6665f7f)

  

**Withdrawn:** 11.5M USDC

**Sent to:** Tornado Cash-funded wallet

  

**Second Transaction:** [0xecb31ff694c0e6c5e5b225c261854c0749ecf5d53c698fcda61f2d8e3db8f9fc](https://etherscan.io/tx/0xecb31ff694c0e6c5e5b225c261854c0749ecf5d53c698fcda61f2d8e3db8f9fc)

  

**Withdrawn:** 38M USDC

**Swapped for:** DAI via Maker's Sky Protocol

  

**Obfuscate & Escape:**

  

Convert USDC to DAI to avoid blacklisting.

Swap DAI to ETH (~17.7K ETH).

  

**Transfer to fresh address:**[](https://etherscan.io/address/0xfcC8Ad911976d752890f2140D9F4edd2c64a6e49)
[0xfcC8Ad911976d752890f2140D9F4edd2c64a6e49](https://etherscan.io/address/0xfcC8Ad911976d752890f2140D9F4edd2c64a6e49)

  

_[QuillAudits noted that](https://decrypt.co/307513/crypto-neo-bank-infini-50-million-exploit) "the lack of further obfuscation techniques means the stolen assets might still be traceable," but this offers little comfort as the funds sit in the attacker's wallet._

  

**The strategy was calculated: withdraw the maximum amount quickly, convert to non-freezable assets, and maintain plausible deniability through Tornado Cash.**

  

The aftermath unfolded as a form of damage control theater.

  

"Currently, all consumption and withdrawals of the product are normal," [Christian insisted](https://x.com/Christianeth/status/1893925373546516916).

  

[Christian claimed that](https://x.com/Christianeth/status/1893947665567916079) "70% of the $50M stolen belonged to big investors I know. I have communicated with them one by one and I will personally bear the possible losses and settle privately."

  

_Less than 12 hours after the theft, [the tone shifted to one of desperate negotiation](https://x.com/Christianeth/status/1894025751533609079): "I know hackers might be watching my tweets, so here's my sincere message... I'm willing to offer 20% of the stolen amount and promise no legal action if the funds are returned."_  
  
**Maybe it was too little, too late - the digital heist was already complete.**

  
As Infini's millions evaporated into the blockchain abyss, the industry faced yet another lesson written in red.

  

The Infini exploit highlights an increasingly troubling pattern in DeFi.

  

Just days after [Bybit's epic $1.43 billion loss](https://rekt.news/bybit-rekt/), another crypto project falls victim not to sophisticated code manipulation, but to something far more mundane: human failure.

  

_The issue wasn't a zero-day vulnerability or a complex reentrancy attack - it appears to be a rogue developer who simply never relinquished control._

  

**"It's frustrating because these aren't new problems," [QuillAudits research team told Decrypt](https://decrypt.co/307513/crypto-neo-bank-infini-50-million-exploit). "We've seen this play out repeatedly, yet projects still underestimate how critical it is to lock down access."**

  

Beneath the technical jargon and blockchain complexity lies a disappointingly simple truth about Infini's collapse.

  

A complete lack of basic access control hygiene. No mandatory privilege transfers. No time-based access expirations. No multi-signature requirements for critical functions.

  

**Just blind trust in a faceless developer who built a backdoor, bided their time, and struck when the vault was fattest.**

  

_When billion-dollar protocols rest on gentleman's agreements with faceless developers, is this truly the future of finance-or just old-world vulnerability dressed in blockchain clothing?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)



_In an industry obsessed with trustlessness, Infini trusted blindly._

  

**Crypto's promise of eliminating third-party risk falls flat when you hand absolute power to anonymous developers.**

  

The irony is brutal-a protocol built to safeguard value, yet it couldn't even secure its own keys.

  

"It's not just about better tech; it's about better habits," the [QuillAudits team noted](https://decrypt.co/307513/crypto-neo-bank-infini-50-million-exploit).

  

Security isn't just a smart contract feature - it’s a mindset, a discipline that starts long before code is deployed.

  

**Until projects start treating access control as a "core security priority" instead of an afterthought, we'll keep seeing these headlines.**

  

_When will projects learn that security theater isn't security, and that a trusted architecture requires more than pinky promises from pseudonymous developers?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
