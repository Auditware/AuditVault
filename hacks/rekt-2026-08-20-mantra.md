---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - web3-sector/bridge
  - web3-sector/infra
  - web3-sector/multisig
  - web3-sector/staking
  - web3-sector/token
  - vuln/arithmetic/underflow
  - vuln/oracle/spot-price
  - precondition/insider
  - novelty/known-pattern
  - type/hack
  - vector/access-control
  - vector/integer-overflow
title: "Mantra - Rekt"
protocol: "Mantra"
date: 2026-08-20
loss_usd: 3600000
audit: "N/A"
source: "https://rekt.news/mantra-rekt"
excerpt: "An attacker drained 720M MANTRA, worth $3.6 million per Mantra’s postmortem, through a confirmed Cosmos EVM underflow bug. The halt came too late for 94.7% of it, which had already reached an exchange"---
# Mantra - Rekt

> **Loss:** $3,600,000 | **Date:** 2026-08-20 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/mantra-rekt-header.png)


_[720,923,967.99 MANTRA left two MANTRA-managed wallets](https://x.com/Rarma_/status/2090702605853012167) on Aug. 20, [worth roughly $3.6 million at the pre-incident spot price](https://x.com/MANTRA_Chain/status/2093288372995543088)._  
  
**[94.7% of it reached a single exchange deposit address before MANTRA ever halted the chain](https://x.com/MANTRA_Chain/status/2093288372995543088); the halt froze only what remained.**

**[MANTRA's own postmortem confirms the failure sat one layer down](https://x.com/MANTRA_Chain/status/2093288372995543088):** A chain of two vulnerabilities in the balance-accounting layer of the shared Cosmos EVM module, the same open-source stack [relied on by other chains](https://github.com/cosmos/evm/security/advisories/GHSA-54gx-3cgr-7mfm) whose teams may not have independently audited every component.

[An unsigned-integer underflow gave the vesting account](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md) an artificially inflated EVM-side balance.  
  
[The attacker then used that wrapped balance in a transfer to a victim account](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md), the burn address or the genesis multisig, producing an overflow that left the attacker holding what the victim lost.  
  
_[An attacker's contract, routed through the staking precompile](https://x.com/MANTRA_Chain/status/2093288372995543088), debited MANTRA's wallets directly, without the private keys, and the stack allowed it to happen._

**This was MANTRA's second major crisis in sixteen months, following the insider-dumping collapse that erased roughly $5 billion in April 2025, as detailed in [rekt's prior reporting, "Mantra of Misfortune"](https://rekt.news/mantra-of-misfortune).**  
  
**[This time, the team moved quickly](https://x.com/MANTRA_Chain/status/2093288372995543088):** It halted the chain 14 minutes after the second unauthorized transaction, then patched the network and resumed block production 30 hours and 13 minutes later.

[Three more chains would be compromised in the same week](https://x.com/Airdrops_one/status/2092336037640970398) by attacks linked to the Cosmos EVM vulnerability cluster.  
  
**[MANTRA’s own postmortem, published Aug. 28, confirms the root cause](https://x.com/MANTRA_Chain/status/2093288372995543088):** An unsigned-integer underflow in the balance-accounting layer of Cosmos EVM, triggered by a specially constructed vesting account and a call through the staking precompile.  
  
**As of that publication, none of the extracted funds had been recovered.**

_The bug is confirmed. The halt worked as a containment mechanism, but only for what remained. Eight days later, why hasn’t a single token come back?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Rarma](https://x.com/Rarma_/status/2090702605853012167), [MANTRA](https://x.com/MANTRA_Chain/status/2093288372995543088), [Grey Ledger](https://x.com/Airdrops_one/status/2092336037640970398), [Cosmos Labs](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md), [TechTimes](https://www.techtimes.com/articles/325233/20260821/mantra-chain-hacked-via-cosmos-evm-bug-that-already-cost-saga-7m-january.htm), [CoinDesk](https://www.coindesk.com/tech/2026/08/21/mantra-token-plunges-18-to-record-low-as-blockchain-halts-after-exploit), [TAC](https://x.com/TacBuild/status/2091873937655574938), [KiiChain](https://x.com/KiiChainio/article/2091721027583709214), [Nesa](https://x.com/nesaorg/status/2091915864497066077), [De](https://x.com/justde/status/2091950451214405678), [Protos](https://protos.com/cosmos-labs-under-fire-over-disclosure-of-bug-affecting-four-blockchains/), [The Coin Republic](https://www.thecoinrepublic.com/2026/08/21/mantra-price-crashes-18-as-exploit-forces-full-blockchain-halt/)_

**MANTRA broke the news itself.**

[On Aug. 20, the team posted only that it was "aware of an incident,"](https://x.com/MANTRA_Chain/status/2090592265765077162) had frozen the chain as a precaution, and had no root cause or timeline to share.  
  
No amount, no addresses, no name for what had gone wrong.

**Roughly nine and a half hours later, [a second post narrowed things slightly](https://x.com/MANTRA_Chain/status/2090736752663339313):** The incident was isolated to the Cosmos EVM module, two MANTRA-managed wallets were affected, and no user funds had been touched.  
  
_Still nothing on how much._

**The accounting came from somewhere else, at first.**  
  
**[Rarma traced the drain to two sources](https://x.com/Rarma_/status/2090702605853012167):** 600,000,035.55 MANTRA from the null/burn address and 120,923,932.44 MANTRA from a genesis-era multisig.  
  
[The funds moved through a single attacker wallet](https://x.com/Rarma_/status/2090702605853012167), which fired 24 transactions before going quiet.  
  
[Rarma initially assigned the theft zero realized value because](https://x.com/Rarma_/status/2090702605853012167), at the time of his analysis, nothing had left the chain to be sold.  
  
**[MANTRA's own postmortem, published Aug. 28, put a different figure on it](https://x.com/MANTRA_Chain/status/2093288372995543088):** Roughly $3.6 million, at the pre-incident spot price of $0.005 per token.  
  
**[It took MANTRA eight days to publicly confirm the amount and mechanism](https://x.com/MANTRA_Chain/status/2093288372995543088) that Rarma had pieced together from public transactions within hours.**  
  
_What was worth protecting in that gap?_  
  
### One Day Too Late

_The confirmed root cause trail begins in May._  
  
**[On May 13, Cosmos Labs opened a pull request, titled “fix: harden statedb balance and event amount handling.”](https://github.com/cosmos/evm/pull/1176) Its description said the change would “guard StateDB balance subtraction against underflow” and make precompile balance-event parsing denomination-aware.**  
  
[In the exploit path later confirmed by MANTRA](https://x.com/MANTRA_Chain/status/2093288372995543088), that combination could allow a contract to create an artificially inflated EVM-side balance and spend funds it did not legitimately control.  
  
The pull request [merged into the main branch on May 15.](https://github.com/cosmos/evm/pull/1176)

[An independent researcher published a full write-up of the underlying exploit path on July 27](https://berardinellidaniele.com/posts/cosmos/), in a piece titled "[Printing Infinite Money on the Cosmos Blockchain](https://berardinellidaniele.com/posts/cosmos/)," reportedly after first reporting it through HackerOne.

_The backport to the [release branches did not begin until Aug. 13](https://github.com/cosmos/evm/pull/1254)._

**[PR #1253](https://github.com/cosmos/evm/pull/1253) and [PR #1254](https://github.com/cosmos/evm/pull/1254) were both merged into their respective release branches on Aug. 19, the same day [Cosmos Labs shipped v0.7.2, whose release notes described the update as containing “important security fixes” and recommended a “coordinated upgrade.”](https://github.com/cosmos/evm/releases/tag/v0.7.2)**  
  
[MANTRA's postmortem says the corresponding v0.6.2 release](https://x.com/MANTRA_Chain/status/2093288372995543088), the version relevant to MANTRA's own chain, [was also published approximately 20 hours before the first drain](https://x.com/MANTRA_Chain/status/2093288372995543088).  
  
Neither release identified the balance-underflow vulnerability or explained its potential impact.  
  
At 07:16 UTC the next morning, [a public pull request on Push Chain's fork of cosmos/evm precisely described the vulnerability and its exploit path](https://github.com/pushchain/push-chain-evm/pull/40), citing an independent Hacken audit and naming the vulnerable release tags, nearly 12 hours before [MANTRA's first attack](https://x.com/MANTRA_Chain/status/2093288372995543088) and roughly 16 hours before [the chain went dark](https://x.com/MANTRA_Chain/status/2090592265765077162).  
  

**That is the story the rest of the cluster tells.**  
  
_**[MANTRA's own postmortem, published Aug. 28, confirms the same account](https://x.com/MANTRA_Chain/status/2093288372995543088):** An unsigned-integer underflow in the balance-accounting layer of cosmos/evm, triggered by a specially constructed vesting account combined with a call through the staking precompile._  
  
It was the defect [the May guard was written to catch](https://github.com/cosmos/evm/pull/1176).  
  
[Cosmos Labs' own postmortem, published the same day, named GHSA-7g4w-cg88-2cq2](https://x.com/cosmoslabs_io/status/2093339849214582969), describes two chained defects, not one.  
  
_[An unchecked underflow lets a vesting account delegate more than its EVM-tracked spendable balance through the staking precompile](https://x.com/cosmoslabs_io/status/2093339849214582969), wrapping the balance to roughly 2^256._  
  
**[That wrapped balance was then sent to a victim account](https://x.com/cosmoslabs_io/status/2093339849214582969), the burn address or the genesis multisig, producing an overflow that left the attacker holding the victim's balance and the victim holding zero.**  
  
[Both fired inside a single, supply-neutral transaction](https://x.com/cosmoslabs_io/status/2093339849214582969), executed through a contract deployed at a precomputed address on top of the vesting account.  
  
The mechanism is visible in the chain’s own transaction history.

_[MANTRA's postmortem lays out the mechanism](https://x.com/MANTRA_Chain/status/2093288372995543088) transaction by transaction._  
  
**An attacker-controlled address [submitted a CreateVestingAccount message](https://explorer.mantrachain.io/MANTRA/tx/32013C7981C81531437242AD1CEBEC44E5A5EF72BEBD926F65131639E0E73A06) at block 17,444,907 at 19:04:50 UTC on Aug. 20.**

Seventy seconds later, [a transaction in block 17,444,928 moved 600,000,035.56 MANTRA out of the null/burn address](https://explorer.mantrachain.io/MANTRA/account/mantra13n9sk3p8x7tpq9adgxvzv9q0qev953mld0hwva) and into the attacker's wallet.  
  
**A nearly identical sequence followed at 22:58:47 UTC:** [A second CreateVestingAccount message](https://explorer.mantrachain.io/MANTRA/tx/41C4FF475FD8F56066B5065B8FAEBB24804C084C8D6FB40BBB5C559F3EEBE0F7), then, fourteen seconds later, [a transaction in block 17,449,159 draining 120,923,932.44 MANTRA from the genesis-era multisig](https://explorer.mantrachain.io/MANTRA/account/mantra13n9sk3p8x7tpq9adgxvzv9q0qev953mld0hwva).  
  
[Cosmos Labs’ postmortem independently confirmed both transactions](https://x.com/cosmoslabs_io/status/2093339849214582969) as MANTRA attack #1 and attack #2.

Vesting accounts, it turns out, were the mechanism, confirmed in MANTRA's own account.

**The bug is no longer a mystery. A guard against it existed three months before MANTRA needed it, but the fix did not reach the relevant release branch, or the affected chains, in time.**  
  
_Was the failure in the code, or in the release schedule that sat on the fix?_

### Mostly Gone

_[The attacker sent 24 transactions during the incident](https://x.com/Rarma_/status/2090702605853012167), draining two compromised addresses, and, within minutes of each drain, [moving the proceeds out in fixed-size batches to a single exchange deposit address._  
  
**[MANTRA halted the chain at block at 23:13 UTC](https://x.com/MANTRA_Chain/status/2093288372995543088), 14 minutes after the second drain.**  
  
[By then, 682,966,951.64 MANTRA, 94.7% of everything taken, had already reached the exchange deposit address](https://x.com/MANTRA_Chain/status/2093288372995543088), moved in 15 scripted transfers spaced across roughly four hours.  
  
**[The halt froze only what was left behind](https://x.com/MANTRA_Chain/status/2093288372995543088):** Approximately 37.96 million MANTRA, 5.27% of the total, still sitting in the attacker's wallet.  
  
**Attacker's Wallet:**
[mantra13n9sk3p8x7tpq9adgxvzv9q0qev953mld0hwva](https://explorer.mantrachain.io/MANTRA/account/mantra13n9sk3p8x7tpq9adgxvzv9q0qev953mld0hwva)

_[MANTRA's own postmortem values the total extraction at roughly $3.6 million](https://x.com/MANTRA_Chain/status/2093288372995543088), using the pre-incident spot price of $0.005 per token._  
  
**[MANTRA fell 18.5% in the hours around the halt, from $0.005060 to a record low of $0.004126, while trading volume spiked nearly 600%](https://www.coindesk.com/tech/2026/08/21/mantra-token-plunges-18-to-record-low-as-blockchain-halts-after-exploit) as holders reacted to a chain going dark without an explanation attached.**  
  
[MANTRA hotfix is released, v0.6.0-v8-mantra-6, at 02:28:46 UTC on Aug. 21](https://x.com/cosmoslabs_io/status/2093339849214582969), hours before the final patch.

[MANTRA restarted on at 05:26 UTC on Aug. 22 running patched v8.4.0](https://x.com/MANTRA_Chain/status/2093288372995543088), roughly 30 hours after the halt.  
  
[Cosmos Labs' own postmortem gives a different time for the same milestone](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md), 03:38:07 UTC, a discrepancy neither account resolves.  
  
_There was no rollback, no alteration of the recorded chain state, and user balances were left exactly as they stood before the halt began._  
  
**[The v8.4.0 release also restricted the attacker's account](https://x.com/MANTRA_Chain/status/2093288372995543088), immobilizing the remaining balance still sitting there.**  
  
As of Aug. 28, none of it, the frozen 5.27% included, [had been recovered](https://x.com/MANTRA_Chain/status/2093288372995543088).

The stolen funds never crossed a bridge or left MANTRA Chain for another network.  
  
But “on-chain” and “untouched” turned out to be two different claims. [Almost all of the extracted funds reached an exchange-deposit address on MANTRA Chain before the halt caught up](https://x.com/MANTRA_Chain/status/2093288372995543088).  
  
**Three more chains running the same underlying stack would not be so fortunate that week.**  
  
_So what, exactly, separated a contained incident from a catastrophic one?_  
  
### Everyone Else's Turn

_MANTRA's halt bought it time, but not an untouched ledger, most of the drained funds had already reached an exchange before the chain went dark._  
  
**Two days later, [TAC](https://x.com/Rarma_/status/2091799580610597029) and [KiiChain halted too late](https://x.com/KiiChainio/article/2091721027583709214) to contain the funds.**  
  
On Aug. 22, the same vulnerability cluster [drained 2,985,651,403 TAC from a single account](https://x.com/TacBuild/status/2091873937655574938) and [148,326,583.15 KII across 18 repeated withdrawals from KiiChain](https://x.com/KiiChainio/article/2091721027583709214).  
  
[Rarma's forensic thread describes TAC's mechanism as the same vesting-account and staking-precompile](https://x.com/Rarma_/status/2091799580610597029) pattern [MANTRA's postmortem later confirmed](https://x.com/MANTRA_Chain/status/2093288372995543088).  
  
TAC has not independently confirmed that attribution.  
  
_**The attacks came two days apart but ended very differently:** MANTRA's funds moved but stayed on MANTRA Chain, while TAC's and KiiChain's crossed bridges to other networks._

**[TAC's attacker bridged the tokens to BNB Chain in 95 seconds](https://x.com/Rarma_/status/2091799580610597029), roughly four hours before TAC's own halt took effect.**  
  
[KiiChain froze 54.4% of the stolen KII on-chain](https://x.com/KiiChainio/article/2091721027583709214); most of the remainder was bridged out and sold for roughly 1.61 million BUSD.  
  
[Nesa followed two days later](https://x.com/nesaorg/status/2091915864497066077). The project said it had identified malicious behavior on its L1, taken action to contain the impact, and taken its services offline while a software fix was applied.  
  
_The extent of the loss was [subsequently reconstructed from Ethereum-side bridge logs.](https://x.com/Rarma_/status/2092001755559309523)_

**[Cosmos Labs publicly released v0.7.2 on Aug. 19](https://github.com/cosmos/evm/releases/tag/v0.7.2), with the underflow fix described only as an “important security fix.”**

[It did not advise affected chains to halt immediately until Aug. 25](https://x.com/cosmoslabs_io/status/2092270725122207904), six days later, when it told chains running versions earlier than v0.6.2 on the v0.6 branch or earlier than v0.7.2 on the v0.7 branch to halt and upgrade.  
  
[Cosmos Labs first acknowledged an "ongoing security incident" on Aug. 24](https://x.com/cosmoslabs_io/status/2091935066381582390), four days after MANTRA's halt and two days after TAC and KiiChain were compromised.

[ ](https://x.com/cosmoslabs_io/status/2092270725122207904)KiiChain's postmortem, [published Aug. 23, called the losses "avoidable" and directly criticized Cosmos Labs' disclosure process](https://x.com/KiiChainio/article/2091721027583709214).  
  
Publishing a fix publicly before privately warning the chains running it, KiiChain wrote, ["hands the vulnerability to anyone reading the commit."](https://protos.com/cosmos-labs-under-fire-over-disclosure-of-bug-affecting-four-blockchains/)

_KiiChain was not alone in that assessment._  
  
**[Indie Developer De called the disclosure "negligent AF," pointing to the Aug. 19 release](https://x.com/justde/status/2091950451214405678): “This release contains important security fixes. All chains should upgrade ASAP using a coordinated upgrade.”**  
  
The release included no public advisory and no main-channel announcement; [the GitHub release itself](https://github.com/cosmos/evm/releases/tag/v0.7.2) described the change only as containing “important security fixes” and urged chains to upgrade using a coordinated upgrade.  
  
[Protos likewise reported that MANTRA, TAC, KiiChain, and Nesa all appeared to be affected](https://protos.com/cosmos-labs-under-fire-over-disclosure-of-bug-affecting-four-blockchains/) by the same Cosmos EVM vulnerability.

[MANTRA’s own postmortem adds a wrinkle to that account.](https://x.com/MANTRA_Chain/status/2093288372995543088) It says MANTRA’s engineers reported both the vulnerability and the live exploit to Cosmos Labs directly, and that the security advisory sent to other Cosmos EVM chains went out only after that report.

_**[Cosmos Labs’ own postmortem independently confirms it](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md):** A war room was set up with MANTRA, and a private patch notice went out to known Cosmos EVM chains roughly two hours after MANTRA’s report, though that notice recommended upgrading, not halting._  
  

**[The halt recommendation itself did not go out until roughly an hour after Cosmos Labs](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md) learned TAC had also been hit.**  
  
MANTRA wasn’t just another chain caught by a slow disclosure process; [it was the one that triggered the wider response](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md).  
  
[That still sits uneasily next to KiiChain’s account](https://x.com/KiiChainio/article/2091721027583709214), which blames Cosmos Labs for not warning affected chains fast enough and does not credit MANTRA’s report as the trigger.  
  
_**Both details can be true at once:**  [MANTRA prompted the private outreach](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md), and that outreach still was not fast enough to save TAC or KiiChain._  
  

**MANTRA, for its part, was already carrying weight before any of this began.**

[This is the same token that lost 90% of its value in April 2025](https://rekt.news/mantra-of-misfortune), and [the exploit landed amid Inveniam Capital Partners’ proposed acquisition of MANTRA](https://www.thecoinrepublic.com/2026/08/21/mantra-price-crashes-18-as-exploit-forces-full-blockchain-halt/), a deal still targeted to close in the third quarter.  
  

MANTRA [promised a postmortem on Aug. 23.](https://status.mantrachain.io/incidents/01M0GRZSN99Q68QTFZT2QH4MDV)

[It finally arrived Aug. 28](https://x.com/MANTRA_Chain/status/2093288372995543088), confirming the root cause but disclosing no fund recovery.

  
**Four publicly identified chains. One vulnerability cluster. A response that eventually became public, but only after the exploit had moved from MANTRA to TAC and KiiChain.**  
  
_So who, exactly, gets to call this contained?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_MANTRA wasn't beaten by a hacker's ingenuity._  
  
**It was beaten by an ecosystem that still doesn’t treat disclosure as part of the fix, [publishing the patch without explaining its urgency and shifting to emergency halts only after the next chains were hit.](https://thedefiant.io/news/blockchains/cosmos-evm-urges-evm-chains-halt-shared-bug-drains-three-networks)**

[Saga lost roughly $7 million to a Cosmos EVM bug](https://rekt.news/saga-rekt) in January.  
  
Cosmos Labs shipped a permanent fix in March and marked the advisory as resolved.  
  
Seven months later, a compiled timeline placed the same shared module at the center of attacks affecting four more chains over five days.

_**[MANTRA’s own postmortem, published Aug. 28, confirmed which bug hit it](https://x.com/MANTRA_Chain/status/2093288372995543088):** The same underflow the May guard was written to catch._

**[Cosmos Labs now says MANTRA’s report triggered its private response](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md), and that its own initial assessment had wrongly concluded the vulnerability did not threaten production funds.**  
  
**That explanation matters, but it does not erase the result:** By the time the ecosystem moved to an immediate-halt posture, [TAC’s funds had already crossed a bridge](https://x.com/Rarma_/status/2091799580610597029) and [KiiChain’s were already being drained.](https://x.com/KiiChainio/article/2091721027583709214)

By the numbers, [720,923,967.99 MANTRA, roughly $3.6 million by MANTRA’s own postmortem valuation](https://x.com/MANTRA_Chain/status/2093288372995543088), was extracted from two wallets.  
  
[MANTRA reported that no user funds](https://x.com/MANTRA_Chain/status/2090736752663339313) were exploited.  
  
_[No stolen tokens crossed a bridge to another blockchain](https://x.com/MANTRA_Chain/status/2093288372995543088), though 94.7% of them reached an exchange-deposit address before the halt caught up._

**[The network restarted roughly 30 hours later](https://status.mantrachain.io/incidents/01M0GRZSN99Q68QTFZT2QH4MDV), and as of the postmortem, none of the extracted MANTRA had been recovered.**

But clean is not the same as accountable. MANTRA moved fast enough to halt the chain and freeze the funds that remained during an active drain.  
  
It took more than a week to publicly confirm the bug that caused the incident, and, as of that confirmation, none of the extracted MANTRA, frozen or otherwise, had been recovered.

Shared infrastructure holds only when disclosure is treated with the same urgency as the code itself. Nobody in this stack has proven that yet.  
  
This time, the warning eventually traveled. It just did not reach every chain in time.

**A chain can survive an exploit intact, confirm the exact bug that caused it, and still recover nothing for the people it affected.**  
  
_Over a week later, what exactly does “contained” mean if nothing comes back?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
