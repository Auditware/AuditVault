---
tags:
  - type/hack
  - blockchain/avalanche
  - blockchain/bitcoin
  - blockchain/bsc
  - blockchain/ethereum
  - blockchain/tron
  - web3-sector/bridge
  - web3-sector/dex
  - web3-sector/governance
  - web3-sector/lending
  - web3-sector/multisig
  - web3-sector/oracle
  - web3-sector/stable
  - web3-sector/staking
  - web3-sector/token
  - vector/access-control
title: "THORChain - Rekt III"
protocol: "THORChain"
date: 2026-05-15
loss_usd: 10700000
audit: "N/A"
source: "https://rekt.news/thorchain-rekt3"
excerpt: "A malicious node is believed to have exploited THORChain’s GG20 TSS signing stack to leak vault key material, reconstructed the private key offline, and drained $10.7 million across multiple chains. T"
---
# THORChain - Rekt III

> **Loss:** $10,700,000 | **Date:** 2026-05-15 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/thorchain-rekt3-header.png)


_[Three exploits in five years](https://x.com/DBCrypt0/status/2055242396166934630). Toss in a [$200 million insolvency crisis](https://www.ccn.com/news/crypto/thorchain-bitcoin-ether-insolvency/). Sprinkle [$1.2 billion in North Korean laundering](https://www.coindesk.com/tech/2025/04/07/the-blockchain-fueling-north-korea-s-massive-crypto-laundering-operation) on top._  
  
**The relationship between THORChain and North Korea runs deeper than most protocols would care to admit.**  
  
North Korea even returned the favor, [draining $1.2 million from co-founder jpthor's personal wallet](https://x.com/zachxbt/status/1966415195137519909) in September 2025 via a fake meeting scam.

  
Not exactly a recipe for success, but rather disaster.  
  
Then on the morning of May 15th, another $10.7 million was stolen.

  

_At some point, the question stops being how did this happen, and starts being why anyone expected otherwise?_

  

**On May 15, 2026, THORChain's Asgard vault was drained across multiple chains in rapid succession.**  
  
THORChain's own auto-solvency checker fired the halt - [the one security upgrade born out of the July 2021 carnage](https://medium.com/thorchain/post-mortem-eth-router-exploits-1-2-and-premature-return-to-trading-incident-2908928c5fb) - and froze the network for twelve hours and forty-two minutes.

  
The vault held. The funds did not.

  

[RUNE dropped 15%](https://ambcrypto.com/thorchain-exploit-hits-bitcoin-ethereum-and-bsc-hackers-steal-over-10-mln/) before most of the world had finished reading ZachXBT's Telegram post.  
  
[Market cap shed $27 million](https://www.cryptotimes.io/2026/05/17/10-8-million-drained-inside-the-thorchain-exploit-that-froze-cross-chain-defi-for-13-hours/) in minutes.  
  

**This is a protocol that has stared into the abyss before and kept building. But there is a limit to how many times you can call the same wound a learning experience.**

  
_When the vulnerability class was documented, the patches existed, and the funds are gone anyway, at what point does deferred maintenance become negligence?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [DBCrypto](https://x.com/DBCrypt0/status/2055242396166934630), [CCN](https://www.ccn.com/news/crypto/thorchain-bitcoin-ether-insolvency/), [CoinDesk](https://www.coindesk.com/tech/2025/04/07/the-blockchain-fueling-north-korea-s-massive-crypto-laundering-operation), [ZachXBT](https://x.com/zachxbt/status/1966415195137519909), [Amb Crypto](https://ambcrypto.com/thorchain-exploit-hits-bitcoin-ethereum-and-bsc-hackers-steal-over-10-mln/), [CryptoTimes](https://www.cryptotimes.io/2026/05/17/10-8-million-drained-inside-the-thorchain-exploit-that-froze-cross-chain-defi-for-13-hours/), [TRM Labs](https://www.trmlabs.com/resources/blog/thorchain-exploit-drains-usd-11m-across-at-least-nine-chains-what-trm-knows-now), [THORSwap](https://x.com/THORSwap/status/2055247705686106434), [banteg](https://x.com/banteg/status/2055231991507800334), [THORChain](https://x.com/THORChain/status/2055376254514196749), [Fireblocks](https://www.fireblocks.com/blog/gg18-and-gg20-paillier-key-vulnerability-technical-report), [verichains](https://verichains.io/tsshock/), [Charles Guillemet](https://x.com/P3b7_/status/2055300824708882933), [Tayvano](https://x.com/tayvano_/status/2055292850557063604), [jpthor](https://x.com/jpthor/status/2055272391513899508), [QuillAudits](https://x.com/QuillAudits_AI/status/2056770026229874867), [Chainalysis](https://x.com/chainalysis/status/2055445398550958438), [ImmuneFi](https://medium.com/immunefi/thorchain-joins-immunefi-with-500-000-bug-bounty-52a5ddcb2713), [Luke Parker](https://x.com/kayabaNerve/status/1854917027778945159), [Trail of Bits](https://blog.trailofbits.com/2021/12/21/disclosing-shamirs-secret-sharing-vulnerabilities-and-announcing-zkdocs/), [Halborn](https://www.halborn.com/audits/thorchain-rujira), [crypto.news](https://crypto.news/thorchain-core-dev-leaves-after-failed-vote-to-block-hacker-transactions/)_

**[ZachXBT saw it first](https://t.me/investigations/319).**  
  

**Early on May 15, [his Telegram channel posted a community alert](https://t.me/investigations/319):** THORChain was likely exploited on Bitcoin, Ethereum, BSC, Base for $10.7M+.  
  
[TRM Labs would later expand the confirmed scope to at least nine chains](https://www.trmlabs.com/resources/blog/thorchain-exploit-drains-usd-11m-across-at-least-nine-chains-what-trm-knows-now) - adding Avalanche, Dogecoin, Litecoin, Bitcoin Cash, and XRP to the initial four - and revise total losses upward past $11 million.  
  

[Arkham labeled](https://intel.arkm.com/explorer/entity/thorchain-exploiter) the exploiter wallet.  
  
**But, the drain was already done.**  
  

_**[PeckShield confirmed it publicly](https://x.com/PeckShieldAlert/status/2055226411125027171):** ~$10M drained, including 36.75 BTC and roughly $7M in assets across BNB Chain, Ethereum, and Base._ 
  

THORChain's own infrastructure moved before the team did.  
  
[THORChain's Mimir governance module flipped trading halt](https://www.coindesk.com/tech/2026/05/15/thorchain-halts-trading-after-usd10-million-cross-chain-exploit-rune-token-drops-12) and signing halt parameters to active, with a node pause running for [approximately 12 hours and 42 minutes from block 26190429](https://t.me/thorchain_alert/44623).  
  
No human had to make the call.

  
_**Over 5 hours after [ZachXBT’s announcement](https://t.me/investigations/319), THORChain [posted an official statement confirming what on-chain data had already made plain](https://x.com/THORChain/status/2055300162331742233):** One of six Asgard vaults had been compromised. $10.7 million gone._  
  
**[Node operators securing the affected vault had their bonded RUNE slashed as a consequence](https://x.com/THORChain/status/2055300162331742233) of the unauthorized outbound transactions. Churn paused. Chain onboarding delayed indefinitely. Initial indications show no individual user swaps were affected.**

  


[THORSwap and Metro.exchange halted THORChain routing immediately.](https://x.com/THORSwap/status/2055247705686106434)
  
[Maya Protocol paused](https://x.com/THORSwap/status/2055247705686106434) out of precaution.

[ATOM trading](https://x.com/THORSwap/status/2055247705686106434) went dark.  

  
_[Alternative providers](https://x.com/THORSwap/status/2055247705686106434) - Chainflip, NEAR Intents, Harbor, Flashnet, Garden, 1inch - [kept running, unaffected](https://x.com/THORSwap/status/2055247705686106434)._  
  
**While the ecosystem scrambled, the on-chain record was already telling a different story.**  
  

**Among the earliest signals pointing toward the why:** [banteg flagged a GitLab commit to THORNode](https://x.com/banteg/status/2055231991507800334), authored May 6 - nine days before the exploit - titled ["sign full ObservedTx wrapper to prevent proposer forgery."](https://gitlab.com/thorchain/thornode/-/commit/af46db22bdfe0c6ce9ec5ee9f4178442318d8eff)  
  
A patch existed. It had a name and a timestamp. It had never shipped.  
  
**The commit would prove to be one thread in a larger fabric of deferred maintenance, not the root cause, but an early indicator of the gap between what was known and what was acted on.**

  

_Nine days separated a committed patch from a $10.7 million loss - so who, exactly, is responsible for what lives in that gap?_  
  
### One Node, One Key, One Sweep  
  
_[THORChain's vaults are secured by Threshold Signature Scheme, TSS, a form of Multi-Party Computation](https://dev.thorchain.org/bifrost/tss.html) where a quorum of nodes jointly produce a cryptographic signature without any single node ever holding the complete private key._  
  
**On paper, distributed trust. In practice, only as strong as every co-signer in the quorum.**  
  

The setup started weeks before the drain. A freshly created Discord handle - "Dinosauruss" - [joined the THORChain Developer Discord on May 1](https://thorchain.org/blog/thorchain-exploit-report-1), asking questions about how to get a node churned into the network as quickly as possible.  
  
[The normal three-day churn interval was delayed due to unrelated reasons](https://thorchain.org/blog/thorchain-exploit-report-1), forcing the attacker to wait. On May 13, two days before the exploit, a brand-new node operator with approximately 635,000 RUNE across two bond addresses churned into the active validator set and was randomly assigned to one of the five vaults.  
  
[Over the following two days](https://thorchain.org/blog/thorchain-exploit-report-1), the node participated in routine GG20 signing ceremonies, getting everything it needed.  
  

_**[THORChain's confirmed finding](https://thorchain.org/blog/thorchain-exploit-report-1):** The attacker exploited a vulnerability in the GG20 TSS implementation that allowed sensitive key material from vault participants to leak over time._  
  
**[By accumulating enough leaked material across signing rounds](https://thorchain.org/blog/thorchain-exploit-report-1), the attacker reconstructed the vault's full TSS private key and executed unauthorized outbound transactions directly.**  
  
The proactive solvency checker checks for insolvency before signing. There was no signing to catch. [The reactive checker fired when the vault came up short](https://thorchain.org/blog/thorchain-exploit-report-1), by then the funds were already gone.  
  
The solvency checker functioned as designed. [The attack simply went around the layer it monitors](https://thorchain.org/blog/thorchain-exploit-report-1).  
  
To understand why the attacker could reconstruct the key in the first place, you have to understand what THORChain was running.

  

_[GG20 is a widely used protocol for threshold ECDSA](https://www.fireblocks.com/blog/gg18-and-gg20-paillier-key-vulnerability-technical-report), which is commonly used in systems that interact with Bitcoin and Ethereum._  
  
**It also has a documented history of critical vulnerabilities.** 
  
[CVE-2023-33241](https://www.fireblocks.com/blog/gg18-and-gg20-paillier-key-vulnerability-technical-report) and [TSSHOCK](https://verichains.io/tsshock/), both disclosed in 2023, are key extraction attacks requiring only one compromised co-signer to reconstruct the full private key - silently, without triggering an abort, leaving no trace in normal protocol operation.  
  
The specific mechanism used against THORChain has not been publicly confirmed to match either CVE, but both illustrate the class of attack the library is vulnerable to.  
  
[THORChain's TSS runs on a fork of Binance's tss-lib](https://gitlab.com/thorchain/tss/tss-lib) implementing GG20.  
  
_**That fork, [as Taylor Monahan noted shortly after the exploit was flagged](https://x.com/tayvano_/status/2055292850557063604):** "Oh dear it appears THORChain was running tss-lib that was like 3 years and 2+ major security releases behind."_

  

**[banteg published the most detailed technical analysis the day after the exploit](https://banteg.xyz/posts/thorchain-tss-lib/), examining THORChain's deployed fork directly, tss-lib v0.1.6 at commit 287e1e2, as used by thornode v3.18.0.**  
  
**[His finding](https://banteg.xyz/posts/thorchain-tss-lib/):** The key-generation path accepts and persists peer Paillier material without the MOD/FAC proof family that establishes a well-formed two-prime Paillier modulus.  
  
[A malicious node could therefore register a 2048-bit Paillier modulus](https://banteg.xyz/posts/thorchain-tss-lib/) that passes every check the library performs while containing attacker-known factors.  
  
[Once that malformed key is persisted by honest nodes](https://banteg.xyz/posts/thorchain-tss-lib/), every signing round that touches it exposes the oracle shape in the examined code, leaking residues of other participants' long-term signing shares that an attacker could accumulate and combine offline.  
  
_[His harness tests confirmed the oracle shape](https://banteg.xyz/posts/thorchain-tss-lib/) in the examined code._  
  
**[jpthor had called this early](https://x.com/jpthor/status/2055272391513899508), flagging GG20 as the most likely explanation within hours of the halt.**  
  
[Charles Guillemet framed the broader structural problem](https://x.com/P3b7_/status/2055300824708882933): In every published GG18 and GG20 attack, one malicious or compromised co-signer is enough.  
  
Not a majority, not a quorum, one.  
  
The whole premise of distributed key security collapses at the co-signer layer if a single participant is malicious.  
  
_[jpthor has since laid out a three-step roadmap](https://x.com/jpthor/status/2056905414206480764): Patch GG20 to get THORChain back online; migrate all ECDSA protocols to DKLS; then migrate Bitcoin signing to FROST._  
  
**[His framing of GG20 as a "black box" with "many brittle assumptions"](https://x.com/jpthor/status/2056905414206480764) that will "forever be a bit of a black box" is as close to an internal admission as exists in the public record.**  
  
[THORChain had engaged Silence Labs in November 2025 to build a custom DKLS implementation](https://thorchain.org/blog/thorchain-exploit-report-1) with a targeted delivery of Q1/Q2 2026, the reason GG20 was still in production at the time of the exploit. That work hadn't landed.  
  

[THORChain's churning mechanism](https://dev.thorchain.org/mimir.html?highlight=churn#churning), the process by which validators rotate in and out of active Asgard vaults on a regular schedule, is what made this possible.  
  
Without it, there is no path for a malicious operator to join a vault, participate in signing ceremonies, and accumulate key material. The attacker didn't need to break the cryptography. They just needed to get inside the room.  
  
_[The investigation continues](https://x.com/THORChain/status/2055376254514196749) alongside THORSec and Outrider Analytics._  
  
**[Law enforcement has been contacted.](https://x.com/THORChain/status/2055376254514196749) The attacker's identity remains unknown.**  
  
[An exploit report was published on May 20th](https://thorchain.org/blog/thorchain-exploit-report-1). A follow-up report will be issued once the investigation is complete and the recovery plan has been finalized.  
  
What is known is the node address, the [on-chain links between bonding wallets and receiving wallets](https://x.com/THORChain/status/2055376254514196749), and the confirmed mechanism - a cryptographic library years out of date, running on a fork that contained an implementation flaw capable of leaking vault key material to a single patient, malicious operator.  
  
**Malicious Node:**
[thor16ucjv3v695mq283me7esh0wdhajjalengcn84q](https://thorchain.net/node/thor16ucjv3v695mq283me7esh0wdhajjalengcn84q)

**THORChain's churning mechanism exists to rotate trust, someone used it to buy time instead.**  
  
_So how many other GG20-based vaults across DeFi are sitting on the same unpatched library, waiting for the next patient operator?_

  

### Swept Clean

  
_Multiple chains, dozens of tokens, one address._  
  

**Whoever did this knew exactly where everything was and moved with a precision that doesn't suggest improvisation.** 
  
Every ERC-20 token across Ethereum, BNB Chain, and Base was funneled into attacker-controlled addresses before the network halt had fully propagated. The Bitcoin moved in parallel.  
  
[By the time ZachXBT posted his alert](https://t.me/investigations/319), the consolidation was already complete.  
  

[QuillAudits published a full chain-by-chain breakdown](https://x.com/QuillAudits_AI/status/2056770026229874867) on May 19.  
  
_The drain broke down as follows…_  
  

**Malicious Actions on Ethereum**  
  
**[Stablecoins, blue-chip DeFi tokens, and protocol-native assets drained from the vault](https://x.com/QuillAudits_AI/status/2056770038011764885):**

  
_1,756,756.02 USDT · 1,261,986.53 USDC · 73,768,463.86 XRUNE · 3,349,323.54 THOR · 5.206 WBTC · 64,138.47 LUSD · 61,074.86 GUSD · 38,762.45 USDP · 1,044.06 LINK · 4,567.54 DAI · 78.10 AAVE · 1,514.92 SNX · 481,996.68 FOX · 1.057 YFI · 11.43 DPI_

  
**Attacker Address:**  
[0x82fc0d5150f3548027e971ec04c065f3c93154eb](https://etherscan.io/address/0x82fc0d5150f3548027e971ec04c065f3c93154eb)

**THORChain Vault:**  
[0x82a5CF67F3e6970C0529122178075C0a94878bDA](https://etherscan.io/address/0x82a5CF67F3e6970C0529122178075C0a94878bDA)  
  
**Transfer Out Transactions:**  
[View all on Etherscan](https://etherscan.io/advanced-filter?tadd=0x82fc0d5150f3548027e971ec04c065f3c93154eb&txntype=2&ps=100)  
  
**Funds were sent here (~$6.77 Million):**  
[0xd477b69551f49C0519F9B18c55030676138890Bd](https://etherscan.io/address/0xd477b69551f49c0519f9b18c55030676138890bd)

**Malicious Actions on BNB**  
  
**[A diverse basket of tokens including stablecoins](https://x.com/QuillAudits_AI/status/2056770044181586197), wrapped BTC, and ETH equivalents were drained:**  
  

_274,256.09 USDC · 125,117.17 BSC-USD · 32,144.23 BUSD · 32,980.44 TWT · 15.615 ETH · 0.509 BTCB_  
  

**Attacker Address:**  
[0x82fc0d5150f3548027e971ec04c065f3c93154eb](https://bscscan.com/address/0x82fc0d5150f3548027e971ec04c065f3c93154eb)

  
**THORChain Vault:**  
[0x82a5cf67f3e6970c0529122178075c0a94878bda](https://bscscan.com/address/0x82a5cf67f3e6970c0529122178075c0a94878bda)

  
**Transfer Out Transactions:**
[View all on BSCscan](https://bscscan.com/advanced-filter?fadd=0x82fc0d5150f3548027e971ec04c065f3c93154eb&tadd=0x82Fc0d5150F3548027e971eC04c065f3c93154Eb&txntype=2&mtd=0x574da717%7eTransfer+Out)

  
**Malicious Actions on Bitcoin**

  
**[Two outbound transactions totaling over 40 BTC (~$3.26M)](https://x.com/QuillAudits_AI/status/2056770041203532103):**

  
_36.85351435 BTC · 3.87429558 BTC_

  
**Attacker Address:**  
[bc1ql4u94klk265lnfur2ujk9p6uh52f2a8jhf6f37](https://mempool.space/address/bc1ql4u94klk265lnfur2ujk9p6uh52f2a8jhf6f37)

  
**THORChain Vault:**  
[bc1qt8f467qdkpmuflgwvgvvlr86r0kldnnvm7zhyv](https://mempool.space/address/bc1qt8f467qdkpmuflgwvgvvlr86r0kldnnvm7zhyv)

  
**Transfer Out Transactions:**  
[View all on mempool.space](https://mempool.space/address/bc1ql4u94klk265lnfur2ujk9p6uh52f2a8jhf6f37) (scroll down to transactions)

  
**Malicious Actions on Avalanche** 
  

**[Avalanche stablecoins and SOL equivalent assets drained](https://x.com/QuillAudits_AI/status/2056770047385944347):**

  
_238,325.94 USDC · 43,041.25 USDT · 388.94 SOL_

  
**Attacker Address:**  
[0xd477b69551f49C0519F9B18c55030676138890Bd](https://snowtrace.io/address/0xd477b69551f49C0519F9B18c55030676138890Bd/tokentxns)

**THORChain Vault:**  
[0x82A3580296b014c27cFe6be23Ed471c30D878Bda](https://snowtrace.io/address/0x82A3580296b014c27cFe6be23Ed471c30D878Bda)

  
**Transfer Out Transactions:**  
[0xd477b69551f49C0519F9B18c55030676138890Bd](https://snowtrace.io/address/0xd477b69551f49C0519F9B18c55030676138890Bd/tokentxns?direction=sent)

  
**Malicious Actions on Base**  
  

**[USDC drained in a single outbound transaction](https://x.com/QuillAudits_AI/status/2056770060451246590):**

  
_55,912.41 USDC_

  
**Attacker Address:**  
[0xd477b69551f49C0519F9B18c55030676138890Bd](https://basescan.org/address/0xd477b69551f49c0519f9b18c55030676138890bd)

  
**THORChain Vault:**  
[0x82a5cf67f3e6970c0529122178075c0a94878bda](https://basescan.org/address/0x82a5cf67f3e6970c0529122178075c0a94878bda)

  
**Single Drain Transaction:** [0x4370739cf3f443fe129727ea1a9e215783d881c643f3ea1d12ce822aeb3e6af8](https://basescan.org/tx/0x4370739cf3f443fe129727ea1a9e215783d881c643f3ea1d12ce822aeb3e6af8)

  
**Malicious Actions on Dogecoin**  
  

**[Nearly 7.82M DOGE drained across two near-identical outbound transactions (~$900K)](https://x.com/QuillAudits_AI/status/2056770050586243405):**

  
_3,911,749.91 DOGE · 3,911,751.03 DOGE_

  
**Attacker Address:**  
[DBLJWFemMHbduKofBRg6TJ9XFAgWdvFCjS](https://blockchair.com/dogecoin/address/DBLJWFemMHbduKofBRg6TJ9XFAgWdvFCjS)

  
**THORChain Vault:**  
[DDL3tEh5P5vjSCNyU7t7sz9DQykRnr97d2](https://blockchair.com/dogecoin/address/DDL3tEh5P5vjSCNyU7t7sz9DQykRnr97d2)

  
**Transfer Out Transactions:**
[View on BlockChair](https://blockchair.com/dogecoin/address/DBLJWFemMHbduKofBRg6TJ9XFAgWdvFCjS#history)

**Malicious Actions on Litecoin**

  
**[LTC drained from the vault](https://x.com/QuillAudits_AI/status/2056770054700814757):**  
  

_6,866.74772083 LTC_

  
**Attacker Address:**  
[ltc1qg0h4rz5kf27fkr99gamw4heg20rfz5epd7m7wh](https://blockexplorer.one/litecoin/mainnet/address/ltc1qg0h4rz5kf27fkr99gamw4heg20rfz5epd7m7wh)

  
**THORChain Vault:**  
[ltc1qt8f467qdkpmuflgwvgvvlr86r0kldnnvlzcnuu](https://blockexplorer.one/litecoin/mainnet/address/ltc1qt8f467qdkpmuflgwvgvvlr86r0kldnnvlzcnuu)

  
**Single Drain Transaction:**
[F5985741ef6d7418cd2f0f4e909b6f0d525f18c6010cca48d846731f23972bd4](https://blockexplorer.one/litecoin/mainnet/tx/f5985741ef6d7418cd2f0f4e909b6f0d525f18c6010cca48d846731f23972bd4)

**Malicious Actions on Bitcoin Cash**  
  

**[BCH moved out of the vault in a single transaction](https://x.com/QuillAudits_AI/status/2056770057636806920):**  
  

_638.52948245 BCH_

  
**Attacker Address:**  
[qpp775v2je9texcv54rhd6kl9pfudy2nyyz4df2uvc](https://blockchain.com/explorer/addresses/bch/qpp775v2je9texcv54rhd6kl9pfudy2nyyz4df2uvc)

  
**THORChain Vault:**  
[qpvaxhtcpkc8038ape3p3nuvlgd7makwds74qyng5p](https://blockchain.com/explorer/addresses/bch/qpvaxhtcpkc8038ape3p3nuvlgd7makwds74qyng5p)

  
**Transfer Out Transactions:**  
[View on Blockchain](https://www.blockchain.com/explorer/addresses/bch/qpp775v2je9texcv54rhd6kl9pfudy2nyyz4df2uvc)

  
**Malicious Actions on XRP**

  
**[XRP drained across two transactions](https://x.com/QuillAudits_AI/status/2056770063588544754):**

  
_25,404.922305 XRP · 16.999982 XRP_

  
**Attacker Address:**  
[rwoGBrYEJ28jhBjchrTyCGXd1Pt4pobFBz](https://xrpscan.com/account/rwoGBrYEJ28jhBjchrTyCGXd1Pt4pobFBz)

  
**THORChain Vault:**  
[r9BxLykSngpSuUU4jXtZLDycXip3Suo7Rf](https://xrpscan.com/account/r9BxLykSngpSuUU4jXtZLDycXip3Suo7Rf)

  
**Transfer Out Transactions:**  
[View on XRPScan](https://xrpscan.com/account/rwoGBrYEJ28jhBjchrTyCGXd1Pt4pobFBz)

**Malicious Actions on TRON**  
  

_[89,172 TRX swapped to 31,215 USDT via SunSwap,](https://tronscan.org/#/transaction/0ee50dd1af24c08a2f73fab18dd96897fcd6c08cfca0a6397b519c8fe1fdf1f4) bridged to Ethereum - 13.9 ETH delivered to the known ETH laundering hub._
  
[TRON signing, trading, and solvency checks halted and disabled in Mimir](https://thornode.thorchain.network/thorchain/mimir), matching the pattern of the confirmed drained chains.

  
**Attacker Address:**  
[TXmo5sdVCvQnJgbvjAUpQJfyNx5EnqtAM3](https://tronscan.org/#/address/TXmo5sdVCvQnJgbvjAUpQJfyNx5EnqtAM3)

  
**THORChain Vault:**
[TMt1UgzBNKETQMgGckJDomcMQhvwhGUiXo](https://tronscan.org/#/address/TMt1UgzBNKETQMgGckJDomcMQhvwhGUiXo)

  
**TRON Drain Transaction:**  
[0ee50dd1af24c08a2f73fab18dd96897fcd6c08cfca0a6397b519c8fe1fdf1f4](https://tronscan.org/#/transaction/0ee50dd1af24c08a2f73fab18dd96897fcd6c08cfca0a6397b519c8fe1fdf1f4)

  
**ETH Delivery:**  
[0x09c4bc73fddaac5697a609cb448cefc26e13ccba22ce1b762b309b010e0db5f4](https://etherscan.io/tx/0x09c4bc73fddaac5697a609cb448cefc26e13ccba22ce1b762b309b010e0db5f4)

  
**Funds sent to Ethereum Address:**  
[0x82fc0d5150f3548027e971ec04c065f3c93154eb](https://etherscan.io/address/0x82fc0d5150f3548027e971ec04c065f3c93154eb)  
  
_[THORChain's official statement confirmed that node operators securing the compromised vault had their bonded RUNE slashed](https://x.com/THORChain/status/2055300162331742233) as a direct consequence of the unauthorized outbound transactions._  
  
**Protocol-owned funds were lost. [Per the team's initial assessment, no individual user swaps were affected.](https://x.com/THORChain/status/2055300162331742233) The slashing mechanism worked. The vault did not.**  
  

The exploit looked sudden, but it wasn't.  
  
[Chainalysis published a five-part thread on May 15](https://x.com/chainalysis/status/2055445398550958438), mapped weeks of preparatory activity [beginning in late April](https://x.com/chainalysis/status/2055445399998021963) - the attacker funding the entry [through Monero, bonding RUNE for the node that became the attack vector](https://x.com/chainalysis/status/2055445399998021963), and [delivering 8 ETH to the final receiving wallet just 43 minutes before the drain](https://x.com/chainalysis/status/2055445401591849139).

  
**Multiple chains. One patient operator. Three weeks of preparation. The network halted itself the moment something looked wrong. By then, the attacker was done.**  
  
_What does it mean when the best thing about your security is how quickly it confirms the damage?_

  
### Audited, Just Not There

  

_THORChain has auditors._  
  
**[It launched a bug bounty program with ImmuneFi after the 2021 exploits](https://medium.com/immunefi/thorchain-joins-immunefi-with-500-000-bug-bounty-52a5ddcb2713), later [departing ImmuneFi under disputed circumstances](https://x.com/kayabaNerve/status/1854917027778945159) in favor of a self-hosted program, which was itself [retired in March 2026](https://gitlab.com/thorchain/thornode/-/merge_requests/3716), two months before the exploit.**  
  
It has a history of taking security seriously enough to hire both Halborn and Trail of Bits after the 2021 carnage, [completing a five-pronged recovery plan](https://medium.com/thorchain/post-mortem-eth-router-exploits-1-2-and-premature-return-to-trading-incident-2908928c5fb) that included red-teaming, protocol hardening, and formal audit sign-off before relaunching.  
  

None of that is in question. What is in question is where the audits were pointed.

  
After the 2021 exploits, [Trail of Bits conducted a full code audit](https://github.com/thorchain/Resources/blob/master/Audits/THORChain-TrailOfBits-FullAudit-Aug2021.pdf) of THORChain's core protocol - THORNode, the Bifrost bridge code, and crucially, the tss-lib implementation underpinning the TSS vault system.  
  
_[Halborn ran a separate penetration testing engagement](https://gitlab.com/thorchain/thornode/-/issues/1010) covering the THORNode stack, Bifrost, and vault security - including a review of the threshold multisig implementation._  
  
**[Both returned passing grades.](https://medium.com/thorchain/thorchains-layers-of-security-e308d537acf1) No unresolved critical vulnerabilities at time of issuance.**
  
In December 2021, Trail of Bits went further, [disclosing Shamir's Secret Sharing vulnerabilities in tss-lib](https://blog.trailofbits.com/2021/12/21/disclosing-shamirs-secret-sharing-vulnerabilities-and-announcing-zkdocs/) that affected THORChain directly.  
  
THORChain patched it. The protocol relaunched. The audits aged.  
  

Since then, Halborn has remained active, conducting eight separate security assessments between January and November 2025.  
  
_**[Every single one was scoped to Rujira](https://www.halborn.com/audits/thorchain-rujira), THORChain's smart contract application layer:** Lending contracts, order book DEX, staking modules, lending pools._  
  
**Useful work. Necessary work. Work that had nothing to do with the layer that just lost $10.7 million.**  
  

**2020 - Early Security Work:**  
  
_[CertiK · Apr 2020 · THORChain code review](https://github.com/thorchain/Resources/blob/master/Audits/THORChain-Certik-CodeReview-Mar2020.pdf)_  
  

_[Kudelski Security · Jun 2020 · THORChain TSS](https://github.com/thorchain/Resources/blob/master/Audits/THORChain-Kudelski-TSS-Audit-June2020.pdf)_

_[IOActive · Nov 2020 · penetration test](https://github.com/thorchain/Resources/blob/master/Audits/THORChain-IOActive-PenetrationTest-Nov2020.pdf)_  
  

  
**2021 - Core Protocol:**  
  

_[Trail of Bits · Aug 2021 · THORChain core + tss-lib](https://github.com/thorchain/Resources/blob/master/Audits/THORChain-TrailOfBits-FullAudit-Aug2021.pdf)_

  
_[Halborn · Sep 2021 · TSS audit](https://github.com/thorchain/Resources/blob/master/Audits/Halborn-TSS-Audit-Sep2021.pdf)_

  
_[Halborn · Sep 2021 · State machine, Router + Bifrost](https://github.com/thorchain/Resources/blob/master/Audits/Halborn-StateMachine-Router-Bifrost-Audit-Sep2021.pdf)_

_[Trail of Bits · Dec 2021 · tss-lib Shamir's Secret Sharing - vulnerability disclosure (patched)](https://blog.trailofbits.com/2021/12/21/disclosing-shamirs-secret-sharing-vulnerabilities-and-announcing-zkdocs/)_

  

**2024/2025 -Bifrost observation layer:**  
  

_[Zellic · Nov 2024 · THORChain Bifrost](https://github.com/thorchain/Resources/blob/master/Audits/THORChain%20Bifrost%20-%20Zellic%20Audit%20Report%20Draft.pdf)_

_[Zellic · Jan 2025 · THORChain Bifrost UTXO Client](https://github.com/thorchain/Resources/blob/master/Audits/THORChain%20Bifrost%20UTXO%20Client%20-%20Zellic%20Audit%20Report.pdf)_

  
**2025 - Rujira application layer only:**  
  

_[Halborn · Jan-Feb 2025 · Rujira Trade (FIN) smart contracts](https://www.halborn.com/audits/thorchain-rujira/ruji-trade-fin-4604e5)_

_[Halborn · Feb 2025 · Rujira Pools (BOW) smart contracts](https://www.halborn.com/audits/thorchain-rujira/ruji-pools-bow-19e51f)_

_[Halborn · Mar-Apr 2025 · Rujira Staking smart contracts](https://www.halborn.com/audits/thorchain-rujira/rujira-staking-319044)_

_[Halborn · May 2025 · NAMI Protocol Rujira Index Product](https://www.halborn.com/audits/thorchain-rujira/nami-protocol-rujira-index-product-0612c8)_

_[Halborn · Aug 2025 · CALC Manager/Scheduler/Strategy smart contracts](https://www.halborn.com/audits/thorchain-rujira/calc---managerschedulerstrategy-85fd22)_

_[Halborn · Oct 2025 · Ghost Vault (RUJI Lending) smart contracts](https://www.halborn.com/audits/thorchain-rujira/ruji-lending-48bc98)_

_[Halborn · Oct-Nov 2025 · Ghost Credit (Credit Accounts) smart contracts](https://www.halborn.com/audits/thorchain-rujira/credit-accounts-21860f)_

_[Halborn · Nov 2025 · Rujira Trade FIN v1.1 smart contracts](https://www.halborn.com/audits/thorchain-rujira/ruji-trade-fin-v11-9d7ca3)_

The GG20 tss-lib fork specifically, the cryptographic implementation at the center of this exploit, [has not had a documented audit since 2021](https://github.com/thorchain/Resources/tree/master/Audits). The broader THORChain codebase has seen more recent attention, but none of it touched this layer.  
  

_Bifrost received more recent attention, with [Zellic auditing the observation layer](https://github.com/thorchain/Resources/blob/master/Audits/THORChain%20Bifrost%20-%20Zellic%20Audit%20Report%20Draft.pdf) and a [Code4rena contest in 2024 covering the EVM smart contract parsing logic](https://github.com/code-423n4/2024-06-thorchain)._  
  
**But the cryptographic library at the center of this exploit, [which Taylor Monahan noted was running years behind on security releases](https://x.com/tayvano_/status/2055292850557063604),last saw formal review before the critical vulnerabilities in that codebase were publicly known.**  
  
None of the 2025 assessments touched it.  
  

[TSSHOCK](https://verichains.io/tsshock/) and [CVE-2023-33241](https://www.fireblocks.com/blog/gg18-and-gg20-paillier-key-vulnerability-technical-report), the two major GG20 vulnerabilities, were both disclosed in 2023.  
  
_[The Trail of Bits audit that covered tss-lib](https://github.com/thorchain/Resources/blob/master/Audits/THORChain-TrailOfBits-FullAudit-Aug2021.pdf) predates both disclosures._  
  
**The protocol kept running on the same library, through two publicized critical bugs, without a documented re-audit of that specific component.**  
  

**To be clear:** Audits are point-in-time assessments. They prove what they're asked to prove, within the scope they're given, at the moment they're conducted.  
  
Halborn didn't miss the GG20 vulnerabilities in 2021, those vulnerabilities weren't public yet.  
  
What's harder to explain is the absence of any follow-up audit of the core protocol layer after they were.  
  

**Eight audits in 2025, all pointed at the application layer, and the cryptographic foundation holding the vaults hadn't been formally reviewed since before the vulnerabilities in it were publicly known.**  
  
_Who decided that was an acceptable posture?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)






_THORChain has survived everything._  
  
**Two exploits in ten days in 2021. A [$200 million insolvency crisis](https://www.ccn.com/news/crypto/thorchain-bitcoin-ether-insolvency/) that looked, briefly, like a death spiral. [$1.2 billion in North Korean laundering](https://www.coindesk.com/tech/2025/04/07/the-blockchain-fueling-north-korea-s-massive-crypto-laundering-operation) that split its own community in half and drove out core contributors.**  
  
It absorbed every hit, restructured, kept the DEX running, and called it resilience.

  
What it never fully absorbed was the lesson underneath each one.

  
_The cryptographic library securing the vaults [was years behind on security releases](https://x.com/tayvano_/status/2055292850557063604)._  
  
**The last audit of the core protocol predates the public disclosure of the vulnerabilities now under investigation.**  
  
And yet eight audits shipped in 2025, every one of them pointed somewhere else.  
  

Shortly after the exploit, [fake refund portals were circulating](https://x.com/THORChain/status/2055593187922587697), scammers targeting the same users who had just watched their funds disappear.  
  
_**By May 18, [THORChain was forced to issue an explicit public warning](https://x.com/THORChain/status/2056281493735944519):** There is no refund portal. Please rely only on official channels._  
  
**[That warning remains live on the top banner](https://thorchain.org/) of THORChain's own website.**  
  
A protocol that lost $10.7 million to a patient, sophisticated attacker spent the following day fighting off opportunists harvesting its own victims.  
  

[The investigation continues alongside THORSec and Outrider Analytics](https://x.com/THORChain/status/2055376254514196749), with law enforcement engaged.  
  
[An initial exploit report was published on May 20.](https://thorchain.org/blog/thorchain-exploit-report-1) A follow-up report is pending. No compensation plan exists so far.  
  
The governance vote on how to handle losses, ADR-028, [has not yet concluded](https://thorchain.org/blog/thorchain-exploit-report-1).  
  

_No timeline has been given for a full network restart._  
  

**The protocol that [laundered $1.2 billion for North Korea earned at least $12 million in fees from it](https://www.coindesk.com/tech/2025/04/07/the-blockchain-fueling-north-korea-s-massive-crypto-laundering-operation), a [conservative estimate per Chainalysis](https://www.coindesk.com/tech/2025/04/07/the-blockchain-fueling-north-korea-s-massive-crypto-laundering-operation), and called that neutrality.**  
  
Node operators initially voted to halt ETH trading when Lazarus came through. [The vote was reversed within minutes](https://crypto.news/thorchain-core-dev-leaves-after-failed-vote-to-block-hacker-transactions/).  
  
[A core contributor resigned.](https://crypto.news/thorchain-core-dev-leaves-after-failed-vote-to-block-hacker-transactions/) The network kept running.  
  
Then on May 15, THORChain's own vault was drained, and the same protocol that found a philosophical reason not to halt for Lazarus found a technical one to halt itself in twelve hours and forty-two minutes.

  
**That contrast hasn't gone unnoticed.**  
  
_**[The question being asked loudly across the ecosystem](https://www.cryptotimes.io/2026/05/17/10-8-million-drained-inside-the-thorchain-exploit-that-froze-cross-chain-defi-for-13-hours/):** If THORChain has an emergency shutdown capability, why has it historically been deployed only when the protocol's own assets are at risk, and not when it was processing hundreds of millions in stolen funds for state-sponsored hackers?_  
  
Whether that reflects a genuine architectural distinction or a selective application of decentralization principles is a conversation THORChain can no longer defer.  
  

THORChain will likely survive this too. It has before, against longer odds.  
  
But survival and accountability are different things, and so far this protocol has been far better at the first than the second.

  
**THORChain halted for North Korea when it had no choice. It will rebuild from this because it always does.**  
  
_But at what point does resilience stop being a virtue and start being an excuse?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
