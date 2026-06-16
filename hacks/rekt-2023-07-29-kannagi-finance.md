---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/privacy
  - sector/token
  - sector/vault
title: "Kannagi Finance - REKT"
protocol: "[[Kannagi Finance]]"
date: 2023-07-29
loss_usd: 2100000
auditors:
source: "https://rekt.news/kannagi-finance-rekt"
excerpt: "Kannagi Finance, a yield aggregator on zkSync pulled the rug on Saturday, dropping TVL from $2.1M to $0.17. The auditors may have highlighted 'centralised aspects' but, in this industry, who reads the"
genome:
  - "[[bridge-message-validation]]"
---
# Kannagi Finance - REKT

> **Loss:** $2,100,000 | **Date:** 2023-07-29 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/kannagi-header.png)

_The L2 rekt-volution continues._

**Kannagi Finance, a yield aggregator on zkSync pulled the rug on Saturday.**

Before the incident the project had $2.1M TVL according to [DeFiLlama](https://defillama.com/protocol/kannagi-finance) (now just $0.17), but the scammer only got away with around $1.1M.

The project’s [website](https://kannagi.finance/) and [socials](https://twitter.com/Kannagi_Zksync) have since been deleted.

**Kannagi had been audited twice, and [endorsed](https://twitter.com/syncswap/status/1671202414463164416) (via a deleted giveaway tweet) by ecosystem-leader SyncSwap, as was EraLend which [got rekt for $3.4M](https://rekt.news/eralend-rekt/) on Tuesday.**

The current system of rubber-stamping protocols with incomplete audits and window dressing only serves to legitimise potential rugs and scams.

**There _must_ be a better framework.**

We need internal consumer protection, if not [Gary](https://rekt.news/grudgematch-sec/) will be happy to do it for us.

_Is that what you want, anon?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[PeckShield](https://twitter.com/PeckShieldAlert/status/1685162644653973510)_

As always, this rug pull offers nothing much to report.

**While the contract was unverified, the [audit report](https://sourcehat.com/audits/KannagiFinance/) includes the line:**

>The MainChef address can initiate a withdrawal on behalf of a user by specifying the user's address and an amount to withdraw.

_Not much of a mystery then._

**And the effect:**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/kannagi-chart.png)

Scammer’s address (on [zkSync](https://explorer.zksync.io/address/0x95ec03b821f164ce55cbb26f23f591a9bd40d6c1) and [Ethereum](https://etherscan.io/address/0x95ec03b821f164ce55cbb26f23f591a9bd40d6c1)): **0x95ec03b821f164ce55cbb26f23f591a9bd40d6c1**

_The rugged funds were bridged to Ethereum and where 600 ETH ($1.1M) was deposited into Tornado Cash._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

Auditors SolidProof published a [statement](https://twitter.com/SolidProof_io/status/1685236707786969088), clarifying that the vault contract did not fall under the scope of their audit, and passing the buck to [SourceHat](https://twitter.com/SolidityFinance) (previously Solidity Finance) who did audit the vault.

**The SourceHat [audit](https://sourcehat.com/audits/KannagiFinance/) indeed pointed out that “_some centralized aspects are present_”, but is this common throwaway observation sufficient to absolve auditors of responsibility?**

Combined with the [statement](https://twitter.com/SolidityFinance/status/1673490972133699584) “_No external vulnerabilities identified_”, and looking back in hindsight, that ‘external’ is doing a lot of heavy lifting.

**Perhaps the responsibility is on users to take more notice of the wording of audit findings and their implications.**

_After all, any auditor handing over a report marked “WARNING: RUGGABLE” would soon find themselves lacking in clients._

But when audits are used as a lazy stamp of approval by projects looking to entice new users, degen gamblers and [airdrop hunters](https://rekt.news/airdrop-hunters/)…

_…do we really expect anyone to read the fine print?_

Especially when testing out the latest L2 du jour…

_Will BASE be [next](https://twitter.com/0x_vadym/status/1685585812887310336)?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
