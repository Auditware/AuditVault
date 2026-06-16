---
tags:
  - blockchain/arbitrum
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/multisig
  - sector/privacy
  - sector/stable
  - sector/staking
  - has/audit
  - impact/loss-of-funds/direct-drain
title: "Hope Finance - REKT"
protocol: "[[Hope Finance]]"
date: 2023-02-20
loss_usd: 1860000
auditors:
  - "[[AuditRateTech]]"
  - "[[Cognitos]]"
source: "https://rekt.news/hope-finance-rekt"
excerpt: "Abandon Hope all ye who enter here. $1.86M was rugged from Hope Finance yesterday. It’s impossible to know whether the doxxed individual accused by the team is truly to blame. Don’t get your Hopes up."
genome:
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# Hope Finance - REKT

> **Loss:** $1,860,000 | **Date:** 2023-02-20 | **Audited by:** AuditRateTech, Cognitos

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/hope-header.png)

_Abandon Hope all ye who enter here._

**$1.86M was stolen from Hope Finance on Monday.**

The project, an Arbitrum-based Tomb-fork, published a [tweet](https://twitter.com/Hope_fin/status/1627798681121333249) accusing a team member of rugging the project, along with KYC information.

>FUCKING SCAMMER!!!! HE SCAMMED COMMUNITY FOR 2 MLN DOLLARS

The official comms didn’t mince their words, even as they [advised users](https://twitter.com/Hope_fin/status/1627941848206516224) on how to use the emergencyWithdraw function to attempt to salvage funds:

>Steps to withdraw your staked LP from the this fucking scam protocol

While the official story may be of a dev gone rogue, the tx preparing the rug was approved by all three accounts on the team’s multisig. And faked KYC is not hard to come by.

For users, the situation seems…

_Hopeless._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Certik](https://twitter.com/CertiKAlert/status/1627990499729588226)_

**Funds were drained (~$800k in [WETH](https://arbiscan.io/tx/0x322044859fa8e000c300a193ee3cac98e029a2c64255de45249b8610858c0679) and ~$1M in [USDC](https://arbiscan.io/tx/0x98a6be8dce5b10b8e2a738972e297da4c689a1e77659cdfa982732c21fa34cb5)) from [GenesisRewardPool](https://arbiscan.io/address/0x1fc2ac2651e1959d9ae86c6b2270aaf3d799e56c#code) contract at launch.**

According to [Certik’s analysis](https://twitter.com/CertiKAlert/status/1627990499729588226):

>In preparation for the [@hope_fin](https://twitter.com/Hope_fin) exit scam, a fake router was deployed in txn 0xf188.
>
>The SwapHelper was then updated to use this fake router in txn [0xc9ee](https://arbiscan.io/tx/0xc9ee5ed274a788f68a1e19852ccaadda7caa06e2070f80efd656a2882d6b77eb). This txn was approved by all 3 owners of Hope’s multisig [0x8ebd](https://arbiscan.io/address/0x8ebd0574d37d77bdda1a40cdf3289c9770309aa7).
>
>In txn 0x1b47, ` _swapExactTokenForTokens` variable was set to wallet address, [0x957D](https://arbiscan.io/address/0x957d354d853a1ff03dda608f3577d24ea18fcece).
>
>When `GenesisRewardPool.openTrade()` is called to borrow USDC, GenesisRewardPool transfers WETH to TradingHelper to convert to USDC.
>
>Instead of swapping, [USDC was sent](https://arbiscan.io/tx/0x98a6be8dce5b10b8e2a738972e297da4c689a1e77659cdfa982732c21fa34cb5) to 0x957D.
>
>As the `_uSDC` address was deliberately left empty, the receiving address ([0x957D](https://arbiscan.io/address/0x957d354d853a1ff03dda608f3577d24ea18fcece)) was passed to v2 and the `swapExactTokensForTokens()` [transferred 477 WETH](https://arbiscan.io/tx/0x322044859fa8e000c300a193ee3cac98e029a2c64255de45249b8610858c0679) to 0x957D.

**Rug puller prep address: [0xdfcb9a03fbe9f616ee6827cd1b753238d53c6145](https://arbiscan.io/address/0xdfcb9a03fbe9f616ee6827cd1b753238d53c6145)**

**Rug puller receiving address ([ETH](https://etherscan.io/address/0x957d354d853a1ff03dda608f3577d24ea18fcece), [ARBI](https://arbiscan.io/address/0x957d354d853a1ff03dda608f3577d24ea18fcece)): 0x957d354d853a1ff03dda608f3577d24ea18fcece**

Hope Finance Multisig: [0x8ebd0574d37d77bdda1a40cdf3289c9770309aa7](https://arbiscan.io/address/0x8ebd0574d37d77bdda1a40cdf3289c9770309aa7)

**The USDC received was swapped to ETH, for a total of 1095 ETH, which was then bridged to Ethereum via Celer and finally deposited into Tornado Cash.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

The project had two audits prior to launch, by [Cognitos](https://twitter.com/CognitosAudit) (the code [passed](https://www.cognitos.io/hopefinance-farmingcontract-audit) despite auditors flagging two ‘major’ issues, neither of which related to the mechanism used to rug) and [AuditRateTech](https://twitter.com/AuditRateTech) (who appear to have deleted the [audit report](https://auditrate.tech/images/pdf/GenesisRewardPool_0x95bCc720EC902012fFB02b7E0Aea30209D2C6e3B.pdf), although a [KYC certificate](https://auditrate.tech/certificate/certificate_Hope_Finance.html) still remains on their site).

**It’s impossible to know whether the doxxed individual accused by the team is truly to blame.**

_According to Streetview, the address given in the ID is a [vacant lot](https://twitter.com/DirtMcGirt_21/status/1627920957594640385)._

And with many other possible explanations: bought KYC or even framed by someone else from the project with access to official comms.

_It’s possible that this case will end in whoever is responsible being brought to justice…_

**But don’t get your Hopes up.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
