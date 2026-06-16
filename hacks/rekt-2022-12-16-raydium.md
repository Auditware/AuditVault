---
tags:
  - blockchain/ethereum
  - blockchain/solana
  - sector/bridge
  - sector/dex
  - sector/privacy
  - sector/stable
  - impact/loss-of-funds/direct-drain
  - precondition/insider
title: "Raydium - REKT"
protocol: "[[Raydium]]"
date: 2022-12-16
loss_usd: 4400000
auditors:
source: "https://rekt.news/raydium-rekt"
excerpt: "On Friday, Raydium, a Solana-based AMM, lost a total of $4.4M in fees from its liquidity pools. Post-FTX, the future of Solana feels uncertain..."
genome:
  - "[[direct-drain]]"
  - "[[insider]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# Raydium - REKT

> **Loss:** $4,400,000 | **Date:** 2022-12-16 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/12/raydium-header.png)

_The latest entry on our [leaderboard](https://rekt.news/leaderboard/) comes from a post-FTX wasteland, once a promising hive of VC-backed dev activity._

**On Friday, [Raydium](https://raydium.io/), a Solana-based AMM, lost a total of ~$4.4M in fees from its liquidity pools.**

The alarm was [raised](https://twitter.com/prism_ag/status/1603752282083950592) by the DEX aggregator PRISM, also on Solana:

>There seems to be a wallet is draining LP Pools from Raydium liquidity pools using admin wallet as a signer without having/burning LP tokens.
>
>We withdrew protocol provided PRISM/USDC liquidity from Raydium
>
>WITHDRAW YOUR PRISM/USDC LIQUIDITY FROM RAYDIUM

The [official announcement](https://twitter.com/RaydiumProtocol/status/1603762271028748289) came 40 minutes later, stating that “_authority has been halted on AMM & farm programs for now_”. In a follow-up [post](https://twitter.com/RaydiumProtocol/status/1603860540153028625), the team assured users that “_a patch is in place preventing further exploits from the attacker._”

While this incident doesn’t look to have caused a total protocol meltdown, losing millions is never a good look.

_But who’s still using Solana anyway?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [Raydium](https://twitter.com/RaydiumProtocol/status/1603860540153028625), [OtterSec](https://twitter.com/osec_io/status/1603763023151509505)_

**According to OtterSec, the incident appears to have been down to a compromised private key to the owner account of Raydium contracts.**

Raydium [suspect](https://twitter.com/RaydiumProtocol/status/1603860543302950918) “_a trojan attack and compromised private key for the pool owner account_”.

The account had authority over certain functions of Raydium’s pools, allowing the attacker to drain accumulated trading/protocol fees via the withdraw_pnl instruction. The hacker also changed the SyncNeedTake parameter to increase expected fees and withdraw extra funds.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/12/raydium-code.png)

**The following pools were affected for a total protocol loss of $4.4M:**

SOL-USDC

SOL-USDT

RAY-USDC

RAY-USDT

RAY-SOL

stSOL-USDC

ZBC-USDC

UXP-USDC

whETH-USDC

The majority of funds were bridged to Ethereum, swapped to ETH and have been deposited into Tornado Cash. 100k SOL ($1.4M) remains in the attacker’s Solana address.

**Attacker’s SOL address [AgJddDJLt17nHyXDCpyGELxwsZZQPqfUsuwzoiqVGJwD](https://solana.fm/address/AgJddDJLt17nHyXDCpyGELxwsZZQPqfUsuwzoiqVGJwD/transfers)**

**Attacker’s ETH address [0x7047912c295cd54d6617b5d0d6d8b324a11c91db](https://etherscan.io/address/0x7047912c295cd54d6617b5d0d6d8b324a11c91db)**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

As ever with cases of “compromised keys” we must ask ourselves if this could simply have been an insider looking for a bit on the side.

The bear market promises a long, tough road ahead for many smaller teams, especially in this context...

_The future of Solana feels uncertain._

Following the [collapse](https://rekt.news/ftx-yikes/) of FTX and [downfall](https://rekt.news/sbf-mask-off/) of the now-imprisoned SBF with whom the ecosystem was so closely associated, it’s easy to see how an ecosystem dev might be sick from the fallout and be tempted to take the easy way out.

**As with so many of the [cases](https://rekt.news/leaderboard/) we’ve covered, we’ll likely never know.**

_Who’s next?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
