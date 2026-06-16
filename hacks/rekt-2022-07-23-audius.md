---
tags:
  - sector/dex
  - sector/governance
  - sector/privacy
  - sector/staking
  - has/audit
  - vuln/access-control/proxy-storage-collision
  - vuln/pda/reinitialization
  - trigger/governance-vote
  - novelty/variant
title: "Audius - REKT"
protocol: "[[Audius]]"
date: 2022-07-23
loss_usd: 6000000
auditors:
  - "[[Kudelski]]"
  - "[[OpenZeppelin]]"
source: "https://rekt.news/audius-rekt"
excerpt: "Audius has fallen victim to a governance attack, losing $6M of its native token, AUDIO. Let’s hope their debut is a one-hit wonder."
genome:
  - "[[proxy-storage-collision]]"
  - "[[reinitialization]]"
  - "[[governance-vote]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[initializer-auth]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
---
# Audius - REKT

> **Loss:** $6,000,000 | **Date:** 2022-07-23 | **Audited by:** Kudelski, OpenZeppelin

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/07/audius-header.png)

**Audius, web3’s answer to Spotify, has fallen victim to a governance attack, losing $6M of its native token, AUDIO.**

The attacker passed a malicious proposal transferring the funds directly from the treasury before dumping them onto the market for just ~$1M.

_AUDIO is used for user rewards and artist tips, as well as for governance purposes on the music-streaming service._

Shortly after the [alarm was raised](https://twitter.com/spreekaway/status/1550995634899009536), Audius [announced](https://twitter.com/AudiusProject/status/1551000725169180672) the “_unauthorized transfer_”, whilst asking for help with the investigation: “_If you'd like to help our response team, please reach out._”

_Pause, rewind, play…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [Audius](https://blog.audius.co/article/audius-governance-takeover-post-mortem-7-23-22), [Spreek](https://twitter.com/spreekaway/status/1551000138134556672)_

**According to the official [post mortem](https://blog.audius.co/article/audius-governance-takeover-post-mortem-7-23-22), the attacker was able to reinitialise governance contracts, delegating a large number of governance tokens to themself and bypassing safeguards meant to limit malicious proposals.**

**Then, with their vastly increased voting power, they could pass a proposal to transfer 18M AUDIO tokens out of the treasury and straight to their own address.**

Audius uses [AudiusAdminUpgradabilityProxy](https://github.com/AudiusProject/audius-protocol/blob/master/eth-contracts/contracts/AudiusAdminUpgradeabilityProxy.sol#L13) to make any upgrades to the governance contracts. The proxyAdmin address is set as the address of the main [governance contract](https://etherscan.io/address/0x4deca517d6817b6510798b7328f2314d3003abac#code), in storage slot 0.

However, this creates a collision with OpenZeppelin's [Initializable contract](https://github.com/OpenZeppelin/openzeppelin-sdk/blob/v2.8.0/packages/lib/contracts/Initializable.sol), leading to a bug which allowed the attacker to take control of the governance contract and change parameters on any of Audius’ Governance, Staking & DelegateManagerV2 contracts.

_For further details, see [OpenZeppelin docs](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#unstructured-storage-proxies) on storage collisions._

**The post mortem summarises the actions of the attacker as follows:**

>With this, the attacker was able to (1) Re-define voting on the Audius protocol and modify the governance contract’s guardian address (2) Set the governance address of both the Staking & DelegateManagerV2 contracts to that of a custom deployment of the Audius governance contract 0xbdbb5945f252bc3466a319cdcc3ee8056bf2e569) and abuse the Audius protocol by
>
>Mark an erroneous delegation of 10,000,000,000,000 $AUDIO to themselves in an attempt to pass a governance vote. (No circulating supply impact / confined to storage of Staking & Delegation contracts)
>
>Mark a second erroneous delegation of 10,000,000,000,000 $AUDIO to themselves in an attempt to pass a governance vote, which did pass and transferred the funds. (No circulating supply impact / confined to storage of Staking & Delegation contracts)
>
> Transferring 18,564,497 $AUDIO tokens from the community treasury: [https://etherscan.io/tx/0x4227bca8ed4b8915c7eec0e14ad3748a88c4371d4176e716e8007249b9980dc9](https://etherscan.io/tx/0x4227bca8ed4b8915c7eec0e14ad3748a88c4371d4176e716e8007249b9980dc9)

**Attacker’s address:** [0xa0c7BD318D69424603CBf91e9969870F21B8ab4c](https://etherscan.io/address/0xa0c7BD318D69424603CBf91e9969870F21B8ab4c)

The attacker then went on to dump the AUDIO in a [single transaction](https://etherscan.io/tx/0x82fc23992c7433fffad0e28a1b8d11211dc4377de83e88088d79f24f4a3f28b3) via Uniswap v2, incurring major slippage and making off with just 704 ETH (~$1M).

The funds were then deposited into Tornado Cash around 10 hours later.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

Despite the [extreme price action](https://twitter.com/0xSisyphus/status/1550993262567198721) as the attacker dumped the loot, the price of [AUDIO](https://www.coingecko.com/en/coins/audius) has held up well since the incident.

A quick response time from the team (plus [help](https://twitter.com/AudiusProject/status/1551378752424161280)), and the loss coming from the treasury, rather than users pockets, likely minimised the fallout.

The contracts had been audited twice, by [Kudelski](https://assets.website-files.com/6024b69839b1b755528798ea/6201872afb297b3955e303aa_Audius%20-%20Security%20Assessment%20for%20Audius%20Protocol%20v1.1.0.pdf) and [OpenZeppelin](https://blog.openzeppelin.com/audius-contracts-audit/), and the vulnerability is [a known issue](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#unstructured-storage-proxies).

However, this doesn’t look to have knocked Audius off the DeFi playlist for good.

_Let’s just hope their [debut](https://rekt.news/leaderboard/) is a one-hit wonder._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
