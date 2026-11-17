---
tags:
  - blockchain/arbitrum
  - blockchain/ethereum
  - web3-sector/bridge
  - web3-sector/dex
  - web3-sector/governance
  - web3-sector/oracle
  - web3-sector/stable
  - web3-sector/staking
  - novelty/variant
  - type/hack
  - vector/bridge-exploit
title: "AFX Trade - Rekt"
protocol: "AFX Trade"
date: 2026-07-22
loss_usd: 24150000
audit: "N/A"
source: "https://rekt.news/afx-trade-rekt"
excerpt: "Five compromised validator signatures cleared the two-thirds threshold guarding a bridge, draining $24.15 million from AFX Trade's USDC custody bridge contract on Arbitrum and moving it out through th"---
# AFX Trade - Rekt

> **Loss:** $24,150,000 | **Date:** 2026-07-22 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/afx-trade-rekt-header.png)





_Five signatures and one quorum. [$24.15 million gone](https://x.com/blockaid_/status/2080080240265621680) in a single withdrawal that never should have cleared._

**On July 22, 2026, AFX Trade's Arbitrum bridge did exactly what it was built to do, trust its validators, and whoever controlled five of those validator keys used that trust like a master password, [moving the most of the protocol's USDC reserve](https://defillama.com/protocol/tvl/afx-protocol) into [a wallet the code had no reason to doubt](https://arbiscan.io/address/0x2f2974fAbc54dbA33442261211c06BD20E0FEefc).** 
  
No smart contract broke, no logic failed, the bridge simply asked whether enough validators agreed the withdrawal was real, and enough of them, compromised or not, [said yes](https://x.com/QuillAudits_AI/status/2080230218648940888).

Forty-nine days after AFX proudly announced an [audit from Zellic](https://x.com/AFX_XYZ/status/2062096991543529893), the same audit that [documented zero test coverage and acknowledgments left unfixed](https://x.com/tayvano_/status/2080132658949210292), met a [two-hundred-second dispute window that disputed nothing](https://t.me/peckshield/55130).

**By the time AFX Trade suspended the bridge, the money had already crossed two networks and cleared a Uniswap auction, now resting in a [wallet holding all of the funds](https://etherscan.io/address/0x627654b2782bfc57580ecd11d40869b350b6ebac).**

_When your entire security model depends on validators never being compromised, what exactly was the code protecting?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Blockaid](https://x.com/blockaid_/status/2080080240265621680), [DefiLlama](https://defillama.com/protocol/tvl/afx-protocol), [QuillAudits](https://x.com/QuillAudits_AI/status/2080230218648940888), [Tayvano](https://x.com/tayvano_/status/2080132658949210292), [Peckshield](https://t.me/peckshield/55130), [Steven Goldfeder](https://x.com/sgoldfed/status/2080071210847674709), [AFX Trade](https://x.com/AFX_XYZ/status/2080126901205770734), [PeckShield](https://x.com/PeckShieldAlert/status/2080088731558801909), [Taylor Monahan](https://x.com/tayvano_/status/2080132658949210292), [CoinDesk](https://www.coindesk.com/tech/2026/07/23/arbitrum-based-afx-trade-drained-of-usd24-million-after-bridge-keys-compromised), [Odysseus](https://x.com/odysseas_eth/status/2080068028293611869), [Bit OK](https://bitok.org/blog/afx-bridge-hack), [Supercube](https://x.com/supercubeguy/status/2080162934140109214), [TRM Labs](https://www.trmlabs.com/resources/blog/bounties-playing-prominent-role-in-stolen-cryptocurrency-recovery-efforts), [zeroShadow](https://x.com/zeroshadow_io/status/2080688515180884173)_

**[Blockaid flagged it on July 22nd](https://x.com/blockaid_/status/2080080240265621680), and had the outline before AFX said a word.**  
  
**[The alert was blunt and specific](https://x.com/blockaid_/status/2080080240265621680):** "Blockaid detected an exploit at 2026-07-22 21:30 UTC targeting AFX, a protocol on Arbitrum. The exploit was specific to a bridge that AFX operates. Approximately 24.15M USDC has been drained thus far."  
  
No hedging, no "investigating," just a number and a target.

**[Steven Goldfeder responded within the hour](https://x.com/sgoldfed/status/2080071210847674709), and he wasn't speaking for AFX. Arbitrum's co-founder drew a boundary before the narrative could blur it:** "We can confirm that the transaction in question originated from a third party protocol, and the Arbitrum native bridge has not been hacked or exploited in any way."  
  
_One paragraph to clear the base layer, while a protocol on top of it was already unwinding._

**[AFX Trade didn't respond until](https://x.com/AFX_XYZ/status/2080126901205770734) 3 hours after [Blockaid’s initial post](https://x.com/blockaid_/status/2080080240265621680). When it did, the statement added little beyond confirmation, an incident, a paused bridge, an investigation underway. No mechanism, no new figures, no explanation of where the funds had gone.**  
  
By that point, the chain had already surfaced more detail than the official response.

[PeckShield filled in the missing path within the hour](https://x.com/PeckShieldAlert/status/2080088731558801909). The stolen USDC had moved off Arbitrum, bridged to Ethereum, and been swapped for 12,467.5 ETH, consolidated into a single address  
  
The flow was visible end to end. Funds don't wait for disclosure, they just leave traces.

**QuillAudits then collapsed the uncertainty into two lines.**  
  
_**[First:](https://x.com/QuillAudits_AI/status/2080230218648940888)** "The same validator set added at deployment is what signed off on this $24M withdrawal."_  
  
**[Then, more directly](https://x.com/QuillAudits_AI/status/2080230218648940888):** "That points to the off-chain signing system being compromised, not the contract itself."  
  
With that, the distinction was clear, the system hadn't been bypassed, it had been operated.

Then attention snapped back to AFX's own disclosures.

**[Researcher Taylor Monahan resurfaced the Zellic audit that AFX had promoted in June](https://x.com/tayvano_/status/2080132658949210292), with a blunt assessment:** The review left important gaps, including missing test coverage and unresolved acknowledgments, and that the auditors were not given a fully runnable environment.  
  
The critique landed directly beneath [AFX's June 3rd announcement of the audit](https://x.com/AFX_XYZ/status/2062096991543529893), the same post that had framed it as a milestone.  
  
**Forty-nine days separated that announcement from the withdrawal. Long enough for the audit to fade, short enough that its warnings were still current.**

_If the audit already outlined the risks in June, why did it take a validator quorum in July to make them visible?_

### The Quorum That Wasn't

_A bridge like AFX's [relies on off-chain signers to approve withdrawals](https://www.coindesk.com/tech/2026/07/23/arbitrum-based-afx-trade-drained-of-usd24-million-after-bridge-keys-compromised)._  
  
**Once enough voting power is assembled, the contract releases funds without further questioning. The mechanism itself is the design, the failure was in who controlled the keys.**

[The validator set behind AFX's bridge had been in place since the contract went live on May 12, 2026](https://x.com/QuillAudits_AI/status/2080230218648940888), and the same validator set signed the July 22 withdrawal.

[Five hot-validator signatures, representing 7,142 of 10,000 units of voting power, cleared a threshold of 6,667](https://x.com/odysseas_eth/status/2080068028293611869). That was enough to satisfy the contract exactly as written.

**Bridge Contract (exploited):**
[0xCb3B9A3E5668AFE84DC7A864B36b845dCE062e67](https://arbiscan.io/address/0xCb3B9A3E5668AFE84DC7A864B36b845dCE062e67)  
  
**Hot-Validator Signer 1:**
[0x00BB84aF06daC03BFe744Da13dF9D2D6fd8e77E5](https://arbiscan.io/address/0x00BB84aF06daC03BFe744Da13dF9D2D6fd8e77E5)  
  
**Hot-Validator Signer 2:**
[0x27259f90D6ae500262AcE6E8428434e0c1f308F5](https://arbiscan.io/address/0x27259f90D6ae500262AcE6E8428434e0c1f308F5)  
  
**Hot-Validator Signer 3:**
[0x2e26dE22a92e41704B3eA00cc65a6CDA47b12c9e](https://arbiscan.io/address/0x2e26dE22a92e41704B3eA00cc65a6CDA47b12c9e)  
  
**Hot-Validator Signer 4:**
[0x52D4D9AD78a53a69bD089eE8f282CE0Cd0506Da7](https://arbiscan.io/address/0x52D4D9AD78a53a69bD089eE8f282CE0Cd0506Da7)  
  
**Hot-Validator Signer 5:**  
[0xBB472BC3962Ad02Ac660429FdBB319B5BC66DA7b](https://arbiscan.io/address/0xBB472BC3962Ad02Ac660429FdBB319B5BC66DA7b)

_All five carry the same "AFX Trade Exploiter" tag on Arbiscan as the loot wallet and the final consolidation address._  
  
**That's not evidence the validators acted in bad faith, it's evidence the label gets applied to any address the incident touches, signer or recipient, without distinguishing between them.**
  
**[Taylor Monahan flagged that exact problem herself](https://t.me/ETHSecurity/161899):** The validator set had been labeled as attacker wallets too.  
  
[A 200-second dispute window sat between the withdrawal request and its finalization](https://x.com/odysseas_eth/status/2080068028293611869), and it did not stop the outcome.  
  
_n practice, that suggests a system designed to detect invalid state, not compromised signers, though that's an interpretation rather than a direct statement from the record._

**The broader pattern is familiar, no smart-contract bug is required when access and signing power are enough.**

Zellic's audit, [which AFX promoted in June](https://x.com/AFX_XYZ/status/2062096991543529893), focused on the contract's logic and code quality, while [Taylor Monahan later criticized it for missing test coverage and unresolved acknowledgments](https://x.com/tayvano_/status/2080132658949210292).

It could verify that a quorum threshold was implemented correctly.  
  
**Whether it could verify anything about the people behind that quorum is a different question, [AFX's own documentation says the report covers the bridge contract scope and shouldn't be read as a full-platform audit of every component](https://docs.afx.xyz/audits).**  
  
_If the contract did exactly what it was told, and the validators did exactly what their keys authorized, whose failure was this really?_

### The Ordinary Getaway  
  
_The stolen funds didn’t move like loot. They moved like routine traffic: six USDC transfers [through a shared router used by ordinary users](https://bitok.org/blog/afx-bridge-hack), then [eight UniswapX fills on Ethereum](https://bitok.org/blog/afx-bridge-hack) before being consolidated into a second wallet._  
  
**Nothing in the path was custom-built for the theft, and that's what made it effective, the attacker hid inside normal behavior.**

The withdrawal that started it all was created, cleared its dispute window, and finalized, releasing the full amount to the loot wallet.  
  
**Withdrawal Creation Transaction (submitted by the operational address, requesting the fraudulent payout):** [0x217c45c1272550e0439e53243f2987b7fb3f58b1d33c222597bbb71851b93f74](https://arbiscan.io/tx/0x217c45c1272550e0439e53243f2987b7fb3f58b1d33c222597bbb71851b93f74)  
  
**Batched Finalize Transaction (executed once the dispute window cleared, releasing $24.15M to the loot wallet):** [0x50d0b3ec6c3f5fce0f10abf81540bbb508f421494aa2b3480c4a264b0436547b](https://arbiscan.io/tx/0x50d0b3ec6c3f5fce0f10abf81540bbb508f421494aa2b3480c4a264b0436547b)  
  
**Finalizer (executes an already-authorized withdrawal, distinct from the validators who sign for it):**
[0x5553EA7Bda594aDE7AFe91D279779a42b2B84208](https://arbiscan.io/address/0x5553ea7bda594ade7afe91d279779a42b2b84208)  
  
**Pre-Exploit Gas / Operational Address (submitted the withdrawal creation transaction):** [0x32E3200D6E944cd9bD1C8C9865293B07206e7A01](https://arbiscan.io/address/0x32E3200D6E944cd9bD1C8C9865293B07206e7A01)The transfers left the loot wallet, now labeled AFX Trade Exploiter 1, for a shared CCTP router used by ordinary transfers.  
 
  
**The transfers left the loot wallet, now labeled AFX Trade Exploiter 1, and routed through BridgingKit, the shared CCTP router.**

_The amounts, 5,895,000, 655,000, 7,500,000, 5,000,000, 5,000,000, and 100,000 USDC, [summed to the stolen total exactly](https://bitok.org/blog/afx-bridge-hack)._

**Loot Wallet ("AFX Trade Exploiter 1"):**
[0x2f2974fAbc54dbA33442261211c06BD20E0FEefc](https://arbiscan.io/address/0x2f2974fAbc54dbA33442261211c06BD20E0FEefc)  
  
**Shared Bridging Router ("BridgingKit"):**
[0xB3FA262d0fB521cc93bE83d87b322b8A23DAf3F0](https://arbiscan.io/address/0xb3fa262d0fb521cc93be83d87b322b8a23daf3f0)

Each transfer burned USDC on Arbitrum and [minted it on Ethereum to the same recipient address](https://bitok.org/blog/afx-bridge-hack), no new wallet at the other end, just a new chain.

**Deposit-for-Burn Transaction (5,895,000 USDC):** [0xd59a78a56165da8c32a47c89bcb7bc2bb0960962b215b65dd6d00f4ead6fedc7](https://arbiscan.io/tx/0xd59a78a56165da8c32a47c89bcb7bc2bb0960962b215b65dd6d00f4ead6fedc7)  
  
**Deposit-for-Burn Transaction (655,000 USDC):** [0xc467e4101e570a1cf86fc9781fdb4a3a7f0618e5437608ac32c3074a3c7ff849](https://arbiscan.io/tx/0xc467e4101e570a1cf86fc9781fdb4a3a7f0618e5437608ac32c3074a3c7ff849)  
  
**Deposit-for-Burn Transaction (7,500,000 USDC):** [0x5489629ad1a9d8b4453eacb6c7585176956b07c7dbb5ee4d6384b462e31adee7](https://arbiscan.io/tx/0x5489629ad1a9d8b4453eacb6c7585176956b07c7dbb5ee4d6384b462e31adee7)  
  
**Deposit-for-Burn Transaction (5,000,000 USDC):** [0x610a6d7058236cfed3ffd761b8bc50ec670518a7a8a7a004252d080c9475d829](https://arbiscan.io/tx/0x610a6d7058236cfed3ffd761b8bc50ec670518a7a8a7a004252d080c9475d829)  
  
**Deposit-for-Burn Transaction (5,000,000 USDC):** [0xb69c938d12a67c8c60c53d9ce4e02c0c7e836519a1068c49282cba035320d496](https://arbiscan.io/tx/0xb69c938d12a67c8c60c53d9ce4e02c0c7e836519a1068c49282cba035320d496)  
  
**Deposit-for-Burn Transaction (100,000 USDC):** [0x0e5c14b52925b9a9b088d8f08923e4a4fe677685839738ebe2c0ca66fbf97f07](https://arbiscan.io/tx/0x0e5c14b52925b9a9b088d8f08923e4a4fe677685839738ebe2c0ca66fbf97f07)

_The USDC was swapped into ETH through eight UniswapX Dutch-auction fills, [settled by a solver labeled Rizzolver](https://etherscan.io/tx/0x2c92d93539ee6c5a5a64323f9d7850da220b4b04cd781bf345beba596b9b6a2d) against [Uniswap's Dutch Order Reactor V2](https://bitok.org/blog/afx-bridge-hack)._  
  
**[Total received](https://bitok.org/blog/afx-bridge-hack):** 12,467.43703738 ETH  
  
**UniswapX Fill (3,035.80133843 ETH):** [0x2c92d93539ee6c5a5a64323f9d7850da220b4b04cd781bf345beba596b9b6a2d](https://etherscan.io/tx/0x2c92d93539ee6c5a5a64323f9d7850da220b4b04cd781bf345beba596b9b6a2d)  
  
**UniswapX Fill (338.79180965 ETH):** [0x1b80124b75b7afbb7aaf018f5ca20782c9a2eab007311aef71999d1700fd7bba](https://etherscan.io/tx/0x1b80124b75b7afbb7aaf018f5ca20782c9a2eab007311aef71999d1700fd7bba)  
  
**UniswapX Fill (1,550.3074912 ETH):** [0xe505e57a1d4fe37fac6aef6e032d5a8bb8dc4e779dfc9f7491a01cb7e5d87e0d](https://etherscan.io/tx/0xe505e57a1d4fe37fac6aef6e032d5a8bb8dc4e779dfc9f7491a01cb7e5d87e0d)  
  
**UniswapX Fill (2,321.39295018 ETH):** [0xc88574ec75f8e3b7a3866f63b84b705d513d54eb76cea8141208ca4a44eebd7a](https://etherscan.io/tx/0xc88574ec75f8e3b7a3866f63b84b705d513d54eb76cea8141208ca4a44eebd7a)  
  
**UniswapX Fill (2,582.07624729 ETH):** [0xc140e82791a624dd66bab2eec6bb5e9c0df33198fdede931982ed07fdf42ca39](https://etherscan.io/tx/0xc140e82791a624dd66bab2eec6bb5e9c0df33198fdede931982ed07fdf42ca39)  
  
**UniswapX Fill (1,292.10792468 ETH):** [0x114d66d43b34d385883f3bc02c48c0de9559a6ccf7766b8c92bff06ca1a92202](https://etherscan.io/tx/0x114d66d43b34d385883f3bc02c48c0de9559a6ccf7766b8c92bff06ca1a92202)  
  
**UniswapX Fill (1,295.04346094 ETH):** [0x0b8df70bf3227a53f81566305a252c769322c005528afdb96ca94a77c926f0e2](https://etherscan.io/tx/0x0b8df70bf3227a53f81566305a252c769322c005528afdb96ca94a77c926f0e2)  
  
**UniswapX Fill (51.8658944 ETH):** [0xc155d394ca0b3e0b62b9da74ff30f7c6506722cadba06e0566213b1dc74401fd](https://etherscan.io/tx/0xc155d394ca0b3e0b62b9da74ff30f7c6506722cadba06e0566213b1dc74401fd)

One transaction moved the full ETH balance to a second wallet, tagged AFX Trade Exploiter 9.
[](https://www.cryptotimes.io/2026/07/23/cryptos-hackers-day-afx-trade-hit-for-24m-losses-reach-35-55m/)

**Final Consolidation Transaction (12,467.43703738 ETH moved):** [0x7469189aea7e9c23e2004a33fcf117968237bc1154aaa61276d9e68ddb5a21a4](https://etherscan.io/tx/0x7469189aea7e9c23e2004a33fcf117968237bc1154aaa61276d9e68ddb5a21a4)  
  
**Final Consolidation Wallet ("AFX Trade Exploiter 9"):** [0x627654B2782BFc57580ecd11d40869B350b6EBaC](https://etherscan.io/address/0x627654b2782bfc57580ecd11d40869b350b6ebac)

**Since then, [the funds fragmented across roughly two dozen addresses carrying real value, buried inside a much larger pile of dust-level noise](https://arkm.com/explorer/address/0x627654B2782BFc57580ecd11d40869B350b6EBaC), the wallet now holding a few cents where 12,467 ETH once sat.**

_The money moved. What happens to two dozen scattered pieces that a 30% offer was never built to reach?_

### The Standard Offer

_[AFX's second statement arrived less than an hour](https://x.com/AFX_XYZ/status/2080140138257207723) after [its first statement](https://x.com/AFX_XYZ/status/2080126901205770734), deeper into the incident and no clearer about what had actually happened._  
  
**[It cited SlowMist's finding that the stolen funds remained in the attacker's address](https://x.com/AFX_XYZ/status/2080140138257207723), now reported to the Crypto Defense Alliance, [a collaborative network that includes multiple exchanges and ecosystem partners, to flag and freeze suspect wallets before they move.](https://github.com/CryptoDefendersAlliance)**

**By then, [AFX's head of growth had already made the offer public:](https://x.com/supercubeguy/status/2080162934140109214)** Return 70%, keep 30%, call it a bounty.  
  
The structure was familiar, and [bounty offers have become a common enough playbook after crypto hacks](https://www.trmlabs.com/resources/blog/bounties-playing-prominent-role-in-stolen-cryptocurrency-recovery-efforts).  
  
**[The logic is simple](https://www.trmlabs.com/resources/blog/bounties-playing-prominent-role-in-stolen-cryptocurrency-recovery-efforts):** Recovering most of a loss is better than recovering none of it, especially when the stolen funds still sit in a traceable wallet.

_So far, the bounty has gone unanswered. [The wallet sat untouched for days before fragmenting, the real value scattering across roughly two dozen addresses inside a single day](https://arkm.com/explorer/address/0x627654B2782BFc57580ecd11d40869B350b6EBaC), a laundering move, not a response to the offer._

**AFX's hack also didn't happen in isolation. One week earlier, [Ostium lost $23.75 million on the same network to a manipulated price feed](https://rekt.news/ostium-rekt).**  
  
The pattern is becoming familiar, audits, alliances, and bounties all existed before the attack, and none of them stopped it.

Days later, [zeroShadow, working with SEAL, said it is highly likely the exploit is linked to UNC4899](https://x.com/zeroshadow_io/status/2080688515180884173), the North Korean group tracked as TraderTraitor.  
  
[They pointed to a match between the gas-funding pattern behind AFX's attacker wallet and the one used in the KelpDAO](https://x.com/zeroshadow_io/status/2080688515180884173) exploit months earlier.  
  
[The fragmentation itself fits the pattern](https://arkm.com/explorer/address/0x627654B2782BFc57580ecd11d40869B350b6EBaC), scattering real value across two dozen addresses inside a single day, buried under a much larger layer of dust, reads like professional laundering, not a hasty smash-and-grab.  
  
**That attribution remains preliminary, but if it holds, a 30% bounty starts to look almost beside the point.**

_If all the usual defenses were already in place, what exactly are they protecting against?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)



_Trust broke, and nothing else needed to._ 
  
**[A validator quorum said yes to a withdrawal it should never have approved](https://x.com/odysseas_eth/status/2080068028293611869), and every system built on top of that yes, the bridge, the router, the swap venue, did exactly what it was designed to do.**  
  
[The dispute window counted down honestly](https://x.com/odysseas_eth/status/2080068028293611869). The [bridging kit moved funds the way it moves funds for anyone](https://bitok.org/blog/afx-bridge-hack).  
  
Even [the bounty offer followed](https://x.com/supercubeguy/status/2080162934140109214) a [now-familiar playbook in crypto hacks](https://www.trmlabs.com/resources/blog/bounties-playing-prominent-role-in-stolen-cryptocurrency-recovery-efforts).  
  
AFX didn't fail because something broke, it failed because nothing did.  
  
[The entire $24.15 million exit ran through the bridge and a public swap](https://www.coindesk.com/tech/2026/07/23/arbitrum-based-afx-trade-drained-of-usd24-million-after-bridge-keys-compromised), pieces nobody would think twice about.  
  
**Forty-nine days after [an audit warned the codebase couldn't be fully tested](https://x.com/tayvano_/status/2080132658949210292), the keys turned out to be the one thing nobody tested at all.**

_If a hack this large can look this unremarkable at every step, how would anyone know the next one is already underway?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
