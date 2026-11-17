---
tags:
  - type/hack
  - blockchain/bitcoin
  - blockchain/ethereum
  - web3-sector/bridge
  - web3-sector/privacy
  - web3-sector/stable
  - vector/bridge-exploit
title: "VerusCoin - Rekt"
protocol: "VerusCoin"
date: 2026-07-22
loss_usd: 7540000
audit: "N/A"
source: "https://rekt.news/veruscoin-rekt"
excerpt: "A second exploit drained VerusCoin's Ethereum Bridge for $7.54 million, following a similar $11.6 million hack in May - same bridge, a different gap in the same broken trust boundary. This time there "
---
# VerusCoin - Rekt

> **Loss:** $7,540,000 | **Date:** 2026-07-22 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/veruscoin-rekt-header.png)






_[$7.54 million left the Verus-Ethereum Bridge on July 23rd](https://x.com/blockaid_/status/2080143099561496896), and every signature checked out._

  
**[The notary proofs were genuine](https://x.com/0x3b33/status/2080186487081980391). The state root was genuine. The Merkle path traced back to a real, validly-signed block. [Nothing about the cryptography failed](https://x.com/1nf0s3cpt/status/2080162610444677132).**  
  

**[What failed was the question nobody asked](https://x.com/1nf0s3cpt/status/2080162610444677132):** Did the withdrawal correspond to money that actually existed?  
  

Two months earlier, [the same bridge lost $11.6 million](https://x.com/1nf0s3cpt/status/2080162610444677132) to [the same entry path and the same bug class](https://x.com/blockaid_/status/2080143511173611704).  
  
Back in May, [the team patched what they found](https://x.com/QuillAudits_AI/status/2080297469733441654), and [cut a bounty deal that returned the bulk of the stolen funds](https://x.com/VerusCoin/status/2058171278096228621).  
  

Roughly 2 weeks later, [a different attacker walked through a different door into the same room](https://x.com/blockaid_/status/2080143511173611704).

  
**This time there was no negotiation. This time there was no statement.**  
  

_When a bridge proves a withdrawal is authentic but never proves it's funded, is that a bug, or is that the design?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Blockaid](https://x.com/blockaid_/status/2080143099561496896), [Pyro](https://x.com/0x3b33/status/2080186487081980391), [Sunsec](https://x.com/1nf0s3cpt/status/2080162610444677132), [QuillAudits](https://x.com/QuillAudits_AI/status/2080297469733441654), [VerusCoin](https://x.com/VerusCoin/status/2058171278096228621), [CertiK](https://x.com/CertiKAlert/status/2080153763332174170), [PeckShield](https://x.com/PeckShieldAlert/status/2080161688779972940),  [SlowMist](https://x.com/SlowMist_Team/status/2080192064478724299), [Backward Labs](https://github.com/BackwardLabs/Q1-2026/blob/main/test/2026-07/veruscoin_ethereum_bridge/README.md), [The Block](https://theblock.co/post/409489/new-verus-ethereum-bridge-attack), [DefiLlama](https://defillama.com/chain/verus)_

**Blockaid was [first to the wreckage](https://x.com/blockaid_/status/2080143099561496896).**  
  
**[Blockaid posted](https://x.com/blockaid_/status/2080143099561496896):** "Blockaid detected a VerusCoin Ethereum Bridge exploit on Ethereum. An attacker used the bridge import path to trigger unbacked Ethereum-side payouts, draining ~$7.54M in ETH, tBTC, USDC, USDT, EURC, MKR, and scrvUSD from bridge reserves."

**Blockaid’s [second post drew the line back to May before most people had finished reading the first one:](https://x.com/blockaid_/status/2080143511173611704)**  Same bridge contract, same entry path, same bug class. A different attacker and loot wallet.



_[PeckShield confirmed the drain and flagged something faster than May's timeline](https://x.com/PeckShieldAlert/status/2080161688779972940), the exploiter was already feeding funds into Tornado Cash._

**[QuillAudits drew the sharpest distinction of the morning](https://x.com/QuillAudits_AI/status/2080297458547282353). The attacker hadn't broken a signature or forged a notary key. [They'd gotten a fake withdrawal notarized like a real one](https://x.com/QuillAudits_AI/status/2080297458547282353).**  
  
**[Then came the detail that mattered most](https://x.com/QuillAudits_AI/status/2080297469733441654):** checkCCEValues, the function patched after May, had held. This wasn't the old hole reopened. It was a different gap in the same trust boundary.

  
_**[SlowMist's post carried the only line-level root cause anyone would publish that day](https://x.com/SlowMist_Team/status/2080192064478724299):** VerusProof.checkExportAndTransfers verified hashReserveTransfers against attacker-controlled serializedTransfers, along with the source/destination IDs, but never enforced the CCE’s accounting semantics. it failed to parse or validate totalamounts, totalfees, totalburned, or the CTxOut nValue, nor did it verify that the referenced prior CCE outpoint carried sufficient value and assets to cover the claimed transfers._

**[Backward Labs published the only formal incident report anyone would see](https://github.com/BackwardLabs/Q1-2026/blob/main/test/2026-07/veruscoin_ethereum_bridge/README.md):** The bridge accepted a proven import that authorized multi-asset reserve payouts, violating the invariant that Ethereum bridge reserves may be released only for source-chain reserve transfers whose transfer hash, count, and economic backing are proven under the expected bridge lifecycle.

Verus said nothing, not the day of the exploit and not a peep since.

**[The Block reached out to the team for comment](https://theblock.co/post/409489/new-verus-ethereum-bridge-attack). No word on whether or not they replied.**

_When eight independent security firms can reconstruct your bridge's failure before you've said a word about it, what exactly is the delay buying you?_

### Half a Proof  
  
_To move value from Verus to Ethereum, a user doesn't send a message. They submit a receipt._

**[On Verus, that receipt takes the form of a CrossChainExport output](https://x.com/0x3b33/status/2080186487081980391), a commitment to a specific set of transfers, hashed and embedded in the chain.**  
  
[Notaries attest to a state root containing that export](https://x.com/0x3b33/status/2080186487081980391). The root is relayed to Ethereum, where the bridge contract verifies the signatures, reconstructs the Merkle path, and confirms the export exists inside a notarized block.

**[On Verus, like on Bitcoin, anyone can put any bytes they want in an output script. An export is just a byte pattern, so the contract checks the pattern, not the authority:](https://x.com/0x3b33/status/2080186487081980391)**  It checks whether the output parses as an export with the right source and destination, whether keccak256(serializedTransfers) equals the hash field inside it, and whether one of the transaction’s inputs spends the previous export’s transaction hash.

If those checks pass, [checkExportAndTransfers returns successfully](https://x.com/SlowMist_Team/status/2080192064478724299), and [processTransactions executes the payouts](https://github.com/monkins1010/Verus-Ethereum-contracts/blob/main/contracts/VerusBridge/SubmitImports.sol#L138-L172).

_**What the contract never asks is the only question that matters:** What actually backs the export?_

**[Not totalamounts. Not totalfees. Not totalburned. Not the real nValue of the CTxOut being spent.](https://x.com/SlowMist_Team/status/2080192064478724299) The bridge proves the receipt is real. It never verifies that the receipt is backed by conserved value.**

[On Verus, as with Bitcoin, transaction outputs can carry arbitrary data.](https://x.com/0x3b33/status/2080186487081980391) An export is just a structured byte pattern, and if an attacker controls both the transfer list and the hash that commits to it, the integrity checks pass by construction.

The attacker built both sides.

**Vulnerable Contract:**  
[0x54e03a1682fd0bb065b669f6296f97028dcfd4ce](https://etherscan.io/address/0x54e03a1682fd0bb065b669f6296f97028dcfd4ce/advanced#internaltx)  
  
**Bridge Contract:**  
[0x71518580f36feceffe0721f06ba4703218cd7f63](https://etherscan.io/address/0x71518580f36feceffe0721f06ba4703218cd7f63)

**[Step one was trivial](https://x.com/0x3b33/status/2080186487081980391):** A legitimate 0.01 VRSC transfer through the bridge, just enough to become the most recent export. That satisfies the linkage check of spending from the last export.

_**[Step two was the forgery](https://x.com/QuillAudits_AI/status/2080297461978141106):** A new Verus transaction spent that output and embedded a hand-crafted export, committing to eight transfers, all payable to the attacker-controlled address._

**[The attacker defined the transfers and the hash that supposedly commits to them.](https://x.com/QuillAudits_AI/status/2080297461978141106) The bridge checked the commitment, not the provenance.**

**[Step three required no compromise](https://x.com/0x3b33/status/2080186487081980391):** Two legitimate notarizations (heights 4162938 and 4162957), each signed by eleven notaries, were relayed to Ethereum as usual.  
  
[The forged export simply existed inside a notarized state root](https://x.com/0x3b33/status/2080186487081980391). The bridge proved the export was included in a real block; it did not prove that Verus had actually created it or that it was economically valid.

**[Step four was execution](https://x.com/0x3b33/status/2080186487081980391):** The import submission supplied a valid proof, a valid root, and a matching hash. All checks passed. The bridge paid out.

**May and July are not the same bug at the code level. [checkCCEValues, implicated in the first exploit, held this time. The patch addressed a specific failure mode.](https://x.com/QuillAudits_AI/status/2080297469733441654)**

_**[What it did not change was the assumption one layer above it](https://x.com/SlowMist_Team/status/2080192064478724299):** That a matching hash implies economic backing._

Close one path, and another remains, [because the invariant itself was never enforced](https://github.com/BackwardLabs/Q1-2026/blob/main/test/2026-07/veruscoin_ethereum_bridge/README.md). The system verifies that a receipt exists, that it is included, and that it is internally consistent. [It never verifies that the value it authorizes to leave Ethereum was ever locked on Verus](https://x.com/1nf0s3cpt/status/2080162610444677132).

The bridge has now demonstrated, twice, that it can authenticate a receipt.

**It has yet to demonstrate that the receipt is worth anything.**

_If May's fix eliminated the exact path the first attacker used, and a second attacker still reached the same outcome, was that a fix - or just a description of the previous exploit?_

### Eight Transfers, One Transaction  
  
_Whatever the invariant was supposed to enforce, this is what left the moment it didn't._

**One internal transfer, seven token transfers, all inside a single call - and every one of them sits in public record.**

**Attacker Wallet:**
[0xbda71b58cec0b1c20a8f87ccd52fa0679747855c](https://etherscan.io/address/0xbda71b58cec0b1c20a8f87ccd52fa0679747855c)  
  
**Loot Wallet:**
[0xcfd0a20703cd11e0b9f665e1c3f1ef989c142d54](https://etherscan.io/address/0xcfd0a20703cd11e0b9f665e1c3f1ef989c142d54)  
  
**Exploit Transaction:** [0xa1f1e65c1cea4dba4ae439cd4dcdba6cc2dbda0ed1228e61f29ae9c9324eb099](https://etherscan.io/tx/0xa1f1e65c1cea4dba4ae439cd4dcdba6cc2dbda0ed1228e61f29ae9c9324eb099)

_**[Eight transfers, all in one transaction](https://etherscan.io/tx/0xa1f1e65c1cea4dba4ae439cd4dcdba6cc2dbda0ed1228e61f29ae9c9324eb099):** 1,137.45 ETH, 71.50 tBTC, 149,275 USDC, 92,784 scrvUSD, 78,300 USDT 59.43 MKR, 220,357 DAI, and 31,475 EURC_

**For DAI, the bridge went further, [it drew against its MakerDAO position and minted 220,357 DAI to satisfy the withdrawal](https://x.com/1nf0s3cpt/status/2080162610444677132).**

[Tornado Cash deposits began roughly](https://x.com/0x3b33/status/2080186487081980391) 90 minutes later.

Before the mixer, the basket was consolidated. [tBTC, the stablecoins, MKR, and the freshly minted DAI](https://x.com/0x3b33/status/2080186487081980391) were [converted and into roughly 3,916 ETH](https://theblock.co/post/409489/new-verus-ethereum-bridge-attack), then [laundered through Tornado Cash](https://x.com/PeckShieldAlert/status/2080161688779972940).  
  
One token is easier to move than seven, and harder for any single issuer to freeze in isolation.

_[The deposits ran in escalating sizes, 0.1 ETH, then 1 ETH, then 10, then a long run of 100 ETH transfers,](https://etherscan.io/address/0xcfd0a20703cd11e0b9f665e1c3f1ef989c142d54?tadd=0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b) each one landing in Tornado Cash's router within seconds of the last._  
  
**By the time anyone thought to check the wallet again, [it held about 0.09 ETH](https://etherscan.io/address/0xcfd0a20703cd11e0b9f665e1c3f1ef989c142d54).**

No freeze. No exchange coordination was announced. No recovery address was published.

In May, [the attacker returned 4,052.4 ETH](https://x.com/QuillAudits_AI/status/2080297465086202003) and [kept a 25% bounty](https://x.com/QuillAudits_AI/status/2080297465086202003).  
  
**Whatever calculation made that trade worth it the first time, nothing suggests the July attacker was offered - or considered - the same deal.**

_When laundering takes ninety minutes and negotiation never starts, what exactly is left for a bounty offer to interrupt?_  
  
### Fifteen Days  
  
_In May, Verus had a script for this._  
  
**[VerusCoin redirected people to Discord](https://x.com/VerusCoin/status/2056338938705420339), with Mike Toutonghi, Verus’s lead developer, giving updates.**  
  
**[Bounty terms were posted publicly](https://x.com/VerusCoin/status/2057465214975492358):** [](https://x.com/VerusCoin/status/2056829444124213652) The community offered 1,350 ETH as a bounty in exchange for the return of 4,052.4 ETH within 24 hours of the post.  
  
[By May 23rd, the team confirmed 4,052.4 ETH, roughly 75% of the stolen funds,](https://x.com/VerusCoin/status/2058171278096228621) had been returned to community control.  
  
[By May 28th, the recovered funds had been converted back into their original currencies,](https://x.com/VerusCoin/status/2060041891731628118) ready for reintegration.

_[On July 8, roughly 1,192 ETH moved from the recovery address back into the bridge contract](https://etherscan.io/tx/0x31441634d048239a75ae071149cb01d812689530d75c8ce21b927b1aeaf183a7), part of [Verus’s v1.2.17 bridge restoration and recovery update](https://github.com/VerusCoin/Verus-Desktop/releases/tag/v1.2.17). The rest of the May recovery funds, tBTC and USDC, remained outside that transfer._  
  
**It went back into [the same bridge contract](https://etherscan.io/address/0x71518580f36feceffe0721f06ba4703218cd7f63), where [the patch had addressed only the specific failure mode identified after May](https://x.com/QuillAudits_AI/status/2080297469733441654).**

Fifteen days later, a different attacker found what the patch never touched.

There has been no Discord post this time. No pinned thread. No bounty offer, no negotiation, no acknowledgment that a second attacker walked through the door the first one used.

[The Block reached out to the team directly.](https://theblock.co/post/409489/new-verus-ethereum-bridge-attack) No word on a response, either.

_The silence reads differently the second time. In May, quiet was the pause before a plan. In July, quiet is just quiet._  
  
**Verus went quiet on social media, but [its GitHub release trail continued](https://github.com/VerusCoin/Verus-Desktop/releases/tag/v1.2.17). The public record shows an urgent bridge restoration release in v1.2.17 on July 3, [a follow-up v1.2.17-1 update on July 12 that added an opt-out vote for the ETH bridge contract upgrade](https://github.com/VerusCoin/Verus-Desktop/releases/tag/v1.2.17-1), and continued activity across the wallet, mobile, and core repositories.**

[ ](https://github.com/VerusCoin/Verus-Ethereum-Contracts)[DefiLlama's numbers tell the rest of it without needing a statement](https://defillama.com/chain/verus). Verus carried roughly $90 million in total value locked at the start of 2025. As of late July 2026, it holds under $5 million.

**A bridge that puts its recovered funds back into an unpatched vault isn't performing recovery. It's performing confidence, and hoping nobody times the gap between the announcement and the next transaction.**

_If the money you get back goes right back into the room with the broken lock, whose recovery was that actually for?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_The Verus-Ethereum Bridge wasn't beaten by cryptography. It was beaten by an assumption nobody rewrote._

**Twice now, the contract has proven a receipt is real. Twice now, it has failed to prove the receipt is worth anything.**

[The first time cost $11.6 million](https://x.com/1nf0s3cpt/status/2080162610444677132) and [ended in a public negotiation](https://x.com/VerusCoin/status/2058171278096228621).

[The second cost $7.54 million](https://x.com/blockaid_/status/2080143099561496896) and ended in silence.

Sixty-six days sit between them. [Fifteen days sit between the partial fund transfer back into the bridge](https://etherscan.io/tx/0x31441634d048239a75ae071149cb01d812689530d75c8ce21b927b1aeaf183a7) and [the second theft](https://etherscan.io/tx/0xa1f1e65c1cea4dba4ae439cd4dcdba6cc2dbda0ed1228e61f29ae9c9324eb099). The gap was never hidden. It was just never closed.  
  
**The bridge verified every signature, every state root, every proof it was built to check for, and it still paid out money that had never existed.**

_If the fix that follows this one only patches the function the last attacker used, and leaves the assumption underneath it standing, how many more names does this list need before someone rewrites the invariant instead of the incident?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
