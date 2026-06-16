---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/governance
  - sector/lending
  - sector/privacy
  - sector/stable
  - sector/token
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
title: "Voltage Finance - REKT"
protocol: "[[Voltage Finance]]"
date: 2022-03-31
loss_usd: 4000000
auditors:
source: "https://rekt.news/voltage-finance-rekt"
excerpt: "Voltage Finance has been exploited for ~$4M via its partner Ola Finance. Earlier this month, a similar incident on the xDAI chain gave the teams using Compound’s code plenty of warning. But somehow, n"
genome:
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reentrancy-guard]]"
---
# Voltage Finance - REKT

> **Loss:** $4,000,000 | **Date:** 2022-03-31 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/03/voltage-header.png)

**[Voltage Finance](https://twitter.com/voltfinance/status/1509400356828049413) has been exploited for ~$4M via its “_Lending-as-a-Service_” partner [Ola Finance](https://twitter.com/ola_finance/status/1509431464521256961) on the Fuse Network.**

Rather than a Compound fork, Ola [describes itself](https://olafinance.gitbook.io/ola-finance/welcome-to-ola-finance/master) as a “_a technology provider that enables others to build Compound-like instances_”.

Earlier this month, a [similar incident](https://rekt.news/agave-hundred-rekt/) on the Gnosis / xDAI chain gave the teams using Compound’s code plenty of warning.

But somehow, neither Voltage nor Ola got the news.

_If only there was somewhere developers could keep up to date with exploits in DeFi…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**Similarly to the cases of [Agave DAO and Hundred Finance](https://rekt.news/agave-hundred-rekt/), this exploit was due to a reentrancy vulnerability in the ERC 677 standard which Fuse Network [uses](https://github.com/fuseio/fuse-bridge/tree/master/native-to-erc20/contracts/contracts) for bridged tokens.**

These token types include a _callAfterTransfer()_ function which can be abused to make additional transfers before balances are updated (provided the underlying code does not follow the recommended _checks-effects-interactions_ routine of execution).

The original Compound code does not follow this pattern, however all proposed collateral tokens are vetted for this vulnerability before being added to the protocol.

_Credit: [BlockSecTeam](https://twitter.com/BlockSecTeam/status/1509466576848064512)_

Attacker’s address on Fuse: [0x371D7C9e4464576D45f11b27Cf88578983D63d75](https://explorer.fuse.io/address/0x371D7C9e4464576D45f11b27Cf88578983D63d75/transactions)

**Example tx (BUSD):** [0x1b3e06b6b310886dfd90a5df8ddbaf515750eda7126cf5f69874e92761b1dc90](https://explorer.fuse.io/tx/0x1b3e06b6b310886dfd90a5df8ddbaf515750eda7126cf5f69874e92761b1dc90/token-transfers)

**Attacker contract A:** [0x632942c9BeF1a1127353E1b99e817651e2390CFF](https://explorer.fuse.io/address/0x632942c9BeF1a1127353E1b99e817651e2390CFF/transactions)

**Attacker contract B:** [0x9E5b7da68e2aE8aB1835428E6E0c83a7153f6112](https://explorer.fuse.io/address/0x9E5b7da68e2aE8aB1835428E6E0c83a7153f6112/internal-transactions)

**1:** Contract A transfers 550 WETH to Contract B

**2:** Contract B deposits 550 WETH, minting 27,284 oWETH 

**3:** Contract B borrows 507,216 BUSD

**4:** Contract BUSD calls back to Contract B via _callAfterTransfer()_

**5:** Contract B transfers both 507,216 BUSD and 27,284 oWETH to Contract A.

**6:** Contract A returns 27,284 oWETH to redeem initial deposit of 550 WETH and keeping the 507,216 BUSD as profit.

As BlockSecTeam [explain:](https://twitter.com/BlockSecTeam/status/1509466576848064512)

> “_In the code logic of the borrow() function, the related internal states are updated after an external call. Specifically, the doTransferOut() function will invoke the transfer() function of the ERC677-based token, which will eventually lead to an external call._”

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/03/voltage-code1.png)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/03/voltage-code2.png)

The above process was used repeatedly to take $USDC, $FUSD, $WBTC, $WETH & $FUSE.

The resulting funds were first bridged to [Ethereum](https://etherscan.io/address/0x371d7c9e4464576d45f11b27cf88578983d63d75#tokentxns) (originally [funded by Tornado Cash](https://etherscan.io/tx/0x98c46fc95b196ca35b2acb2e02bb9b6901df6a9a2e356629e9cbb42017a24efb)) and then sent on to [this address](https://etherscan.io/address/0xbcdb800d77ccaac6597830b026d6af78a1118f42#tokentxns), where they remain in the form of ETH, WBTC, USDC _(will Circle freeze these funds?)_ and FUSE, worth approximately $3.1M.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**When [Agave and Hundred](https://twitter.com/RektHQ/status/1503832693062213642) fell victim to the same attack vector, we said;**

>When one fork falls, all others have to check their foundations.

Voltage Finance didn’t do that, and that’s why they’re taking their place (#64) on [the leaderboard.](https://rekt.news/leaderboard/)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
