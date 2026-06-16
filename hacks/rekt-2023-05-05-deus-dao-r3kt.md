---
tags:
  - blockchain/arbitrum
  - blockchain/bsc
  - blockchain/ethereum
  - blockchain/fantom
  - sector/governance
  - sector/multisig
  - sector/privacy
  - sector/stable
  - sector/token
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
  - novelty/variant
title: Deus DAO - R3KT
protocol: "[[Deus Dao]]"
date: 2023-05-05
loss_usd: 6500000
auditors:
source: https://rekt.news/deus-dao-r3kt
excerpt: It’s a hat trick for Deus DAO.  Token holders lost a total of ~$6.5M and DEI depegged by over 80%. How many times can a thrice-hacked protocol be trusted?
genome:
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[frontrun-exposure]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[oracle-freshness]]"
  - "[[upgrade-safety]]"
---
# Deus DAO - R3KT

> **Loss:** $6,500,000 | **Date:** 2023-05-05 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/deus3-header.png)

_It’s a hat trick for [Deus DAO](https://twitter.com/DeusDao)._

**Token holders lost a total of ~$6.5M on Arbitrum, BSC and Etherum, and the [DEI stablecoin](https://www.coingecko.com/en/coins/dei-token) depegged over 80%.**

This incident, just over a year since their [last appearance](https://rekt.news/deus-dao-rekt-2/), makes Deus DAO the third protocol with three entries on our [leaderboard](https://rekt.news/leaderboard/).

Deus’ two previous entries were on the project’s original home, FTM, where they don’t appear to have been affected. Since then, DEI has branched out onto other chains.

After the [alarm was raised](https://twitter.com/hippo_potato/status/1654555505854152704), and the [root cause identified](https://twitter.com/adamb83024264/status/1654558408803250176), Deus eventually [acknowledged](https://twitter.com/DeusDao/status/1654614967084101633) the hack, as well as confirming a multisig address for whitehats to return funds.

_But how many times can a thrice-hacked protocol be trusted?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[adamb](https://twitter.com/adamb83024264/status/1654558408803250176), [Zellic](https://twitter.com/zellic_io/status/1654605171333423104), [0xProtosec](https://twitter.com/0xProtosec/status/1654592710546960385)

A simple implementation error was introduced into the DEI token contract, in an upgrade last month. The burnFrom function was misconfigured, with the ‘_allowances’ parameters ‘msgSender’ and ‘account’ written into the contract in the wrong order.

This created a public (or pubic, according to [Peckshield](https://twitter.com/peckshield/status/1654626667787321344)) burn vulnerability, which an attacker is then able to manipulate and gain control of DEI holders’ approvals and transfer assets directly to their own address.

The mis-ordered parameters allow the attacker to set a large token approval for any DEI holder’s address. Then, by burning 0 tokens from the address, the approval is updated to the attacker’s address, who can drain the holder’s funds.

See the [following](https://twitter.com/PaladinCharles/status/1654585109964619777) step-by-step:

>identify an address with a huge amount of DEI
>
>approve to this address
>
>call burnFrom with amount = 0 and this address
>
>During the burnFrom it grants approves all tokens from the address to your own
>
>call transferFrom

Attacker’s address (Arbitrum): **[0x189cf534de3097c08b6beaf6eb2b9179dab122d1](https://arbiscan.io/address/0x189cf534de3097c08b6beaf6eb2b9179dab122d1)**

Example attack tx (Arbitrum): [0xb1141785…](https://arbiscan.io/tx/0xb1141785b7b94eb37c39c37f0272744c6e79ca1517529fec3f4af59d4c3c37ef)

Frontrunner address (BSC): [0x5a647e376d3835b8f941c143af3eb3ddf286c474](https://bscscan.com/address/0x5a647e376d3835b8f941c143af3eb3ddf286c474)

Example attack tx (BSC): [0xde2c8718…](https://bscscan.com/tx/0xde2c8718a9efd8db0eaf9d8141089a22a89bca7d1415d04c05ba107dc1a190c3)

Attacker’s address (Ethereum): [0x189cf534de3097c08b6beaf6eb2b9179dab122d1](https://etherscan.io/address/0x189cf534de3097c08b6beaf6eb2b9179dab122d1)

Example attack tx (Ethereum): [0x6129dd42…](https://etherscan.io/tx/0x6129dd42778345bc278822a7feadeacb933f5e56ce51114e686832ad239307a8)

**According to BlockSec’s [MetaSleuth](https://twitter.com/MetaSleuth/status/1654688526095745024), the losses were approximately $5M on Arbitrum, $1.3M on BSC and $135k on Ethereum.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

Luckily, the exploit on BSC was frontrun, and an on-chain [message](https://bscscan.com/tx/0x6cda17b36013ab3d5c2ed95cdb56256bffcb4f086f0c849ae53d4f036f96c322) to the Deus Deployer shows the intent to return the funds. Other [whitehats](https://twitter.com/pcaversaccio/status/1654576766927634432) also sprang into action, and over $600k in USDC has so far been returned to a [recovery multisig](https://arbiscan.io/address/0xf8b5e2e99faea5a3416822123c8eca24309cab99#tokentxns).

_However, there were also [doubts](https://twitter.com/adamb83024264/status/1654577806628761600) about the usefulness of giving funds back to a team that produced such a trivial bug._

**Returning rescued funds to a thrice-hacked protocol seems rather counterproductive…**

An official update mentions a [recovery plan](https://twitter.com/DeusDao/status/1654808611263246336) for users who lost out in the exploit, and Deus have [reached out](https://arbiscan.io/tx/0xa99e7ee2889fddd52f2c1549072f290516e1001b3220e44f0e62d9ec26341abe) to the attacker on-chain.

But given the account was originally [funded](https://bscscan.com/tx/0x8b1fd7b6726499fcd4bf4d593fe7be80c2ec134d81db1d431cb590a9ea88147a) via Tornado Cash on BSC, it’s not looking good.

_Will this be finally be a killing blow for Deus DAO?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
