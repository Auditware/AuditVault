---
tags:
  - sector/governance
  - sector/privacy
title: "Tornado Cash Governance - REKT"
protocol: "[[Tornado Cash Governance]]"
date: 2023-05-20
loss_usd: 750000
auditors:
source: "https://rekt.news/tornado-gov-rekt"
excerpt: "Cypherpunks strive to become ungovernable... but not like this. Tornado Cash's governance has been taken hostage via a trojan horse proposal. But now the hacker is proposing reversing the effects of t"
genome:
  - "[[access-roles]]"
  - "[[governance-voting-power-snapshot]]"
---
# Tornado Cash Governance - REKT

> **Loss:** $750,000 | **Date:** 2023-05-20 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/tornado-gov-header.png)

**Cypherpunks strive to become ungovernable…**

_…but not like this._

**In a whirlwind of events, Tornado Cash's governance has been taken hostage via a trojan horse proposal, effectively granting control of the DAO to a single address.**

While the contracts do not allow for draining of the [~$275M](https://defillama.com/protocol/tornado-cash) in the privacy pools themselves, the exploiter gained control of the TORN governance token, the power to modify the router to reroute deposits/withdrawals, and admin status over Nova, the Gnosis chain deployment.

_However, it seems not all is lost._

**Yesterday, just before midday UTC, the exploiter [published](https://etherscan.io/address/0x1FAd009aD35689B5a9B91486148F2F32AFE31e23) another proposal to revert the changes.**

As long as there are no nasty surprises this time, this could be a bullet dodged for the Tornado Cash community.

_Repentant grey-hat?_

_Lazarus [intern](https://twitter.com/KyleSt4rgarden/status/1660396019946000384)?_

_Or maybe the hacker is just looking to [pump and dump](https://twitter.com/0xngmi/status/1660405878619611138) their remaining TORN?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[samczsun](https://twitter.com/samczsun/status/1660012956632104960), [SlowMist](https://twitter.com/SlowMist_Team/status/1660252800406659073), [BlockSec](https://twitter.com/BlockSecTeam/status/1660214665429876740), [Apoorv Lathey](https://twitter.com/apoorvlathey/status/1660355712353189888)_

**It’s been a tough year for DeFi’s go-to crypto mixer.**

From the [OFAC sanctions](https://rekt.news/eye-of-the-storm/) levelled in August, and the [jailing](https://rekt.news/winds-of-change/) of core developer, Alexey Pertsev, now [released](https://twitter.com/alex_pertsev/status/1651961639388815363) pending trial.

Last week there were [worries](https://twitter.com/spreekaway/status/1659129830330310657) that someone was attempting to exploit Tornado’s governance system, creating multiple addresses and locking 0 TORN to the governance vault. Given that nothing immediately came of it, it was [dismissed](https://forums.tornadocash.community/t/analysis-of-a-possible-attempt-at-a-failed-exploit/178) as a failed attempt.

**Was it a decoy, perhaps?**

_Or a preparatory move?_

Exploiter address 1: **[0x092123663804f8801b9b086b03b98d706f77bd59](https://etherscan.io/address/0x092123663804f8801b9b086b03b98d706f77bd59)**

Exploiter address 2: **[0x592340957ebc9e4afb0e9af221d06fdddf789de9](https://etherscan.io/address/0x592340957ebc9e4afb0e9af221d06fdddf789de9)**

The successful attack was smuggled in under cover of a proposal to [penalise certain ‘cheating’ relayers](https://twitter.com/samczsun/status/1660012960176279552/photo/1). While the code purportedly used the same logic as a [previous proposal](https://forums.tornadocash.community/t/16-relayer-registry-penalisation-and-configuration/129), the attacker had added an [extra function](https://twitter.com/samczsun/status/1660012960176279552/photo/2) which allowed them to selfDestruct the contract.

The [proposal contract](https://etherscan.io/address/0xC503893b3e3c0C6b909222b45f2a3a259a52752D) itself was published via a deployer contract. By [combining](https://twitter.com/apoorvlathey/status/1660355712353189888) CREATE and CREATE2 opcodes, the attacker could take advantage of their deterministic deployment to deploy new code into the address approved by governance.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/tornado-gov-contracts.png)

Using [selfDestruct](https://etherscan.io/tx/0xd3a570af795405e141988c48527a595434665089117473bc0389e83091391adb), the hacker was then able to erase the approved code, simultaneously resetting their nonce, and allowing for a redeployment of the malicious contract at the same address.

BlockSec’s Yajin Zhou [explains](https://twitter.com/yajinzhou/status/1660310706644721664):

>Option I: Use CREATE2 opcode to create a malicious proposal contract. This will raise a flag since CREATE2 and self-destruct are used together.
>
>Option II: Use CREATE2 to create the deployer contract (0x7dc8), which further deploys the malicious proposal contract (0xc503) using CREATE.
>
>Then the deployer contract is self-destructed (to reset the nonce), and it can create a new proposal at the same address (0xc503).
>
>4/ That's because the address of the deployed contract using CREATE depends on the sender and nonce (nonce = 1), enabling the attacker to create a new proposal with the same address (0xc503)

_These techniques for creating ‘[metamorphic contracts](https://0age.medium.com/the-promise-and-the-peril-of-metamorphic-contracts-9eb8b8413c5e)’ are one reason that some have [called for](https://hackmd.io/@vbuterin/selfdestruct) the selfDestruct opcode to be deprecated._

The malicious proposal then assigned 10,000 TORN to all addresses created in last week’s (_presumed_) failed exploit. These were unlocked and [withdrawn](https://twitter.com/samczsun/status/1660094606019825664) from the vault, granting the exploiter 1.2M votes (against 700k legitimate votes) and full control of Tornado governance.

See [BlockSec’s chart](https://t.co/OHCCzl5RUY) for a full breakdown of the attack stages:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/tornado-gov-flow.png)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**In unexpected turn of events, the exploiter later [published](https://etherscan.io/address/0x1FAd009aD35689B5a9B91486148F2F32AFE31e23#code) a proposal to [revert the effects](https://forums.tornadocash.community/t/attacker-has-a-new-proposal-to-potentially-restore-the-state-of-governance/183/) of their hostile takeover, handing back control to the DAO as before.**

Apart from the 430 ETH (~$750k) profit from dumping TORN (_any guesses where the attacker [chose to launder](https://etherscan.io/address/0x092123663804f8801b9b086b03b98d706f77bd59?toaddress=0xd90e2f925da726b50c4ed8d0fb90ad053324f31b) the profits?_), the hacker may have [other motivations](https://twitter.com/0xdface/status/1660395508521738240):

>Either they're giga trolling or it will end up being an expensive but not disastrous lesson in Governance security.

As community member Tornadosaurus-Hex [pointed out](https://forums.tornadocash.community/t/attacker-has-a-new-proposal-to-potentially-restore-the-state-of-governance/183/4):

>I mean note that we don’t even have a choice in regards to this proposal but it is still important nonetheless.

**Hopefully, this devastating (albeit impressively crafted) exploit will have a happy ending.**

Should it have been spotted? _Maybe._

But with [recent trouble](https://forums.tornadocash.community/t/18-audit-reimbursement-and-remuneration-q2/150) amongst [contributors](https://twitter.com/deomaius/status/1649910369467473930), perhaps the DAO was not at full strength.

The [warning](https://twitter.com/deomaius/status/1649910385305108489) “_You will be at the helm of negligent tokenholders._” reads as stunningly prescient, in hindsight.

However we got here, hopefully this all turns out to have been nothing more than a _storm in a teacup_.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
