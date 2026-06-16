---
tags:
  - blockchain/fantom
  - sector/bridge
  - sector/dex
  - sector/multisig
  - sector/stable
  - sector/token
  - sector/vault
  - precondition/insider
title: "Multichain - REKT 2"
protocol: "[[Multichain]]"
date: 2023-07-06
loss_usd: 126300000
auditors:
source: "https://rekt.news/multichain-rekt2"
excerpt: "Multi-rekt. Multichain was drained yesterday for a total of $126M of Fantom and Moonriver backing. The project has quite the record… How many more victims will lose out to these ‘experiments’?"
genome:
  - "[[insider]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# Multichain - REKT 2

> **Loss:** $126,300,000 | **Date:** 2023-07-06 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/multichain2-header.png)

_Multi-rekt._

**Multichain addresses were drained yesterday for a total of $126M, representing around 50% of the [FTM bridge](https://debank.com/profile/0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe) and 80% of the [Moonriver bridge](https://debank.com/profile/0x10c6b61dbf44a083aec3780acf769c77be747e23) holdings.**

**The project has quite the record…**

Before re-branding to Multichain, Anyswap was [hacked for $8M](https://rekt.news/anyswap-rekt/) almost two years ago.

Then, in early 2022, [six multi-token contracts](https://medium.com/multichainorg/action-required-critical-vulnerability-for-six-tokens-6b3cbd22bfc0) were found to be vulnerable to an [approvals draining attack](https://www.halborn.com/blog/post/explained-the-multichain-hack-january-2022), estimated to have led to $3M in user losses.

Finally, in May of this year, Multichain caused [panic](https://protos.com/rumors-prompt-panic-over-1-5b-blockchain-bridge-multichain/) when responding to bridging delays, potential insider dumping and team arrest rumours, [explaining](https://twitter.com/MultichainOrg/status/1661443109019062272) things away with a vague, but foreboding, “_force majeure_”.

**This time, [comms](https://twitter.com/MultichainOrg/status/1677096839731097600) were equally worrying:**

>The lockup assets on the Multichain MPC address have been moved to an unknown address abnormally.
>
>The team is not sure what happened and is currently investigating.
>
>**It is recommended that all users suspend the use of Multichain services and revoke all contract approvals related to Multichain.**

Fantom, which is heavily reliant on Multichain versions of many non-native assets (USDC, USDT, DAI, wETH and wBTC), also [didn’t have any answers](https://twitter.com/FantomFDN/status/1677055684716683264).

**With such a long and chequered history, and still no definitive root cause identified by the team…**

_Is this just another of Cronje’s test-in-prod experiments gone wrong?_

_The largest rug we’ve ever seen?_

_Or even a very shy whitehat?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Beosin](https://twitter.com/BeosinAlert/status/1677281092116840448)_

As the large withdrawals picked up [attention](https://twitter.com/peckshield/status/1677031203772289030) on Twitter, an initial theory that the withdrawals were related to Stargate/LayerZero’s [launch](https://twitter.com/StargateFinance/status/1676990139921498112) of new offerings on FTM were quickly [put to bed](https://twitter.com/pcaversaccio/status/1677038824734457856) by the LZ team.

**While the exact attack vector is still to be determined, the [behaviour](https://twitter.com/BeosinAlert/status/1677281092116840448) of transactions appear to suggest that an attacker was able to control the addresses directly.**

Plausible [methods](https://twitter.com/BeosinAlert/status/1677281299860709377) of gaining access include a back-end breach, obtaining private keys via spearphishing or the actions of a malicious insider.

_The [last time](https://rekt.news/anyswap-rekt/) Multichain (then Anyswap) was hacked, the attacker was able to [back-calculate](https://medium.com/multichainorg/anyswap-multichain-router-v3-exploit-statement-6833f1b7e6fb) private keys from repeated transaction data the (then recently-launched) v3._

**Exploiter addresses and current holdings at time of writing (total $126.3M):**

[0x9d5765ae1c95c21d4cc3b1d5bba71bad3b012b68](https://etherscan.io/address/0x9d5765ae1c95c21d4cc3b1d5bba71bad3b012b68) ($16.7M including DAI, LINK, USDT and CRV)

[0xefeef8e968a0db92781ac7b3b7c821909ef10c88](https://etherscan.io/address/0xefeef8e968a0db92781ac7b3b7c821909ef10c88) ($30.1M in USDC)

[0x418ed2554c010a0c63024d1da3a93b4dc26e5bb7](https://etherscan.io/address/0x418ed2554c010a0c63024d1da3a93b4dc26e5bb7) ($13.4M in wETH)

[0x622e5f32e9ed5318d3a05ee2932fd3e118347ba0](https://etherscan.io/address/0x622e5f32e9ed5318d3a05ee2932fd3e118347ba0) ($30.9M in wBTC)

[0x48bead89e696ee93b04913cb0006f35adb844537](https://etherscan.io/address/0x48bead89e696ee93b04913cb0006f35adb844537) ($7.5M in USDC, USDT, DAI and wBTC from Moonriver)

[0x027f1571aca57354223276722dc7b572a5b05cd8](https://etherscan.io/address/0x027f1571aca57354223276722dc7b572a5b05cd8) ($27.7M in USDC)

_The full list of assets can be found [here](https://twitter.com/hackenclub/status/1677261932296798208)._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

While the losses are enormous, funds have not been swapped or moved since being drained, potentially [pointing](https://twitter.com/functi0nZer0/status/1677075378752352256) to actions of a whitehat. Additionally, over half the amount ($65M) could be [frozen](https://twitter.com/tayvano_/status/1677106407131475968) by Tether and Circle.

**Two bridges have earned their 2nd leaderboard entry in a week, after [Poly Network’s](https://rekt.news/poly-network-rekt2/) multisig was compromised last Saturday.**

The latest in an ongoing series of bridge hacks, this is another [reminder](https://twitter.com/pcaversaccio/status/1677277847788847104) of Vitalik’s warning that, despite the name of today's entry, a multi- not cross-chain future may be the safest way to go for crypto.

As we wrote after the >$300M [Wormhole](https://rekt.news/wormhole-rekt/) hack:

>In the race across the cryptoverse to reach experimental and more lucrative opportunities, many are willing to trust in newer tech. But when one of these gateways fails, the damage done can be immense.

**Once again, another project [linked](https://andrecronje.medium.com/multichain-dapp-guide-standards-and-best-practices-8fabe2672c60) to Cronje’s [decentralised monopoly](https://rekt.news/decentralised-monopoly/) has ended up rekt, joining many others on the leaderboard, some with [multiple](https://rekt.news/cream-rekt-2/)  [entries](https://rekt.news/yearn2-rekt/).**

_How many more victims will lose out to these ‘experiments’?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
