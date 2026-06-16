---
tags:
  - blockchain/bsc
  - sector/bridge
  - sector/multisig
  - sector/staking
  - vuln/access-control/missing-signer
  - trigger/low-liquidity
  - novelty/variant
title: "Poly Network - REKT 2"
protocol: "[[Poly Network]]"
date: 2023-07-01
loss_usd: 4400000
auditors:
source: "https://rekt.news/poly-network-rekt2"
excerpt: "Poly Network is back. Almost two years after topping the leaderboard, this time the hacker got away with just $4.4M. How many more bridges will get rekt because of a handful of compromised keys?"
genome:
  - "[[missing-signer]]"
  - "[[trigger/low-liquidity]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[account-signer]]"
  - "[[bridge-message-validation]]"
  - "[[reward-accounting]]"
---
# Poly Network - REKT 2

> **Loss:** $4,400,000 | **Date:** 2023-07-01 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/poly2-header.png)

_Poly Network is back._

**Almost two years after topping the [leaderboard](https://rekt.news/leaderboard/) with a [complex hack](https://rekt.news/polynetwork-rekt/) of over $600M, this time the losses totalled just $4.4M.**

_And the attack was a simple case of a compromised 3-of-4 multisig._

When [Lazarus](https://rekt.news/big-phish/) knocked Poly off the top spot with the [Ronin bridge](https://rekt.news/ronin-rekt/) exploit, 5 of 9 validator keys were compromised. Apparently, Poly still thought that an even lower bar was acceptable.

The team eventually [acknowledged](https://twitter.com/PolyNetwork2/status/1675384703149568001) the attack, informing users that bridging services had been paused and making a call for help to the security community. In a follow-up, Poly [clarified](https://twitter.com/PolyNetwork2/status/1675592129727418370) that “_57 assets have been affected on 10 blockchains_”

**Prompting flashbacks of the first hack, which at the time totalled more than the entire rest of the leaderboard combined, initial reports [used](https://twitter.com/CertiKAlert/status/1675544670263209984) a notional value of $42B of minted assets.**

_But [low liquidity](https://twitter.com/MetisDAO/status/1675347320588718080) on destination chains meant the attacker was only able to cash out a few million._

**It seems we only ever hear of Poly Network when they’re hacked…**

_…who knew they were even still around?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Dedaub](https://twitter.com/dedaub/status/1675516729349292032), [Beosin](https://twitter.com/BeosinAlert/status/1675708122944483328)_

**In contrast to Poly’s last incident, this time appears to be a far simpler case of compromised keys; three of four multisig signers validated deposit proofs, granting the attacker access to funds.**

The attack process involved locking a small amount of tokens on one chain, then withdrawing a larger amount on a different chain via forged proofs, repeated for various assets and chains.

_A full, technical post-mortem can be found [here](https://dedaub.com/blog/poly-chain-hack-postmortem)._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/poly2-code.png)

Attacker’s main ETH address: **[0xe0Afadad1d93704761c8550F21A53DE3468Ba599](https://etherscan.io/address/0xe0Afadad1d93704761c8550F21A53DE3468Ba599)**

Example tx: [0x1b8f8a38…](https://etherscan.io/tx/0x1b8f8a38895ce8375308c570c7511d16a2ba972577747b0ac7ace5cc59bbb1c4) (deposit on ETH), [0x5c70178e…](https://bscscan.com/tx/0x5c70178e6dc882fba1663400c9566423f8942877a0d42bb5c982c95acc348e31) (withdrawal on BSC)

EthCrossChainManager contract: [0x14413419452aaf089762a0c5e95ed2a13bbc488c](https://etherscan.io/address/0x14413419452aaf089762a0c5e95ed2a13bbc488c#code)

Although the notional value of assets minted reached into the tens of billions, the attacker could only access [around $4.4M](https://twitter.com/MistTrack_io/status/1675436475595526144) of Poly’s liquidity, with further assets remaining in the attacker’s address.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/poly2-funds.png)

_A full list of assets stolen by chain is available [here](https://twitter.com/PolyNetwork2/status/1675592129727418370)._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Blockchain bridges create bottlenecks where funds accumulate on either side, often secured by a flimsy threshold of just a few EOAs.**

_[Time](https://rekt.news/ronin-rekt/) and [again](https://rekt.news/harmony-rekt/) we have seen hundreds of millions lost to just a few signatures._

Last time Poly was rekt, [on-chain negotiations](https://etherscan.io/tx/0x7b6009ea08c868d7c5c336bf1bc30c33b87a0eedd59dac8c26e6a8551b20b68a) resulted in a happy ending, as funds were returned and the whitehat [offered](https://twitter.com/PolyNetwork2/status/1427574236483231749#) a Chief Security Advisor role on top of a $500k bounty.

**Luckily, far less was lost in this time.**

_Will Poly learn their lesson?_

_Or will they go for the hat trick?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
