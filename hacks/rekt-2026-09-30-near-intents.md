---
tags:
  - type/hack
  - blockchain/arbitrum
  - blockchain/avalanche
  - blockchain/bitcoin
  - blockchain/bsc
  - blockchain/ethereum
  - blockchain/near
  - blockchain/optimism
  - blockchain/polygon
  - blockchain/solana
  - web3-sector/bridge
  - web3-sector/dex
  - web3-sector/stable
  - web3-sector/staking
  - vector/access-control
title: "NEAR Intents - Rekt"
protocol: "NEAR Intents"
date: 2026-09-30
loss_usd: 3870000
audit: "N/A"
source: "https://rekt.news/near-intents-rekt"
excerpt: "A wallet funded with 10 USDT drained $3.87M from a BNB Chain vault serving NEAR Intents using valid signed authorizations. After a 48-hour ultimatum, the team announced a full recovery and closed its "
---
# NEAR Intents - Rekt

> **Loss:** $3,870,000 | **Date:** 2026-09-30 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/near-intents-rekt-header.png)

_Two days after [NEAR Intents told the world it was no place to launder stolen assets](https://x.com/AlexAuroraDev/status/2104554958754357482), someone [stole $3.87 million from it and ran part of the loot straight back through its own pipes](https://bitquery.io/investigations/near-intents-hack)._

**The only BNB Chain deposit [Bitquery could tie to the attacker before the drain was 10 USDT](https://bitquery.io/investigations/near-intents-hack).**

Over roughly six hours spanning September 30 and October 1, a [BNB Chain vault](https://docs.near-intents.org/security-compliance/treasury-addresses) paid [the attacker’s wallet](https://bscscan.com/address/0x09fd1f5d9f185067a92493e43aa259ea4ab3ad37) [3,865,000 USDT in five withdrawals](https://bitquery.io/investigations/near-intents-hack).  
  
[Each carried a signed authorization in the same form](https://bitquery.io/investigations/near-intents-hack) as an ordinary withdrawal.

[About $822,000 of the stolen value moved through NEAR Intents’ own service while the drain was still running](https://bitquery.io/investigations/near-intents-hack), including 750 BNB paid into the very vault being emptied.

_[NEAR Intent’s first public statement arrived about 13 hours](https://x.com/near_intents/status/2105642219357241796) after the [first large withdrawal](https://bscscan.com/tx/0x9fe58e031f73bbd880c782bc9e7446bcda32cadb304a729209871a4a81856c4c)._

**[Then NEAR Intents general manager, Alex Shevchenko posted](https://x.com/AlexAuroraDev/status/2105814573152661894), “We have identified you, sir,” along with three return addresses and a 48-hour clock.**

Before one-third of that window had elapsed, [the attacker asked for a Signal handle](https://bscscan.com/idm?addresses=0x09fd1f5d9f185067a92493e43aa259ea4ab3ad37,0xb18a1aedfde8b70fd67012c9e9c7a088b4d0c0e7&type=1).

[ ](https://x.com/AlexAuroraDev/status/2106049685928677585)Shortly after, [the NEAR Intents GM claimed the funds came back in full.](https://x.com/AlexAuroraDev/status/2106049685928677585)

In the same post, [Alex Shevchenko claimed they were stopping their investigation](https://x.com/AlexAuroraDev/status/2105814573152661894).  
  
**The money came back. [NEAR Intent’s promised detailed report did not](https://x.com/near_intents/status/2105642219357241796).**

_If the withdrawal authorizations were valid and the vault did what it was built to do, what made a 10 USDT deposit worth $3.87 million?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Bitquery](https://bitquery.io/investigations/near-intents-hack), [NEAR Intents](https://x.com/near_intents/status/2105642219357241796), [Alex Shevchenko](https://x.com/AlexAuroraDev/status/2105814573152661894), [ZachXBT](https://t.me/investigations/365), [AMLBot](https://x.com/AMLBotHQ/status/2105647685705597403), [Unchained](https://unchainedcrypto.com/near-intents-pledges-full-compensation-after-a-bug-lets-an-attacker-drain-3-8-million/), [Illia Polosukhin](https://x.com/ilblackdragon/status/2105686871200366663), [Gracy Chen](https://x.com/GracyBitget/status/2104602301503816040), [NEAR](https://docs.near.org/chain-abstraction/intents/overview), [HOT Protocol](https://docs.hotdao.ai/omni-tokens), [Veridise](https://veridise.com/wp-content/uploads/2025/10/VAR_Stellar_250715_HOT_DAO-V2.pdf), [Solidity](https://docs.soliditylang.org/en/v0.8.14/smtchecker.html), [The Block](https://www.theblock.co/news/ecosystems/2026-10-01-near-intents-halts-services-after-3-8-million-exploit-promises-full-compensation-417404), [Rhea Finance](https://x.com/rhea_finance/status/2045203607856042118), [Vini B.](https://x.com/vinibarbosabr/status/2106000451585835448), [Hackenproof](https://hackenproof.com/programs/near-intents-bridges)_

**For six hours, the public record shows only one party acting on the vault: The one emptying it.**

The tests came first. [A 10 USDT withdrawal cleared at 18:57 UTC on September 30](https://bitquery.io/investigations/near-intents-hack), then [11 USDT at 20:05](https://bitquery.io/investigations/near-intents-hack).  
  
At 23:54, [the same wallet took 800,000 USDT. Thirty minutes later, 1.2 million. Twenty-six minutes after that, 1.5 million](https://bitquery.io/investigations/near-intents-hack).

[Bitquery’s reconstruction puts the vault’s largest single stablecoin payout in the preceding two days at under 400,000 USDT](https://bitquery.io/investigations/near-intents-hack). Three withdrawals in under an hour cleared that threshold by a wide margin.

_[A 330,000 USDT withdrawal followed at 01:46](https://bscscan.com/tx/0x9c10b967da0c85631ec105e3b322c0a851fcd01b69ff390ff58f860e5cce003a). The last, 35,000 USDT, landed at 06:08, more than six hours after the first large withdrawal._

**No public alert surfaced while any of it was happening.**

The silence broke at 12:53 UTC on October 1. [NEAR Intents posted that its services](https://x.com/near_intents/status/2105642219357241796) “were stopped” earlier that day, citing a bug in the interaction between its Omni deposit-and-withdrawal infrastructure and its smart contract.  
  
[It put the preliminary loss at about $3.8 million](https://x.com/near_intents/status/2105642219357241796), promised full compensation, and said deposits and withdrawals on 11 chains would remain unavailable for roughly another 12 hours.

[ZachXBT’s Telegram alert appeared around the same moment](https://t.me/investigations/365). The BSC hot wallet, [0x233c](https://blockscan.com/address/0x233c5370CCfb3cD7409d9A3fb98ab94dE94Cb4Cd), had seen “multiple irregular outflows,” had stopped processing transactions, and NEAR Intents’ status page showed an incident affecting multiple EVM chains. By his account, the money had already reached [KuCoin and been bridged to Bitcoin](https://t.me/investigations/365).

**[AMLBot followed at 13:15](https://x.com/AMLBotHQ/status/2105647685705597403), flagging roughly $4 million in suspicious withdrawals and listing four transactions. At that point, it said it could not tell whether the outflows reflected an exploit or funds connected to another incident.**  
  
_**[Unchained flagged another payout at 13:27](https://unchainedcrypto.com/near-intents-pledges-full-compensation-after-a-bug-lets-an-attacker-drain-3-8-million/):** The same vault sent roughly 215,000 USDT to an address that had repeatedly received six-figure sums from it for at least a month._

At least one ordinary payout route remained live.

[NEAR co-founder Illia Polosukhin supplied a fuller official account at 15:50](https://x.com/ilblackdragon/status/2105686871200366663). SHIELD, “the AI security layer on Intents,” had detected outlier behavior and Intents had been temporarily paused, he wrote.  
  
[The bug was isolated to USDT on BSC and fixed within an hour of detection](https://x.com/ilblackdragon/status/2105686871200366663). He framed the incident as part of a broader wave of attacks by criminals using AI systems, naming Bitget, MetaMask, and Lido as recent targets.

Fixed within an hour of detection. NEAR has not disclosed when detection occurred, which withdrawal triggered it, or when the relevant withdrawal route was actually stopped.

**The claim came from a system with fresh press clippings. [On September 29, NEAR Intents GM Alex Shevchenko published SHIELD’s scorecard against the Bitget hackers](https://x.com/AlexAuroraDev/status/2104554958754357482):** More than $50 million in flagged laundering attempts, $503,000 frozen mid-execution, [and a public thank-you from Bitget’s CEO, Gracy Chen](https://x.com/GracyBitget/status/2104602301503816040).

**This time, [the same layer is credited with detecting outlier behavior during a drain](https://x.com/ilblackdragon/status/2105686871200366663) that unfolded across five withdrawals over more than six hours.**

_If SHIELD detected outlier behavior, when did it do so, and why did the vault keep paying after the first three major withdrawals had each exceeded its recent payout ceiling?_

### Paid as Instructed  
  
_[NEAR Intents says it found the exact vulnerability](https://x.com/ilblackdragon/status/2105686871200366663), and fixed it within an hour of detection._  
  
**Except it left out exactly what the bug was.**  
  
**[The company’s public explanation ends at the handoff](https://x.com/near_intents/status/2105642219357241796):** A bug in the interaction between Omni’s deposit-and-withdrawal infrastructure and the NEAR Intents smart contract.

  
On the BNB Chain, [the vault paid signed withdrawal instructions](https://bitquery.io/investigations/near-intents-hack).  
  

Off BNB Chain, [a separate system decided who was owed what](https://bitquery.io/investigations/near-intents-hack).

_Between those two facts sits the $3.87 million question._

**[NEAR’s own documentation](https://docs.near.org/chain-abstraction/intents/overview) fills in part of the map.**

The drained contract, [0x233c…b4cd](https://blockscan.com/address/0x233c5370CCfb3cD7409d9A3fb98ab94dE94Cb4Cd), is [listed in NEAR Intents’ documentation](https://docs.near-intents.org/security-compliance/treasury-addresses) as the treasury for the HOT Bridge, [one of three bridge implementations available to Intents](https://docs.near-intents.org/integration/bridging/overview).  
  
[HOT Bridge routes assets through HOT/Omni infrastructure and serves](https://docs.near-intents.org/integration/bridging/overview) BNB, Polygon, Optimism, Avalanche, Scroll, Monad, TON, Stellar, LayerX, Adi, and Plasma.  
  
[That is the same eleven-chain list whose deposits and withdrawals NEAR said would remain unavailable for roughly twelve hours](https://x.com/near_intents/status/2105642219357241796), mapping the affected route to [HOT Bridge/HOT-Omni](https://docs.near-intents.org/integration/bridging/overview), not the separately listed [Omni Bridge](https://docs.near-intents.org/integration/bridging/overview), another NEAR Intents bridge implementation.

_[HOT Bridge’s documentation describes a withdrawal as a cross-system transaction](https://docs.hotdao.ai/omni-tokens). On NEAR, the HOT OMNI Balance contract [burns the user’s omni-token, records the withdrawal, and generates a unique nonce](https://docs.hotdao.ai/omni-tokens)._  
  
**[The user then requests an attestation from the HOT Protocol’s MPC validator network](https://docs.hotdao.ai/omni-tokens). Each node checks that the withdrawal exists in the OMNI Balance contract.**  
  
[The user submits the resulting signature, nonce, and withdrawal data to the destination-chain locker](https://docs.hotdao.ai/omni-tokens). The locker verifies the signature, confirms the nonce has not been used, and transfers the native asset to the designated recipient.

[The destination-chain locker does not independently calculate a user’s balance](https://bitquery.io/investigations/near-intents-hack). It verifies a signed withdrawal instruction and an unused nonce before paying.

[Bitquery found that the attacker’s withdrawals used signed authorizations in the same form](https://bitquery.io/investigations/near-intents-hack) as ordinary withdrawals.

_One detail stood apart. In all seven withdrawals, [the recipient submitted the withdrawal directly](https://unchainedcrypto.com/near-intents-pledges-full-compensation-after-a-bug-lets-an-attacker-drain-3-8-million/). In the other payouts Unchained reviewed, a different address submitted it._  
  
**[HOT’s design permits any account, including a user or relayer, to execute a user-signed withdrawal intent](https://docs.hotdao.ai/hot-omni-balance), so self-submission is not itself a flaw. It does show the attacker possessed the authorizations.**

Before the theft, [the only deposit Bitquery could tie to the attacker’s side on BNB Chain was 10 USDT](https://bitquery.io/investigations/near-intents-hack). What balance NEAR Intents’ separate system believed the attacker held cannot be seen from BNB Chain.

The attacker’s BNB Chain activity shows an identifiable 10 USDT deposit, [yet the system later produced a withdrawal authorization for 1.5 million USDT](https://bscscan.com/tx/0x69d1c68c7e961a0199d3c9f3b6a31cb168ed775ef34b51a42762253ac1efcceb). That gap indicates a failure in, or missing safeguard within, the separate system that determined withdrawal entitlements.

[NEAR’s public incident statement identified the affected interaction](https://x.com/near_intents/status/2105642219357241796), but did not explain the exploit’s technical mechanism.  
  
[A regression test later added to its public repository describes the condition the patch prevents](https://github.com/near/intents/pull/362): A refund request exceeding the amount deposited.

  
On October 1, while the funds were still being chased, [NEAR engineers opened a pull request against the public intents contracts and titled it, flatly, "reproduce bug."](https://github.com/near/intents/pull/362)  
  
[A temporary commit recreated “the deployed state”](https://github.com/near/intents/pull/362); the same pull request then added a refunded-amount check in mt_resolve_deposit and merged it into main.  
  

_**[Its regression test describes the flaw plainly:](https://github.com/near/intents/pull/362)** A receiver with a large balance could request a refund larger than the amount it had deposited. The resulting mt_burn refund event could exceed NEAR’s log-length limit, causing the mt_resolve_deposit callback to fail—“as happened to the deployed revision.”_  
  
**[A late-30-September mt_resolve_deposit callback on intents.near carried 98 token/amount pairs](https://nearblocks.io/txns/3mst2uZ32KPuCs7wc8rJqEtCrZqugCy4yDSZ3df8KPm3/execution):** 97 one-unit entries of a repeated, unusually long token ID, plus a final amount of 649984000000000000000000 in another token.  
  

_[The callback then failed because its attempted log message was 16,495 bytes](https://nearblocks.io/txns/3mst2uZ32KPuCs7wc8rJqEtCrZqugCy4yDSZ3df8KPm3/execution), exceeding NEAR’s 16,384-byte limit._

**Sample Deposit Transaction:**  
[3mst2uZ32KPuCs7wc8rJqEtCrZqugCy4yDSZ3df8KPm3](https://nearblocks.io/txns/3mst2uZ32KPuCs7wc8rJqEtCrZqugCy4yDSZ3df8KPm3)

**[The receipt shows the immediate failure](https://nearblocks.io/txns/3mst2uZ32KPuCs7wc8rJqEtCrZqugCy4yDSZ3df8KPm3/execution):** The mt_resolve_deposit callback aborted after attempting to emit a log larger than NEAR’s limit.

[NEAR Intents’ regression test describes the patched condition](https://github.com/near/intents/pull/362): A refund request must not exceed the corresponding deposit.  
  
_What remains unclear is how the failed callback translated into the balance or signed withdrawal notes that let the attacker withdraw millions. [Bitquery’s chain analysis reaches the same limit: it can trace where the funds went, but not how the bug worked.](https://bitquery.io/investigations/near-intents-hack)_

**[NEAR attributed the exploit to the interaction between Omni deposit-and-withdrawal infrastructure and the NEAR Intents smart contract](https://x.com/ilblackdragon/status/2105686871200366663), and said it was isolated to USDT on BSC.**  
  
[The public regression test places one reproduced failure mode in the near/intents deposit-resolution path](https://github.com/near/intents/pull/362); it does not establish that no other component contributed.

[The report says its Ethereum-locker walkthrough was conceptual](https://veridise.com/wp-content/uploads/2025/10/VAR_Stellar_250715_HOT_DAO-V2.pdf), because that contract was outside the review scope.

  

[The review found 21 issues, including one critical and five high-severity findings](https://veridise.com/wp-content/uploads/2025/10/VAR_Stellar_250715_HOT_DAO-V2.pdf); its final dashboard recorded 18 as fixed.  
  
_[Those included a critical lack-of-access-control issue in mt_resolve_transfer and a high-severity double-spend risk caused by a missing nonce-freshness check](https://veridise.com/wp-content/uploads/2025/10/VAR_Stellar_250715_HOT_DAO-V2.pdf); both were marked fixed in the reviewed codebase._  
  

**[The audit assumed that the MPC network would sign only valid deposits and withdrawals, while saying that](https://veridise.com/wp-content/uploads/2025/10/VAR_Stellar_250715_HOT_DAO-V2.pdf), from the MPC network’s perspective, validity was left “entirely” to the Validation SDK.**  
  
[It also says the MPC service retrieves configuration data, including addresses of contracts queried to validate protocol operations](https://veridise.com/wp-content/uploads/2025/10/VAR_Stellar_250715_HOT_DAO-V2.pdf), from an external smart contract outside the assessment’s scope.  
  
Those assumptions do not identify the cause of this incident, but they identify a validation boundary that any complete postmortem should explain.

  
[Illia Polosukhin said the team identified and fixed the vulnerability within an hour, would produce a full retrospective and postmortem](https://x.com/ilblackdragon/status/2105686871200366663), and would incorporate formal verification for NEAR contracts into its release process.

_[Formal verification can mathematically prove that code fulfills a formal specification](https://docs.soliditylang.org/en/v0.8.14/smtchecker.html). But it can only compare the specification with the implementation; developers must still determine whether the specification expresses what they intended and whether it omits unintended effects._

**[Bitquery’s reconstruction counted five large USDT withdrawals totaling 3,865,000 USDT](https://bitquery.io/investigations/near-intents-hack), following two smaller test withdrawals.**  
  
[The BNB Chain vault accepted and paid signed](https://bitquery.io/investigations/near-intents-hack) withdrawal instructions.  
  
**[NEAR Intents’ public regression test documents one upstream failure mode](https://github.com/near/intents/pull/362):** It adds a refunded-amount check to prevent a refund request from exceeding its corresponding deposit.  
  
But neither source supplies the full exploit path that gave the attacker an apparent entitlement to withdraw millions. [Bitquery’s analysis says it can trace where the money went, not how the bug worked.](https://bitquery.io/investigations/near-intents-hack)

**The root cause remains only partly public. The money trail does not.**  
  
_Where did the withdrawn funds go?_

### Round Trip

  
_USDT did not stay USDT for long._  
  
**[Bitquery’s trace shows the first swap out of USDT beginning three minutes after the 800,000 USDT withdrawal landed](https://bitquery.io/investigations/near-intents-hack), using MetaMask’s built-in swap and CoW Swap.**  
  
BscScan labels the sender “HOT Bridge: Treasury” and the recipient “Near Intents Exploiter 1,” making the vault-to-exploiter transfer unusually explicit in the explorer itself. Kudos to whomever labeled these.

  

**Attacker’s BNB Chain Wallet:**
[0x09fd1f5d9f185067a92493e43aa259ea4ab3ad37](https://bscscan.com/address/0x09fd1f5d9f185067a92493e43aa259ea4ab3ad37)

  
**HOT Bridge Treasury (Drained Vault):**
[0x233c5370CCfb3cD7409d9A3fb98ab94dE94Cb4Cd](https://blockscan.com/address/0x233c5370CCfb3cD7409d9A3fb98ab94dE94Cb4Cd)

  
**Withdrawal 1 - 800,000 USDT:**
[0x9fe58e031f73bbd880c782bc9e7446bcda32cadb304a729209871a4a81856c4c](https://bscscan.com/tx/0x9fe58e031f73bbd880c782bc9e7446bcda32cadb304a729209871a4a81856c4c)

  
**Withdrawal 2 - 1,200,000 USDT:**
[0x0381265d6a1bb09de899f49f410a8b907cd548358a7e3c91076c3a52656b8220](https://bscscan.com/tx/0x0381265d6a1bb09de899f49f410a8b907cd548358a7e3c91076c3a52656b8220)

  
**Withdrawal 3 - 1,500,000 USDT:**
[0x69d1c68c7e961a0199d3c9f3b6a31cb168ed775ef34b51a42762253ac1efcceb](https://bscscan.com/tx/0x69d1c68c7e961a0199d3c9f3b6a31cb168ed775ef34b51a42762253ac1efcceb)

  
**Withdrawal 4 - 330,000 USDT:**
[0x9c10b967da0c85631ec105e3b322c0a851fcd01b69ff390ff58f860e5cce003a](https://bscscan.com/tx/0x9c10b967da0c85631ec105e3b322c0a851fcd01b69ff390ff58f860e5cce003a)

  
**Withdrawal 5 - 35,000 USDT:**
[0x16ddfa695b9525662b8e57c35723f44af89b4e7fc2dedc3634f730caf8b90c02](https://bscscan.com/tx/0x16ddfa695b9525662b8e57c35723f44af89b4e7fc2dedc3634f730caf8b90c02)

  
_[The attacker converted the stablecoins to BNB, then cut the BNB into mostly 100-to-250-BNB parcels and scattered them across 32 fresh wallets](https://bitquery.io/investigations/near-intents-hack). Bitquery traced the funds through those wallets, each used for a discrete step in the route before going quiet._

  
**Within minutes, [address-poisoning bots were already spraying those wallets with lookalike tokens](https://bitquery.io/investigations/near-intents-hack). Bitquery found the poisoning transactions had appeared hours before the first public alert.**

  
[Seven routes carried the BNB out of BNB Chain](https://bitquery.io/investigations/near-intents-hack). The largest, an unnamed cross-chain swap service, took about 2,318 BNB, roughly $1.78 million, from 23 fresh wallets and paid out in ETH and Bitcoin to wallets on the attacker’s route. MetaMask’s bridge moved about 805 BNB to Ethereum.  
  
[Another 800 BNB went to an address Bitquery identifies as a KuCoin deposit route](https://bscscan.com/address/0xcd87C2e1F53B7dF97f1db56aEC6c63cBd60BB262). Smaller batches went through instant-swap desks and LI.FI.

  
**Unnamed Swap Service Router:**
[0xadd2b3801d64905b4eebf67ef52cca63ee792d1d](https://bscscan.com/address/0xadd2b3801d64905b4eebf67ef52cca63ee792d1d)

  
Two of the seven exit routes [went through NEAR Intents](https://bitquery.io/investigations/near-intents-hack).

  
About 80 minutes into the drain, [the main attacker-linked wallet sent 650 BNB into two CoW Swap orders seeking ETH on Ethereum](https://bitquery.io/investigations/near-intents-hack). Bitquery reports that CoW Swap’s order records name NEAR Intents as the bridging partner, and that the associated BNB entered the same BNB Chain vault being drained.

_[NEAR Intents’ Ethereum hot wallet then sent 185.5 ETH](https://bitquery.io/investigations/near-intents-hack) to the attacker-linked Ethereum address._  
  
**The two on-chain payouts were:**

**NEAR Intents payout 1 - 85.74 ETH:**  
[0x383ee25422cba1e5b47ee511760a395259bfdb8a7f35df9be7eb0560495f8c6f](https://etherscan.io/tx/0x383ee25422cba1e5b47ee511760a395259bfdb8a7f35df9be7eb0560495f8c6f)

**NEAR Intents payout 2 - 99.79 ETH:**  
[0x1b589df14968199ed8b2d3e6efe8514a9b32484c5cdc18ea8498ed48e64873c9](https://etherscan.io/tx/0x1b589df14968199ed8b2d3e6efe8514a9b32484c5cdc18ea8498ed48e64873c9)

About an hour later, [a helper wallet sent 100 BNB directly into the BNB Chain vault. Bitquery also traced two later Ethereum-side deposits totaling 91.7 ETH](https://bitquery.io/investigations/near-intents-hack); NEAR Intents paid the resulting three orders in Bitcoin to addresses already receiving the other proceeds.

[Bitquery puts about $822,000 of stolen value](https://bitquery.io/investigations/near-intents-hack), roughly one-fifth of the total, through NEAR Intents’ own service while the drain was still underway. Of that, 750 BNB went back into the vault being emptied.  
  
**[After the first of those deposits](https://bitquery.io/investigations/near-intents-hack), the vault paid the attacker twice more.**

_**[That sequence does not show what NEAR Intents knew or when](https://bitquery.io/investigations/near-intents-hack):** Swaps are automated, and on-chain records show transfers rather than a participant’s knowledge or intent._

A scorecard NEAR Intents had published days earlier, after the Bitget hack, [put SHIELD’s miss at about $166,000 against more than $50 million in laundering attempts it said it flagged](https://x.com/AlexAuroraDev/status/2104554958754357482), with $503,000 frozen mid-execution. That was a different incident, and its own rough accounting.  
  
[Bitquery’s reconstruction puts roughly five times the $166,000 through NEAR Intents](https://bitquery.io/investigations/near-intents-hack) during this drain.

  
[Bitquery traced about 955 ETH to attacker-linked addresses on Ethereum](https://bitquery.io/investigations/near-intents-hack) across six wallets.  
  
_None stayed there. [Most was then routed into Bitcoin](https://bitquery.io/investigations/near-intents-hack)._

  
**Chainflip came first. Over roughly two hours, [it took 17 deposits and paid each out in BTC](https://bitquery.io/investigations/near-intents-hack). A broker, the front end that opens a Chainflip swap, then rejected the next three and refunded the ETH. Its records do not say why.**

  
Within ten minutes of the last rejection, [the attacker sent 1 ETH to THORChain as a test](https://bitquery.io/investigations/near-intents-hack). After it cleared, five more swaps followed, the last near midday.  
  
Bitquery noted [that the Bitget attacker had used the same two protocols a week earlier](https://bitquery.io/investigations/near-intents-hack).

  
[Every Bitcoin payout Bitquery traced initially landed at one of two addresses](https://bitquery.io/investigations/near-intents-hack), and the smaller emptied into the larger.

_**[That hub received 34.69 BTC from the traced routes](https://bitquery.io/investigations/near-intents-hack):** 21.12 from Chainflip, 5.47 from the unnamed swap service, 4.26 from THORChain, and 3.84 from NEAR Intents._

**Bitcoin Hub:**  
[bc1qsyrcmlxj9kaglnmqetwghnvssqjezs6pqwtsn8](https://mempool.space/address/bc1qsyrcmlxj9kaglnmqetwghnvssqjezs6pqwtsn8)

At 06:40 UTC on October 1, [the hub began distributing the proceeds](https://bitquery.io/investigations/near-intents-hack). Its first transfers, 15.7675 BTC and 7.88375 BTC, went to two fresh wallets in an exact 2:1 ratio.

Minutes later, it split a smaller amount the same way. [Bitquery says the fixed ratio could indicate a partner split, a helper’s fee, or neither](https://bitquery.io/investigations/near-intents-hack).

**[Bitquery traced the hub’s distributions](https://bitquery.io/investigations/near-intents-hack) to four Bitcoin wallets:**

**Bitcoin Wallet 1:**  
[bc1qzsrxkzwdah6343kj4rafr56v84xrzuzrlhvtn8](https://mempool.space/address/bc1qzsrxkzwdah6343kj4rafr56v84xrzuzrlhvtn8)

**Bitcoin Wallet 2:**  
[bc1qjkdzyt845q0vte6sax2nn9j40zdalec3q4zmrc](https://mempool.space/address/bc1qjkdzyt845q0vte6sax2nn9j40zdalec3q4zmrc)

**Bitcoin Wallet 3:**  
[bc1qkm5d88p472cg73n7tgw8dpv243v36jjmmnzktz](https://mempool.space/address/bc1qkm5d88p472cg73n7tgw8dpv243v36jjmmnzktz)

**Bitcoin Wallet 4:**  
[bc1q4kddgqsuqmwmzq3qgv0aq2jr9jgdwesx0wljen](https://mempool.space/address/bc1q4kddgqsuqmwmzq3qgv0aq2jr9jgdwesx0wljen)

_The later transfers were part of the recovery, not further dispersal. [Funds from all four wallets ultimately reached the Bitcoin recovery address Shevchenko published on October 2](https://x.com/AlexAuroraDev/status/2105814573152661894)._

**Bitcoin Recovery Address:**  
[bc1qjhv3hu8rfteh5e8exfmalvx2z3pzlmjlgnzxey](https://mempool.space/address/bc1qjhv3hu8rfteh5e8exfmalvx2z3pzlmjlgnzxey)

**[KuCoin was the second destination](https://bitquery.io/investigations/near-intents-hack), reached through two routes.**

  
On the BNB Chain, [five fresh wallets deposited 800 BNB into one address that swept funds into KuCoin wallets within roughly two minutes of each deposit](https://bitquery.io/investigations/near-intents-hack). That address predated the theft, having first received a deposit on August 6.

  
**KuCoin Deposit Address (BNB Chain):**
[0xcd87c2e1f53b7df97f1db56aec6c63cbd60bb262](https://bscscan.com/address/0xcd87C2e1F53B7dF97f1db56aEC6c63cBd60BB262)

  
On Ethereum, [70 ETH moved through pass-through wallets into three other KuCoin deposit addresses](https://bitquery.io/investigations/near-intents-hack). Each had received ETH from at least 16 senders since September 25; two intermediary wallets had received Gate withdrawals in the hours before the drain. [Bitquery says this pattern looks more like an OTC route than infrastructure created for this theft](https://bitquery.io/investigations/near-intents-hack).

  
**KuCoin Deposit Address 1 (Ethereum):**
[0xecf2383f813de458857b092fba4059aa8caed7a8](https://etherscan.io/address/0xecf2383f813de458857b092fba4059aa8caed7a8)

  
**KuCoin Deposit Address 2 (Ethereum):**
[0x1b181e14902bf94fd22c4c4656b71f7b6c4b8324](https://etherscan.io/address/0x1b181e14902bf94fd22c4c4656b71f7b6c4b8324)

  
**KuCoin Deposit Address 3 (Ethereum):**
[0x25b4826d04271e0bc5645c07faa022ab34abc2a5](https://etherscan.io/address/0x25B4826d04271E0Bc5645C07fAa022aB34ABC2A5)

  
_Together, [the two routes carried about $802,000](https://bitquery.io/investigations/near-intents-hack). An exchange deposit address maps to a customer account internally, but only KuCoin can identify the account holder._

**[The Block reported that KuCoin did not immediately respond](https://www.theblock.co/news/ecosystems/2026-10-01-near-intents-halts-services-after-3-8-million-exploit-promises-full-compensation-417404) to its request for comment.**

  
One early batch took a different road. Roughly an hour into the theft, before any of the Bitcoin swaps, [120 BNB was swapped and bridged to Arbitrum as USDC](https://bitquery.io/investigations/near-intents-hack). Thirteen seconds after landing, the USDC was on its way to Hyperliquid through the exchange’s bridge. Within half a minute of arriving there, all of it had been spent on XMR1, a token on Hyperliquid’s spot market that represents Monero.

  
**Hyperliquid Account:**
[0x0e77cbf891b90c73e2fc5dff6d78ec2e383c8616](https://app.hyperliquid.xyz/explorer/address/0x0e77cbf891b90c73e2fc5dff6d78ec2e383c8616)

  
[That route did not move further during Bitquery’s observation window](https://bitquery.io/investigations/near-intents-hack). At last check, 165.3 XMR1, then worth roughly $90,000, worth a little more since, remains untouched.

  
**As October 1, [Bitquery said it had traced 99% of the 3.865 million USDT taken](https://bitquery.io/investigations/near-intents-hack):** 76% into Bitcoin, 21% to KuCoin deposit addresses, 2% into XMR1 on Hyperliquid, with the remaining 1% accounted for by swap and bridge costs and price movement.

  
**[Alex Shevchenko, NEAR Intents’ general manager, would soon tell the attacker](https://x.com/AlexAuroraDev/status/2105814573152661894) “We have identified you,” without explaining the basis for the claim.**  
  

_When a victim says they have identified the thief but will not say how, is that evidence, leverage, or a bluff nobody can afford to call?_

  
### Identified, Allegedly

  
_At 00:18 UTC on October 2, [NEAR Intents GM Alex Shevchenko opened with five words and published three recovery addresses](https://x.com/AlexAuroraDev/status/2105814573152661894)._

**[“We have identified you, sir.”](https://x.com/AlexAuroraDev/status/2105814573152661894)**

**Recovery Address (Bitcoin):**  
[bc1qjhv3hu8rfteh5e8exfmalvx2z3pzlmjlgnzxey](https://mempool.space/address/bc1qjhv3hu8rfteh5e8exfmalvx2z3pzlmjlgnzxey)

**Recovery Address (BNB Chain / Ethereum):**  
[0xB18a1aEDfde8B70FD67012C9E9c7a088B4d0C0e7](https://bscscan.com/address/0xB18a1aEDfde8B70FD67012C9E9c7a088B4d0C0e7)

**Recovery Address (Solana):**  
[AHTfKaeRcaK1sbSG8MFJS2uPxLBChfenigNtvbWEkhKD](https://solscan.io/account/AHTfKaeRcaK1sbSG8MFJS2uPxLBChfenigNtvbWEkhKD)

**[He gave the attacker 48 hours and pitched it as a final opportunity for responsible disclosure](https://x.com/AlexAuroraDev/status/2105814573152661894), saying the attacker knew better than most how it worked. He named no bounty, no person, and no evidence.**

_**[The language left a door open](https://x.com/AlexAuroraDev/status/2105814573152661894):** Return the funds, and treat the episode as a belated disclosure. “You know better than most” hinted at familiarity with security work, but established neither the attacker’s profession nor their identity._

Shevchenko had used a similar public posture before. [After Rhea Finance lost $18.4 million](https://rekt.news/rhea-finance-rekt) in April, [he sent the attacker an on-chain message saying the team had identified the attacker and associated accounts](https://x.com/AlexAuroraDev/status/2045176333362233833/photo/1).  
  
[Rhea later said it had recovered roughly 3.36 million USDC and 1.56 million NEAR](https://x.com/rhea_finance/status/2045203607856042118), while about 4.34 million USDT had been frozen.

This time, the answer came on-chain.

_**At 10:22 UTC, the [same BNB Chain wallet tied to the drain](https://bscscan.com/address/0x09fd1f5d9f185067a92493e43aa259ea4ab3ad37) sent 1 BNB to [NEAR’s BNB Chain recovery address](https://bscscan.com/address/0xB18a1aEDfde8B70FD67012C9E9c7a088B4d0C0e7) with a message in the transaction input:** [“Willing to cooperate, reply with your Signal so contact is possible.”](https://bscscan.com/idm?addresses=0x09fd1f5d9f185067a92493e43aa259ea4ab3ad37,0xb18a1aedfde8b70fd67012c9e9c7a088b4d0c0e7&type=1)_

**Attacker-Linked BNB Chain Wallet - Sender of the Cooperation Message:**  
[0x09fd1f5d9f185067a92493e43aa259ea4ab3ad37](https://bscscan.com/address/0x09fd1f5d9f185067a92493e43aa259ea4ab3ad37)

**BNB Chain Recovery Address - Recipient of the 1 BNB Transfer:**  
[0xB18a1aEDfde8B70FD67012C9E9c7a088B4d0C0e7](https://bscscan.com/address/0xB18a1aEDfde8B70FD67012C9E9c7a088B4d0C0e7)

The attacker sent 1 BNB with a request for a chat handle.

_[Vini B. surfaced the message publicly](https://x.com/vinibarbosabr/status/2106000451585835448). Days earlier, [he had criticized NEAR Intents for blocking Bitget-linked funds](https://x.com/vinibarbosabr/status/2104573464250077575), arguing that permissionless systems should remain neutral._  
  
**This time, [he called the deal a no-brainer and speculated that the attacker could keep a 5-to-10% bounty](https://x.com/vinibarbosabr/status/2106000451585835448). That figure was Barbosa’s estimate, not a published term.**

Between 14:31 and 15:05 UTC on October 2, [the published Bitcoin recovery address received 34.58927254 BTC](https://mempool.space/address/bc1qjhv3hu8rfteh5e8exfmalvx2z3pzlmjlgnzxey).

**Bitcoin recovery-address receipt 1:**  
[58c6487fe95c5fa51317eaa7ba2d327e80262c23ebb11e6c579d0c05c13d5665](https://mempool.space/tx/58c6487fe95c5fa51317eaa7ba2d327e80262c23ebb11e6c579d0c05c13d5665)

**Bitcoin recovery-address receipt 2:**  
[45ad939aebb42044a3313eaa5eb363d65a9fd96ce20f4d546eea14089c033d8f](https://mempool.space/tx/45ad939aebb42044a3313eaa5eb363d65a9fd96ce20f4d546eea14089c033d8f)

**Bitcoin recovery-address receipt 3:**  
[1f24b67e0135f4d7be6cfe1d450e42d2b5e16f147170ad85881cc96148695e73](https://mempool.space/tx/1f24b67e0135f4d7be6cfe1d450e42d2b5e16f147170ad85881cc96148695e73)

**Bitcoin recovery-address receipt 4:**  
[767ac8c26443c85d91bd5d58759d4742480ab4b8fe737cde33d9ef60e3d44613](https://mempool.space/tx/767ac8c26443c85d91bd5d58759d4742480ab4b8fe737cde33d9ef60e3d44613)

**Bitcoin recovery-address receipt 5:**  
[1205e8a86dfe8375a7ee5989524bfae63769e76d9db026f6931c0ba208dea216](https://mempool.space/tx/1205e8a86dfe8375a7ee5989524bfae63769e76d9db026f6931c0ba208dea216)

_**At 15:52 UTC, [Shevchenko posted the result](https://x.com/AlexAuroraDev/status/2106049685928677585):** The funds had been returned in full, and NEAR would stop the investigation. His parting advice was to use bug bounties instead of disrupting services._

**[The official NEAR Intents account went further](https://x.com/near_intents/status/2106095140586791407): “The investigation is closed.”**

The money was back, according to the team. The public explanation was not complete.

[NEAR’s October 1 incident statement attributed the theft to a bug in the interaction between Omni’s deposit-and-withdrawal infrastructure and the Intents contract](https://x.com/near_intents/status/2105642219357241796). It said the contract-side vulnerability had been patched, further infrastructure fixes were underway, and the incident had been reported to law enforcement. It also promised a detailed public report “in the following days.”

As of October 8th, no such report exists. [The initial statement described the affected systems and the response](https://x.com/near_intents/status/2105642219357241796), but did not explain the precise failure, how the attacker exploited it, or what changes would prevent a repeat.

_Returning the funds answers the recovery question. It does not answer those technical questions, and the team’s announcement does not establish the status of the law-enforcement referral._

**The same distinction applies to “sent back in full.” [Shevchenko’s announcement supplies no asset-by-asset reconciliation or terms of the return](https://x.com/AlexAuroraDev/status/2106049685928677585).**  
  
The Bitcoin return is visible. How the other branches were resolved is not explained in the [full-return announcement](https://x.com/AlexAuroraDev/status/2106049685928677585), including the [165.3 XMR1 last reported on Hyperliquid and the roughly $802,000 traced to KuCoin deposit addresses](https://bitquery.io/investigations/near-intents-hack).  
  
That is a gap in the public reconciliation, not evidence that those funds were left unrecovered.

The announcement also discloses no bounty or other terms of the return.

_[Shevchenko had openly discussed recovery incentives for Bitget](https://x.com/AlexAuroraDev/status/2104554958754357482); after NEAR’s own exploit, he [urged the attacker to use bug bounties while announcing a full return and stopping the investigation](https://x.com/AlexAuroraDev/status/2106049685928677585), without disclosing whether any recovery incentive had been offered._

**[His advice to use bug bounties](https://x.com/AlexAuroraDev/status/2106049685928677585) points to a real alternative. [The NEAR Intents Bridges program requires reports within 24 hours of discovery through HackenProof](https://hackenproof.com/programs/near-intents-bridges), private-testnet testing wherever possible, and permission before discussing vulnerabilities outside the program.**  
  
[Those rules require reporting a vulnerability while avoiding harm](https://hackenproof.com/programs/near-intents-bridges), not draining live funds and then offering to cooperate over their return.

Even the published reward ceiling is unclear. [The NEAR Intents Bridges page lists a $300,000 critical maximum in its reward table and $100,000 in its written rules](https://hackenproof.com/programs/near-intents-bridges). Its 10%-of-affected-funds formula would produce about $386,500 on the reported loss, exceeding either ceiling.  
  
Whether this vulnerability fell within the program’s scope is not publicly established.  
  
_Days earlier, [Shevchenko had said NEAR Intents would waive its own share of Bitget’s proposed 5% plus 5% recovery bounty so Bitget could recover more](https://x.com/AlexAuroraDev/status/2104554958754357482)._  
  
**That was a separate incident, but it shows the team could discuss recovery incentives publicly.**  
  
Here, it announced the return and the end of its investigation without disclosing the terms.

**The contrast is uncomfortable:** Researchers are directed toward a tightly controlled disclosure process, while an attacker who drained live funds received an invitation to cooperate and, after the claimed return, a public announcement that the investigation was over.  
  
That does not prove the attacker was rewarded. It leaves the public unable to tell what consequences, or concessions, followed.

The recovery was a result. It was not a substitute for the promised report.

**The public record shows how the recovery unfolded. It does not disclose the terms on which it ended.**

_At what point did the language of responsible disclosure become the language of a recovery negotiation?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)



_The router that turns away stolen money spent a night carrying its own._

**[A vault on BNB Chain paid out $3.87 million against signed authorizations](https://bitquery.io/investigations/near-intents-hack). In Bitquery’s reconstruction, it checked the signatures; the balance accounting behind them happened somewhere else.**

[NEAR Intents announced a contract-side patch and further fixes to Omni’s deposit-and-withdrawal infrastructure](https://x.com/near_intents/status/2105642219357241796). It attributed the incident to that infrastructure’s interaction with the NEAR Intents contract, but did not explain the precise failure in the announcement, nor have they offered an explanation since.

[The traced Bitcoin reached NEAR’s published recovery address](https://mempool.space/address/bc1qjhv3hu8rfteh5e8exfmalvx2z3pzlmjlgnzxey). [NEAR says the funds were returned in full](https://x.com/AlexAuroraDev/status/2106049685928677585). Whether the attacker was allowed to keep, or separately received, anything for returning them remains undisclosed.

The recovery has a public timeline; the failure still lacks a detailed public explanation.  
  
_[The record holds an ultimatum](https://x.com/AlexAuroraDev/status/2105814573152661894), a [chat request accompanying a 1 BNB transfer](https://bscscan.com/idm?addresses=0x09fd1f5d9f185067a92493e43aa259ea4ab3ad37,0xb18a1aedfde8b70fd67012c9e9c7a088b4d0c0e7&type=1), and [a detailed report promised “in the following days.”](https://x.com/near_intents/status/2105642219357241796)_

**Except the detailed public report never manifested, NEAR’s next public conclusion was that [“the investigation is closed.”](https://x.com/near_intents/status/2106095140586791407)**

  

[SHIELD, NEAR Intents’ risk-intelligence layer for detecting suspicious flows and blocking hack-linked transactions](https://x.com/AlexAuroraDev/status/2104554958754357482), earned its headlines catching someone else’s thief.  
  
Yet, [the drain on a vault serving NEAR Intents ran more than six hours](https://bitquery.io/investigations/near-intents-hack) ,and [NEAR Intents’ public confirmation](https://x.com/near_intents/status/2105642219357241796) came about thirteen hours after [the first large withdrawal on September 30](https://bscscan.com/tx/0x9fe58e031f73bbd880c782bc9e7446bcda32cadb304a729209871a4a81856c4c).

**Getting the money back is a recovery. Explaining what broke, and what now prevents it, is accountability. Closing the investigation does not close that gap.**  
  
_When the funds return but the answers don’t, what has actually been restored?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
