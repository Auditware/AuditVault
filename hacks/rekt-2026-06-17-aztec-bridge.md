---
tags:
  - web3-sector/bridge
  - web3-sector/infra
  - web3-sector/stable
  - web3-sector/token
  - precondition/insider
  - type/hack
  - vector/access-control
title: "Aztec Bridge - Rekt"
protocol: "Aztec Bridge"
date: 2026-06-17
loss_usd: 2198000
audit: "N/A"
source: "https://rekt.news/aztec-bridge-rekt"
excerpt: "One deprecated contract, one flawed escape hatch circuit, and a verifier that should have been retired years earlier. Aztec’s legacy rollup contract lost roughly $2.198 million after a ZK proof passed"---
# Aztec Bridge - Rekt

> **Loss:** $2,198,000 | **Date:** 2026-06-17 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/aztec-bridge-rekt-header.png)



_On June 14th, [an attacker drained $2.28 million from a deprecated Aztec Connect contract that Aztec Labs had wound down in 2023 and handed back the admin keys on in 2024](https://rekt.news/aztec-connect-rekt), exploiting a mismatch between the ZK proof verification layer and the L1 settlement logic._  
  
**The contract was immutable. There was nothing to patch and nothing to recover.**  
  
[Three days after the first drain](https://x.com/AztecLabs_/status/2067511785637163354), on June 17th, the same deprecated bridge stack handed someone else $2.198 million.

**Not the same contract, not the same flaw, not the same entry point, but it did have the same foundational assumption:** That a ZK proof connecting two independent witnesses was actually constraining something.  
  
[The attacker funded a fresh wallet with 0.134 ETH from HitBTC](https://x.com/PeckShieldAlert/status/2067502440044437871), called [escapeHatch() on a deprecated Aztec 2.0 rollup contract that hadn't been a maintained product since 2022](https://www.aztec-labs.com/blog/aztec-2-incident.html), and [walked out with 1,158 ETH, 150,000 DAI, and 0.4696 renBTC](https://x.com/PeckShieldAlert/status/2067502440044437871) across three transactions in thirty-seven minutes.

_The escape hatch was designed as the last resort, [the function users could call to force their own funds out if the sequencer went dark](https://www.aztec-labs.com/blog/aztec-2-incident.html). It verified ownership with a ZK proof._

**[ ](https://x.com/Phalcon_xyz/status/2067539090736926936)[The exploit came from a mismatch between the verified rollup transaction set and the L1 settlement](https://x.com/Phalcon_xyz/status/2066372912635097155) processing boundary.**

[numRealTxs was not effectively bound to the transaction set enforced by the proof](https://x.com/Phalcon_xyz/status/2066372912635097155), so the proof path and the L1 settlement logic interpreted the transaction list differently.

[Aztec Labs held no admin keys.](https://x.com/AztecLabs_/status/2067511785637163354) The contract was immutable.  
  
**[The circuit that enabled the flaw had been removed from the codebase years earlier,](https://github.com/AztecProtocol/aztec-connect/commit/8c3953a4d79e3130508389ff4a55a5dfd2fb3c49) but the deployed verifier still contained the old escape hatch verification key. Proofs built against the old circuit remained valid on-chain.**

_When a protocol removes a vulnerable circuit from its codebase but leaves the deployed verifier intact, who owns the gap between what the code says now and what the contract still accepts?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Aztec Labs](https://x.com/AztecLabs_/status/2067511785637163354), [Peckshield](https://x.com/PeckShieldAlert/status/2067502440044437871), [Blocksec Phalcon](https://x.com/Phalcon_xyz/status/2066372912635097155), [thisvishalsingh](https://x.com/thisvishalsingh/status/2067464678771744843), [CertiK](https://x.com/CertiKAlert/status/2067497629127410058), [MistTrack](https://x.com/MistTrack_io/status/2067513557055644076), [L2Beat](https://l2beat.com/scaling/projects/aztecnetwork), [Specter](https://x.com/SpecterAnalyst/status/2067520218180534305), [TrustSec](https://x.com/TrustSecAudits/status/2069083335570161811), [Defi Edward](https://x.com/Defi_Edward/status/2069380914036035984)_


**[thisvishalsingh was first on the scene, the evening of June 17th](https://x.com/thisvishalsingh/status/2067464678771744843), three hours after the drain had settled on-chain.**  
  
**[The read was careful and restrained](https://x.com/thisvishalsingh/status/2067464678771744843):** A call to escapeHatch() on the [Private Rollup Bridge contract](https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba), 1,158 ETH to the caller, no reverts, no unusual internal flows, the proof package went through.  
  
[The on-chain trace looked surgical](https://x.com/thisvishalsingh/status/2067464678771744843), 0.00009 ETH in gas, a single RollupProcessed event for rollupId 4487, and a balance that had just become zero.  
  
The open question, flagged explicitly, [was whether the proof had represented real ownership or had passed through a gap in the verification logic](https://x.com/thisvishalsingh/status/2067464678771744843).  
  
_The answer would take until the following morning._

**[CertiK confirmed the drain later that night](https://x.com/CertiKAlert/status/2067497629127410058), naming the attacker address and estimating the loss at roughly $2.15 million.**  
  
**[Their follow-up thread](https://x.com/CertiKAlert/status/2067518781304525189) surfaced [an early mechanical observation](https://x.com/CertiKAlert/status/2067532493558088174):** Within the escape hatch's call window of 240 calls per 4,800 blocks, the attacker had submitted proofData with rollupSize and numTxs set to zero at the proof header while real withdrawal parameters sat further into the data.  
  
Verification [pulled the zeroes](https://x.com/CertiKAlert/status/2067532493558088174).  
  
Execution, [hardcoded to process at least one transaction at line 512](https://x.com/CertiKAlert/status/2067534653859443090), pulled the withdrawal values.  
  
**The two reads looked at different parts of the same calldata and reached different conclusions.**

_**[PeckShield confirmed the full asset picture shortly after midnight](https://x.com/PeckShieldAlert/status/2067502440044437871):** 1,158 ETH, 150,000 DAI, 0.4696 renBTC, for an estimated total of approximately $2.165 million at the time, the attacker wallet, [originally funded with 0.134 ETH from HitBTC](https://x.com/PeckShieldAlert/status/2067502440044437871)._

[BlockSec Phalcon followed with all three attack transaction hashes and noted the connection to the June 14th exploit](https://x.com/Phalcon_xyz/status/2067501141701857291), two separate deployments, two separate entry points, the same underlying class of proof-binding gap.

[Aztec Labs posted in the early hours of June 18th](https://x.com/AztecLabs_/status/2067511785637163354), with a brief statement describing the target as "a deprecated Aztec payments product from 2021," confirming the contract was immutable and beyond their control, [and separating the incident cleanly from the June 14th Aztec Connect drain](https://x.com/AztecLabs_/status/2067511785637163354).  
  
**[The Aztec Foundation followed one minute later with the same ring-fencing](https://x.com/aztecFND/status/2067511967237939636):** No connection to the current Aztec Network, no connection to the AZTEC ERC-20 token.  
  
Both posts were factually accurate and said almost nothing about how the money had actually been taken.

**The full technical account, the circuit binding gap, the fake Merkle tree, the two independent witnesses with no equality constraint between them, [came from BlockSec Phalcon the following morning](https://x.com/Phalcon_xyz/status/2067539090736926936) and [Aztec Labs' own incident report](https://www.aztec-labs.com/blog/aztec-2-incident.html), and is covered in the next section.**

_When the first alerts name the attacker and the amounts but the protocol's own statement omits the mechanism entirely, what does the public record actually contain in the hours that matter most?_

### The Unbound Root

_To withdraw from Aztec 2.0, [a user had to submit a ZK proof showing that the funds existed in the private ledger, had not already been spent, and belonged to the claimant](https://www.aztec-labs.com/blog/aztec-2-incident.html)._  
  
**The verifier checked that proof against a verification key generated from the circuit, while [the settlement contract trusted the verifier to establish ownership and then executed the withdrawal](https://www.aztec-labs.com/blog/aztec-2-incident.html).**

[The escape hatch circuit used old_data_root](https://x.com/Phalcon_xyz/status/2067539090736926936) in two places.  
  
[One instance was fed into the join-split circuit at line 33](https://x.com/Phalcon_xyz/status/2067539090736926936) as the root used for note membership checks.  
  
[A second instance was exposed as a public input at lines 50 and 88](https://x.com/Phalcon_xyz/status/2067539090736926936), then compared in Solidity against the live on-chain state via require(oldDataRoot == dataRoot).  
  
_[The circuit did not enforce that those two values](https://x.com/Phalcon_xyz/status/2067539090736926936) were the same._

**That missing equality constraint was the exploit. [The attacker built a fake Merkle tree containing fabricated notes](https://x.com/Phalcon_xyz/status/2067539090736926936), proved membership against that fake root, and supplied the real on-chain root as the public input.**  
  
[The circuit accepted the proof](https://x.com/Phalcon_xyz/status/2067539090736926936), the Solidity check passed against the genuine root, and the withdrawal executed.

**[Aztec Labs' incident report said the result was visible on-chain](https://www.aztec-labs.com/blog/aztec-2-incident.html):** The attacker's proof stated deposit = 0, withdraw = 1,158 ETH, and the notes cited as the source of those funds were fabricated, a combination that cannot occur in a legitimate proof.  
  
_**[The flaw resided not in the verifier's execution but in what the verification key encoded](https://x.com/Phalcon_xyz/status/2067539090736926936):** A circuit that never required its two uses of old_data_root to match.[](https://www.aztec-labs.com/blog/aztec-2-incident.html)_

**The shared cryptographic [trusted setup was not compromised.](https://www.aztec-labs.com/blog/aztec-2-incident.html)**

The vulnerable escape hatch circuit had already been [removed from the codebase in PR #402](https://github.com/AztecProtocol/aztec-connect/commit/8c3953a4d79e3130508389ff4a55a5dfd2fb3c49), but [the deployed verifier contract still contained the verification key generated from that circuit](https://x.com/Phalcon_xyz/status/2067539090736926936).  
  
The repository had moved on. The chain had not.  
  
**Proofs built against the old circuit remained valid on-chain, because the key that accepted them was still there.**

_When the code says one thing and the deployed verifier still accepts another, which one is the contract actually running?_

### Three Clean Exits

  

_[The attacker funded a fresh wallet with 0.134 ETH for gas at 18:21 UTC on June 17th](https://www.aztec-labs.com/blog/aztec-2-incident.html). Thirteen minutes later, [the first transaction cleared](https://www.aztec-labs.com/blog/aztec-2-incident.html)._  
  

**At 18:34 UTC, [1,158 ETH left the contract in a single call through the escape hatch](https://www.aztec-labs.com/blog/aztec-2-incident.html), the overwhelming majority of what would be taken.**  
  
Fifteen minutes later, at 18:49 UTC, [a second transaction drained 150,000 DAI](https://www.aztec-labs.com/blog/aztec-2-incident.html).  
  
One minute after that, at 18:50 UTC, [a third transaction swept ~0.47 renBTC](https://www.aztec-labs.com/blog/aztec-2-incident.html)  
  
From gas funding to final drain, [the full operation took roughly 37 minutes](https://www.aztec-labs.com/blog/aztec-2-incident.html). 
  

**The three attack transactions, in order:**

  
**1,158 ETH Attack Transaction:** [0xab306cd2184d23b6ba3e151b10b3b9a0b81f211cc16f4f3b0c79f0b17a59c2b5](https://etherscan.io/tx/0xab306cd2184d23b6ba3e151b10b3b9a0b81f211cc16f4f3b0c79f0b17a59c2b5)

**150k DAI Attack Transaction:** [0x5c196c37a109d74c9797254287a0331f30e0daa637af241bd28fdc43774705c3](https://etherscan.io/tx/0x5c196c37a109d74c9797254287a0331f30e0daa637af241bd28fdc43774705c3)

**0.46963295 renBTC Attack Transaction:** [0x9e1d6ab7c20ae235409d7dd3a9cd47c04f07293585b3498b8beed82d6f6b03ca](https://etherscan.io/tx/0x9e1d6ab7c20ae235409d7dd3a9cd47c04f07293585b3498b8beed82d6f6b03ca)

_[The ETH was worth approximately $2.04 million](https://www.aztec-labs.com/blog/aztec-2-incident.html) at the time of the exploit._  
  
**The [DAI was worth $150k](https://www.aztec-labs.com/blog/aztec-2-incident.html).**  
  
[The renBTC figure of roughly $7,000 was an upper bound per Aztec Labs' incident report](https://www.aztec-labs.com/blog/aztec-2-incident.html), which noted that renBTC is a deprecated and depegged asset whose real value was likely far lower.  
  
**Total taken in the primary attack:** Approximately $2.197 million.  
  

The attacker's wallet [was originally funded by HitBTC](https://x.com/PeckShieldAlert/status/2067502440044437871).  
  
_The attacker consolidated primary funds at the EOA, [with partial ETH distributed to two holding addresses identified by MistTrack](https://x.com/MistTrack_io/status/2067513557055644076)._  
  
**Approximately 300 ETH moved to one address and 56 ETH to a second, [per Aztec Labs' incident report](https://www.aztec-labs.com/blog/aztec-2-incident.html).**  
  

**Attacker EOA:**
[0x6952d9246e9aFE8B887B2877225163436F78E97F](https://etherscan.io/address/0x6952d9246e9aFE8B887B2877225163436F78E97F)

  
**Victim Contract (Aztec: Private Rollup Bridge):**
[0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba](https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba)

  

**Holding Wallet A:**
[0x15930a0fef3421f48c6553b5691682cc1b22edb3](https://etherscan.io/address/0x15930a0fef3421f48c6553b5691682cc1b22edb3)

  
**Holding Wallet B:**
[0x33d6a0d9bc210e823e043d604179cd844eb467df](https://etherscan.io/address/0x33d6a0d9bc210e823e043d604179cd844eb467df)

  
_The following morning, approximately 13.5 hours after the primary attack, a [separate actor swept the residual 0.76 ETH](https://www.aztec-labs.com/blog/aztec-2-incident.html) remaining in the contract via the operator path rather than the escape hatch, [bringing the secondary take to roughly $1,300](https://www.aztec-labs.com/blog/aztec-2-incident.html).[ ](https://www.aztec-labs.com/blog/aztec-2-incident.html)_

**Second Attacker EOA:**  
[0xb6f89d12Ff9A9e394f40B701Ac46428DE0d1bEa5](https://etherscan.io/address/0xb6f89d12ff9a9e394f40b701ac46428de0d1bea5)


**Secondary Attack Transaction:**  
[0x389bce3dad78c09900cb4c9e72397a73b39b8217ae37ef264f3439046737cb0c](https://etherscan.io/tx/0x389bce3dad78c09900cb4c9e72397a73b39b8217ae37ef264f3439046737cb0c)

**Total amount stolen by the 2 attackers:** $2.197 million  
  
[That path was accessible because a default Anvil/Hardhat developer test account had been registered](https://www.aztec-labs.com/blog/aztec-2-incident.html) as an authorized operator during the 2024 decommissioning process.  
  
**[The attacked contract is almost empty](https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba):** ~$50 left as of publishing time.  
  
**Two attackers, three transactions for the first, one for the second, [and a contract that had been sitting on-chain, unmonitored, since 2022 with nothing left to give](https://www.aztec-labs.com/blog/aztec-2-incident.html).**  
  

_What does it mean for users whose funds were still in a deprecated contract when the sequencer stopped running and the only exit was an escape hatch built on a flawed circuit?_

  
### No Keys Left

  
_[Aztec Labs published a full incident report in the days following the exploit](https://www.aztec-labs.com/blog/aztec-2-incident.html), confirming the root cause, laying out the timeline, and naming Groom Lake as its incident response provider, engaged to coordinate fund blocking across exchanges._  
  
**[No compensation mechanism was described](https://www.aztec-labs.com/blog/aztec-2-incident.html). No recovery path existed. The contract was immutable, [and Aztec Labs had renounced all administrative control in April 2024](https://www.aztec-labs.com/blog/aztec-2-incident.html).**  
  
There was nothing left to do but document what had happened.

  
**[That April 2024 key revocation matters because it came after a year of supported exits and public reminders urging remaining users to withdraw](https://www.aztec-labs.com/blog/aztec-2-incident.html):** Aztec Labs formally relinquished all administrative roles and renounced all upgrade authority on-chain.  
  
That decision is part of the same decentralization posture [reflected in the current Aztec Network’s L2Beat Stage 2 rating](https://l2beat.com/scaling/projects/aztecnetwork), one of the highest available for rollups. Few L2s reach it.  
  
**The same architectural discipline that earned that rating meant that when the escape hatch circuit flaw surfaced three years after the product was wound down, there was no key to reach for and no upgrade to push.**  
  

_**[Onchain investigator Specter put the criticism plainly](https://x.com/SpecterAnalyst/status/2067520218180534305):** If a contract is no longer being used and there is no team actively maintaining or monitoring it, the right move is to withdraw the funds and shut it down properly rather than leave it waiting to be exploited._

**[Fran, an Aztec ecosystem community member and Foundation contributor, offered context in response](https://x.com/Franacc_/status/2067645371866554723):** Aztec Connect was wound down around three years ago. Most users withdrew their funds, but some money was still sitting there, likely from people who lost access to their wallets or never bothered to claim it. Last week, someone stole about $2 million from those remaining funds, and another roughly $2 million now appears to have been taken. This was an old contract that Aztec Labs does not control, and it is not connected to Aztec Network or $AZTEC. The broader risk applies to legacy smart contracts that are no longer actively monitored, maintained, or battle-tested.  
  
**But that debate does not fully capture the technical point:** The immutability and key revocation that made the contract trustless also left Aztec Labs with no administrative way to intervene.  
  
[The escape hatch circuit had been removed from the codebase in PR #402](https://github.com/AztecProtocol/aztec-connect/commit/8c3953a4d79e3130508389ff4a55a5dfd2fb3c49), but the EscapeHatchVk it generated remained deployed in the verifier.

  
_In other words, responsible deprecation covered the operational layer, but it did not change what the verifier would still accept._  
  

**The two Aztec exploits in three days, the June 14th Aztec Connect drain and this one, [combined for more than $4 million in losses across deprecated contracts](https://x.com/Franacc_/status/2067645371866554723) the current team had no ability to intervene in.**  
  
The loss total was still growing [when the follow-on sweep added its $1,300 the following morning](https://www.aztec-labs.com/blog/aztec-2-incident.html).  
  
**Independently, it raises a harder question:** If a white hat discovers a critical flaw in a fully disowned project, what can they actually do?

  

_**[TrustSec framed the harder question after the Aztec incident](https://x.com/TrustSecAudits/status/2069083335570161811):** What should a white hat do upon finding a critical vulnerability in a fully disowned project?_  
  
[Disclose it publicly and risk alerting every bad actor watching the feed](https://x.com/TrustSecAudits/status/2069083335570161811). Attempt a quiet recovery alone and face frontrunning bots, legal exposure, and execution risk. Or bury it, knowing the next person to find the same gap may not be weighing the same options.  
  
**None of those paths were clean, and none offered an easy answer.**  
  

_When a protocol revokes its keys, completes its deprecation, and earns one of the highest decentralization ratings available, then watches a flawed verification key drain the last of its users' funds, what exactly did responsible sunset look like from the inside?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_**[Two deprecated contracts, two separate circuit-level flaws, more than $4 million gone in three days, and a team that had done everything the industry considers responsible](https://www.aztec-labs.com/blog/aztec-2-incident.html):** Gave users a year of notice, ran the exit infrastructure, revoked the admin keys on-chain, and walked away cleanly._

**That last part is what makes this harder than most exploits to assign.**

**[Defi Edward's question cuts to the center of it](https://x.com/Defi_Edward/status/2069380914036035984):** How many L2s talk decentralization but never actually revoke their admin keys?  
  
[Aztec did revoke them](https://www.aztec-labs.com/blog/aztec-2-incident.html). The contract became trustless. And trustless, in this case, meant there was no one left to call when the verifier kept accepting proofs from a circuit that had been removed from the codebase years earlier.

The escape hatch was supposed to be the safety net, the mechanism that let users exit when every other path closed.  
  
**The flaw wasn't in the idea of an escape hatch.**

_**[It was in the binding gap behind the escape hatch:](https://x.com/Phalcon_xyz/status/2067539090736926936)** The circuit treated the same root as two separate values, and nothing forced them to match. That let a proof pass even when the tree being proven against was not the tree the contract was checking on-chain._

[Aztec 2.0 was deprecated in 2022.](https://www.aztec-labs.com/blog/aztec-2-incident.html)  
  
It sat on-chain for roughly four years after that, with source code public, balances visible, and the verification key intact, until someone read the circuit carefully enough to find the gap.

**The cryptography didn't fail. The sunset did.**

_When every good-faith effort at responsible deprecation still ends with users losing funds to a flaw nobody caught, what exactly does the industry owe the people whose money was still inside when the door finally closed?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
