---
tags:
  - type/hack
  - blockchain/bitcoin
  - blockchain/ethereum
  - web3-sector/bridge
  - web3-sector/governance
  - web3-sector/infra
  - web3-sector/staking
  - web3-sector/token
  - vector/access-control
  - vector/bridge-exploit
title: "Syscoin - Rekt"
protocol: "Syscoin"
date: 2026-06-07
loss_usd: 8560000
audit: "N/A"
source: "https://rekt.news/syscoin-rekt"
excerpt: "5 billion SYS minted from a malformed SPV proof that slipped past Syscoin’s bridge relay parser. The team published the receipts, coordinated a whitehat recovery, and the funds came back. No public au"
---
# Syscoin - Rekt

> **Loss:** $8,560,000 | **Date:** 2026-06-07 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/syscoin-rekt-header.png)


_[5 billion SYS minted from nothing](https://x.com/syscoin/status/2063749418365665413). No keys stolen. No cryptography broken. Just a relay that read a lie and called it true._

**On June 7th, an attacker fed a malformed SPV proof into Syscoin's bridge relay path, [a proof structured not to be valid, but to be misread as valid](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026).**

[The relay's parsing code did exactly what it was implemented to do](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026). It just wasn't implemented to handle what the attacker sent it.

[Five billion unauthorized SYS materialized](https://x.com/syscoin/status/2063749418365665413) on the UTXO side of the bridge.[ ](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026)

No equivalent burn [was observed on NEVM](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026).  
  
_The bridge's zero-sum design assumption, every mint backed by a burn, was voided in a single transaction._

**Valued at approximately $8.56 million at the moment of mint, based on the [CoinGecko June 7 closing price of $0.00171187](https://www.coingecko.com/en/coins/syscoin/historical_data), the [tokens cleared one address and split across two wallets within minutes](https://x.com/syscoin/status/2063749418365665413).**

[Syscoin paused the bridge, contacted exchanges, and published a preliminary postmortem](https://x.com/syscoin/status/2063749418365665413) before most of its users were awake. The fix was identified. The damage was done.

SYS was already [down 43% on the week](https://cryptopotato.com/sys-drops-20-after-5b-unauthorized-tokens-minted-in-syscoin-bridge-exploit/) before the attacker arrived. [Binance had delisted it eleven days earlier](https://www.binance.com/en/support/announcement/a42f51022cb649aea0b4cb808205fd76).  
  
What landed on top of a token in freefall wasn't just an exploit, it was a supply shock that inflated [circulating supply by 568% relative to pre-attack levels](https://www.coingecko.com/en/coins/syscoin/historical_data), with the 5 billion unauthorized SYS now representing roughly 85% of total circulating supply, diluting every legitimate holder the moment those tokens were minted.

**[Hupzy, the on-chain analytics account operated by Spot On Chain, called it plainly](https://x.com/hupzy_agent/status/2063814173088514518?s=20):** “A recurring structural risk.”  
  
**Exchange blacklisting might contain the secondary damage. The reputational hit to the bridge model, they noted, will persist.**

_If the relay accepted a proof for a burn that never happened, who was supposed to catch that before it shipped?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Syscoin](https://x.com/syscoin/status/2063749418365665413), [Halborn](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026), [CoinGecko](https://www.coingecko.com/en/coins/syscoin/historical_data), [Crypto Potato](https://cryptopotato.com/sys-drops-20-after-5b-unauthorized-tokens-minted-in-syscoin-bridge-exploit/), [Binance](https://www.binance.com/en/support/announcement/detail/a42f51022cb649aea0b4cb808205fd76), [Hupzy](https://x.com/hupzy_agent/status/2063814173088514518?s=20), [WuBlockchain](https://x.com/WuBlockchain/status/2063811891978457300), [Cyrex](https://cyrex.tech/cases/pali-wallet/), [Security Research Labs](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-Solidity-audit-v1.2.pdf?ref=blog.hyperbridge.network), [Hyperbridge](https://blog.hyperbridge.network/april-13-post-mortem/)_

**Nobody sounded the alarm before Syscoin did.**  
  

**[Syscoin's preliminary postmortem landed on Twitter on June 7th](https://x.com/syscoin/status/2063749418365665413) the same evening as the attack. It was measured, detailed, and transparent:** The team named the flaw, published all three transaction hashes, identified the two tainted wallets by address, confirmed the bridge was paused, and acknowledged a fix was in place pending review.  
  
All of it before most of their holders had noticed anything unusual.  
  
**[Their key line](https://x.com/syscoin/status/2063749418365665413):** "The incident involved the bridge relay path incorrectly accepting or interpreting a transaction proof."  
  

_[WuBlockchain amplified the situation to a wider audience](https://x.com/WuBlockchain/status/2063811891978457300) shortly after._

  

**[Hupzy, Spot On Chain's analytics account, was the only independent voice to add meaningful commentary](https://x.com/hupzy_agent/status/2063814173088514518?s=20), calling it "a recurring structural risk" and noting that exchange blacklisting could contain secondary damage but not the reputational hit to the bridge model.**  
  
That observation, delivered in a single pass, was the sharpest thing anyone outside the team said about the incident.  
  

[Halborn published the only substantive technical breakdown the following morning](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026), June 8, correctly classifying the root cause as an SPV proof parsing flaw and [drawing the comparison to the 2022 Nomad Bridge hack](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026) - same attack class, different chain, different proof system.

  

Everyone else followed Syscoin's preliminary postmortem. No independent forensics. No on-chain investigator building the transaction graph from scratch.  
  
No security firm published anything before the team had already named the vulnerability and provided the receipts.

  
**For a $8.56 million exploit that inflated a chain's token supply by 568%, the external security response was remarkably quiet.**

  

_What does it mean when a protocol is better at documenting its own exploit than the security industry is at detecting it?_  
  
### Parsing Fiction  
  

_To understand what broke, you need to understand what the bridge was supposed to do._

  
**[Syscoin is a dual-layer chain](https://docs.syscoin.org/docs/intro/syscoin-what). On one side sits the [UTXO chain - Bitcoin-derived, merge-mined](https://bridge.syscoin.org/), the security foundation.**  
  
[On the other sits NEVM](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026), an EVM-compatible execution layer for smart contracts.

[The bridge connects them](https://bridge.syscoin.org/), and the mechanism it relies on is [SPV: Simplified Payment Verification](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026), the same proof concept Satoshi described in the original Bitcoin whitepaper.

  
[The flow in the exploited direction,](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026) NEVM to UTXO, works like this. A user calls [freezeBurnERC20 on the SyscoinERC20Manager contract](https://github.com/syscoin/syscoin-bridge) on the NEVM side.  
  
_That transaction mines. [An SPV proof of the burn is constructed and submitted to the UTXO relay](https://github.com/syscoin/syscoin-bridge)._

**[The relay validates the proof](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026), the [mint is authorized](https://x.com/syscoin/status/2063749418365665413), and [SYSX issued on the UTXO side](https://syscoin-bridge.vercel.app/).[ ](https://syscoin-bridge.vercel.app/)**

On June 7th, [no corresponding burn was observed on NEVM](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026).

[What the attacker submitted wasn't a valid SPV proof](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026), constructing one for a transaction that doesn't exist is cryptographically infeasible.  
  
That's not what happened here. [What they submitted was a malformed proof,](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026) one specifically structured to exploit a flaw in the relay's parsing code.

_[The relay's parser read the malformed structure.](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026) Interpreted it as valid. Treated the nonexistent NEVM burn as confirmed. Authorized the mint._

**[5 billion SYS materialized on the UTXO side](https://x.com/syscoin/status/2063749418365665413) with nothing backing them.**

**[Halborn's post-incident analysis put the distinction precisely](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026):** The attacker didn't forge a valid proof. They forged something the parsing code would read as a valid proof, which is a fundamentally different problem.  
  
One requires breaking cryptography. The other requires reading implementation code carefully enough to find where the parser's assumptions fall apart.

  
_The cryptography was never the weak point. [The parser was](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026)._  
  
**[Nomad Bridge fell to the same class of failure in 2022](https://www.halborn.com/blog/post/the-nomad-bridge-hack-a-deeper-dive), errors in how proofs were handled, not the underlying cryptography.**  
  
[The BNB Bridge fell to a forged IAVL proof verification failure](https://www.halborn.com/blog/post/explained-the-bnb-chain-hack-october-2022) the same year.  
  
[Hyperbridge fell to a missing bounds check in its MMR verifier](https://rekt.news/hyperbridge-rekt) almost 2 months before Syscoin.  
  
**Every one of them:** Implementation logic exploited at the point where the math hands off to the code.  
  

_[The Syscoin relay was where the invalid proof was accepted](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026). Someone found where the parser's model of a valid proof diverged from the cryptographic reality of what a valid proof actually requires, and submitted exactly that divergence._  
  

**Initial Mint Transaction:** [a5b422abbbd89c8e316d1990f696e030d610cb527001ff97524f5317e87fa184](https://explorer-blockbook.syscoin.org/tx/a5b422abbbd89c8e316d1990f696e030d610cb527001ff97524f5317e87fa184)

The full technical postmortem from Syscoin has not been published as of the time of writing.  
  
**The precise parsing flaw - which field, which assumption, which edge case the relay failed to enforce - remains unconfirmed in public documentation.**

_When the gap between what the proof validator accepts and what the cryptography actually guarantees is wide enough to mint five billion tokens, who was reading the parser?_

### Three Transactions

  
_Three transactions, that's all it took._  
  
**From unauthorized mint to split holdings, the entire operation is documented on-chain, and [Syscoin put the receipts in their own preliminary postmortem](https://x.com/syscoin/status/2063749418365665413).**

  
**Step 1 - The mint.**

  
5 billion SYS landed at the initial receipt address the moment the relay authorized the fraudulent proof.  
  
**Attacker Address:**  
[sys1qgaelv690g7wwp2xchfdh0enf5uewzq5sm9wvcw](https://explorer-blockbook.syscoin.org/address/sys1qgaelv690g7wwp2xchfdh0enf5uewzq5sm9wvcw)

  
**Mint Transaction:**
[a5b422abbbd89c8e316d1990f696e030d610cb527001ff97524f5317e87fa184](https://explorer-blockbook.syscoin.org/tx/a5b422abbbd89c8e316d1990f696e030d610cb527001ff97524f5317e87fa184)

  

**Step 2 - The spend.**

  
**The full balance was moved out of the receipt address in a single subsequent transaction:**
[ba6798fac98eaf95f18e4622a6d46b5d8547f75d3912ed3665ee2e12537d5ff4](https://explorer-blockbook.syscoin.org/tx/ba6798fac98eaf95f18e4622a6d46b5d8547f75d3912ed3665ee2e12537d5ff4)

  
**Step 3 - The split.**  
  

**The 5 billion SYS were divided across two destination wallets:**
[31e12b0dcd9aeffa12e596e0b16d75ce161667104c7e511bfafe67195117113c](https://explorer-blockbook.syscoin.org/tx/31e12b0dcd9aeffa12e596e0b16d75ce161667104c7e511bfafe67195117113c)

  
**The two addresses holding the bulk of the tainted supply:**
[sys1q2k482wnachkgky4lw60973p4vcf7xlh9kzpv33](https://explorer-blockbook.syscoin.org/address/sys1q2k482wnachkgky4lw60973p4vcf7xlh9kzpv33) (~4 billion SYS)
[sys1qx6jjkq89sdaxftfgre3m0nv7vjfd4jeakg5t38](https://explorer-blockbook.syscoin.org/address/sys1qx6jjkq89sdaxftfgre3m0nv7vjfd4jeakg5t38) (~1 billion SYS)  
  

_At the moment of mint, the 5 billion unauthorized tokens were worth approximately $8.56 million, [based on SYS closing at $0.00171187 on June 7th](https://www.coingecko.com/en/coins/syscoin/historical_data)._ 
  

**The tokens did not stay put for long, though not in the direction anyone expected.**  
  

[Syscoin publicly posted a recovery address on June 9](https://x.com/syscoin/status/2064562381188149279), acknowledging that the attacker had made contact and offered to engage in a standard whitehat bounty discussion through a private coordination channel.  
  
**The Official Recovery Address:**
[sys1qdytsq5am9a7y6hweenl925g3yxtlrvl9fls0yg](https://explorer-blockbook.syscoin.org/address/sys1qdytsq5am9a7y6hweenl925g3yxtlrvl9fls0yg)

  
[The exploited SYS has now been returned](https://x.com/syscoin/status/2064616775829102889) to the recovery address.  
  
**Two recovery transactions confirmed on-chain:**
[ce9671d1e5d1fa4d7090828f92712c830aef7ecb87e31f59c4fab7baf7a8fc9d](https://explorer-blockbook.syscoin.org/tx/ce9671d1e5d1fa4d7090828f92712c830aef7ecb87e31f59c4fab7baf7a8fc9d)
[e079e10ceae81d30ce64e5469acde64a8c7f4705771e4d6eceabecbcb100debd](https://explorer-blockbook.syscoin.org/tx/e079e10ceae81d30ce64e5469acde64a8c7f4705771e4d6eceabecbcb100debd)

  
[Syscoin confirmed the return of the funds](https://x.com/syscoin/status/2064616775829102889) and the next steps are pending.  
  
**The terms of that discussion have not been made public.**

_The tokens are back in Syscoin's hands, but the bounty terms are still private. Who decided what the parser was worth?_  
  
### Audited Adjacently

_[Syscoin's response to the exploit](https://x.com/syscoin/status/2063749418365665413) was, by the standards of this space, responsible._  
  
**The bridge was paused within hours.**

[The preliminary postmortem named the vulnerability class, published the transaction trail, and identified the tainted addresses](https://x.com/syscoin/status/2063749418365665413), all before most coverage outlets had filed their first dispatch.

[The team stated it had a fix in place](https://x.com/syscoin/status/2063749418365665413) and was coordinating with exchanges.  
  
The story didn't end there.  
  
_[Syscoin published the recovery address publicly](https://x.com/syscoin/status/2064562381188149279) and offered a whitehat bounty rather than threatening legal action. The funds came back._

**A team that handled the incident cleanly, yet still shipped a bridge relay that nobody had reviewed.**

The Syscoin ecosystem has a documented audit history.

[Pali Wallet, (the official Syscoin browser wallet), was penetration tested by Cyrex](https://cyrex.tech/cases/pali-wallet/), who assessed the overall security maturity as excellent and confirmed all suggested patches were correctly applied.[  
 ](https://thebittimes.com/hacken-to-audit-syscoin-layer2-rollux-hacken-is-a-leading-web3-cybersecurity-auditor-who-works-with-the-biggest-names-in-the-industry-rollups-are-on-the-horizon-and-represent-a-massive-leap-forward-in-scalability-and-affordability-it-will-usher-in-an-unprecedented-level-of-adoption-tbt22999.html)

When Pali V4 was in development, [a governance proposal in October 2025 allocated 350,000 SYS to fund a fresh audit by the same firm](https://support.syscoin.org/t/pali-wallet-security-audit/886), with [all issues confirmed fixed ahead of its public release](https://syscoin.org/news/eco-update-26211)  
  

Syshub, Syscoin's governance portal, [published its own internal security audit report](https://github.com/syscoin/syshub-api/blob/master/SECURITY_AUDIT_REPORT.md).[  
](https://support.syscoin.org/t/pali-wallet-security-audit/886)

No public record exists of a third-party security audit scoped to the [bridge relay path](https://github.com/syscoin/syscoin-bridge), the [off-chain process responsible for proof validation](https://www.halborn.com/blog/post/explained-the-syscoin-bridge-hack-june-2026) component that failed.

This is the audit coverage gap that nobody in the existing coverage has named directly.  
  
**It follows a pattern the industry keeps relearning:** Security resources flow toward the visible and the user-facing.  

Wallets get audited because users touch them. L2s get audited because they carry headlines.  
  
The relay logic sitting between two chains, doing the quiet work of parsing proof structures, which is assumed correct until it isn't.

_[Hyperbridge earned its own story here almost two months ago](https://rekt.news/hyperbridge-rekt), the same attack class, the same lesson unlearned._

**[The exploit triggered a post-incident audit by Security Research Labs,](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-Solidity-audit-v1.2.pdf?ref=blog.hyperbridge.network) which found 14 vulnerabilities - 1 critical, 3 high, 5 medium, 4 low, and 1 informational - across the verification stack.**  
  
[All were remediated](https://blog.hyperbridge.network/april-13-post-mortem/). The audit that found the problems came after the attack, not before it.

**Syscoin's situation mirrors that in one important respect: No audit warning has surfaced.**  
  
The relay path wasn't flagged as needing more work, it simply wasn't reviewed by any independent firm whose findings are part of the public record.  
  
Not a missed warning, an absent one.

**[The funds are back](https://x.com/syscoin/status/2064616775829102889). The full technical postmortem hasn't landed yet.**

_When the audits covered everything around the exploit and nothing inside it, is that a gap in the security process, or a gap in what protocols are willing to pay to protect?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_Five billion tokens minted from a proof that never proved anything, and then handed back._  
  
**Not that often that we see a catch and release exploit like this.**

Nomad Bridge [fell to the same class of failure in 2022](https://www.halborn.com/blog/post/the-nomad-bridge-hack-a-deeper-dive).

BNB Bridge [fell the same year](https://www.halborn.com/blog/post/explained-the-bnb-chain-hack-october-2022).[](https://blog.hyperbridge.network/april-13-post-mortem/)

Hyperbridge [fell this past April](https://rekt.news/hyperbridge-rekt).  
  
_And now Syscoin in June._  
  
**The attack class has a name, a history, and a documented paper trail.**  
  
The relay parsing layer keeps showing up unaudited anyway, because it isn't a contract, it isn't user-facing, and it doesn't fit neatly into a standard audit scope.

[The 5 billion unauthorized SYS are back in Syscoin's hands](https://x.com/syscoin/status/2064616775829102889). That's the best outcome this story could have had.

_The bridge is built to keep two chains honest with each other._  
  
**Someone found the one place where the honesty check was never checked, and then, this time, chose to give it back.**  
  
This time.

But the pattern is older than any single protocol.  
  
**As long as relays and bridges keep treating malformed proofs as valid because their parsers assume they won’t see them, someone will keep finding that same gap.**

_What happens next time someone finds it and decides to keep what they find?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
