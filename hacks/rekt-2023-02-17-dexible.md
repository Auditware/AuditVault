---
tags:
  - blockchain/arbitrum
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/privacy
  - sector/token
title: "Dexible - REKT"
protocol: "[[Dexible]]"
date: 2023-02-17
loss_usd: 2000000
auditors:
source: "https://rekt.news/dexible-rekt"
excerpt: "Crisis-comms calamity as cross-chain chaos continues… Dexible lost a total of $2M on Friday, on Ethereum and Arbitrum. In Dexible’s own words... 'exploits happen in DeFi.'"
genome:
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
---
# Dexible - REKT

> **Loss:** $2,000,000 | **Date:** 2023-02-17 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/dexible-header.png)

_Crisis-comms calamity as cross-chain chaos continues…_

**The decentralised exchange aggregator, [Dexible](https://dexible.io/) lost a total of $2M on Friday, on Ethereum and Arbitrum.**

Although contracts were quickly paused, an [official announcement](https://twitter.com/DexibleApp/status/1626575966003757056) came more than 9 hours after the hack, and over five hours after Peckshield [raised the alarm](https://twitter.com/peckshield/status/1626493024879673344).

The thread states that their tech lead “_discovered the attack early on_” but that the “_Twitter channel was not able to respond in time_”, despite various promotional tweets being published in the intervening hours.

**When they did finally respond, however, part of their message came across as, at best, tone-deaf and, at worst, indifferent.**

>There's no excuse for an exploit, but these things happen

And when [called out](https://twitter.com/DollarCakeCry/status/1626579812700798979), the Dexible team simply [referred](https://twitter.com/DexibleApp/status/1626583089211392006) to rekt.news’ [leaderboard](https://rekt.news/leaderboard/), stating a hard truth:

>exploits happen in DeFi.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _Dexible, [Peckshield](https://twitter.com/peckshield/status/1626493024879673344), [Beosin](https://twitter.com/BeosinAlert/status/1626499932265005058)_

One feature of Dexible’s recently introduced v2 contracts allows users to define their own routing via the selfSwap function. Dexible’s post-mortem report (published via Telegram and Discord, in PDF format) explains:

>embedded in each request to swap was a "route" of what DEX to call and what data to send to that DEX to execute a swap

However, the function does not check whether the router address is actually a DEX by, for example, using an on-chain allowlist:

>the router address was not verified on-chain in any way. This meant that instead of calling a DEX smart contract, the hacker simply called a token contract with a request to "transferFrom" any account that had spend approval on the Dexible contract

Attacker addresses ([ETH](https://etherscan.io/address/0x684083f312ac50f538cc4b634d85a2feafaab77a), [ARBI](https://arbiscan.io/address/0x684083f312ac50f538cc4b634d85a2feafaab77a), [BSC](https://bscscan.com/address/0x684083f312ac50f538cc4b634d85a2feafaab77a#tokentxns)): **0x684083f312ac50f538cc4b634d85a2feafaab77a**

Example tx: [0x138daa4c…](https://etherscan.io/tx/0x138daa4cbeaa3db42eefcec26e234fc2c89a4aa17d6b1870fc460b2856fd11a6)

Relatively [few addresses](https://twitter.com/DexibleApp/status/1626592861050527745) were affected, with the majority of losses [reportedly](https://www.coindesk.com/tech/2023/02/17/blocktower-capital-loses-15m-in-defi-market-aggregator-dexible-exploit-blockchain-data/) coming from an [address](https://etherscan.io/address/0x58f5f0684c381fcfc203d77b2bba468ebb29b098) belonging to [BlockTower Capital](https://www.blocktower.com/) which lost 18M TRU tokens, valued at ~$1.4M at the time.

In total, approximately $1.5M was lost on Ethereum, and sent to Tornado Cash. A further $450k was lost on Arbitrum, which was bridged to BSC before also being washed via Tornado Cash.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

In the post-mortem report, the Dexible team attempted to justify releasing unaudited code based on the experience of their team:

>A formal audit was not performed on the latest set of contracts. We had several community members and Dexible engineers review the code, and they did not find the vulnerability. The core engineer that created the contracts has over 25 years of software engineering experience, and he did not see the vulnerability. Upon reviewing one of the hacker's transactions, however, he immediately understood how it was executed.

**An audit is not a silver bullet… but it certainly helps.**

Even the most experienced engineers may overlook a security vulnerability in their own code. Naturally, when building a new protocol, devs primarily have users in mind.

But in this industry, security is paramount.

_And no shortage of unaudited protocols have made it onto the [leaderboard](https://rekt.news/leaderboard/)._

**In Dexible’s own words:**

>exploits happen in DeFi.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
