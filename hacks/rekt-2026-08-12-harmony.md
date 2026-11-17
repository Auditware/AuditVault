---
tags:
  - type/hack
  - web3-sector/bridge
  - web3-sector/dex
  - web3-sector/staking
  - web3-sector/token
  - vector/access-control
  - vector/bridge-exploit
title: "Harmony - Rekt"
protocol: "Harmony"
date: 2026-08-12
loss_usd: 3200000
audit: "N/A"
source: "https://rekt.news/harmony-rekt2"
excerpt: "Estimated $3.2 million lost after unauthenticated proof fields let old cross-shard receipts replay, crediting ONE without a source debit. Harmony confirmed an initial 4 billion ONE mint, its broader r"
---
# Harmony - Rekt

> **Loss:** $3,200,000 | **Date:** 2026-08-12 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/harmony-rekt2-header.png)






_Harmony's own supply counter didn't blink._  
  
**[On August 12,](https://x.com/the_juice_berg/status/2087353885765620127) [an attacker exploited flaws in Harmony’s legacy cross-shard verification path, and the protocol credited billions of ONE that no transfer backed](https://x.com/harmonyprotocol/status/2088078119269978281)[, an anomalous mint Juiceberg had publicly flagged before Harmony said anything at all.](https://x.com/the_juice_berg/status/2087353885765620127)**
  
[An initial four billion tokens surfaced within the hour, about 26% of the previously reported supply](https://x.com/the_juice_berg/status/2087353885765620127), while [Harmony’s totalSupply endpoint did not reflect the new issuance, so every monitor relying on it was still reading yesterday’s supply.](https://x.com/the_juice_berg/status/2087353885765620127)

  
**[Harmony's own August 17th trace put hard numbers on the spread](https://x.com/harmonyprotocol/status/2089280253701324989):** One wallet alone attempted 534 transfers of 5 billion ONE each in 106 seconds, 477 of which succeeded, moving 2.385 trillion ONE total, and a revised flow model reconciled almost 100% of the forged issuance to a wallet or service boundary.  
  
[SlowMist's tracker lists the incident at $3.2 million](https://hacked.slowmist.io/), a third-party cash-out estimate that doesn't touch what the mint actually cost every other holder.  
  
_**This was Harmony's third major security failure in four years:** [A stolen bridge key in 2022](https://medium.com/harmony-one/harmonys-horizon-bridge-hack-1e8d283b6d66), [](https://www.coindesk.com/markets/2026/08/12/harmony-s-one-falls-26-after-attacker-allegedly-mints-4-billion-tokens) a [staking bug in 2023](https://talk.harmony.one/t/technical-incident-report-staking-logic-vulnerability-and-exploitation/23660), and now a legacy verification flaw the team is still fully accounting for._

**[ONE cratered to an all-time low of $0.0005735](https://www.techtimes.com/articles/324068/20260812/harmony-one-hacked-4-billion-tokens-minted-supply-masking-sent-97-exchanges.htm) before Harmony even had a name for what broke.**

[A patch stopped further minting](https://x.com/harmonyprotocol/status/2088078119269978281) within hours.  
  
[Harmony has since published its rollback plan](https://x.com/harmonyprotocol/status/2089280253701324989), Shard 0 held at block 92,730,034 and Shard 1 at block 94,978,278, both restored from replacement databases. Under that plan, every later block would be discarded and new blocks would resume at heights 92,730,035 and 94,978,279.  
  
**Whether the rollback has actually been executed is separate from whether it has been decided, and the final mint total still has not been reconciled.**  
  
_When a blockchain's own accounting system can't tell you how much of its currency exists, what exactly are exchanges pricing?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Harmony](https://github.com/harmony-one/harmony/pull/5101), [SlowMist](https://hacked.slowmist.io/), [Juiceberg](https://x.com/the_juice_berg/status/2087353885765620127), [Matthew Barrett](https://medium.com/harmony-one/harmonys-horizon-bridge-hack-1e8d283b6d66), [Tech Times](https://www.techtimes.com/articles/324068/20260812/harmony-one-hacked-4-billion-tokens-minted-supply-masking-sent-97-exchanges.htm), [ZachXBT](https://x.com/zachxbt/status/2087429244007940368), [CertiK](https://x.com/CertiKAlert/status/2087450799874224439)_

**[Juiceberg fired first](https://x.com/the_juice_berg/status/2087353885765620127), publicly, before Harmony said a word.**

[On August 11th, on-chain analyst Juiceberg laid out the initial figures](https://x.com/the_juice_berg/status/2087353885765620127): Roughly 4 billion ONE minted through empty blocks, about 26% of the previously reported supply, and 2.8 billion routed toward exchange addresses as the price fell.  
  
[The same post flagged a second problem that would shape the story for days after](https://x.com/the_juice_berg/status/2087353885765620127), Harmony's totalSupply endpoint wasn't reflecting the unauthorized issuance.

Harmony didn't respond for almost three hours.

_[The official account quote-posted Juiceberg directly, offering coordination with exchanges, a patch in progress, rollback options under evaluation](https://x.com/harmonyprotocol/status/2087395174263705704). No figure confirmed. No cause named._

**Within the hour, [Harmony followed with four wallet addresses](https://x.com/harmonyprotocol/status/2087410115200889135), asking every exchange watching to freeze anything tracing back to them.**

[Harmony paused bridge.harmony.one as a containment measure](https://x.com/harmonyprotocol/status/2087428693933367768). [Its own incident report puts the emergency patch](https://x.com/harmonyprotocol/status/2088078119269978281), [v2026.1.1](https://github.com/harmony-one/harmony/releases/tag/v2026.1.1), at 06:30 UTC on August 12th, built around [pull request #5101](https://github.com/harmony-one/harmony/pull/5101), deployed after the bridge was already down, not before.  
  
The patch stopped further unauthorized minting.

Then came the part no patch could touch. [ZachXBT said he wouldn't be tracing this one and argued nobody else should for free](https://x.com/zachxbt/status/2087429244007940368), pointing back to how Harmony had treated the people who helped recover funds after the 2022 Horizon Bridge hack, freezes that led to law-enforcement seizures, acknowledged, by his account, [highlighting that they got nothing more than a “good job.](https://x.com/zachxbt/status/2087429244007940368)”

**[Hours later, Harmony's own numbers finally caught up to the scale of it](https://x.com/harmonyprotocol/status/2087487246148542527):** 10,288 transfers traced across 409 wallets, hundreds of suspicious exchange deposits flagged, 53% of validators patched within four hours of release.

**[The team thanked its validators](https://x.com/harmonyprotocol/status/2087487246148542527). It still hadn't said what broke**.

_If the official response couldn't outrun the exploit, what exactly was being protected, the funds, or the timeline?_

### Credit Without Debit  
  

_[Harmony’s cross-shard design was supposed to let value move among its four shards through a native](https://docs.harmony.one/home/general/introduction/what-is-harmony), receipt-based mechanism rather than an external bridge._  
  
**[Harmony supports cross-shard transactions through a receipt-based, asynchronous communication mechanism designed to achieve eventual consistency](https://docs.harmony.one/home/general/introduction/what-is-harmony), so no double spending is possible between shards.**  
  
[The destination shard is supposed to verify the receipt and proof before processing it.](https://docs.harmony.one/home/general/technology/transactions) In Harmony’s intended design, that receipt-based mechanism was [meant to prevent cross-shard double spending](https://docs.harmony.one/home/general/technology/sharding).  
  
Harmony’s cross-shard receipt-verification logic [allowed valid receipts to be processed multiple times](https://x.com/harmonyprotocol/article/2088078119269978281).  
  

[Before IsCXMerkleProofReplayFixEpoch](https://x.com/harmonyprotocol/article/2088078119269978281), Harmony’s legacy replay check derived a receipt’s spent-marker key from CXMerkleProof.ShardID and CXMerkleProof.BlockNum.  
  

_[Because ValidateCXReceiptsProof did not bind those fields to the signed source-block header for those epochs](https://x.com/harmonyprotocol/article/2088078119269978281), an attacker could alter them without invalidating the header signature, making an already processed receipt appear new._  
  

**[While the Header itself could not be altered without failing VerifyHeaderSignature, the Merkle-proof identity fields were unauthenticated.](https://x.com/harmonyprotocol/article/2088078119269978281) By modifying those identifiers, an attacker could make processed receipts appear new.**  
  

[An attacker could take an already processed cross-shard receipt and resubmit it with those identifiers altered](https://x.com/harmonyprotocol/article/2088078119269978281). Each altered submission would produce a different spent-marker key, causing IsSpent to return false and making the receipt appear new.  
  
[When that happened, ApplyIncomingReceipt credited the destination shard without a corresponding debit](https://x.com/harmonyprotocol/article/2088078119269978281) on the source shard.  
  

**[The result was native ONE inflation in empty, zero-gas blocks:](https://x.com/harmonyprotocol/article/2088078119269978281)**  The state root changed despite the absence of ordinary or staking transactions.  
  
_**[Harmony found a second issue in pre-staking quorum verification:](https://x.com/harmonyprotocol/article/2088078119269978281)** uniformVerifier.IsQuorumAchievedByMask used the size of the full committee, len(mask.Publics), instead of counting only validators enabled in the signer bitmap._  
  

**[Under that vulnerable logic, an empty signer bitmap combined with an identity](https://x.com/harmonyprotocol/article/2088078119269978281), or all-zero, aggregate BLS signature could satisfy quorum for any pre-staking-epoch committee.**
  

[A nil mask was not rejected; the affected path was used to verify pre-staking-era committees](https://x.com/harmonyprotocol/article/2088078119269978281), including source headers attached to old cross-shard receipts.  
  
**[Harmony’s report leaves one question open:](https://x.com/harmonyprotocol/article/2088078119269978281)**  Whether the exploit relied solely on the cross-shard receipt issue or also leveraged the pre-staking quorum-verification flaw.  
  

**[Harmony patched both issues in mainnet release v2026.1.1](https://x.com/harmonyprotocol/article/2088078119269978281), included in PR #5101.**  
  
[Which vulnerability, or combination of vulnerabilities](https://x.com/harmonyprotocol/article/2088078119269978281), the attacker actually relied on remains unconfirmed.

  

Two checks failed either way. One let a used receipt pass as unused. The other meant a pre-staking-era header with no enabled signers could still pass quorum.  
  
**Neither required breaking a single cryptographic primitive, both just needed nobody to check what the numbers actually proved.**

_If a chain can't tell a header with no enabled signer record from one with genuine validator approval, what exactly was consensus protecting?_

### The Accounting Gap  
  
_Whatever the "already spent" check was supposed to catch, this is what got through instead._  
  
**Two mints, two transfers, four wallets flagged for freezing, all inside a few minutes, and every address involved sits in public record.**

**Mint Recipient 1 - (1,000,000,000 ONE):[  
](https://explorer.harmony.one/#/address/0xF722f7f6afffe8e0dda7b4a97b2c64bb6408efe5)[one17u300a40ll5wphd8kj5hktryhdjq3ml9f4phy4](https://explorer.harmony.one/address/0xF722f7f6afffe8e0dda7b4a97b2c64bb6408efe5)**

**Mint Recipient 2 (3,000,000,000 ONE):**
[one1a5hur07z5vtvzhr35zkw8tfqedemkz8t88xgd7](https://explorer.harmony.one/#/address/0xed2Fc1bfc2a316c15c71a0ace3ad20cb73bb08eb)

[Four billion tokens minted](https://x.com/harmonyprotocol/status/2088078119269978281) across two empty blocks.  
  
The second wallet didn't sit still. It moved the funds out in two hops, first to a second wallet within ninety seconds, then that wallet forwarded nearly all of it to a third within three minutes.

**Transfer Transaction 1 (2,800,000,000 ONE):** [0xf3d4e8b12479ae14cd5eae973a5f61b07d567b142a6ca1385471d5c288242c7f](https://explorer.harmony.one/tx/0xf3d4e8b12479ae14cd5eae973a5f61b07d567b142a6ca1385471d5c288242c7f?shard=0)

**Transfer Transaction 2 (2,799,999,999.99183949 ONE):** [0x9a756ef9f95a4c737b3c7e87f04419e9391f226c631ff7b81c401619b0a4d678](https://explorer.harmony.one/tx/0x9a756ef9f95a4c737b3c7e87f04419e9391f226c631ff7b81c401619b0a4d678?shard=0)

_[Nearly the entire balance moved again under three minutes later](https://x.com/harmonyprotocol/status/2088078119269978281), at 01:05:24 UTC._

**The four wallets [Harmony asked every exchange to freeze are as follows](https://x.com/harmonyprotocol/status/2087410115200889135)…**

**Freeze Wallet 1:**
[one1uap8dx2z0qsjxqthm5flgcxkeepsz3gsrghnfn](https://explorer.harmony.one/#/address/0xe7427699427821230177dd13f460d6ce43014510)

**Freeze Wallet 2:**
[one17u300a40ll5wphd8kj5hktryhdjq3ml9f4phy4](https://explorer.harmony.one/#/address/0xf722f7f6afffe8e0dda7b4a97b2c64bb6408efe5)

**Freeze Wallet 3:**
[one1a5hur07z5vtvzhr35zkw8tfqedemkz8t88xgd7](https://explorer.harmony.one/#/address/0xed2fc1bfc2a316c15c71a0ace3ad20cb73bb08eb)

**Freeze Wallet 4:**
[one1h56hkxmua0uzfv07fu04cudvtrl35u96pq47vy](https://explorer.harmony.one/#/address/0xbd357b1b7cebf824b1fe4f1f5c71ac58ff1a70ba)

_That is the confirmed first wave, four billion ONE, and it is only one of two figures in Harmony's accounting._

**[Its incident report says it is still reconciling that first-wave measurement with a reconstruction of 3,010,000,100,000 ONE across six forged cross-shard transactions](https://x.com/harmonyprotocol/status/2088078119269978281) into four exploiter wallets.**  
  
[Harmony stated that the 4,000,000,000 ONE figure represents the initial wave](https://x.com/harmonyprotocol/status/2088078119269978281), whereas the 3,010,000,100,000 ONE figure reflects the full forged cross-shard issuance into four exploiter wallets.  
  
[CertiK independently reported an anomaly exceeding 3 trillion ONE](https://x.com/CertiKAlert/status/2087450799874224439) across six abnormal blocks.  
  
A protocol can describe its own exploit at two different sizes at once.

_On August 17th, Harmony published a later flow reconstruction. [One forged-mint wallet attempted 534 transfers of 5 billion ONE each in 106 seconds, of which 477 succeeded, moving 2,385,000,000,000 ONE from one wallet](https://x.com/harmonyprotocol/status/2089280253701324989)._  
  
**That equals about 79% of [Harmony's provisional 3.0100001 trillion ONE full-issuance reconstruction](https://x.com/harmonyprotocol/status/2088078119269978281).**

[Harmony said its earlier flow model routed more than 99.9% of forged ONE to a wallet or service boundary](https://x.com/harmonyprotocol/status/2089280253701324989), while a later model reconciled almost 100% across those boundaries and transaction fees at the same cutoff.  
  
[It checked the traced transfers against block data](https://x.com/harmonyprotocol/status/2089280253701324989), transaction receipts, and balances through Shard 0 block 92,805,850

**But traceability is not attribution or recovery. [Harmony says “traceable to a wallet or cluster” means it can follow forged ONE to a wallet, pool, contract, exchange, bridge, validator, or service](https://x.com/harmonyprotocol/status/2089280253701324989) - not identify the person controlling it; a cluster or service wallet may represent many unrelated users.**

**[Harmony also distinguishes traceability from what is safely burnable](https://x.com/harmonyprotocol/status/2089280253701324989):** Once forged ONE entered a CEX wallet, DEX pool, LP position, bridge contract, staking position, or other shared balance, burning the full traced amount could take unrelated funds or damage the service

The initial four billion ONE wave alone [represented roughly a quarter of Harmony's previously reported supply](https://x.com/the_juice_berg/status/2087353885765620127).  
  
**A cash-loss figure cannot capture the dilution borne by holders, or distinguish coins sold, frozen, pooled, or ultimately erased by rollback.**

_If Harmony can trace nearly all of the route but cannot infer control from an address, or recover the funds without risking harm to unrelated users, what exactly does "traceable" mean?_  
  
### Undoing What's Already Gone

_By the time Harmony began preparing a rollback, Shard 0 had already been halted._

**[Harmony said it stopped at block 92,753,555, 12:32:54 UTC on August 12th](https://x.com/harmonyprotocol/status/2088078119269978281), to facilitate the rollback, and that the official RPC could return a 502 error as a result.**

A rollback preserves a checkpoint and discards all subsequent blocks and their on-chain history.

[Harmony explicitly says all blocks after the checkpoints, including regular transactions](https://x.com/harmonyprotocol/status/2089280253701324989), will be discarded.  
  
[Harmony's August 13th incident report identified block 92,730,034, timestamped 23:25:37 UTC on August 11th](https://x.com/harmonyprotocol/status/2088078119269978281), as the candidate rollback point, one block before the first forged cross-shard activity the report itself flags.  
  
_By August 17th, that candidate had become the plan, chosen as a one-block safety buffer._  
  
**[Harmony said it would retain Shard 0 at block 92,730,034 and Shard 1 at block 94,978,278, both at that same timestamp](https://x.com/harmonyprotocol/status/2089280253701324989), then create new blocks at heights 92,730,035 and 94,978,279.**  
  
[Client v2026.1.2 rejects the listed problematic block hashes](https://x.com/harmonyprotocol/status/2089280253701324989) as part of the recovery procedure.

This isn't a targeted deletion of the attacker's transactions. [It's a full replacement of chain history, every post-checkpoint block removed, whether or not it involved forged ONE](https://x.com/harmonyprotocol/status/2089280253701324989).

[Harmony says it considered a targeted burn, a blacklist, selective transaction replay, a token migration](https://x.com/harmonyprotocol/status/2089280253701324989), and its own built-in revert tool before choosing this.

_[It rejected the burn because forged ONE had already spread into shared balances, the blacklist because it would leave the forged supply in place while potentially catching unrelated wallets](https://x.com/harmonyprotocol/status/2089280253701324989), and selective replay because changed chain state means a transaction can now produce a different result, leaving no fair rule for choosing what to restore._

**The cost is measurable. [Harmony's archive from Shard 0 blocks 92,730,035 through 92,871,662 runs 141,628 consecutive blocks](https://x.com/harmonyprotocol/status/2089280253701324989), 109,126 regular transactions, and 315 staking transactions, all of it set to be absent from the replacement chain history.**  
  
[Only 22 regular transactions appeared to carry no obvious dependency on anything else](https://x.com/harmonyprotocol/status/2089280253701324989), and Harmony says even those aren't safe to restore.

That scale matters because a rollback cannot itself resolve forged ONE that had already reached third-party services before the halt. It can replace Harmony's on-chain history, but it cannot directly unwind activity at exchanges, bridges, or other external services.  
  
Harmony has not publicly identified the exchanges involved.

As of this writing, [Harmony says it plans to proceed with the rollback](https://x.com/harmonyprotocol/status/2089280253701324989), but it hasn't happened yet.

**[The bridge remains paused](https://x.com/harmonyprotocol/status/2087428693933367768) and [Harmony says the emergency patch was deployed and activated](https://x.com/harmonyprotocol/status/2087487246148542527) after the validator threshold was met.**

_If removing the forged issuance requires discarding more than 109,000 ordinary transactions, whose ledger is actually being protected?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)








_Three times in four years, Harmony has given the market a new reason to question ONE's security record._

**[In 2022, attackers compromised enough Horizon Bridge signing authority to drain roughly $100 million](https://medium.com/harmony-one/harmonys-horizon-bridge-hack-1e8d283b6d66) in assets.**  
  
In 2023, [a staking-system bug improperly created about 146.28 million ONE](https://talk.harmony.one/t/technical-incident-report-staking-logic-vulnerability-and-exploitation/23660).  
  
[This time, Harmony says a flaw in its legacy cross-shard receipt-verification path let valid receipts be processed repeatedly](https://x.com/harmonyprotocol/status/2088078119269978281), crediting a destination shard without a corresponding source-chain debit.  
  
[The resulting state changes occurred in empty](https://x.com/harmonyprotocol/status/2088078119269978281), zero-gas blocks, no ordinary or staking transactions, but a changed state root.

[Harmony's provisional reconstruction identifies six forged cross-shard transactions](https://x.com/harmonyprotocol/status/2088078119269978281) into four exploiter wallets.  
  
**[It plans a rollback down to specified block heights, but that doesn't make the cost disappear](https://x.com/harmonyprotocol/status/2089280253701324989):** more than 109,126 regular transactions are set to be absent from the replacement chain history, while Harmony has not publicly identified the exchanges involved.

**A network built to coordinate activity across shards found its weakest point in the logic meant to verify that coordination.**

_If sharding is designed to make trust invisible, what catches it when trust breaks?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
