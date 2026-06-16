---
tags:
  - blockchain/arbitrum
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/multisig
  - sector/privacy
  - sector/staking
  - sector/token
  - sector/vault
  - trigger/low-liquidity
  - novelty/variant
title: "Hyperbridge - Rekt"
protocol: "[[Hyperbridge]]"
date: 2026-04-13
loss_usd: 2500000
auditors:
source: "https://rekt.news/hyperbridge-rekt"
excerpt: "On April 13, 2026, a missing bounds check in Hyperbridge's MMR proof verifier allowed forged proofs to pass. 1 billion DOT minted. Two attacks, combined with opportunistic withdrawals from drained poo"
genome:
  - "[[trigger/low-liquidity]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[bridge-merkle-proof]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# Hyperbridge - Rekt

> **Loss:** $2,500,000 | **Date:** 2026-04-13 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/hyperbridge-rekt-header.png)



_[1 billion DOT tokens minted](https://etherscan.io/tx/0x240aeb9a8b2aabf64ed8e1e480d3e7be140cf530dc1e5606cb16671029401109), [$2.5 million in losses](https://x.com/hyperbridge/status/2044750854457061393), one missing line of code._  
  
**[Initially reported as a $237k](https://x.com/hyperbridge/status/2043676775083803057) loss, [Hyperbridge revised that figure to $2.5 million](https://x.com/hyperbridge/status/2044750854457061393), citing [two separate attacks](https://blog.hyperbridge.network/recovery-and-next-steps/) and [users who swapped into artificially cheap DOT after the pools were drained](https://x.com/hyperbridge/status/2044853463105122734).**  
  

**Hyperbridge built its entire identity [around a single promise](https://hyperbridge.network/):** Cryptographic proofs, not human committees, would keep its bridge secure.  
  
No multisig. No validators. No trust.  
  
Just math, math that the Polkadot ecosystem [backed with a $5.3 million seed round](https://techcabal.com/2025/04/17/polytope-labs-raises-over-5-million-to-scale-hyperbridge-backed-by-the-polkadot-ecosystem-fund/), and, six weeks earlier, a [Polkadot OpenGov vote to hard-cap DOT supply at 2.1 billion tokens](https://coindoo.com/polkadot-bridge-hacked-1-billion-dot-minted-and-dumped/) in a bid for monetary credibility.  
  

On April 1st, [Hyperbridge announced that the Lazarus Group had drained $37 million](https://protos.com/hyperbridge-exploited-less-than-two-weeks-after-april-fools-day-hack-prank/) - a joke, before linking to a since deleted blog post explaining "Why Hyperbridge Can't Be Hacked."  
  
_**[Founder Seun Lanlege had said as much in a December 2025 interview](https://techparley.com/nigerias-polytope-labs-builds-hyperbridge-to-end-cryptos-multi-billion-dollar-bridge-hack-crisis/):** "Unless the cryptographic libraries themselves fail, the proofs cannot be forged."_

**Twelve days later, [the cryptographic library failed. The proofs were forged.](https://x.com/hyperbridge/status/2043676789948461358)**

The April 1st post and tweet were since removed. What replaced them was a real exploit announcement that opened, without a trace of irony.  
  

One missing bounds check, a single require statement that was never written, [let an attacker submit a fabricated proof, seize admin control of the bridged DOT token contract on Ethereum, mint a billion tokens out of thin air](https://x.com/CertiKAlert/status/2043557571609731268), and walk away with everything the liquidity pool had to offer.

  
**The attacker didn't outsmart the cryptography. They found the place where the math stopped and the Solidity began.**  
  

_When a protocol's security guarantee lives or dies on a library nobody fuzz-tested, who exactly was minding the proof?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [CoinTelegraph](https://claude.ai/chat/bf7a4509-bf71-49c9-8e4d-8ab302638e38), [techcabal](https://techcabal.com/2025/04/17/polytope-labs-raises-over-5-million-to-scale-hyperbridge-backed-by-the-polkadot-ecosystem-fund/), [coindoo](https://coindoo.com/polkadot-bridge-hacked-1-billion-dot-minted-and-dumped/), [Techparley](https://techparley.com/nigerias-polytope-labs-builds-hyperbridge-to-end-cryptos-multi-billion-dollar-bridge-hack-crisis/), [CertiK Alert](https://x.com/CertiKAlert/status/2043557571609731268), [Zilayo](https://x.com/0xZilayo/status/2043546814037803401), [PeckShield](https://x.com/PeckShieldAlert/status/2043552128980185162), [BlockSec Phalcon](https://x.com/Phalcon_xyz/status/2043567998662053982), [Arkham](https://x.com/arkham/status/2043579311060644273), [Hyperbridge](https://x.com/hyperbridge/status/2043676775083803057), [Polkadot](https://x.com/Polkadot/status/2043594321836884446), [DLNews](https://www.dlnews.com/articles/defi/a-hacker-created-dollar12bn-of-counterfeit-crypto-they-only-sold-it-for-dollar237000/), [Stepan Chekhovskoi](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961), [SpecterAnalyst](https://x.com/SpecterAnalyst/status/2043641769754235076), [DEGEN NEWS](https://x.com/DegenerateNews/status/2043612335818842282), [AInvest](https://www.ainvest.com/news/polkadot-launches-etf-implements-tokenomics-overhaul-enhance-staking-security-scarcity-2603/), [Arkham](https://x.com/arkham/status/2044324483209801979), [Range](https://www.range.org/blog/1-billion-tokens-minted-inside-the-hyperbridge-gateway-exploit)_

**[Zilayo fired first early on April 13th](https://x.com/0xZilayo/status/2043546814037803401) - No preamble, no hedging - just admin changed to the attacker's contract, 1 billion DOT minted.**

[PeckShield followed 21 minutes later](https://x.com/PeckShieldAlert/status/2043552128980185162), amplifying it to a wider audience.

[CertiK followed minutes later](https://x.com/CertiKAlert/status/2043557571609731268) with the transaction hash and the mechanism in plain terms.  
  
[The attacker had slipped through a forged message](https://x.com/CertiKAlert/status/2043557571609731268), changed the admin of the Polkadot token contract on Ethereum, minted a billion tokens, and [cashed out approximately $237,000](https://x.com/CertiKAlert/status/2043557571609731268).  
  
One sentence. Done.  
  
_[BlockSec Phalcon came next with more detail](https://x.com/Phalcon_xyz/status/2043567998662053982), initially framing it as an MMR proof replay vulnerability caused by missing proof-to-request binding - a valid description of the symptom, though the precise root cause would sharpen in a second post._  
  
**[Their alert named the HandlerV1 contract specifically](https://x.com/Phalcon_xyz/status/2043567998662053982), listed six attack transactions, and noted what the attacker had actually done: Changed the admin of the DOT token, then used that admin access to mint.**

[Arkham tracked the wallet in real time](https://x.com/arkham/status/2043579313703051459). The attacker's address was already moving funds by the time the first alerts landed.

**Primary Attacker Address on Arkham:**
[0xc513e4f5d7a93a1dd5b7c4d9f6cc2f52d2f1f8e7](https://intel.arkm.com/explorer/address/0xC513E4f5D7a93A1Dd5B7C4D9f6cC2F52d2F1F8E7)

_Hyperbridge went quiet for hours. When the team did speak, [they opened with "Security Update!"](https://x.com/hyperbridge/status/2043676775083803057), with the replies turned off._  
  
**Maybe the April Fools Joke did not go over too well, given the irony.**

Polkadot moved faster than Hyperbridge did. [Their official account clarified that native DOT](https://x.com/Polkadot/status/2043594321836884446), and all parachains were fully secure and unaffected.[  
  
**[Parity Technologies, a Polkadot developer, told DL News the roughly same thing](https://www.dlnews.com/articles/defi/a-hacker-created-dollar12bn-of-counterfeit-crypto-they-only-sold-it-for-dollar237000/):** No vulnerability in Polkadot's protocol, consensus, or audited core code.

[Hyperbridge's official statement acknowledged $237,000 in losses](https://x.com/hyperbridge/status/2043676775083803057), that [figure would become $2.5 million three days later](https://x.com/hyperbridge/status/2044750854457061393). Bridging was paused. The team said it was [working with security partners to trace and recover funds](https://x.com/hyperbridge/status/2043676801801638205).

**A protocol that spent two years telling the industry it had solved bridge security had just been handed the bill for the one assumption nobody checked.**

  
_How does a library built by the same team that built the bridge end up with an untested edge case at the center of its security model?_  
  
### Forged in Plain Sight

_**[Hyperbridge's cross-chain messaging](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961) worked like this:** A user sends a request on Polkadot, a relayer carries a proof of that request to Ethereum, and the [HandlerV1 contract](https://github.com/polytope-labs/hyperbridge/blob/05031ae6c41979cdb5a03b44ccf767e0cbc0dcae/evm/src/core/HandlerV1.sol#L150-L181) on Ethereum validates that proof before dispatching any action._  
  
**The entire security model rested on that validation step. If the proof passed, the message was treated as legitimate. If the message was legitimate, its instructions were executed, including [instructions that could reassign who controlled a token contract](https://x.com/hyperbridge/status/2043676797435322590).**  
  
Those instructions landed in TokenGateway, [the contract responsible for minting and burning wrapped assets](https://docs.hyperbridge.network/developers/polkadot/token-gateway/).

**The attacker's goal was simple:** Make a forged message pass as legitimate. Everything else followed from that.

The attacker [submitted a ChangeAssetAdmin request targeting the bridged DOT token contract](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961).  
  
**[The core of the exploit lives in one function call](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961):** HandlerV1.handlePostRequests, the handler that processes incoming cross-chain messages.  
  
**[Its job](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961):** Fetch a Merkle root, validate that the message is included in that tree, then dispatch the action if the proof holds.  
  
_[The attacker needed step two](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961), to validate that the message is included in that tree, to pass for a message they had [fabricated from scratch](https://x.com/Phalcon_xyz/status/2043601549893738970)._

**[Here's what they actually submitted](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961):**  
  
_MerkleMountainRange.VerifyProof( 
root: 0x466dddba7e9a84a0f2632b59be71b8bd489e3334a1314a61253f8b827c9d3a36, proof: [0x466dddba7e9a84a0f2632b59be71b8bd489e3334a1314a61253f8b827c9d3a36], leaves: [{ k_index: 0, leaf_index: 1, hash: 0xb870f0ca...318a99d }], 
leafCount: 1 
)_  
  

[proof[0] == root.](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961) That's not an accident.  
  

CalculateRoot(), the function underneath VerifyProof(), [has an early exit for single-leaf trees](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961).  
  
[When leafCount == 1, leaves.length == 1](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961), and leaves[0].leaf_index == 0, it returns the leaf hash directly. A fast and clean path.

_[The attacker set leaf_index to 1 instead of 0.](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961) One digit off. That single change bypassed the early exit entirely and [sent execution down the general path](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961), where the function looked for leaves within each subtree._  
  
**With an out-of-bounds leaf_index, no leaves fell within any subtree, so instead of incorporating the leaf into the calculation, [the function reached for the next item in the proof array and pushed it directly onto the peak roots stack.](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961)**

[The function returned proof[0]](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961). The attacker had set proof[0] equal to the expected root. Computed root matched expected root. Verification passed.

[The attacker's actual leaf hash was never used in the calculation at all.](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961) It was decorative. The message was entirely fabricated. The verifier accepted it without question.

ChangeAssetAdmin executed.  
  
**Admin and minter rights for the bridged DOT token contract transferred to:** [0xc513e4f5d7a93a1dd5b7c4d9f6cc2f52d2f1f8e7](https://app.blocksec.com/phalcon/explorer/tx/eth/0x240aeb9a8b2aabf64ed8e1e480d3e7be140cf530dc1e5606cb16671029401109)

The attacker didn't arrive unprepared.  
  
**A contract containing the core mint and swap logic had been [pre-deployed days earlier](https://www.range.org/blog/1-billion-tokens-minted-inside-the-hyperbridge-gateway-exploit):**
[0x31a165a956842aB783098641dB25C7a9067ca9AB](https://etherscan.io/address/0x31a165a956842ab783098641db25c7a9067ca9ab)

**The exploit transaction itself [deployed a minimal proxy as the direct attack vehicle](https://www.range.org/blog/1-billion-tokens-minted-inside-the-hyperbridge-gateway-exploit):**
[0x518ab393c3f42613d010b54a9dcbe211e3d48f26](https://etherscan.io/address/0x518ab393c3f42613d010b54a9dcbe211e3d48f26#internaltx)

By the time the forged proof was submitted, the exit was already built.

_From there, [minting a billion tokens](https://x.com/hyperbridge/status/2043676801801638205) was a formality, and [dumping them for 108.2 ETH](https://cointelegraph.com/news/hacker-steals-237k-1b-bridged-dot-hyperbridge) was simply a matter of how deep the pool ran._

**It ran to $237,000. That was the floor. Not the ceiling, [the entire available depth](https://cointelegraph.com/news/hacker-steals-237k-1b-bridged-dot-hyperbridge).**

One bounds check, require(leaf_index < leafCount), [would have reverted the transaction before any of this happened](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961).  
  
[It was never written](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961). The library flagged no invariant requiring it.

[The calling code validated nothing](https://github.com/polytope-labs/hyperbridge/blob/05031ae6c41979cdb5a03b44ccf767e0cbc0dcae/evm/src/core/HandlerV1.sol#L150-L181) before passing untrusted input into a security-critical function.

[Neither layer caught what the other assumed](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961) the other was handling.

**[Blocksec Phalcon's final root cause update put it plainly](https://x.com/Phalcon_xyz/status/2043601549893738970):** The verifier does not enforce leaf_index < leafCount.  
  
**If an attacker submits leafCount = 1 and leaf_index = 1, CalculateRoot() never incorporates the request commitment into root computation, the proof passes for arbitrary request content, [decoupled from the message it was meant to authenticate](https://x.com/Phalcon_xyz/status/2043601549893738970).**

_When a library is both authored and consumed by the same team, who owns the assumption that inputs will be valid?_  
  
### The Number That Kept Changing

  
_The timeline that [Hyperbridge's official statement](https://x.com/hyperbridge/status/2043676775083803057) didn't tell._  
  
**There was more than one attack and more than one attacker.**  
  
The first attack got less coverage. [According to SpecterAnalyst](https://x.com/SpecterAnalyst/status/2043641769754235076), it also walked away with more.  
  
According to [on-chain investigator SpecterAnalyst](https://x.com/SpecterAnalyst/status/2043641769754235076), [](https://www.cryptointegrat.com/p/hyperbridge-exploit-mints-1-billion) Hyperbridge's [TokenGateway contract](https://etherscan.io/address/0xfd413e3afe560182c4471f4d143a96d3e259b6de) was hit for 245 ETH, approximately $570k, before the main attack made headlines.  
  
**[The exit was methodical](https://x.com/SpecterAnalyst/status/2043641769754235076):** Funds split into 16.39 ETH per wallet across 15 addresses, then deposited into Tornado Cash. No negotiation. No bounty contact. Just a clean split and a vanish.  
  
**Hyperbridge's TokenGateway Contract:**  
[0xFd413e3AFe560182C4471F4d143A96d3e259B6dE](https://etherscan.io/address/0xfd413e3afe560182c4471f4d143a96d3e259b6de)

  
**Attacker’s Address:**  
[0xc0564bBa9Ba5A9bE95AE866429F936012E1bF143](https://etherscan.io/address/0xc0564bba9ba5a9be95ae866429f936012e1bf143)

**Contract Used in Attack:**
[0xCcd363E1A098558b17431b934fffac9906855a5d](https://etherscan.io/address/0xccd363e1a098558b17431b934fffac9906855a5d#internaltx)

**Attack Transaction:** [](https://x.com/SpecterAnalyst/status/2043641769754235076) [0xeff151ef58d57d6523874a7b97344fcd1ce3c7c6880cfc26a93da17f82062d59](https://etherscan.io/tx/0xeff151ef58d57d6523874a7b97344fcd1ce3c7c6880cfc26a93da17f82062d59)

_This earlier drain appears to have been a separate attack, not the one tied to [the HandlerV1 vulnerability](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961)._  
  
**The [headline exploit followed at 03:55 UTC on April 13](https://www.cryptointegrat.com/p/hyperbridge-exploit-mints-1-billion).**  
  
The same TokenGateway contract managed four assets, [all hit in the same transaction.](https://www.cryptointegrat.com/p/hyperbridge-exploit-mints-1-billion)  
  
Beyond [minting the 1 billion DOT](https://etherscan.io/tx/0x240aeb9a8b2aabf64ed8e1e480d3e7be140cf530dc1e5606cb16671029401109), the attacker also minted roughly 999 billion ARGN tokens and [targeted MANTA and CERE](https://www.range.org/blog/1-billion-tokens-minted-inside-the-hyperbridge-gateway-exploit).  
  
**ARGN Transaction:**  
[0xb28ab9526e1538bdb7a26ec8485d055f9e417620c72a2f4de0f42234b5f8ac09 ](https://etherscan.io/tx/0xb28ab9526e1538bdb7a26ec8485d055f9e417620c72a2f4de0f42234b5f8ac09)

_The rest of the on-chain picture is as follows…_  
  
**HandlerV1 Contract (vulnerable):**  
[0x6C84eDd2A018b1fe2Fc93a56066B5C60dA4E6D64](https://etherscan.io/address/0x6c84edd2a018b1fe2fc93a56066b5c60da4e6d64)

  
**Hijacked DOT Token Contract:**  
[0x8d010bf9c26881788b4e6bf5fd1bdc358c8f90b8](https://etherscan.io/token/0x8d010bf9c26881788b4e6bf5fd1bdc358c8f90b8)

  
**Primary Attacker:**
[0xc513e4f5d7a93a1dd5b7c4d9f6cc2f52d2f1f8e7](https://etherscan.io/address/0xc513e4f5d7a93a1dd5b7c4d9f6cc2f52d2f1f8e7)

**Primary Attack Transaction (1 Billion DOT Minted):** [](https://app.blocksec.com/phalcon/explorer/tx/eth/0x240aeb9a8b2aabf64ed8e1e480d3e7be140cf530dc1e5606cb16671029401109) [0x240aeb9a8b2aabf64ed8e1e480d3e7be140cf530dc1e5606cb16671029401109](https://etherscan.io/tx/0x240aeb9a8b2aabf64ed8e1e480d3e7be140cf530dc1e5606cb16671029401109)

**Additional Attack Transactions:** [0xb93aab835e4002f7d46b63e37a156c78abd1d9256df094d63321deeb514a0634](https://etherscan.io/tx/0xb93aab835e4002f7d46b63e37a156c78abd1d9256df094d63321deeb514a0634) [0x6f1efcde4a52db999c8cd233364d889292ae5ba357d9f2ead3dd3774010a0808](https://etherscan.io/tx/0x6f1efcde4a52db999c8cd233364d889292ae5ba357d9f2ead3dd3774010a0808) [0x743f4bdb67df7e6db57346e557f94ded8d7f85e854040963b7f345545e227125](https://etherscan.io/tx/0x743f4bdb67df7e6db57346e557f94ded8d7f85e854040963b7f345545e227125) [0xb80c7d4cde034689eb9aa42f0d28aa01d12e233e3805a7c8888ed871b7443c3a](https://etherscan.io/tx/0xb80c7d4cde034689eb9aa42f0d28aa01d12e233e3805a7c8888ed871b7443c3a) [0xb28ab9526e1538bdb7a26ec8485d055f9e417620c72a2f4de0f42234b5f8ac09](https://etherscan.io/tx/0xb28ab9526e1538bdb7a26ec8485d055f9e417620c72a2f4de0f42234b5f8ac09) [0xfa23fb22cc8ff10518e561817dea838d3232f7573fd90bd81fd7a30a9161b6f6](https://etherscan.io/tx/0xfa23fb22cc8ff10518e561817dea838d3232f7573fd90bd81fd7a30a9161b6f6)

_The combined notional value of tokens minted ran into the billions. Shallow Ethereum liquidity pools prevented the attacker from realizing more than a fraction of that sum._  
  
**The original headline number was $237k. The full picture is less tidy.**  
  
Same exploit. Same window. Two different attackers.  
  
The main attacker walked away with $237K, [limited only by what the limited liquidity pool could absorb](https://cointelegraph.com/news/hacker-steals-237k-1b-bridged-dot-hyperbridge) before collapsing to near zero.[  
  
[According to SpecterAnalyst, a separate actor had already taken 245 ETH](https://x.com/SpecterAnalyst/status/2043641769754235076) through the same door before the DOT mint made headlines.  
  
[Three days later, Hyperbridge revised its loss estimate to approximately $2.5 million](https://x.com/hyperbridge/status/2044750854457061393), a figure that includes not just funds extracted by the attacker, but losses from incentive pools across Ethereum, Base, BNB Chain, and Arbitrum.  
  
Those pools were part of the [DeFi Singularity campaign](https://forum.polkadot.network/t/pre-proposal-discussion-dot-recovery-loan-for-hyperbridge-token-gateway-exploit-victims/17552), a [795,000 DOT Polkadot treasury initiative](https://polkadot.subsquare.io/referenda/1439) that had actively recruited external LPs into the exact positions that were destroyed.

**[Hyperbridge has since identified a third category of losses](https://x.com/hyperbridge/status/2044853463105122734):** Regular users who, during or shortly after the attack, noticed the distorted DOT price in the drained pools and swapped other tokens for a disproportionately large amount of DOT, then bridged it back to Polkadot.  
  
**[A 14-day voluntary return window has been opened](https://x.com/hyperbridge/status/2044853463105122734). Wallets that don't comply will be referred to law enforcement alongside documented on-chain evidence.**

_When the same door gets used more than once before anyone sounds the alarm, at what point does the question stop being about the exploit and start being about who was watching?_  
  
### April Fools Indeed  
  
_Twelve days before the exploit, [Hyperbridge announced that the Lazarus Group had drained $37 million](https://protos.com/hyperbridge-exploited-less-than-two-weeks-after-april-fools-day-hack-prank/) across its Ethereum, Arbitrum, and Base deployments._

**It was a joke. The announcement linked to a [now-deleted blog post](https://blog.hyperbridge.network/explained-hack-april-fool/) which contained a Rickroll gif before explaining "Why Hyperbridge Can't Be Hacked".**  
  
The blog post was deleted. The [tweet was deleted](https://x.com/DegenerateNews/status/2043612335818842282).


The [team's real breach announcement opened with "Security Update!",](https://x.com/hyperbridge/status/2043676775083803057) with the replies turned off.[  
](https://thedefiant.io/news/hacks/polkadot-hyperbridge-ethereum-gateway-exploit-sjb0ql)

**[Hyperbridge's official statement](https://x.com/hyperbridge/status/2043676775083803057) was careful to draw one distinction:**  [The proof-based model itself](https://x.com/hyperbridge/status/2043676785758359959), cryptographic proofs generated directly from blockchain state, eliminating the need for validators or multisigs, [wasn't what failed](https://x.com/hyperbridge/status/2043676789948461358).  
  
What failed was [a vulnerability in the Solidity-based MMR proof verification logic, specifically within the Merkle tree verifier implementation](https://x.com/hyperbridge/status/2043676789948461358). That's a meaningful distinction.

_**[Founder Seun Lanlege had said as much himself, in a December 2025 interview](https://techparley.com/nigerias-polytope-labs-builds-hyperbridge-to-end-cryptos-multi-billion-dollar-bridge-hack-crisis/):** "Unless the cryptographic libraries themselves fail, the proofs cannot be forged."_

**[That quote](https://techparley.com/nigerias-polytope-labs-builds-hyperbridge-to-end-cryptos-multi-billion-dollar-bridge-hack-crisis/) didn't survive contact with April 13th.**

The timing of everything else compounds it.  
  
Almost a month before the exploit, [Polkadot's governance passed a hard supply cap of 2.1 billion DOT with 81% approval](https://polkadot.subsquare.io/referenda/1710) - emissions cut by 53.6%, the date set deliberately on Pi Day as a nod to the decay formula.  
  
Then there is Polkadot's monetary credibility play. The [21Shares TDOT ETF had just launched on Nasdaq on](https://www.ainvest.com/news/polkadot-launches-etf-implements-tokenomics-overhaul-enhance-staking-security-scarcity-2603/) March 6th, offering direct exposure to DOT.

_A governance-enforced supply cap designed to make DOT scarcer. A Nasdaq ETF designed to make it more accessible. Weeks of institutional momentum._

**[Then an attacker forged a proof](https://x.com/CertiKAlert/status/2043557571609731268), took admin control of a bridged token contract, and [minted a billion DOT on Ethereum](https://x.com/CertiKAlert/status/2043557571609731268).**

The supply cap on native Polkadot was never touched. The [relay chain was never touched](https://x.com/hyperbridge/status/2043676781270483094).  
  
The exploit changed none of that. It didn't need to.  
  
**[Hyperbridge's confidence had one audit behind it](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-ISMP-baseline_assurance-report.pdf). That audit had something to say about the Solidity libraries. Nobody followed up.**

_When a deleted blog post turns out to be more accurate than the protocol intended, what exactly does the team owe the people who read it?_  
  
### Read The Report  
  

_[SR Labs audited Hyperbridge in June 2024.](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-ISMP-baseline_assurance-report.pdf) The report is 26 pages. It is publicly available on GitHub. It has been sitting there for nearly two years._  
  
**[On Page 4](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-ISMP-baseline_assurance-report.pdf), Table 1, under In-scope components, [HandlerV1.sol listed.](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-ISMP-baseline_assurance-report.pdf)**  
  
**Priority:** High.

[The auditors looked at it.](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-ISMP-baseline_assurance-report.pdf) They found issues - one high severity, one medium, three low across the Solidity modules. The high and medium were fixed. Two of the low severity findings were accepted. One low severity finding remained open - a configuration that could be locked due to the finality of updates  
  
**Then, [on page 23](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-ISMP-baseline_assurance-report.pdf), buried in the evolution suggestions section, SR Labs wrote something the Hyperbridge team apparently decided not to act on:**

_"The investigation conducted on EvmHost.sol and HandlerV1.sol was heavily constrained in scope. Based on our investigation we believe that the Solidity implementation requires further analysis from a team specialized in smart contract auditing. We recommend investing further resources into the security of the Solidity codebase, including the associated custom libraries."_

The associated custom libraries - including the [solidity-merkle-trees library](https://github.com/polytope-labs/solidity-merkle-trees) that [Polytope Labs wrote](https://github.com/polytope-labs/solidity-merkle-trees), the one that contained [CalculateRoot](https://github.com/polytope-labs/solidity-merkle-trees/blob/03832eb448ab77e5010281d7894c77b92a0640ad/src/MerkleMountainRange.sol#L34-L120).

[SR Labs flagged those libraries](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-ISMP-baseline_assurance-report.pdf), in writing, in [the cited audit](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-ISMP-baseline_assurance-report.pdf). Then [recommended that a team specializing in Solidity smart contract auditing take a closer look](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-ISMP-baseline_assurance-report.pdf).  
  
The warning was in the audit. The exploit came later anyway.

_The threat model on page 8 makes it worse. [SR Labs explicitly identified](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-ISMP-baseline_assurance-report.pdf) "Replay ISMP messages" and "Exploit a bug in validation scheme to accept an invalid transaction" as high-value integrity threats - medium effort, high incentive, high hacking value._  
  
**The attack that happened on April 13th fits both descriptions precisely. The threat was named. The attack surface was pointed at.**

This is the audit that [Seun Lanlege cited when he told TechCabal in November 2025 that security was Hyperbridge's "core obsession."](https://techcabal.com/2025/11/25/hyperbridge-wants-to-end-bridge-hacks/)

The same audit where the auditors said the Solidity codebase needed more work and the custom libraries needed specialist review. The same audit where replay attacks against the proof validation scheme were called out as a high-value threat.  
  
It wasn’t the only warning.

_The [January 2025 GitHub security advisory for ismp-grandpa](https://github.com/polytope-labs/hyperbridge/security/advisories/GHSA-wwx5-gpgr-vxr7) should have been a warning too. A critical vulnerability in the ISMP grandpa crate, a missing negation check that caused the verifier to accept only invalid signatures, was discovered and patched internally. A verifier accepting invalid inputs._  
  
**Sound familiar?**  
  
That one was caught before it was exploited. This one wasn't.

The Hyperbridge exploit didn't stay contained to Hyperbridge.  
  
**On April 14th, the day after the exploit, Polkadot SDK developer sorpaas [disclosed a critical vulnerability in the Polkadot relay chain itself](https://forum.polkadot.network/t/relay-chain-vulnerability-false-validator-slashing-due-to-proof-verification-bug/17530):** What sorpaas described as a same-class proof verification bug in pallet_mmr, introduced in May 2024, that could have allowed an attacker to submit forged BEEFY offense reports, potentially disabling up to [199 of 600 validators](https://forum.polkadot.network/t/relay-chain-vulnerability-false-validator-slashing-due-to-proof-verification-bug/17530) and triggering slashes totaling [~446 million DOT](https://forum.polkadot.network/t/relay-chain-vulnerability-false-validator-slashing-due-to-proof-verification-bug/17530), subject to a 28-day governance window.  
  
_The fix, [PR#11738, was merged on April 13th](https://github.com/paritytech/polkadot-sdk/pull/11738)._

**[The bug had been present in the SDK codebase for 702 days](https://forum.polkadot.network/t/relay-chain-vulnerability-false-validator-slashing-due-to-proof-verification-bug/17530) and live in production for ~485.**

[The SR Labs audit of Hyperbridge went public in June 2024](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-ISMP-baseline_assurance-report.pdf), the month after that same bug class was introduced into the Polkadot SDK.  
  
The [auditors were reviewing Hyperbridge's proof verification implementation](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-ISMP-baseline_assurance-report.pdf) around the same that bug class entered the Polkadot SDK. 
  
**[The disclosure by sorpaas explicitly recommends a full audit of the Polkadot SDK](https://forum.polkadot.network/t/relay-chain-vulnerability-false-validator-slashing-due-to-proof-verification-bug/17530) for all proof verification issues similar to Hyperbridge.**

_When an auditor explicitly tells you your custom libraries need more work and you ship anyway, who exactly is surprised when the library fails?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)



_The number started at $237,000 and ended at $2.5 million. Neither will make the top of the Rekt Leaderboard. But a protocol that published a joke about being unhackable twelve days before it got hacked earns a story._
  
**The door was open and more than one actor walked through it.**  
  
[According to SpecterAnalyst](https://x.com/SpecterAnalyst/status/2043641769754235076) and [confirmed by Hyperbridge's own April 16th update](https://x.com/hyperbridge/status/2044750866284966062), a separate attacker took 245 ETH (~$570,000) before the DOT mint made headlines.
  
The main attacker minted a billion tokens and learned, the hard way, that liquidity is a ceiling, walking away with ~$237,000  
  
On-chain, the two attacks account for approximately $806,000 in confirmed losses.[  
  
_[Hyperbridge's revised figure is $2.5 million](https://x.com/hyperbridge/status/2044750854457061393), citing incentive pool losses across four chains._
  
**[Hyperbridge says forensics partners have identified the wallets and compiled full transaction histories](https://x.com/hyperbridge/status/2044853463105122734). A 14-day voluntary return window is open before referral to law enforcement.**

The April 1st blog post titled "Why Hyperbridge Can't Be Hacked" was deleted. The tweet was deleted.  
  
What remained was [a protocol frozen in place](https://x.com/hyperbridge/status/2043676801801638205), a bridge that won't reopen until the patch is verified.

The main attacker didn't wait around. [Arkham confirmed](https://x.com/arkham/status/2044324483209801979) the Bridged Polkadot Exploiter sent all funds to Tornado Cash - $269,000 total, with [$515 left in the wallet](https://intel.arkm.com/explorer/entity/bridged-dot-exploiter).  
  
_The funds are gone. The questions aren't._

**[One cited audit](https://github.com/polytope-labs/hyperbridge/blob/main/audits/SRL-Hyperbridge-ISMP-baseline_assurance-report.pdf). One recommendation about the custom libraries.**  
  
A [January 2025 security advisory about a verifier accepting invalid inputs](https://github.com/polytope-labs/hyperbridge/security/advisories/GHSA-wwx5-gpgr-vxr7) that didn't prompt anyone to check whether the Solidity side had the same problem.

The cryptographic model wasn't broken. The math was fine.  
  
**What failed was [those lines of Solidity](https://github.com/polytope-labs/hyperbridge/blob/05031ae6c41979cdb5a03b44ccf767e0cbc0dcae/evm/src/core/HandlerV1.sol#L150-L181) that sat between the math and the money - untested at the edges, unreviewed by specialists, and unprotected by a single bounds check that would have cost nothing to write.**  
  

Hyperbridge's pitch was that bridges fail because humans can't be trusted.

Turns out [libraries need to be read too.](https://medium.com/@SteMak/dot-hacked-the-hyperbridge-exploit-53e149b93961)

**When your auditors tell you the custom libraries need specialist review and you publish an April Fools post about being unhackable instead, the joke writes itself, you just have to wait for the punchline.**

_If the cryptographic libraries themselves fail and the proofs can be forged, and you were warned, what exactly were you selling?_


![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
