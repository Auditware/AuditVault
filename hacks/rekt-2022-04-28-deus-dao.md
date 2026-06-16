---
tags:
  - blockchain/ethereum
  - blockchain/fantom
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - has/audit
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
title: "Deus DAO - REKT 2"
protocol: "[[Deus Dao]]"
date: 2022-04-28
loss_usd: 13400000
auditors:
  - "[[Armor Labs]]"
source: "https://rekt.news/deus-dao-rekt-2"
excerpt: "Deus DAO double damage. In an unfortunate sequel to last month’s incident, the protocol has now lost a further $13.4M. How did the attacker bypass the new oracle?"
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Deus DAO - REKT 2

> **Loss:** $13,400,000 | **Date:** 2022-04-28 | **Audited by:** Armor Labs

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/04/deus2-header.png)

**Deus DAO dealt double damage.**

On 15th March, the project’s users were liquidated for a total of $3M.

In an unfortunate sequel, the protocol has now lost a further $13.4M.

Deus DAO [recognised](https://twitter.com/DeusDao/status/1519574219419496449) the exploit stating that:

> 1. User funds are safe. No users were liquidated
>
> 2. DEI lending has been temporarily halted
>
> 3. $DEI peg has been restored.

This attack used a similar technique to the first; oracle manipulation to inflate the value of DEI collateral, however this time the process was more complex.

**In [last month’s article](https://rekt.news/deus-dao-rekt/) we asked:**

_Why didn’t Deus DAO have a more robust system in place?_

In Deus DAO’s [official response](https://lafayettetabor.medium.com/deus-post-mortem-3c65df12927f), Lafayette Tabor explained that the integration of Muon’s off-chain VWAP oracle was “_designed exactly to prevent this_”.

It was then [announced on Discord](https://discord.com/channels/746652484382228480/895295996672745502/954875912321642506) on March 19th that “Muon oracles are ready and implemented”.

_But it seems the new system wasn't enough to keep the protocol safe._

How did the attacker bypass the new oracle?

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**This exploit was [not as straightforward](https://twitter.com/lafachief/status/1519616442412449792) as the last.**

The hacker needed to trick the off-chain (Muon) oracle as well as manipulate the on-chain price feed _(the same USDC/DEI pool as before)_.

The Muon oracle monitors transactions within the Solidly USDC/DEI pool to calculate a Volume Weighted Average Price (VWAP). Four minutes before the main attack transaction, a separate [transaction](https://ftmscan.com/tx/0x8589e136e6ad927096d07baa16852d16f11456c0446efb8f1ecd467ce0d4cb10) was able to [“fake”](https://twitter.com/lafachief/status/1519624606180691968) a swap of ~2M USDC to 100k DEI.

The funds necessary to finance this manipulation were [initially withdrawn](https://etherscan.io/address/0x700a81265ea72f609eaf9d0f08356c94b1c5af52#internaltx) from Tornado Cash before being [sent on](https://etherscan.io/tx/0x96a06ee8ffc205f33ec6a2645bf240d1b577cd8085e1504525c108997e833fb8) to the exploiter’s address, swapped for $2M USDC and then sent via Multichain to Fantom (example tx: [send](https://etherscan.io/tx/0xf4b19a90df1eed9faf8672876996f56ed57fc3702d98d3efa2262a598b102428), [receive](https://ftmscan.com/tx/0x80e70a4956216630aa0d9ec4edc1a1c3dd35cec898b6cfda05fda9435bd270f8)).  

In what Tabor claims to be a [“_a zero-day exploit on Solidly swaps_”](https://twitter.com/lafachief/status/1519645308061462528), a series of flash-swaps inside the same pool outputs a manipulated price, which is read by the Muon oracle.

He went on to explain via DM that:

>”we came to the conclusion it all is based on the fact the muon oracle implementation only used Solidly as a price source, they have been working on upgrading that already.
>
>the swap used flashswap() that wasnt filtered out properly by muon leading to a short term VWAP price glitch…
>
>…Main takeaway based on the whitehackers anlysis is to change muon vwap pricing to filter out obscure swaps and use multiple data sources."

After having prepared the Muon oracle, at 02:40 UTC, the [main attack](https://ftmscan.com/tx/0x39825ff84b44d9c9983b4cff464d4746d1ae5432977b9a65a92ab47edac9c9b5) targeted the USDC/DEI pool used by the lending contract as an on-chain oracle for DEI, using the same process as before.

_Credit: [Peckshield](https://twitter.com/peckshield/status/1519533378529562624)_

**1:** Flashloan 143,200,000 USDC

**2:** Swap 143,200,000 USDC to 9,547,716 DEI via sAMM-USDC/DEI_USDC_DEI (so DEI becomes extremely expensive)

**3:** With 71,436 DEI as collateral, attacker borrows 17,246,885 DEI from DeiLenderSolidex due to the manipulated price in step 2

**4:** Repay flashloan with ~$13M as hack profit

**While last month’s attack manipulated collateral price in order to liquidate borrowers, this time, the collateral was used to borrow funds directly from the protocol.**

The loot _(5446 ETH, including the funds used to finance the Muon manipulation)_ was sent from the attacker’s address on [Fantom](https://ftmscan.com/address/0x701428525cbac59dae7af833f19d9c3aaa2a37cb) to [Ethereum](https://etherscan.io/address/0x701428525cbac59dae7af833f19d9c3aaa2a37cb) and then on to Tornado Cash.

**Muon oracle manipulation tx:** [0x8589e1…](https://ftmscan.com/tx/0x8589e136e6ad927096d07baa16852d16f11456c0446efb8f1ecd467ce0d4cb10)

**Main flashloan attack tx:** [0x39825f… ](https://ftmscan.com/tx/0x39825ff84b44d9c9983b4cff464d4746d1ae5432977b9a65a92ab47edac9c9b5)

**Attacker’s address (FTM):** [0x701428… ](https://ftmscan.com/address/0x701428525cbac59dae7af833f19d9c3aaa2a37cb)

**Attacker’s address (ETH):** [0x701428…](https://etherscan.io/address/0x701428525cbac59dae7af833f19d9c3aaa2a37cb)

Despite this being the second incident to affect the project in as many months, the price of [DEUS](https://www.coingecko.com/en/coins/deus-finance) has returned close to pre-hack prices, after an initial ~20% drop. [DEI](https://www.coingecko.com/en/coins/dei-token) has been trading under peg since the incident, but appears to be stabilising over time.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**Given the oracle is a new product and the swap vulnerability is allegedly previously unknown, it's no surprise that the [Armors Labs’ audit](https://github.com/deusfinance/lending-audit/blob/main/Armor%20Labs%20Audit%20report/DEUS%20Lending_audit.pdf) of Deus’ lending product did not pick up the issue.**

However, even if the claims of a novel vulnerability are accurate, Tabor’s admissions show that the Muon oracle wasn’t up to task - it shouldn’t have been using a single price source, and had inadequate filtering of “obscure swaps”.

Both of these factors will be addressed and, similarly to last time, the project will be [covering losses](https://twitter.com/lafachief/status/1519624610194599938), this time via veDEUS funds.

There are reliable, established and already battle-tested options to choose from.

While innovation is admirable, [security standards](https://samczsun.com/so-you-want-to-use-a-price-oracle/) emerged from our [baptism of fire.](https://rekt.news/on-flash-loans/)

_Let’s make sure to use them._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
