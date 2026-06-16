---
tags:
  - blockchain/optimism
  - sector/governance
  - sector/lending
  - sector/multisig
  - sector/stable
  - sector/vault
  - has/audit
  - trigger/flash-loan
  - trigger/time-based/timelock-expiry
  - precondition/flash-loan-available
title: "Sonne Finance - Rekt"
protocol: "[[Sonne Finance]]"
date: 2024-05-15
loss_usd: 20000000
auditors:
  - "[[yAudit]]"
source: "https://rekt.news/sonne-finance-rekt"
excerpt: "The alarm has been rung on Sonne Finance, as a $20 million flash loan attack reverberates across the crypto sphere, chiming a somber melody that warns of the perils lurking in the DeFi shadows."
genome:
  - "[[flash-loan]]"
  - "[[timelock-expiry]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[timelock-timestamp-bypass]]"
---
# Sonne Finance - Rekt

> **Loss:** $20,000,000 | **Date:** 2024-05-15 | **Audited by:** yAudit

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/sonne-header.png)











_The alarm has been rung on Sonne Finance, as a $20 million flash loan attack reverberates across the crypto sphere, chiming a somber melody that warns of the perils lurking in the DeFi shadows._

  

Nerv Alert [sounded the alarm](https://twitter.com/nervalert/status/1790507902391972071) on late Tuesday, initially detecting a $3 million loss.  
  
**Sonne made an [announcement on Discord](https://discord.com/channels/979481420189806612/1017388570253733898/1240090118598168647) soon after the attack. But did not announce it on X [until a couple of hours](https://twitter.com/SonneFinance/status/1790535383005966554) after.**  
  
Soon after the loss tallied up to $20 million in WETH, VELO, soVELO and Wrapped USDC.

  

_The Optimism chain of Sonne Finance was exploited through a known donation attack on Compound v2 forks._

  

Another fork of Compound v2, Hundred Finance was [rocked by a similar exploit](https://rekt.news/hundred-rekt2/) roughly a year ago.

  
Hundred Finance [sent out a warning](https://twitter.com/HundredFinance/status/1647634154710769664) to other Compound forks after their attack.  
  
**It appears that Sonne seemingly turned a deaf ear, because this was an attack that could have been prevented.**  
  
_Will these protocols ever learn?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)






_Credit: [Nerv Alert](https://twitter.com/nervalert/status/1790507902391972071), [Luke Youngblood](https://twitter.com/LukeYoungblood/status/1790549404312805574), [Daniel Von Fange](https://twitter.com/danielvf/status/1790736601095479730), [Tony KΞ](https://twitter.com/tonyke_bot)_

  

**Rinse, repeat, rekt - another DeFi protocol gets taken to the cleaners by a known exploit.**  
  
A fork of Compound V2, Sonne held just over [$60 million in TVL](https://defillama.com/protocol/sonne-finance#information) prior to the exploit.

  
In an infuriating display of ignoring history, Sonne became the latest Compound fork to succumb to an exploit that had already taken down protocols like Hundred Finance a year prior.  
  
**Luke Youngblood provided an [attack breakdown](https://twitter.com/LukeYoungblood/status/1790549404312805574):**  
  
The Sonne Finance team deployed a new market contract for $VELO and a governance proposal was created to activate the market, which had a 4 day total governance period before going live.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/sonne-deployer.png)

When the governance proposal succeeded 3 days later, and the 24 hour timelock expired, it was now executable by anyone on the Optimism network. The attacker made sure they were the one to execute it, probably by running a bot and hoping they were first to strike.

  

The attacker executed the proposal, along with their attack payload, all in a single transaction. The proposal set the collateral factor on the Sonne $VELO market to 35%, which enabled the attack to occur, and the protocol to immediately be drained of at least 7 figures of funds.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/sonne-exploiter.png)

**Attacker:**
[0xae4a7cde7c99fb98b0d5fa414aa40f0300531f43](https://optimistic.etherscan.io/address/0xae4a7cde7c99fb98b0d5fa414aa40f0300531f43)

  

**Attack Contract:**  
[0x02fa2625825917e9b1f8346a465de1bbc150c5b9](https://optimistic.etherscan.io/address/0x02fa2625825917e9b1f8346a465de1bbc150c5b9)

  

**Target Contracts:**  
soVELO: [0xe3b81318b1b6776f0877c3770afddff97b9f5fe5](https://optimistic.etherscan.io/address/0xe3b81318b1b6776f0877c3770afddff97b9f5fe5)

SoUSDC: [0xec8fea79026ffed168ccf5c627c7f486d77b765f](https://optimistic.etherscan.io/address/0xec8fea79026ffed168ccf5c627c7f486d77b765f)

soWETH: [0xf7b5965f5c117eb1b5450187c9dcfccc3c317e8e](https://optimistic.etherscan.io/address/0xf7b5965f5c117eb1b5450187c9dcfccc3c317e8e)

  

**Attack Transaction:** [0x9312ae377d7ebdf3c7c3a86f80514878deb5df51aad38b6191d55db53e42b7f0](https://optimistic.etherscan.io/tx/0x9312ae377d7ebdf3c7c3a86f80514878deb5df51aad38b6191d55db53e42b7f0)

  

**Stolen Funds currently held in several addresses:**  
[0x5d0d99e9886581ff8fcb01f35804317f5ed80bbb](https://debank.com/profile/0x5D0D99e9886581ff8fCB01F35804317f5eD80BBb)

  

[0x6277ab36a67cfb5535b02ee95c835a5eec554c07](https://debank.com/profile/0x6277ab36a67cfb5535b02ee95c835a5eec554c07)

  

[0xae4a7cde7c99fb98b0d5fa414aa40f0300531f43](https://debank.com/profile/0xae4A7cDe7C99fb98B0D5fA414aa40F0300531F43)

  

[0x9f09ec563222fe52712dc413d0b7b66cb5c7c795  
  ](https://debank.com/profile/0x9f09ec563222fe52712dc413d0b7b66cb5c7c795)
  [0x3b39652151102d19ca41544a635956ef97416598](https://debank.com/profile/0x3b39652151102d19ca41544a635956ef97416598)

  

[0x9f44c4ec0b34c2dde2268ed3acbf3aba8eacde51](https://debank.com/profile/0x9f44c4ec0b34c2dde2268ed3acbf3aba8eacde51)

  

_Daniel Von Fange delved deeper into the critical errors committed by Sonne, and [provided recommendations for protocols](https://twitter.com/danielvf/status/1790736601095479730) employing multisig wallets alongside timelock governance._

  

The TL;DR: if a series of actions must happen in a certain order in order to be safe, make sure your governance process doesn't allow picking and choosing what to execute, be atomic.

  

**Sonne was quick to issue a [Post-mortem](https://medium.com/@SonneFinance/post-mortem-sonne-finance-exploit-12f3daa82b06) on the exploit roughly 5 hours after the attack.**  
  
_They highlighted how they previously avoided the Compound V2 donation attack by slowly increasing collateral factors, but a recent proposal to add VELO markets opened an exploit window._  
  
After scheduling VELO integration transactions through their permissionless Optimism multisig, the attacker executed the changes and drained $20M by leveraging the well-known vulnerability.  
  
Sonne Finance is working to recover the stolen funds, considering a bug bounty for their return.

  
**But it wasn’t all bad news. MEV researcher [Tony KΞ](https://twitter.com/tonyke_bot) from [fuzzland](https://twitter.com/hackthedefi) posted a play by play of how they prevented more than $6.5M from being hacked during the incident, using just $100.**

  

One [user noticed something fishy](https://twitter.com/pbxbt/status/1790566645108219992) when they posted that [Mendi Finance's](https://twitter.com/MendiFinance) code [is a friendly fork of Sonne Finance](https://docs.mendi.finance/protocol/audit).  
  
Could they be exploited soon?

  

_[Sonne was audited](https://reports.yaudit.dev/reports/05-2023-Sonne/) by Yearn Finance's yAudit._  
  
**The attack vector is listed as high finding, stating “Unclear protection against Hundred Finance attack vector.”**  
  
This latest attack on a Compound v2 fork has [speculation floating](https://twitter.com/0x_tiago/status/1790521333559996867) around that [other forked protocols](https://t.co/hxmWZ0R7ek) could be exploited  
  
**This is a known vulnerability that can be easily prevented, hopefully this latest incident will put this on other forked protocol’s radars.**  
  
_Do you think they will do their due diligence or will we see more similar attacks?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_The $20 million attack on Sonne Finance represents a major breach enabled by failure to properly address a well-known vulnerability._

  

**Despite explicit warnings from previous incidents like the Hundred Finance exploit, Sonne's team pushed ahead with integrating new markets without comprehensive safeguards against the donation attack vector.**

  

This oversight, coupled with loosely configured governance permissions, allowed the attacker to drain millions with relative ease.

  

_The fact that auditors had explicitly flagged this risk as high-severity makes this incident even more inexcusable and concerning._

  

As speculation swirls around other Compound V2 forks potentially being exposed to the same exploit, the incident serves as a wakeup call.

  

**Prioritizing swift deployments over comprehensive security reviews is a trade-off no protocol can afford, as Sonne has learned the hard way.**

  

For DeFi to reach maturity, teams must move past blindly copying code they don't fully understand.

  

**Rigorous pre-launch audits, real-time monitoring for attack vectors, and recovery mechanisms are essential. Otherwise, the ecosystem will remain trapped in a cycle of relearning the same costly lessons with each keystroke.**

  

_The burning question is whether Sonne's $20 million lesson will be the final straw that forces positive change or will the acceptable loss figures simply keep increasing until major investors and users lose faith altogether?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
