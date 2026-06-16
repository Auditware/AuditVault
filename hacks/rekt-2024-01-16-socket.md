---
tags:
  - blockchain/ethereum
  - blockchain/polygon
  - sector/bridge
  - sector/dex
  - sector/stable
  - novelty/variant
title: "Socket - REKT"
protocol: "[[Socket]]"
date: 2024-01-16
loss_usd: 3300000
auditors:
source: "https://rekt.news/socket-rekt"
excerpt: "Infinite approvals… the ultimate leap of faith. Socket’s Bungee bridge lost $3.3M yesterday. Have you checked your approvals lately?"
genome:
  - "[[variant]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
  - "[[upgrade-safety]]"
---
# Socket - REKT

> **Loss:** $3,300,000 | **Date:** 2024-01-16 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/socket-header.png)

_Infinite approvals… the ultimate leap of faith._

**Socket’s Bungee bridge lost $3.3M yesterday to an attack draining addresses that had previously approved the [SocketGateway contract](https://etherscan.io/address/0x3a23f943181408eac424116af7b7790c94cb97a5) on Ethereum.**

Shortly after the alarm was [raised](https://twitter.com/spreekaway/status/1747337879771033632), the team [acknowledged](https://twitter.com/SocketDotTech/status/1747349422730813525) the hack, having [patched](https://etherscan.io/tx/0xac75adcc1cb3fef158c4f200c48fcbcbb9b6ce3250bdf3751d6231d41a9e604b) the vulnerability just 14 minutes after the [attack began](https://etherscan.io/tx/0xc6c3331fa8c2d30e1ef208424c08c039a89e510df2fb6ae31e5aa40722e28fd6).

Wallet provider Rainbow also [informed](https://twitter.com/rainbowdotme/status/1747360808772792762) their users, as Socket’s contracts are used by the in-app bridging feature. They urged users to check whether their address was affected and revoke approvals via [RevokeCash’s dedicated tool](https://twitter.com/RevokeCash/status/1747352408022245790).

**As the over [$80M NYE attack](https://rekt.news/orbit-bridge-rekt/) on Orbit shows, bridges continue to be a prime target for blackhats, and must be subject to the highest levels of scrutiny whenever any changes are made.**

_Why did a [known bug](https://twitter.com/0xdface/status/1747355730603078081) make it to production on a live bridge?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[qckhp](https://twitter.com/qckhp/status/1747344887425450475), [Peckshield](https://twitter.com/peckshield/status/1747353782004900274), [Beosin](https://twitter.com/BeosinAlert/status/1747450173675196674)_

**The attack was due to a lack of validation of user input contained in a new route [added](https://etherscan.io/tx/0x1df44e224c7a715da25fa33dcad2ca3a930d1a4dafd263e61c07b52673d505f4) to the bridging contract three days prior to the exploit.**

The vulnerable route’s [contract](https://etherscan.io/address/0xcc5fda5e3ca925bd0bb428c8b2669496ee43067e#code) itself neglects to validate the swapExtraData parameter, [allowing](https://twitter.com/qckhp/status/1747344887425450475) an exploiter to inject a transferFrom call, and send approved assets from victim addresses to their attack contract.

As Beosin [points out](https://twitter.com/BeosinAlert/status/1747450173675196674):

>It did not consider the case where the caller transfers in 0 WETH, allowing the caller to specify other functions in the call and still pass the balance check.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/socket-code.png)

Attacker’s address: **[0x50df5a2217588772471b84adbbe4194a2ed39066](https://etherscan.io/address/0x50df5a2217588772471b84adbbe4194a2ed39066)**

SocketGateway contract: [0x3a23f943181408eac424116af7b7790c94cb97a5](https://etherscan.io/address/0x3a23f943181408eac424116af7b7790c94cb97a5)

Socket contracts have audits by both [Peckshield](https://github.com/SocketDotTech/audits/blob/c357981ecbd9f070bedd9260c2ec0d7726f820b4/Socket/Socket%20Liquidity%20Layer%20(prev.%20FundMovr)-Audit-Report-By-PeckShield.pdf) and [Consensys Diligence](https://consensys.io/diligence/audits/2023/02/socket/). However, given that the new route was added just three days prior to the exploit, neither audit examined the vulnerable code.

**Funds stolen include ETH, MATIC, WBTC, WETH and DAI totalling approximately $3.3M.**

The stolen assets remain in the attacker's address, which has received a [message](https://etherscan.io/tx/0xff5e81a0191c53f1109442dcb3de47a2ac6be84dcc784bc0fa84e7db808d5192) threatening to dox the attacker if not paid off:

>100 ETH and I'll throw away the timing analysis routing through FixedFloat that doxxes you. After 6 hours I go to Zach. Act swiftly.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Infinite approvals strike again.**

Despite Bungee’s response that “_Bungee doesn't request infinite approvals by default_”, other protocols which route via the affected contract must subscribe to the UI before security mindset.

_Otherwise, it’s hard to believe that [so many users](https://dune.com/queries/3356512) would be vulnerable._

**With the biggest loss at over $600K and the five hardest-hit victims each losing over $100K, this will have been a costly lesson in approvals hygiene for some.**

Without a regular revoking detox, token approvals sit waiting for a live (_or forgotten_) project to be exploited. And given that tokens are stolen directly from users’ wallets, there’s no need to have any funds deposited to fall victim.

**However, all this could have simply been avoided by not making risky, unaudited upgrades to an existing bridge contract.**

_Have you [checked](https://revoke.cash/) your approvals lately, anon?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
