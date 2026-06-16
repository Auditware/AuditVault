---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - has/audit
  - sector/dex
  - sector/privacy
  - sector/stable
title: "StableMagnet - REKT"
protocol: "[[Stablemagnet]]"
date: 2021-06-23
loss_usd: 27000000
auditors:
  - "[[Techrate]]"
source: "https://rekt.news/stablemagnet-rekt"
excerpt: "A few hours before the attack, we received a message from an anonymous source suggesting that StableMagnet would rugpull. We couldn’t verify the claims, so our hands were tied."
genome:
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
  - "[[circuit-input-range-check]]"
---
# StableMagnet - REKT

> **Loss:** $27,000,000 | **Date:** 2021-06-23 | **Audited by:** Techrate

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/06/mag-header.png) 
**They told us it was going to happen, then it did.**

A few hours before the attack, we received a direct message from an anonymous source suggesting that StableMagnet would rugpull.

_We couldn’t verify the claims, and therefore our hands were tied._ 

If we had made a public warning and the accusations had been false, we would have caused FUD and potentially damaged an innocent project. 

There was no scope to whitehack the funds, so all we could do was wait. 

Now there’s $27 million gone, and more due to be stolen from the wallets of those who have not yet revoked permissions to StableMagnet. 

**Users can use the [BSC Token Approval Checker](https://t.co/n0q58A8gJ1?amp=1) to revoke these permissions.**

We were unable to stop this attack, and that knowledge is not easy to accept. However, the information we received correlates with some of our previously held [suspicions.](https://www.rekt.news/autoshark-rekt/)

**[Techrate audits](https://twitter.com/TechRate1) are not to be trusted.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/06/mag-investigates.png) 

**The rug pull started with [this transaction:](https://bscscan.com/tx/0xf0ba46c8a20e1e75ad382e42c509bf71393e1b3b90326165c747a5d3cc5d967c)** 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/06/mag-txdetails.png) 

**An initial $22.2 million in stablecoins were taken from the StableMagnet 3Pool via an unverified source code.**

**This figure is now $27M and rising.**

_As stated by [Rugdoc:](https://twitter.com/RugDocIO/status/1407830298251964427?s=20)_

>Etherscan and BSCScan explorers do not verify linked library source code. 

>This allows the exploiter to deploy a completely different library than the one in the source code.

The unverified SwapUtil library did not only contain code to drain all pairs, it also contained code to transfer more tokens to everyone who had approved StableMagnet.

SwapUtils library containing the exploit:[0xE25d05777BB4bD0FD0Ca1297C434e612803eaA9a](https://bscscan.com/address/0xE25d05777BB4bD0FD0Ca1297C434e612803eaA9a) 

>Other protocols which are still in operation, such as Dopple and StableGaj are based upon the same code, and their SwapUtils libraries are also unverfied.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**The stolen funds were split between multiple addresses and deposited to Binance in order to switch to the Ethereum blockchain, then quickly withdrawn and the centralised USDT exchanged for decentralised DAI.**

These attackers had planned their escape route. 

_Is the Binance KYC process faulty, or do Binance care less about enforcing the law than they [would have us believe?](https://twitter.com/cz_binance/status/1408010393214017545?s=20)_

**BUSD sent to Binance hot wallet:** [0x2bac04457e5de654cf1600b803e714c2c3fb96d7](https://bscscan.com/address/0x2bac04457e5de654cf1600b803e714c2c3fb96d7#tokentxns)

**Tether received on ETH chain:** [0xDF5B180c0734fC448BE30B7FF2c5bFc262bDEF26](https://etherscan.io/address/0xDF5B180c0734fC448BE30B7FF2c5bFc262bDEF26#tokentxns)

**Tether changed to DAI:** [0xe5daac909a3205f99d370bc2b32b1810a4912a07](https://etherscan.io/address/0xe5daac909a3205f99d370bc2b32b1810a4912a07#tokentxns)

_This pattern has been replicated across multiple addresses._ 

**Could this be the rug that keeps on rugging?**

At one point, there were over [1000 users](https://twitter.com/peckshield/status/1407868387103936514?s=20) with non-zero allowances on the rugpulled StableMagnet.

With an initial entry at number 8, this case is set to keep on climbing the [rekt leaderboard](https://www.rekt.news/leaderboard/) as we uncover more of the story and the wallets of unsuspecting users continue to be drained. 

_This is not the first time that this group has rugpulled, but this time they’ve left us some clues._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/06/mag-footsteps.png) 

**The other information that was given to us by our anonymous source is given more authenticity following the events at StableMagnet.**

They told us that the same group is responsible for multiple recent rugpulls, suggesting that [Moon Here token](https://bscscan.com/address/0xf84c682279E6B687Fc3449954e25377ECC1A59f9), and [Wen Moon token](https://bscscan.com/address/0x16a4a0bb3c8b3dde8459f192b9ae09cad7b95a70) were also carried out by the same bad actors.

**They also told us that “[Techrate audited the Github](https://github.com/TechRate/Smart-Contract-Audits/blob/main/StableMagnet%20Standart%20Smart%20Contract%20Security%20Audit.pdf), but not the deployed contract”**

We know that Techrate was alerted to this rugpull, and that they took no action.  A quick glance through the [list of projects](https://techrate.org/#product-list) that they are involved with will give you a good idea of the kind of quality you can expect with a Techrate audited project. 

**Why should we expect them to point out the problem, rather than let it slide and come back to it later when they are wearing their black hat?**

_In a space and time where trust is already at a minimum, you would hope you could look to audit companies for some security._ 

>However, this is not the first incident in which the auditor becomes the number one suspect. 

**We know of at least two major hacks in which the protocol is working to prove that they were attacked by their auditor. Investigations are ongoing.**

This has been one of the more sinister rug pulls that we have documented. A known group of attackers stealing not only from their scam protocol, but also directly from users wallets, then fleeing to the decentralised protection of DAI.

**Don’t trust an auditor to DYOR.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-text-linebreak.png) 

>If you enjoy our work, please donate to our [Gitcoin grant.](https://gitcoin.co/grants/1632/rektnews-the-dark-web-of-defi-journalism)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/06/gitcoin-type.png)
