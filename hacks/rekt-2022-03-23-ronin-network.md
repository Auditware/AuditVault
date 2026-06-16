---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/gaming
  - sector/governance
  - sector/stable
  - sector/staking
title: "Ronin Network - REKT"
protocol: "[[Ronin Network]]"
date: 2022-03-23
loss_usd: 624000000
auditors:
source: "https://rekt.news/ronin-rekt"
excerpt: "A new number one on the leaderboard. ~$624M stolen from Ronin Network, but nobody even noticed for 6 days. Will the attacker try to launder the loot?"
genome:
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[bridge-validator-threshold]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# Ronin Network - REKT

> **Loss:** $624,000,000 | **Date:** 2022-03-23 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/03/ronin-header.png)

**[Poly Network](https://rekt.news/polynetwork-rekt/) has been toppled from [the top spot.](https://rekt.news/leaderboard/)**

~$624M stolen from Ronin Network.

_And nobody noticed for six days._

When they did eventually realise, the Ronin team [announced](https://twitter.com/Ronin_Network/status/1508828719711879168) that:

>“We discovered the attack this morning after a report from a user being unable to withdraw 5k ETH from the bridge.”

Imagine how the Ronin team felt when they found out that the bridge had been drained nearly a week earlier.

**The _new_ biggest cryptocurrency hack ever.**

_But will the attacker be able to launder the loot?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**With the rising popularity of Axie Infinity, Ronin was launched as an Ethereum side-chain in Feb 2021 to provide the fast, cheap transaction throughput necessary for a p2e game to function.**

In order to maximise TPS, decentralisation and trustlessness were neglected in favour of a Proof of Authority model in which just nine validators put their reputation at stake, rather than processing any power or funds.

**Of these nine validators, a consensus of five is necessary to approve deposits and withdrawal transactions.**

**Four of the validators are [operated](https://explorer.roninchain.com/validators) by Sky Mavis, meaning that in the event of a security breach, just one more signature was needed to control the network.**

Although the official [Community Alert](https://roninblockchain.substack.com/p/community-alert-ronin-validators) doesn't give details on how the Sky Mavis validators were compromised, it does point out the vulnerability that led to the attacker gaining control of the required fifth signature. 

**The attacker was able to gain access to the additional validator due to an arrangement made between Sky Mavis and the Axie DAO in November last year. A gas-free RPC node was established to ease costs for users during a period of heavy network traffic in which the [AXS price](https://www.coingecko.com/en/coins/axie-infinity) peaked.**

This required Axie DAO approving Sky Mavis validators to sign transactions on their behalf.

Despite the arrangement only lasting until the following month, the whitelist access was never revoked, allowing the attacker who had compromised Sky Mavis validators to use the additional (Axie DAO) signature necessary to approve transactions.

The [attacker](https://etherscan.io/address/0x098b716b8aaf21512996dc57eb0615e2383e2f96) then authorised two withdrawals, draining first [173,600 ETH](https://etherscan.io/tx/0xc28fad5e8d5e0ce6a2eaf67b6687be5d58113e16be590824d6cfa1a94467d0b7) and then [25.5M USDC](https://etherscan.io/tx/0xed2c72ef1a552ddaec6dd1f5cddf0b59a8f37f82bdda5257d9c7c37db7bb9b08) from the Ronin [Bridge contract](https://etherscan.io/address/0x1a2a1c938ce3ec39b6d47113c7955baa9dd454f2). The 25.5M USDC were swapped for ETH via [other addresses](https://etherscan.io/address/0xe708f17240732bbfa1baa8513f66b665fbc7ce10) before being returned to the main wallet. 

Perhaps in an attempt to complicate the chase, 6250 ETH have been [transferred](https://twitter.com/FrankResearcher/status/1508832517826174989) from the wallet, some of which has since been transferred to FTX and Crypto.com. The address was also initially [funded](https://etherscan.io/tx/0xe0669bbaaa12cf5ecc682848ddc373a9b86e1351bccc01092b744099bf52a87d) from Binance, but KYC’d accounts are easily acquired.

**The rest of the funds remain in the attacker’s address:** 

[0x098b716b8aaf21512996dc57eb0615e2383e2f96](https://etherscan.io/address/0x098b716b8aaf21512996dc57eb0615e2383e2f96)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**This theft will be remembered not just for its size, but for the surreal lack of awareness shown by the Ronin team.**

It seems unthinkable that their key infrastructure was not monitored, with the only alert coming from a concerned user days later.

In their [official statement](https://roninblockchain.substack.com/p/community-alert-ronin-validators), Sky Mavis has said that “_Moving forward, the threshold will be eight out of nine_” validators to approve transactions.

**However this was [enacted](https://etherscan.io/tx/0x99d8dfd159e678135634bf3e1c7d7f6af1db3fc87f90bcce675a2e4dbd491eda) almost 11 hours before the incident was officially announced.** 

_No need to rush when it’s already been almost a week…_

Although most agree on its importance, decentralisation is sometimes seen as an academic, or moral distraction from the adrenaline of trading and the pursuit of profit. 

**This case shows the real importance of decentralisation.**

_Why hadn't the Ronin validator set been expanded further?_

As we saw with the [Wormhole case](https://rekt.news/wormhole-rekt/), when [deep pockets](https://twitter.com/jump_/status/1489301013408497666) stand to lose out, a bailout is no problem.

Axie is considered the market leader in GameFi, does this incident present that same level of risk to an entire ecosystem?

_If so, who’s bailing out $624M?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
