---
tags:
  - web3-sector/dex
  - web3-sector/governance
  - web3-sector/lending
  - web3-sector/oracle
  - web3-sector/privacy
  - web3-sector/rwa
  - web3-sector/stable
  - web3-sector/vault
  - trigger/governance-vote
  - type/hack
  - vector/access-control
  - vector/price-manipulation
  - vector/private-key
  - vector/reentrancy
title: "Term Labs - Rekt"
protocol: "Term Labs"
date: 2026-08-23
loss_usd: 8500000
audit: "N/A"
source: "https://rekt.news/term-labs-rekt"
excerpt: "Near-zero voter participation let one wallet seize control of Term Labs’ vaults for minimal cost, bypass the governance delay, and drain approximately $8.5 million. The attack exploited governance, no"---
# Term Labs - Rekt

> **Loss:** $8,500,000 | **Date:** 2026-08-23 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/term-labs-rekt-header.png)





_Half an Ether bought a controlling stake, and it was still overpaying._

**On August 23, [Term Lab's vaults lost roughly $8.5 million to an attacker](https://www.theblock.co/news/defi/2026-08-23-defi-lending-protocol-term-finance-loses-an-estimated-8-5-million-to-governance-exploit-412543) who did not need to exploit a defect in the core vault code.**  
  
[A small amount of capital was enough to acquire 90.7% of the ETH Meta Vault’s voting supply](https://x.com/0x3b33/status/2091466221602406855) and all of the voting supply in five USDC vaults.  
  
[That single deposit handed one wallet total control over all five USDC vaults and roughly 91% of the ETH Meta Vault’s voting supply](https://x.com/0x3b33/status/2091466221602406855), a majority built entirely out of everyone else’s absence.  
  
Six days later, [the proposal it had quietly filed became executable on schedule](https://x.com/0x3b33/status/2091466221602406855).  
  
**[Its opening actions set the Zodiac Delay module’s cooldown and expiration to zero](https://x.com/CDSecurity_io/status/2091869490078183720), eliminating the transaction delay that was supposed to slow dangerous actions.**

_**[What followed was procedure, not improvisation](https://x.com/0x3b33/status/2091466221602406855):** Capital was recalled from legitimate strategies, and an attacker-controlled strategy contract was added to the vault, assigned an effectively unlimited debt ceiling, and funded with the recalled assets._

[Approximately 2,843 WETH and 1.68 million USDC](https://x.com/PeckShieldAlert/status/2091452165932175659) were drained.

[Term Labs confirmed](https://x.com/term_labs/status/2091428394130886740) the governance exploit.  
  
**[At the time of AMLBot's August 23 monitoring update](https://x.com/AMLBotHQ/status/2091579185437540514), the consolidated proceeds had not moved.**

_When the only thing standing between a vault and its own governance is a vote nobody bothers to cast, was the timelock ever protecting anyone?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [The Block](https://www.theblock.co/news/defi/2026-08-23-defi-lending-protocol-term-finance-loses-an-estimated-8-5-million-to-governance-exploit-412543), [Pyro](https://x.com/0x3b33/status/2091466221602406855), [CD Security](https://x.com/CDSecurity_io/status/2091869490078183720), [PeckShield](https://x.com/PeckShieldAlert/status/2091452165932175659), [Term Labs](https://x.com/term_labs/status/2091428394130886740), [AMLBot](https://x.com/AMLBotHQ/status/2091579185437540514), [Defimon](https://x.com/DefimonAlerts/status/2091422624249217259?s=20), [CertiK](https://x.com/CertiKAlert/status/2091433962795106499), [Yearn](https://x.com/yearnfi/status/2091599858323075144?s=20), [crypto.news](https://crypto.news/term-labs-vault-exploit-drains-estimated-8-5m/)_

**[Defimon caught it first on August 23](https://x.com/DefimonAlerts/status/2091422624249217259?s=20), a Decurity monitoring bot posted two transaction hashes and two attacker addresses.**  
  
**[Defimon identified the apparent mechanism before Term Labs had spoken](https://x.com/DefimonAlerts/status/2091422624249217259?s=20):** The attacker had "cheaply acquired a majority of a sparsely-held DAO governance token, then passed malicious proposals to seize control of Term's vaults."

**[Term Labs responded shortly afterward, without a loss estimate or technical explanation](https://x.com/term_labs/status/2091428394130886740):** "We are aware of a governance exploit impacting Term vaults. We will share more details once it has been further investigated."

[CertiK identified the address that held the proceeds and estimated the loss](https://x.com/CertiKAlert/status/2091433962795106499) at roughly $8.5 million.  
  
_[PeckShield added further tracing](https://x.com/PeckShieldAlert/status/2091452165932175659), reporting that approximately 2,843 ETH and 1.68 million USDC had been removed, that the USDC had been swapped into DAI, and that the attacker's initial funding appeared to trace to 2 ETH from Tornado Cash._

**[Yearn later said Term’s vault contracts were built on Yearn V3 architecture](https://x.com/yearnfi/status/2091599858323075144?s=20), but the exploit ran through a custom governance wrapper and did not apply to standard Yearn vault setups. It added that funds in standard Yearn vaults were safe and unaffected.**

  
In a later public update, [Term Labs said all Term Meta Vaults had been shut down irreversibly and their DAO governance roles revoked](https://x.com/term_labs/status/2091667425129304215); the shutdown permanently prevented further deposits, while withdrawals remained open.  
  

[It also said its investigation so far indicated that the underlying Term protocol and direct borrowing and lending markets](https://x.com/term_labs/status/2091667425129304215) had not been affected.

By then, third-party monitors had already mapped the principal transaction flows, [identified the attackers](https://x.com/DefimonAlerts/status/2091422624249217259?s=20) and [consolidation addresses](https://x.com/CertiKAlert/status/2091433962795106499), and [publicly estimated the damage](https://x.com/CertiKAlert/status/2091433962795106499).  
  
**Term still had not explained the critical authorization question, how a wallet with minimal economic exposure could acquire effective governance control in the first place.**

_If outside researchers could reconstruct the essential on-chain picture before midday, why did Term's end-of-day update disclose less than the public record had already established?_

### The Master Key  
  
_The vulnerability was not a bug in Term's core vault contracts._  
  
**It was governance arithmetic, paired with governance authority broad enough to turn that arithmetic into an $8.5 million exit.**

[Term's Strategy Vaults used Aragon TokenVoting](https://x.com/0x3b33/status/2091466221602406855), with voting power represented separately from ordinary vault shares.  
  
[Term’s voting token was a wrapper around vault shares](https://x.com/0x3b33/status/2091466221602406855). To obtain voting power, users had to deposit into a strategy vault and then opt in by wrapping their shares into the governance token. Depositing alone gave them no voting power. [Almost nobody wrapped](https://x.com/0x3b33/status/2091466221602406855).  
  
On the ETH Meta Vault, [total voting-token supply was 0.5352](https://x.com/0x3b33/status/2091466221602406855). The attacker held 0.4852, or roughly 90.7% of the supply, [after depositing about 0.5 ETH and wrapping the resulting vault shares](https://x.com/0x3b33/status/2091466221602406855).  
  
**Across the USDC vaults, governance-token supply was similarly negligible; [reporting indicates the attacker held all active voting power in four of the five affected USDC vaults](https://x.com/0x3b33/status/2091466221602406855).**

_**[The formal settings did not look reckless in isolation](https://x.com/0x3b33/status/2091466221602406855):** A 50% support threshold, 5% minimum participation, and a voting window of just over six days._  
  
But thresholds do not create opposition. When a single wallet constitutes nearly all active voting power, every threshold becomes a formality.  
  
[And because the minimum proposer-voting-power setting was zero](https://x.com/0x3b33/status/2091466221602406855), opening a proposal required no voting power.  
  
**[The proposal was titled “Veto strategy vault parameter change,” using the format the curator used for routine parameter updates](https://x.com/0x3b33/status/2091466221602406855):** “Vote YES to VETO the curator’s proposed vault parameter changes. Otherwise, the transaction will become executable when this proposal expires.”  
  
_To anyone scrolling through governance, [it looked like a normal veto item](https://x.com/0x3b33/status/2091466221602406855)._

**Underneath, however, [were 17 actions](https://x.com/0x3b33/status/2091466221602406855).**  
  
**[The first three reconfigured the Zodiac Delay module:](https://x.com/CDSecurity_io/status/2091869490078183720)** They set its roughly seven-day cooldown to zero, set its expiration to zero, and enabled an attacker-controlled executor.  
  
[The remaining actions recalled capital from all four real ETH strategies](https://x.com/0x3b33/status/2091466221602406855), added an attacker-controlled strategy deployed under the name “Fixed Recipient WETH Exit Strategy,” [set its maximum debt limit to uint256 max, and pushed the vault’s entire balance into it](https://x.com/0x3b33/status/2091466221602406855).  
  
_**The important distinction is this:** Low governance participation made control cheap, but the governance route also had enough authority to reconfigure the mechanism meant to delay dangerous transactions._  
  
**The same process intended to provide oversight could alter its own restraint.**  
  
Whether that authority reflected an intentional design choice, a misconfiguration, or a distinct authorization failure remains unanswered.

[The available public reconstruction does not indicate reentrancy](https://x.com/CDSecurity_io/status/2091869490078183720), oracle manipulation, or private-key compromise.  
  
**The attacker needed only to notice that governance was effectively unattended, and that the gatekeeper had been given the keys to its own lock.**

_If a delay module can be disabled by the same proposal it is meant to slow, what exactly is it a safeguard against?_

### Nowhere to Go

_The attacker drained the vaults in two transactions roughly 22 minutes apart, using the same governance playbook._  
  
**[At approximately 06:25 UTC on August 23, the ETH Meta Vault proposal became executable](https://x.com/CDSecurity_io/status/2091869490078183720). Seconds later, the attacker called executeProposal().**  
  
[The transaction recalled capital from four existing strategies](https://x.com/0x3b33/status/2091466221602406855), registered an attacker-controlled strategy, assigned it an effectively unlimited debt ceiling, and used that strategy to move the recalled WETH out of the vault.  
  
[Approximately 2,841.74 WETH was extracted](https://x.com/0x3b33/status/2091466221602406855) from the ETH Meta Vault.  
  
**[The proposal recalled WETH from four ETH Meta Vault strategies](https://x.com/CDSecurity_io/status/2091869490078183720):** Shorewoods ETH, August Digital ETH, Parity Prime ETH, and Parity Core ETH  
  
**Proposal Execution Exploit Transaction 1:** [0xd354a15b15cb73d30908f411aee3f795ec86737a4d080e9a818ac4d6d3014129](https://etherscan.io/tx/0xd354a15b15cb73d30908f411aee3f795ec86737a4d080e9a818ac4d6d3014129)

_At approximately 06:47 UTC, [a second attacker wallet executed the same pattern against five USDC vaults in a single transaction](https://x.com/0x3b33/status/2091466221602406855), draining approximately 1,679,639 USDC._

**Proposal Execution Exploit Transaction 2:** [0x9f273f9a5a20c2fc957b06bbfa45db486390eede4a7f44fbe1a2eb6744c2e8a0](https://etherscan.io/tx/0x9f273f9a5a20c2fc957b06bbfa45db486390eede4a7f44fbe1a2eb6744c2e8a0)

**Attacker Wallets:**
[0xa908b3472d76e7744bab0a5911768a4a6300612b ](https://etherscan.io/address/0xa908b3472d76e7744bab0a5911768a4a6300612b)[0x686457a7468b9b31c5dba43b1b16077b48520691](https://etherscan.io/address/0x686457a7468b9b31c5dba43b1b16077b48520691)

[AMLBot reported that both wallets appeared to have been seeded](https://x.com/AMLBotHQ/status/2091579185437540514) with roughly 1 ETH from Tornado Cash before the attack.  
  
That provenance may complicate attribution, but it does not, by itself, identify an operator or establish a link to any particular person or group.

[The USDC was later swapped into DAI.](https://x.com/PeckShieldAlert/status/2091452165932175659) The ETH/WETH and stablecoin proceeds then converged at a single address:

**Consolidation Address:**
[0xD5183d8BfC65a50863C62aF2538198A8288FFc13](https://etherscan.io/address/0xD5183d8BfC65a50863C62aF2538198A8288FFc13)

_[At the time of the cited monitoring reports](https://x.com/PeckShieldAlert/status/2091452165932175659), the address held roughly 2,843 ETH and 1.68 million DAI, representing an estimated loss of approximately $8.5 million._  
  
**Since then, 300 ETH was transferred from the [Consolidation Address](https://etherscan.io/address/0xD5183d8BfC65a50863C62aF2538198A8288FFc13) to [another address](https://etherscan.io/address/0xC14007663A5bb9F13d4d2AEE8c6FE9075eF1d83e), then cashed out through Tornado Cash.**  
  
**Wallet used to cash out through Tornado Cash:**  
[0xC14007663A5bb9F13d4d2AEE8c6FE9075eF1d83e](https://etherscan.io/address/0xC14007663A5bb9F13d4d2AEE8c6FE9075eF1d83e)

**Tornado Cash Movement:**  
[3 Transactions can be seen here](https://etherscan.io/txs?a=0xC14007663A5bb9F13d4d2AEE8c6FE9075eF1d83e&f=2)

For now, most of the proceeds remain consolidated and publicly traceable.  
  
**Whether the first transfer reflects a shift toward laundering, a test of the route, or something else remains unknown.**

_Most of the remaining funds are visible on-chain. That does not make them recoverable. What, then, was the system actually designed to protect?_

### The Governance Gap

_[Term's Strategy Vaults were ERC-4626 tokenized vaults](https://www.theblock.co/news/defi/2026-08-23-defi-lending-protocol-term-finance-loses-an-estimated-8-5-million-to-governance-exploit-412543) built on Yearn V3 infrastructure._

**[Yearn said the attack occurred through Term's custom governance wrapper and did not affect](https://x.com/yearnfi/status/2091599858323075144?s=20) standard Yearn vault deployments.**

That distinction may mean little to depositors.

**[The underlying contracts appear to have executed the actions authorized by the proposal](https://x.com/0x3b33/status/2091466221602406855):** recalling WETH from four strategies, adding the attacker-controlled strategy, assigning it an effectively unlimited debt ceiling, and transferring the vault’s funds to it.  
  
The critical failure was not necessarily an unauthorized call into the vault. It was the system's definition of authorization.

_An audit can identify technical flaws, dangerous permissions, and insecure governance assumptions._  
  
**But an audit cannot make passive tokenholders participate, nor can sound implementation compensate for a governance token whose active voting supply is so thin that meaningful control costs a fraction of the assets it commands.**  
  
In Term's case, the risk sat above the core vault logic, in who could govern, how cheaply they could obtain control, and whether a single successful proposal could rewrite the controls intended to limit it.

[Term had been here before](https://www.term.finance/post/tethpostmortem). In April 2025, a decimal-precision mismatch introduced during an update to Term's tETH oracle caused incorrect pricing and [triggered roughly 918 ETH in unintended liquidations](https://www.term.finance/post/tethpostmortem).  
  
[Term attributed the incident to operational execution error, rather than a smart-contract exploit.](https://www.term.finance/post/tethpostmortem) The protocol said it had recovered about 556 ETH, reducing the final protocol loss to 362 ETH ($650k), [and that all affected users would be fully reimbursed](https://www.term.finance/post/tethpostmortem).  
  
_[Its postmortem also committed Term to mandatory third-party validation for critical oracle updates and protocol parameter changes](https://www.term.finance/post/tethpostmortem), alongside full governance transparency through public proposals._

**Sixteen months later, the governance layer, not the price oracle, became the attack surface.**

After the recent August incident, [Term shut down all Meta Vaults, revoked their DAO governance roles, and permanently closed them to new deposits while keeping withdrawals open.  
  
[The team said its investigation had not found an impact on the core Term protocol or its direct borrowing and lending markets](https://x.com/term_labs/status/2091667425129304215), while stressing that its review was ongoing.

As of the available reporting, [Term had not published a full transaction-level explanation or completed technical postmortem, nor a recovery and reimbursement plan for the reported $8.5 million loss.](https://crypto.news/term-labs-vault-exploit-drains-estimated-8-5m/)The attacker's transactions may have executed successfully within the authority the system had granted them.  
  
**That does not make the outcome inevitable, nor does it make remediation impossible.**  
  
_It makes the unanswered question more uncomfortable: If governance could authorize the removal of the safeguards meant to contain governance, what exactly was audited, and what was left to trust?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_A small amount of capital decided who governed millions in depositor funds._  
  

**[Term Finance did not lose approximately $8.5 million](https://x.com/PeckShieldAlert/status/2091452165932175659) because an attacker discovered a broken line of core vault code.**  
  
It lost that money because almost nobody was participating in the governance system.

[In five USDC vaults, the attacker held all of the voting tokens; in the ETH Meta Vault](https://x.com/0x3b33/status/2091466221602406855), the attacker held 90.7% of the voting supply.  
  
[The proposal that authorized the drain was presented in the same format as the curator’s routine parameter updates](https://x.com/0x3b33/status/2091466221602406855), then [used its opening actions to disable the mechanism intended to slow it down](https://x.com/CDSecurity_io/status/2091869490078183720).  
  
_[The attacker needed six days](https://x.com/0x3b33/status/2091466221602406855), a routine-looking title that presented the proposal as an ordinary veto item, and [a delay module that governance itself had been allowed to reconfigure](https://x.com/CDSecurity_io/status/2091869490078183720)._

**[Term has since shut down the Meta Vaults, revoked their DAO governance roles](https://x.com/term_labs/status/2091667425129304215), and closed them to new deposits while keeping withdrawals open.**  
  
As of the available reporting, it had not publicly explained why those safeguards could be altered through the same governance process they were intended to constrain.

The reported $8.5 million remains notable not because the attacker was uniquely clever, but because DAOs continue to relearn the same lesson at different price points.  
  
**Decentralization on paper is not a security control when participation is absent in practice.**

_If governance can be captured for the price of a few dollars' worth of vault shares and still call itself decentralized, whose vault was it actually protecting?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
