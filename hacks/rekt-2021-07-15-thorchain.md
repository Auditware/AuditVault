---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/lending
  - sector/privacy
title: "THORChain - REKT"
protocol: "[[Thorchain]]"
date: 2021-07-15
loss_usd: 5000000
auditors:
source: "https://rekt.news/thorchain-rekt"
excerpt: "Even the old gods cannot escape the exploits. As the cross-chain attacks continue, THORChain becomes the latest victim. $5 million lost."
genome:
  - "[[bridge-message-validation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# THORChain - REKT

> **Loss:** $5,000,000 | **Date:** 2021-07-15 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/thor-header.png)
**Even the old gods cannot escape the exploits.**

As the cross-chain attacks continue, THORChain becomes the latest victim.

**$5 million taken in various assets from the recently updated THORChain Bifrost bridge code.**

Cronje wrote that [innovation leads to exploitation](https://twitter.com/AndreCronjeTech/status/1415909394643132417?s=20), but as attacks are so common, it seems that so does [replication](https://www.rekt.news/saddle-finance-rekt/), or even [slight alteration](https://www.rekt.news/shitcoins/). 

The number of names listed on our [leaderboard](https://www.rekt.news/leaderboard/) is steadily rising, and these are not all fast forks or cheap copy-paste protocols. 

THORChain has a dedicated user base, and their peak market cap reached [nearly $5 billion](https://www.coingecko.com/en/coins/thorchain) just two months ago (now at $1.2B).

_How can such an established platform still fall victim to an anonymous attacker?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/thor-investigates.png)

**Attacker Wallet:** [0x3a196410a0f5facd08fd7880a4b8551cd085c031](https://etherscan.io/address/0x3a196410a0f5facd08fd7880a4b8551cd085c031)

**Contract Address:** [0x4a33862042d004d3fc45e284e1aafa05b48e3c9c](https://etherscan.io/address/0x4a33862042d004d3fc45e284e1aafa05b48e3c9c)

**Tornado Address:** [0x4b713980d60b4994e0aa298a66805ec0d35ebc5a](https://etherscan.io/address/0x4b713980d60b4994e0aa298a66805ec0d35ebc5a)

According to ThorChain’s preliminary [incident report](https://thearchitect.notion.site/THORChain-Incident-07-15-7d205f91924e44a5b6499b6df5f6c210), the bug was located within the ETH Bifrost (bridge) [code](https://gitlab.com/thorchain/thornode/-/blob/develop/bifrost/pkg/chainclients/ethereum/ethereum_block_scanner.go#L794).

The code contains an over-ride loop, designed only for use in _vaultTransferEvent_ transactions, which the hacker was able to manipulate. The hacker was able to wrap the router with their own [contract](https://etherscan.io/address/0x4a33862042d004d3fc45e284e1aafa05b48e3c9c), allowing them to access this over-ride.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/thor-code.png)

A transaction was sent with call value of 0 and deposit amount of 0. However, the over-ride loop caused the transaction’s msg.value, set at 200, to be mistakenly read as the txvalue().

**The exploit was then used in a loop, draining liquidity in various coins:**

- 2,500 ETH
- 57,975.33 SUSHI
- 8.7365 YFI
- 171,912.96 DODO
- 514.519 ALCX
- 1,167,216.739 KYL
- 13.30 AAVE

**Although the code contains a comment that explicitly states...**

>”// it is important to keep this part outside the above loop”

… the vulnerability was left open, and looks to have been a costly oversight for the ThorChain team.

According to the incident report:

>”The fix is to make the over-ride only happen if it specifically is a vaultTransferEvent”

**It seems this is something that could have been foreseen and prevented long ago.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**Creating a secure cross-chain bridge is one of the most important milestones for the industry right now, and the race is on to be the first to provide it.**

As [AAVE have hinted](https://twitter.com/lemiscate/status/1414978778489659394?s=20) that they will release something soon, it seems that this is a prize even the giants of DeFi cannot resist fighting for.

_If innovation really does lead to exploitation, then there are many more stories yet to be told..._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-text-linebreak.png)
