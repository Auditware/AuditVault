---
tags:
  - type/hack
  - blockchain/bitcoin
  - web3-sector/bridge
  - web3-sector/multisig
  - web3-sector/stable
  - vector/access-control
title: "Liquid Network - Rekt"
protocol: "Liquid Network"
date: 2026-09-06
loss_usd: 320000000
audit: "N/A"
source: "https://rekt.news/liquid-network-rekt"
excerpt: "An actor exploited a range-proof cache-key collision in Elements to mint ~4,000 unbacked L-BTC, draining $320 million from Liquid Network. The actor returned 3,400 BTC and kept roughly 598.5 BTC. Was "
---
# Liquid Network - Rekt

> **Loss:** $320,000,000 | **Date:** 2026-09-06 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/liquid-network-rekt-header.png)


_[Ninety-five percent of a Bitcoin sidechain's reserves walked out the door](https://codeant.ai/blogs/liquid-network-hack-attack-path-validation), and no signing key was compromised to do it._

**On September 6th, [a flaw in how Liquid Network cached confidential-transaction range-proof verifications let unbacked L-BTC pass as legitimate](https://www.certik.com/blog/liquid-network-incident-analysis).**  
  
[Roughly 4,000 BTC, worth $320 million](https://x.com/Liquid_BTC/status/2096696272447218108), then left the Liquid Federation wallet through SideSwap’s PAK-mediated peg-out route, the same ordinary withdrawal machinery used to redeem L-BTC for Bitcoin.  
  
The authorization path was not reportedly bypassed. It authorized L-BTC that vulnerable validation software had already accepted as real.  
  
**[The actor's exit note read simply](https://x.com/P3b7_/status/2096685528267592008):** "we are whitehats.contact us onchain"

**[About a day later, 3,400 BTC came back](https://x.com/Excellion/status/2097060644977877433). Roughly 598 BTC did not.**

_If the signers followed every rule and the multisig held, where did the money actually go missing?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [CodeAnt](https://codeant.ai/blogs/liquid-network-hack-attack-path-validation), [CertiK](https://www.certik.com/blog/liquid-network-incident-analysis), [Liquid Network](https://x.com/Liquid_BTC/status/2096696272447218108), [Charles Guillemet](https://x.com/P3b7_/status/2096685528267592008), [Samson Mow](https://x.com/Excellion/status/2097060644977877433), [Dr. Calle](https://x.com/callebtc/status/2096877551884919120), [orangesurf](https://x.com/OrangeSurfBTC/status/2096765508431294843), [Elements](https://elementsproject.org/), [SideSwap](https://x.com/side_swap/status/2096709838310928674), [Tayvano](https://x.com/tayvano_/status/2098342824337170655), [Blockstream](https://x.com/Blockstream/status/2098281867908690394), [Adam Back](https://x.com/adam3us/status/2098040524309512272), [TRM Labs](https://www.trmlabs.com/resources/blog/the-largest-hardware-wallet-exploit-of-2026-inside-the-usd-116-million-coldcard-hack)_

**Liquid appears to have been among the first to say so, out loud, in public.**

**[The federation's reserve balance made the scale visible before any formal incident report did](https://x.com/Liquid_BTC/status/2097404704028545175):** Roughly 4,205 BTC fell to about 197 BTC, observable through the same [public mempool explorer](https://mempool.space/address/bc1qdlld6antmv4xug242ed83q7k4rqw50cwfns38szx4qu2f4jwaxxsuhwxxr) Liquid [itself pointed people toward](https://x.com/Liquid_BTC/status/2096696272447218108).  
  
Within hours of the withdrawal landing on Bitcoin's mainnet, [Liquid's official account confirmed a security incident](https://x.com/Liquid_BTC/status/2096696272447218108), identified SideSwap's Peg-out Authorization Key service as the route involved, and said bridge nodes had been disabled.  
  
The notice preceded the detailed technical coverage that followed.

_The actor didn't wait to be asked either. [An OP_RETURN message went up on the same address, the same day](https://x.com/P3b7_/status/2096685528267592008): "we are whitehats. contact us on chain."_  
  
**Read the message here:**  
[C103de95817b43f2df635ec6f35ff126ca26a7c6d20570c4b01866b2b3e69a19](https://mempool.space/tx/c103de95817b43f2df635ec6f35ff126ca26a7c6d20570c4b01866b2b3e69a19?showDetails=true)At that stage there was no public monetary demand attached, just a claim and a request for contact.

Independent technical analysis followed within hours, not days.  
  
By the early hours of September 7, [Bitcoin developer and physicist Dr. Calle had posted a plain-language account of the emerging range-proof caching theory](https://x.com/callebtc/status/2096877551884919120).  
  
_[He was explicit that he had simplified the mechanics and that some specifics could prove incomplete](https://x.com/callebtc/status/2096877551884919120), as the incident was still being reconstructed._  
  
**It became one of the most widely circulated technical explainers of the incident.**

**[Researcher orangesurf raised three open questions that same evening](https://x.com/OrangeSurfBTC/status/2096765508431294843):** How did the exploit happen before the fix was widely deployed? Why did Sideshift allow the huge peg-out? Why did Liquid Network and Blockstream’s explorer diverge?  
  
They were questions, not conclusions.

_**[CertiK's own technical write-up](https://www.certik.com/blog/liquid-network-incident-analysis), published September 7th, gave the mechanism a name more precise than anyone had managed on day one:** An ambiguous cache-key encoding in the rangeproof verification cache, allowing two different validation inputs to produce the same cached entry._

**[Liquid’s formal incident report did not land until September 8](https://x.com/Liquid_BTC/status/2097404704028545175), two days after the withdrawal. It said a range-proof-verification caching vulnerability created roughly 4,000 unbacked L-BTC that SideSwap and Liquid’s functionary nodes accepted as valid before processing the peg-out as authorized.**  
  
[The report called the failure a convergence of “several individually low-probability factors,”](https://x.com/Liquid_BTC/status/2097404704028545175) without identifying a specific commit, function, or line.  
  
That gap doesn't establish what the federation knew at the time. It does establish that its public technical account stayed limited while the network remained paused.

**Containment took hours, public technical specificity took days.**  
  
_What was the federation prepared to say then, and what did it leave for outsiders to reconstruct?_

### Memory Over Math

_The math held, the memory didn't, and neither did the fix._  
  
**The transaction still appeared to balance. [The range proof was the check meant to prevent an invalid hidden value from being accepted](https://www.certik.com/blog/liquid-network-incident-analysis).**  
  
[CertiK’s reconstruction says a cache hit returned success before the manipulated proof](https://www.certik.com/blog/liquid-network-incident-analysis) underwent cryptographic verification.

Liquid is a [Bitcoin sidechain built on Elements](https://www.certik.com/blog/liquid-network-incident-analysis), the open-source software that adds features such as [Confidential Transactions and Confidential Assets](https://elementsproject.org/).  
  
[Bitcoin held in the Liquid Federation’s wallet backs L-BTC issued on the sidechain](https://www.certik.com/blog/liquid-network-incident-analysis); under the intended peg model, one L-BTC represents one BTC in reserve.

[Liquid uses Confidential Transactions](https://www.certik.com/blog/liquid-network-incident-analysis), which can hide transferred amounts while still allowing nodes to verify that a transaction’s inputs and outputs balance.  
  
_[A confidential output carries a range proof](https://www.certik.com/blog/liquid-network-incident-analysis), a cryptographic proof that its concealed value falls within an allowed non-negative range._  
  
**[That matters because the commitment equation can otherwise balance a large positive output against a hidden negative value](https://www.certik.com/blog/liquid-network-incident-analysis); the range proof prevents that negative value from being accepted as legitimate.**

Range-proof verification is computationally expensive, [so Elements caches successful verification results instead of repeating the cryptographic check for the same verification input](https://www.certik.com/blog/liquid-network-incident-analysis).

  

That check [runs through a function called CachingRangeProofChecker::VerifyRangeProof](https://github.com/ElementsProject/elements/commit/212c43f4).  
  
[The cache lookup occurs before commitment parsing and secp256k1_rangeproof_verify](https://www.certik.com/blog/liquid-network-incident-analysis). A hit returns true immediately, so the invalid proof is never cryptographically checked on a primed node.  
  

_[Before the change, the cache key was built from the range-proof bytes and the value commitment](https://github.com/ElementsProject/elements/commit/212c43f4), not the asset commitment or output script._  
  
**[Orangesurf traced the caching approach back](https://x.com/OrangeSurfBTC/status/2096765508431294843) roughly seven years.**

  
**[But CertiK found that the observed setup and attack outputs do not collide under the earlier P || C key](https://www.certik.com/blog/liquid-network-incident-analysis):** their old-key inputs differ in both length and content.

  
**[Commit c26d719, titled “fix](https://github.com/ElementsProject/elements/commit/c26d719c29a40da280a825b25657e9c3d8bc7d99):** range proof cache bind to asset and scriptpubkey,” attempted to bind the cache entry to the full verification context by adding the asset generator and output script to the hash input.  
  
**[The patched cache-key construction was ambiguous](https://www.certik.com/blog/liquid-network-incident-analysis):** Two different validation inputs could produce the same cached entry.

  
**[Proof and script are both variable-length](https://gist.github.com/1440000bytes/211ac92dd4433bb1a2e674bf0ff7db2e). Shift the boundary between them, and two completely different verification inputs can produce the identical stream of bytes.**  
  
_**[CertiK found that the observed setup and attack outputs did exactly that](https://www.certik.com/blog/liquid-network-incident-analysis):** Both reduce to the same 4,301-byte stream._  
  
**[The valid setup output used an OP_RETURN script that pushed 67 bytes](https://www.certik.com/blog/liquid-network-incident-analysis):** A second value commitment, the L-BTC asset generator, and a final OP_RETURN byte.  
  
[The invalid output’s range proof ends with the bytes carried in the valid setup output’s](https://www.certik.com/blog/liquid-network-incident-analysis)  OP_RETURN script.  
  
Concatenate the setup output’s four fields, then concatenate the invalid output’s four fields, [and both reduce to the identical 4,301-byte stream](https://www.certik.com/blog/liquid-network-incident-analysis).

_**[Same hash, same cache entry, with two different verification inputs](https://www.certik.com/blog/liquid-network-incident-analysis):** One valid, the other capable of creating L-BTC with no corresponding Bitcoin backing._

**[Connecting block 4,050,335 consumed the existing cache entry and did not store a new one on a miss](https://www.certik.com/blog/liquid-network-incident-analysis). The inflation transaction therefore required a fresh valid primer to reach each accepting node after that block connected and before the invalid output was checked in block 4,050,336.**

  

[CertiK’s transaction trace places the two visible setup transactions at 13:52:10 UTC and the Liquid-side inflation transaction at 13:53:10 UTC](https://www.certik.com/blog/liquid-network-incident-analysis), 60 seconds later.  
  
The fresh valid transaction that primed the live cache remains publicly unknown; [CertiK says its transaction ID and raw bytes have not been identified](https://www.certik.com/blog/liquid-network-incident-analysis).  
  
**The earlier two-part key was not the collision CertiK reconstructed.**

[The observed setup and attack outputs do not collide under P || C](https://www.certik.com/blog/liquid-network-incident-analysis); their old-key inputs differ in both length and content.  
  

[CertiK’s reconstruction specifically matches the four-part, undelimited key introduced by commit c26d719](https://www.certik.com/blog/liquid-network-incident-analysis), a change that attempted to bind the cache entry to the full verification context.  
  

**[CertiK says the acceptance points to a c26d719-like implementation combined with a primed cache](https://www.certik.com/blog/liquid-network-incident-analysis), though the exact binaries deployed by individual functionaries have not been published.**

  
_If patching a bug is what handed someone the exploit, what exactly counts as “fixed”?_

  
### Same Block

  

_The receipts tell their own story._

**Setup Transaction (13:52:10 UTC):** [271147100a94f6337b6c3db39b30c92d5b97ed91597307b6f721f73a15187ec5](https://blockstream.info/liquid/tx/271147100a94f6337b6c3db39b30c92d5b97ed91597307b6f721f73a15187ec5)

**Liquid-side Inflation Transaction (13:53:10 UTC, Liquid block 4,050,336):** [f24a4b179b5cc7e88b25a763911f7cbdf2bf45d1d1b5ab611e94461cef0a183f](https://blockstream.info/liquid/tx/f24a4b179b5cc7e88b25a763911f7cbdf2bf45d1d1b5ab611e94461cef0a183f)

[Sixty seconds separate those two](https://www.certik.com/blog/liquid-network-incident-analysis). CertiK's forensic reconstruction ties the second transaction directly to the colliding cache key, the exact moment the unbacked L-BTC came into existence.

_[CertiK's trace also identifies two more hops](https://www.certik.com/blog/liquid-network-incident-analysis) within the hour:_

**First Hop (13:54:10 UTC):** [3875a6d6ed4af708e6fd90d1c5504dc014e52c7093a566987252006d6cf1146b](https://blockstream.info/liquid/tx/3875a6d6ed4af708e6fd90d1c5504dc014e52c7093a566987252006d6cf1146b?input:0&expand)

**Second Hop (14:00:10 UTC):** [c6ea588ac26f5838b6acbb2a444a33b325bbfeb39bf16dfe27b47215ffd72267](https://blockstream.info/liquid/tx/c6ea588ac26f5838b6acbb2a444a33b325bbfeb39bf16dfe27b47215ffd72267)

Then came the peg-outs. [A smaller 2.65138358-L-BTC peg-out appeared at 14:01:10 UTC](https://www.certik.com/blog/liquid-network-incident-analysis).

  
**Smaller peg-out, 14:01:10 UTC:** [46f117c990580501a5156937a8c8affda551a38b3c0b99d29eb8469ee6beb3d2](https://blockstream.info/liquid/tx/46f117c990580501a5156937a8c8affda551a38b3c0b99d29eb8469ee6beb3d2)

Five minutes later, the real one.  
  
**Large Peg-Out, 3,996.01834922 L-BTC (14:06:10 UTC):** [ce4caece413cd9d444ce7ed9f54e5b328b3da5e4af301aff59a3571f76e988f2](https://blockstream.info/liquid/tx/ce4caece413cd9d444ce7ed9f54e5b328b3da5e4af301aff59a3571f76e988f2)

**The Bitcoin side moved just as fast, [and SideSwap's own statement confirms the sequence directly](https://x.com/side_swap/status/2096709838310928674):** Its service received the 4,000 L-BTC order, burned it on Liquid, and the federation paid out at 14:28 UTC.  
  
**Federation Payout:** [8db751a650ae2f12006b7e8c69a75e4df360e8afd6b9e05ae0b9fa6458a7b140](https://blockstream.info/tx/8db751a650ae2f12006b7e8c69a75e4df360e8afd6b9e05ae0b9fa6458a7b140)

_The Federation released 3,996.02 BTC in transaction [8db751…b140](https://blockstream.info/tx/8db751a650ae2f12006b7e8c69a75e4df360e8afd6b9e05ae0b9fa6458a7b140); SideSwap then forwarded 3,995.99999857 BTC to the party’s address in transaction [85d2ca…5043](https://blockstream.info/tx/85d2ca15bea33a592e73ed40c6a5da887feecf1e77f58ec7f580e00841645043), [in the same Bitcoin block](https://sideswap.io/news/statement-on-the-liquid-network-incident-of-6-september-2026/)._  
  
**[SideSwap forwarded 3,995.99999857 BTC to the party’s address in the same Bitcoin block as the Federation’s](https://sideswap.io/news/statement-on-the-liquid-network-incident-of-6-september-2026/) 3,996.02-BTC release.**

  
**Same-Block Forward:** [85d2ca15bea33a592e73ed40c6a5da887feecf1e77f58ec7f580e00841645043](https://blockstream.info/tx/85d2ca15bea33a592e73ed40c6a5da887feecf1e77f58ec7f580e00841645043)

Two addresses, with two different roles.  
  
The first was SideSwap’s whitelisted Bitcoin address, through which the Federation released the peg-out payout. [Liquid’s September 8th incident report says the Federation released approximately 4,000 BTC through that whitelisted SideSwap address.](https://x.com/Liquid_BTC/status/2097404704028545175)

The second was the exploiters’ specified destination that received SideSwap’s same-block forward. [SideSwap says its service forwarded 3,995.99999857 BTC to the party’s address in transaction 85d2ca…5043.](https://sideswap.io/news/statement-on-the-liquid-network-incident-of-6-september-2026/)  
  
**That destination was an actor-controlled consolidation and on-chain-messaging address:**  
[Bc1ql4mfu6aundtkksxklfajs2h3t9nzcd6gyqjlte](https://blockstream.info/address/bc1ql4mfu6aundtkksxklfajs2h3t9nzcd6gyqjlte)

**[CertiK labels that address as the consolidation](https://www.certik.com/blog/liquid-network-incident-analysis) and on-chain-messaging address.**

_**Later that day, the actors used an OP_RETURN message to declare:** “we are whitehats. contact us on chain.”_

**Whitehat Message:** [c103de95817b43f2df635ec6f35ff126ca26a7c6d20570c4b01866b2b3e69a19](https://mempool.space/tx/c103de95817b43f2df635ec6f35ff126ca26a7c6d20570c4b01866b2b3e69a19?showDetails=true)

Roughly a day later, [in Bitcoin block 965,950, one more transaction returned most, but not all, of the funds](https://x.com/Liquid_BTC/status/2097404704028545175).

**Partial-return Transaction:** [a6d697a25266ce3c78774fd1d75f896b7af522ada209b0f6228ea497bc49a46d](https://mempool.space/tx/a6d697a25266ce3c78774fd1d75f896b7af522ada209b0f6228ea497bc49a46d)

  
**It sent 3,400 BTC to the Liquid Federation peg wallet:** [bc1qdlld6antmv4xug242ed83q7k4rqw50cwfns38szx4qu2f4jwaxxsuhwxxr](https://mempool.space/address/bc1qdlld6antmv4xug242ed83q7k4rqw50cwfns38szx4qu2f4jwaxxsuhwxxr)

  
The same [partial-return transaction](https://mempool.space/tx/a6d697a25266ce3c78774fd1d75f896b7af522ada209b0f6228ea497bc49a46d) sent the remaining 598.49955894 BTC back to [bc1ql4mfu6aundtkksxklfajs2h3t9nzcd6gyqjlte](https://mempool.space/address/bc1ql4mfu6aundtkksxklfajs2h3t9nzcd6gyqjlte) as change, [an address Chainalysis identifies as actor-controlled](https://www.chainalysis.com/blog/320m-exploit-liquid-network/).

The actors called themselves white hats in their on-chain message.  
  
**[Taylor Monahan disagreed](https://x.com/tayvano_/status/2098342824337170655):** “They’re not a whitehat.”

**One transaction. Two destinations. One was a return. The other went back to an actor-controlled address.**

_Was it really a whitehat?_

### Before and After the Patch

_The earlier cache-key flaw was old. [The construction CertiK reconstructed as exploitable was new](https://www.certik.com/blog/liquid-network-incident-analysis)._

**[The earlier construction keyed the range-proof cache on the proof and value commitment](https://github.com/ElementsProject/elements/commit/212c43f4) while omitting the asset generator and output script.**  
  
[But CertiK found that the observed setup and attack outputs do not collide under that earlier P || C key](https://www.certik.com/blog/liquid-network-incident-analysis); their old-key inputs differ in both length and content.  
  
[Its reconstruction instead specifically matches the four-part](https://www.certik.com/blog/liquid-network-incident-analysis), undelimited construction introduced by commit c26d719.  
  
In other words, the long-lived omission was not [the byte-level collision CertiK reconstructed from the September 6 transactions](https://www.certik.com/blog/liquid-network-incident-analysis).

_**[CertiK’s reconstruction identifies the practical failure](https://www.certik.com/blog/liquid-network-incident-analysis):** Distinct verification tuples could reduce to the same byte stream when variable-length components were not unambiguously delimited._

**After the exploit, Blockstream released [Elements v23.3.4](https://github.com/ElementsProject/elements/releases/tag/elements-23.3.4).**

[Liquid said the emergency release hardened range-proof cache keys and underwent multiple rounds of internal and external review](https://x.com/Liquid_BTC/status/2097695714310521331), including by Bitcoin Red Team and Alpen Labs.

[One post-incident technical write-up argues that the replacement still permits](https://gist.github.com/1440000bytes/211ac92dd4433bb1a2e674bf0ff7db2e) a related ambiguity.

[Liquid resumed block production and transactions on September 10, while keeping peg-outs disabled as a precaution.](https://x.com/Liquid_BTC/status/2098140614239920622) Its update said the recovery process included rigorous testing, AI-assisted code scanning, and continuous monitoring.

_The dispute over the remaining BTC continued. [Blockstream called taking assets without authorization and withholding their return “a crime, not responsible disclosure,”](https://x.com/Blockstream/status/2098281867908690394) rejected paying a ransom, and said it would pursue lawful recovery if the funds were not returned._  
  
**[It nevertheless said a full return could allow the actors to](https://x.com/Blockstream/status/2098281867908690394) “revert to the standard of white-hat principles.”**

The argument then turned to prior warnings.

[Adam Back said the exploit involved an incorrect fix for an AI-found issue assessed as non-critical](https://x.com/adam3us/status/2098040524309512272), interacting with a separate issue also judged non-critical.  
  
[Dr. Calle suggested a warning](https://x.com/callebtc/status/2098115137634725933?s=20) had been ignored.  
  
**[Dr. Calle said](https://x.com/callebtc/status/2098116300459450512):** “We will give Blockstream time to restore orderly operations and publish a postmortem on the Liquid hack before we share our own complete account of the disclosure process.”

**The public record still does not settle that dispute. The code changed in public. The money left days later.**  
  
_Where was the review built to ask whether four byte strings still meant four separate things?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_Bitcoin’s base layer never had to answer for any of this. The systems at issue did._  
  

**[Liquid said its federation functionaries were not hacked](https://x.com/Liquid_BTC/status/2097404704028545175), no private keys were compromised, and the peg-out mechanism operated as designed.**  
  
A vulnerability in Elements’ range-proof-verification cache allowed distinct validation inputs to map to the same cached entry; [CertiK’s reconstruction says the attacker reused a cached successful result to create unauthorized L-BTC.](https://www.certik.com/blog/liquid-network-incident-analysis)  
  
The resulting peg-out was then paid in BTC on Bitcoin’s mainchain.

  
[Liquid said the exploit created roughly 4,000 L-BTC not backed by Bitcoin held in reserve](https://x.com/Liquid_BTC/status/2097404704028545175); the exploiters then used SideSwap to convert the unbacked L-BTC to BTC through Liquid’s [standard peg-out mechanism.](https://x.com/Liquid_BTC/status/2097404704028545175)  
  
_[Its reserve fell from about 4,205 BTC to 197 BTC following that peg-out and additional peg-outs](https://x.com/Liquid_BTC/status/2097404704028545175) processed before operations were halted._  
  
**That was not a break in Bitcoin consensus. It was a failure in a Bitcoin-adjacent system that treated unbacked value as valid.**  
  

Six weeks earlier, a different failure exposed the same boundary.  
  
[TRM Labs says a March 2021 Coldcard firmware build-configuration error caused some devices to fall back to a weak software random-number generator rather than the hardware entropy source](https://www.trmlabs.com/resources/blog/the-largest-hardware-wallet-exploit-of-2026-inside-the-usd-116-million-coldcard-hack), reducing effective key strength from 128 bits to as little as 40 bits.  
  
**[TRM says exploitation began on July 30, 2026, and cites Galaxy Research’s preliminary tally of roughly 1,816 BTC](https://www.trmlabs.com/resources/blog/the-largest-hardware-wallet-exploit-of-2026-inside-the-usd-116-million-coldcard-hack), about $116 million, from more than 5,200 addresses.**  
  

The technical failures differed. The lesson did not. Bitcoin’s long record without a catastrophic consensus break does not automatically extend to a wallet generating a secret, software validating a confidential transaction, or a federation holding and releasing a reserve.  
  
Those systems may inherit Bitcoin’s utility, but they do not inherit Bitcoin’s security guarantees.  
  
**Bitcoin has survived years of people trying to break it directly.**  
  
_How many more failures will the systems built around it suffer before somebody starts checking them with the same rigor?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
