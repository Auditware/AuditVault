---
tags:
  - type/hack
  - blockchain/bsc
  - blockchain/ethereum
  - web3-sector/bridge
  - web3-sector/dex
  - web3-sector/infra
  - web3-sector/staking
  - vector/integer-overflow
title: "Kiichain - Rekt"
protocol: "Kiichain"
date: 2026-08-22
loss_usd: 9700000
audit: "N/A"
source: "https://rekt.news/kiichain-rekt"
excerpt: "An attacker drained 148.3 million KII, worth roughly $9.7 million at the pre-exploit price, from KiiChain through the Cosmos EVM exploit class that also hit MANTRA and TAC. A halt immobilized 54.4% on"
---
# Kiichain - Rekt

> **Loss:** $9,700,000 | **Date:** 2026-08-22 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/kiichain-rekt-header.png)




_Eighteen times, the same trick worked._

**On Aug. 22, [an attacker drained 148,326,583.15 KII from wallets across KiiChain](https://x.com/KiiChainio/status/2091721027583709214), repeating one exploit sequence against 18 different targets before anyone stopped them.**

[KiiChain says its own team flagged the anomalous drains internally and halted the network at block 9,355,723 at 22:50:58 UTC](https://x.com/KiiChainio/status/2091721027583709214), hours after [TAC was hit by the same bug](https://rekt.news/tac-rekt) and two days after [MANTRA became the first target](https://rekt.news/mantra-rekt).

[The tokens carried a nominal value of roughly $9.7 million at the pre-exploit price](https://thedefiant.io/news/blockchains/cosmos-labs-urges-evm-chains-halt-shared-bug-drains-three-networks). Only a fraction of that ever became real money for the attacker.

**[54.4% of what was taken, 80.7 million KII, never left the chain at all](https://x.com/KiiChainio/status/2091721027583709214), frozen in place the moment validators stopped producing blocks.**

[The rest crossed a bridge to BNB through Hyperlane](https://x.com/KiiChainio/status/2091721027583709214), where most of it was sold before KiiChain had finished writing its own incident report.

**[By the time the postmortem went public](https://x.com/KiiChainio/status/2091721027583709214), KiiChain was not just describing a theft. It was accusing the people who built the code underneath it of publishing a security fix before giving affected chains timely private notice of the risk, an interval in which multiple networks were hit.**

_If a halt initiated from inside the chain caught more of the damage than a warning issued from outside it, what exactly was the disclosure process supposed to be protecting?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [KiiChain](https://x.com/KiiChainio/status/2091721027583709214), [The Defiant](https://thedefiant.io/news/blockchains/cosmos-labs-urges-evm-chains-halt-shared-bug-drains-three-networks), [Rarma](https://x.com/Rarma_/status/2091799580610597029), [TAC](https://x.com/TacBuild/status/2091312709438444021), [Cosmos Labs](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md)_

**KiiChain didn't wait for an outside analyst to name what happened.**

In the hours around the halt, the team posted twice on Twitter.  
  
[The first post said a vulnerability in the EVM module had let an attacker move funds off KiiChain via Hyperlane to BSC](https://x.com/KiiChainio/status/2091330990027296992), and that the chain had been halted to contain it.

The second, later that same evening, [narrowed the cause to the Cosmos EVM module specifically](https://x.com/KiiChainio/status/2091377203531452821), framed the halt as precautionary, [and said every other supported network kept running normally](https://x.com/KiiChainio/status/2091377203531452821).  
  
_The later post promised that "[a detailed incident report will be shared once completed](https://x.com/KiiChainio/status/2091377203531452821)."_

**That promise came due fast. By the next day, [KiiChain had published a full technical post-mortem](https://x.com/KiiChainio/status/2091721027583709214), naming the mechanism, the exact figure, the wallet addresses, and a recovery plan.**

Set that against how TAC handled the same moment. [TAC's initial public statement](https://x.com/TacBuild/status/2091312709438444021), posted the day of its own drain, did not identify an attacker, explain the mechanism, or state a loss figure.  
  
[It took an Rarma's forensic thread to supply the transaction-level account TAC's own team](https://x.com/Rarma_/status/2091799580610597029) had left out.  
  
KiiChain skipped that step entirely, [publishing its own technical account before an outside researcher had to reconstruct the attack](https://x.com/KiiChainio/status/2091721027583709214).

**Cosmos Labs' own postmortem puts a number on how word spread upstream. [About an hour after learning TAC had been hit, its team received a Slack message from KiiChain confirming a third chain was down](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md).**

_KiiChain explained itself faster, and in more detail, than either chain it shared a bug with. So why didn't a faster explanation translate into a smaller loss?_

### No Longer a Mystery

  

_[KiiChain's own report opens with a disclaimer worth sitting with](https://x.com/KiiChainio/status/2091721027583709214): The flaw is in Cosmos code, not KiiChain code._

**The [chain runs the shared cosmos/evm module unmodified](https://x.com/KiiChainio/status/2091721027583709214).**

[At least three defects had to line up](https://x.com/KiiChainio/status/2091721027583709214) before the exploit worked.  
  
**[The first is the one KiiChain names outright](https://x.com/KiiChainio/status/2091721027583709214):** An underflow in the staking precompile's post-delegation balance write-back, [the same defect Cosmos Labs later confirmed was part of the exploit affecting MANTRA and TAC as well](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md).

KiiChain wouldn't name the other two. "[Due to security reasons, we cannot disclose the real issue at this time](https://x.com/KiiChainio/status/2091721027583709214)," the report says, leaving most of its own root-cause analysis as a placeholder rather than an explanation.  
  
**[Cosmos Labs’ later postmortem filled in much of that blank, describing a linked pair of balance-accounting vulnerabilities](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md):** The vesting-account underflow and the victim-balance overflow that allowed the attacker to redirect real tokens without creating new supply.

**[An ordinary wallet can't reach any of it](https://x.com/KiiChainio/status/2091721027583709214). A standard account can't delegate more than its spendable balance, so the underflow stays out of reach without a workaround.**  
  
_**[KiiChain's attacker built one](https://x.com/KiiChainio/status/2091721027583709214):** Precompute the address a contract would deploy to, convert that address into a vesting account before the contract exists, then deploy the contract onto it._  
  
The contract inherits vesting status on arrival, delegates one wei more than its spendable balance, [and its mirrored EVM balance underflows to roughly 2^256](https://x.com/KiiChainio/status/2091721027583709214).  
  
From there, the attacker used the remaining bugs, [part of the mechanism Cosmos Labs later confirmed](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md), to move real tokens from victim accounts to the attacker.

[No new supply was created](https://x.com/KiiChainio/status/2091721027583709214), and each drain was capped at the amount the victim actually held.

**What KiiChain doesn’t explain is why the same technique worked [18 separate times against 18 separate targets](https://x.com/KiiChainio/status/2091721027583709214) in a single day, without the pattern being caught after the first one.**

_If MANTRA's version appears to have used a hardcoded victim address while TAC's exposed the victim as a variable, what design let KiiChain's attacker run the same play more times than both of them combined?_

### Half and Half

_[KiiChain said the attacker drained 148,326,583.15 KII across 18 attacks](https://x.com/KiiChainio/status/2091721027583709214) on Aug. 22, 2026._  
  
**[The chain halted at block 9,355,723](https://x.com/KiiChainio/status/2091721027583709214), leaving [80,728,575.06 KII, 54.4% of the stated loss](https://x.com/KiiChainio/status/2091721027583709214), in attacker-controlled accounts on KiiChain that the project said would be moved to recovery wallets during the restart.**  
  
The remaining [67,597,997.87 KII crossed to BNB Chain through Hyperlane](https://x.com/KiiChainio/status/2091721027583709214); KiiChain said 64,597,997.87 KII was sold through decentralized exchanges and 3 million KII was sent to a KuCoin deposit address.

Two reconstructed sequences show a repeatable workflow rather than a single theft transaction.  
  
In each reconstructed sequence, the attacker created and funded a delayed-vesting account with 2 KII.  
  
_[KiiChain said the attacker had precomputed those addresses](https://x.com/KiiChainio/status/2091721027583709214) for future EVM contract deployments._  
  
**The attacker then deployed helper-contract code at that address.**  
  
A subsequent EVM call delegated 2 KII plus one wei, one smallest unit more than the prepared account’s balance, and debited a selected victim account; [KiiChain said this triggered an underflow in the contract’s mirrored EVM balance](https://x.com/KiiChainio/status/2091721027583709214).  
  
In the first observed sequence, a later helper call moved funds from the temporary vesting/helper address to the attacker’s primary wallet.  
  
_[The project said the technique was repeated](https://x.com/KiiChainio/status/2091721027583709214) against 18 targets._

**The first four visible transactions from the attacker's KiiChain address form a setup, deployment, victim-drain, and sweep sequence over roughly four minutes.**  
  
A later reconstructed sequence repeats the same setup and one-wei-over-balance delegation pattern, moving more than 42 million KII from a different account to a newly created vesting/helper address.  
  
These examples do not independently enumerate all 18 reported drains, but they demonstrate the same observable workflow early and later in the reviewed transaction set.

**First Observed Sequence as follows…**

_At 20:32:15 UTC, the attacker created a delayed-vesting address and funded it with exactly 2 KII._

**Vesting-Account Setup (2 KII):** [4A86F67CFC909E29C640BC52E0BE7DF663F0E01C99B0D4150A9853922A356D54](https://explorer.kiichain.io/tx/4A86F67CFC909E29C640BC52E0BE7DF663F0E01C99B0D4150A9853922A356D54)

Seventy-eight seconds later, the same attacker wallet submitted an EVM contract-creation transaction, carrying deployment bytecode rather than a call to an existing recipient, creating the helper contract later used in the sequence.

**Helper-Contract Deployment:** [D9A2445151C89CA0B49C069D509A51C8A968EB82F6377531E904B23BC94609AD](https://explorer.kiichain.io/tx/D9A2445151C89CA0B49C069D509A51C8A968EB82F6377531E904B23BC94609AD)

At 20:35:54 UTC, the attacker sent an EVM transaction to the newly deployed helper contract.  
  
_The transaction delegated 2,000,000,000,000,000,001 akii, 2 KII plus one wei, from the newly prepared account, although its setup transaction funded it with only 2 KII._ 
  
**In the same transaction, the explorer records a debit of 1,023.953 KII from a victim address and later records a credit of the same amount to the attacker-controlled vesting/helper address.**  
  

**Victim Drain (1,023.953 KII):** [D89E47F892962A6366D8F151BC7E3DD9687982FF858EA48D939C3F8217FA1DCA](https://explorer.kiichain.io/tx/D89E47F892962A6366D8F151BC7E3DD9687982FF858EA48D939C3F8217FA1DCA)

Forty-four seconds later, the attacker sent another EVM transaction to the same helper contract, passing the attacker's primary EVM address as an argument.  
  
KiiChain's event record shows 1,025.952999999999999999 KII moving from the temporary vesting/helper address to the attacker's primary KiiChain address.

**Helper-to-Attacker Sweep (approximately 1,025.953 KII):** [12516318DACF80A376A1E5CB662D27EC32060882813C816DDCBC862464C5FDAE](https://explorer.kiichain.io/tx/12516318DACF80A376A1E5CB662D27EC32060882813C816DDCBC862464C5FDAE)

  
**Attacker Wallet on KiiChain:**
[0x0e7a96227fcf09f53d644ba6462d8c73993ef246](https://explorer.kiichain.io/address/0x0e7a96227fcf09f53d644ba6462d8c73993ef246)

  
**Temporary Vesting/Helper Address:**
[kii1a5v3eaeaugdh3vk57nlh8q8xcu7z46w0ttlrw9](https://explorer.kiichain.io/address/kii1a5v3eaeaugdh3vk57nlh8q8xcu7z46w0ttlrw9)

  
**Victim Address:**
[kii19c6q309u7c9atnvefqajdjzzjhn82cfcakx4cc](https://explorer.kiichain.io/address/kii19c6q309u7c9atnvefqajdjzzjhn82cfcakx4cc)

**Later Confirmed Drain as follows…**

_At 22:32:44 UTC, the attacker repeated the setup: it created a delayed-vesting address and funded it with 2 KII._  
  

**Vesting-Account Setup (2 KII):** [85081A4BFE2A7329C9ED4772AD2F9AD765663986B23598D77A87F7E85FA08504](https://explorer.kiichain.io/tx/85081A4BFE2A7329C9ED4772AD2F9AD765663986B23598D77A87F7E85FA08504)

  
At 22:34:02 UTC, it submitted another EVM contract-creation transaction containing helper-contract bytecode.  
  

**Helper-Contract Deployment:** [3074A3C7E22CFD4A60A16500898E763A0EFA62BF582304C23024006DF0EC4476](https://explorer.kiichain.io/tx/3074A3C7E22CFD4A60A16500898E763A0EFA62BF582304C23024006DF0EC4476)

_At 22:36:21 UTC, the attacker sent an EVM transaction to the helper contract listed below. This transaction again delegated 2,000,000,000,000,000,001 akii, or 2 KII plus one wei. The event record shows 42,178,466.002176081424538812 KII debited from a victim address and later records a credit of that amount to the newly created vesting/helper address._

**Helper Contract:**
[0x8F37701914d60CeE95CcAa39AF959561045CF9E8](https://explorer.kiichain.io/address/0x8F37701914d60CeE95CcAa39AF959561045CF9E8)

**Victim Drain (42,178,466.002176081424538812 KII):** [4FC1440E411EEF245BB6111E7D72F89F4883FE4022C7D7B0E60A36D2A1E3DB84](https://explorer.kiichain.io/tx/4FC1440E411EEF245BB6111E7D72F89F4883FE4022C7D7B0E60A36D2A1E3DB84)

**Temporary Vesting/Helper Address:**
[Kii13umhqxg56cxwa9wv4gu6l9v4vyz9e70g4hupvn](https://explorer.kiichain.io/address/kii13umhqxg56cxwa9wv4gu6l9v4vyz9e70g4hupvn)

**Victim Address:**
[Kii1fsr2zu92l4gexcz9fdgatucddlduahy250pygy](https://explorer.kiichain.io/address/kii1fsr2zu92l4gexcz9fdgatucddlduahy250pygy)

[The matching attacker address on BSC](https://bscscan.com/address/0x0e7a96227fcf09f53d644ba6462d8c73993ef246), later [sold KII through PancakeSwap on BNB Chain](https://bscscan.com/txs?a=0x0e7a96227fcf09f53d644ba6462d8c73993ef246&f=2).  
  

_Known Infrastructure as follows…_

**Attacker Wallet on KiiChain:**
[0x0e7a96227fcf09f53d644ba6462d8c73993ef246](https://explorer.kiichain.io/address/0x0e7a96227fcf09f53d644ba6462d8c73993ef246)

  
**Attacker Wallet on BNB Chain:**
[0x0e7a96227fcf09f53d644ba6462d8c73993ef246](https://bscscan.com/address/0x0e7a96227fcf09f53d644ba6462d8c73993ef246)

  
**Exploit Helper Contract 1:**
[0x8f37701914d60cee95ccaa39af959561045cf9e8](https://explorer.kiichain.io/address/0x8f37701914d60cee95ccaa39af959561045cf9e8)

  
**Exploit Helper Contract 2:**
[ 0x77308955c6cbc4cdef2e53defc7d78a007f29739](https://explorer.kiichain.io/address/0x77308955c6cbc4cdef2e53defc7d78a007f29739)

  
**Exploit Helper Contract 3:**
[0x8cdab0fa359ac467c80c19de3fee5a543e258365](https://explorer.kiichain.io/address/0x8cdab0fa359ac467c80c19de3fee5a543e258365)

  
**Observed Helper Contract in the First Sequence:** [0xED191cf73DE21b78b2D4F4ff7380e6c73c2ae9Cf](https://explorer.kiichain.io/address/0xED191cf73DE21b78b2D4F4ff7380e6c73c2ae9Cf)

_[KiiChain’s published planned-recovery list names two attacker wallets and three helper contracts](https://x.com/KiiChainio/status/2091721027583709214). It does not name [0xED191cf73DE21b78b2D4F4ff7380e6c73c2ae9Cf](https://explorer.kiichain.io/address/0xED191cf73DE21b78b2D4F4ff7380e6c73c2ae9Cf), the helper contract observable in the first reconstructed sequence._

The first reconstructed sequence shows that contract receiving the drain and then transferring funds to the attacker’s primary wallet.  
  
But [KiiChain’s public recovery plan](https://x.com/KiiChainio/status/2091721027583709214) does not say whether its planned state migration and blocking measures cover that observed early helper contract.  
  
[The report does not explain whether it is included through an unlisted recovery address](https://x.com/KiiChainio/status/2091721027583709214), a broader state migration, or another blocking mechanism.

**What the reconstructed transactions show is how the money moved. What KiiChain said happened next is a different story.**  
  
_While this sequence was unfolding on-chain, what was everyone else being told?_

### The Comeback Claim

_[KII had been trading for exactly eight days](https://thedefiant.io/news/blockchains/cosmos-labs-urges-evm-chains-halt-shared-bug-drains-three-networks) when the exploit hit._

**The token [launched Aug. 14 and touched its all-time high of $0.0977 that same day](https://thedefiant.io/news/blockchains/cosmos-labs-urges-evm-chains-halt-shared-bug-drains-three-networks). KII [plunged 83% in the immediate aftermath of the halt](https://thedefiant.io/news/blockchains/cosmos-labs-urges-evm-chains-halt-shared-bug-drains-three-networks).**  
  
By Aug. 25, three days later, [it traded at $0.0595, down 21% over the week, holding a market cap of roughly $19.3 million](https://thedefiant.io/news/blockchains/cosmos-labs-urges-evm-chains-halt-shared-bug-drains-three-networks).

That timing mattered beyond price. A network barely a week into public trading was now the third chain in three days to go dark from the same underlying bug, after [MANTRA on Aug. 20](https://rekt.news/mantra-rekt) and [TAC earlier on Aug. 22](https://rekt.news/tac-rekt).

Cosmos Labs did not publicly acknowledge an "[ongoing security incident](https://x.com/cosmoslabs_io/status/2091935066381582390)" until Aug. 24. It was the lab's first public statement on the incident, days after [private mitigation notices had already gone out to known Cosmos EVM chains](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md).  
  
_[Its public recommendation that any chain running an unpatched version halt immediately followed a day later](https://x.com/cosmoslabs_io/status/2092270725122207904), on Aug. 25, six days after [the vulnerable release](https://github.com/cosmos/evm/releases/tag/v0.7.2) had already shipped._

**The full account arrived Aug. 28. [Cosmos Labs' postmortem said six networks had been exploited across the ecosystem](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md).**

[It said affected chains had reported that the centralized-exchange accounts used by the attackers](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md) were frozen pending investigation.

KiiChain resumed block production that same day, Aug. 28. Its own announcement said [the network was fully operational again](https://x.com/KiiChainio/status/2093292518859555035), called the response's recovery of the majority of tokens a success, and stated plainly that no user funds were lost.  
  
**[67,597,997.87 KII, 45.6% of everything taken, had already crossed a bridge](https://x.com/KiiChainio/status/2091721027583709214), with about [95.6% of that amount swapped or sold](https://x.com/KiiChainio/status/2091721027583709214) before that statement went out.**

_If 45.6% of the stolen tokens had already left KiiChain's control before the network called its users whole, what exactly does "no user funds lost" mean, and who absorbed the difference?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_[Eighteen drains](https://x.com/KiiChainio/status/2091721027583709214). One bug KiiChain named itself; the rest, [it left for Cosmos Labs to describe](https://x.com/cosmoslabs_io/status/2091935066381582390)._

**[148,326,583.15 KII left KiiChain's wallets on Aug. 22](https://x.com/KiiChainio/status/2091721027583709214), worth roughly [$9.7 million](https://thedefiant.io/news/blockchains/cosmos-labs-urges-evm-chains-halt-shared-bug-drains-three-networks) at the token's prevailing price, [while the portion swapped on BSC ultimately yielded about $1.6 million](https://x.com/KiiChainio/status/2091721027583709214).**  
  
The gap between those two numbers is the whole story of what a halt can and can't do.  
  
[It froze 54.4% of the tokens in place](https://x.com/KiiChainio/status/2091721027583709214). It could not recover the rest through the halt; those tokens had already crossed a bridge before KiiChain's own team finished writing down what happened.

None of it traces back to code KiiChain wrote. The underflow sat in shared Cosmos EVM infrastructure, [the same defect that had already hit MANTRA and would hit TAC the same week](https://github.com/cosmos/security/blob/main/communications/cosmos_evm_GHSA-7g4w-cg88-2cq2_post_mortem.md).

_[KiiChain says Cosmos Labs knew about the underlying flaw months before any of this happened](https://x.com/KiiChainio/status/2091721027583709214), treated it as low-risk, and let the fix ship without privately warning the chains that depended on it._  
  
**[Its first public acknowledgment came two days after KiiChain and TAC](https://x.com/cosmoslabs_io/status/2091935066381582390) had already been drained.**  
  
A halt takes minutes. A vulnerability known for months became a public problem in days.

KiiChain moved faster than either chain it shared this bug with, explained more of its own mechanism than TAC had publicly managed by then, and still ended up with tens of millions of tokens that a blocklist alone cannot recover.

**A chain can out-disclose its peers, halt in time to save more than half the loot, and still call the outcome a win while most of its own root cause stays classified.**

_If speed and transparency weren't enough to stop 45.6% of the theft from becoming somebody else's money, what would actually have to change upstream before the next chain gets to skip this story entirely?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
