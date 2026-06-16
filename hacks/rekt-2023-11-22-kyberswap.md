---
tags:
  - blockchain/arbitrum
  - blockchain/avalanche
  - blockchain/ethereum
  - blockchain/optimism
  - blockchain/polygon
  - has/audit
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/perpetuals
  - sector/privacy
title: "KyberSwap - REKT"
protocol: "[[Kyberswap]]"
date: 2023-11-22
loss_usd: 48000000
auditors:
  - "[[ChainSecurity]]"
  - "[[Sherlock]]"
source: "https://rekt.news/kyberswap-rekt"
excerpt: "OG decentralised exchange KyberSwap got rekt across six chains, for a total loss of over $48M. Perhaps there’s some good news in store for KyberSwap and LPs, or is the attacker just toying with us?"
genome:
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# KyberSwap - REKT

> **Loss:** $48,000,000 | **Date:** 2023-11-22 | **Audited by:** ChainSecurity, Sherlock

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/kyberswap-header.png)

_It’s already been a November to remember… and there’s still a week to go._

**OG decentralised exchange [KyberSwap](https://kyberswap.com/) is the latest project to fall victim, getting rekt across six chains for a total loss of over $48M.**

The project’s concentrated liquidity protocol, KyberSwap Elastic, saw its [TVL fall](https://defillama.com/protocol/kyberswap-elastic) from $71M to under $3M. The losses were [spread out](https://twitter.com/AnciliaInc/status/1727469857212682470/photo/1) as follows: >$20M on Arbitrum, $15M on Optimism, $7.5M on Ethereum, $3M on Polygon, $2M on Base and $23k on Avalanche.

This incident brings the total stolen this month to over $300M (_so far_), including [Poloniex](https://rekt.news/poloniex-rekt/) ($126M), [dYdX](https://rekt.news/dydx-rekt/) ($8M), [Kronos Research](https://rekt.news/kronos-rekt/) ($26M), [HECO Bridge and HTX](https://rekt.news/heco-htx-rekt/) ($99M).

[Spreek](https://twitter.com/spreekaway/status/1727462694138024249) spotted the hack, which was confirmed within the hour by [KyberNetwork](https://twitter.com/KyberNetwork/status/1727475235342217682):

>As a precautionary measure, we strongly advise all users to promptly withdraw their funds. Our team is diligently investigating the situation, and we commit to keeping you informed with regular updates.

**Honestly, given that the hacker basically left [on-chain instructions](https://twitter.com/fozzydiablo/status/1727475573276991766), it’s probably [best to withdraw](https://twitter.com/spreekaway/status/1727467130189205592) from any KyberSwap forks, in case of black hat copycats.**

As well as playing the Bob Ross of smart contract exploiting, the hacker has some [shady](https://arbiscan.io/tx/0xd5ec02f4fb46ed2c6b030fd5c310f68505295fe1ea8745e532568cc47f7eb8c5) connections, but nonetheless [claims](https://etherscan.io/tx/0x7a8912583520304ce2364fa165dafe94461a91ab2dcf45dab942e296594dc40a) to be keen to negotiate (_after a nap, of course_).

_Is this an exhausted grey hat, inspired by a [near-miss](https://cointelegraph.com/news/kyberswap-announces-potential-vulnerability-tells-lps-to-withdraw-asap) of a [similar](https://twitter.com/TheDEFIac/status/1727618390431306144) (albeit [simpler](https://twitter.com/1_00_proof/status/1727625974911791488)) [vulnerability](https://100proof.org/kyberswap-post-mortem.html), and finally looking to secure a bounty after over six months of work?_

_Or just a bluffing troll?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[0xdoug](https://twitter.com/0xdoug/status/1727613541115429314), [BlockSec](https://twitter.com/BlockSecTeam/status/1727560157888942331)_

**The attack, which [began](https://etherscan.io/tx/0x485e08dc2b6a4b3aeadcb89c3d18a37666dc7d9424961a2091d6b3696792f0f3) shortly before 11 PM UTC last night, targeted [KyberSwap Elastic](https://docs.kyberswap.com/liquidity-solutions/kyberswap-elastic) (concentrated liquidity) pools.**

The [exploit](https://twitter.com/0xdoug/status/1727613541115429314) involved using flash loans to push asset prices into a region of each pool’s liquidity curve where there was no existing liquidity. Then, by executing [extremely precise](https://twitter.com/0xdoug/status/1727615177766387853) swaps within this region, the exploiter was able to trick Kyber’s code via a precision error.

>That shows just how carefully engineered this exploit was. The check failed by <0.00000000001%

_See 0xdoug’s detailed breakdown [here](https://twitter.com/0xdoug/status/1727613541115429314)._

**[BlockSec](https://twitter.com/BlockSecTeam/status/1727560157888942331) defined the route cause as “_tick manipulation and double liquidity counting_”:**

>In summary, the attackers borrowed a flash loan and drained the pools with low liquidity. By executing swaps and altering positions, they manipulated the current prices and ticks of the victimized pools. Ultimately, the attacker triggered multiple swap steps and cross tick operations, resulting in double liquidity counting and consequently draining the pools.

Exploiter address 1 ([ARB](https://arbiscan.io/address/0x50275e0b7261559ce1644014d4b78d4aa63be836), [OP](https://optimistic.etherscan.io/address/0x50275e0b7261559ce1644014d4b78d4aa63be836), [ETH](https://etherscan.io/address/0x50275e0b7261559ce1644014d4b78d4aa63be836), [MATIC](https://polygonscan.com/address/0x50275e0b7261559ce1644014d4b78d4aa63be836), [BASE](https://basescan.org/address/0x50275e0b7261559ce1644014d4b78d4aa63be836), [AVAX](https://snowtrace.io/address/0x50275e0b7261559ce1644014d4b78d4aa63be836)): **0x50275e0b7261559ce1644014d4b78d4aa63be836**

Exploiter address 2 ([ARB](https://arbiscan.io/address/0xc9b826bad20872eb29f9b1d8af4befe8460b50c6), [OP](https://optimistic.etherscan.io/address/0xc9b826bad20872eb29f9b1d8af4befe8460b50c6), [ETH](https://etherscan.io/address/0xc9b826bad20872eb29f9b1d8af4befe8460b50c6), [MATIC](https://polygonscan.com/address/0xc9b826bad20872eb29f9b1d8af4befe8460b50c6), [BASE](https://basescan.org/address/0xc9b826bad20872eb29f9b1d8af4befe8460b50c6), [AVAX](https://snowtrace.io/address/0xc9b826bad20872eb29f9b1d8af4befe8460b50c6)): **0xc9b826bad20872eb29f9b1d8af4befe8460b50c6**

Example attack tx (ETH): [0x485e08dc…](https://etherscan.io/tx/0x485e08dc2b6a4b3aeadcb89c3d18a37666dc7d9424961a2091d6b3696792f0f3)

**The attacker used the 0x50275 address for execution and 0xc9b82 address for holding stolen funds across all affected chains. BlockSec’s MetaSleuth [provided a map](https://twitter.com/MetaSleuth/status/1727568517443252582) of all the attacks. EigenPhi [published a list](https://twitter.com/EigenPhi/status/1727660593027674243) of all transactions.**

_Although the hacker also [funded](https://scrollscan.com/address/0x50275e0b7261559ce1644014d4b78d4aa63be836) their address on Scroll, the attack never went ahead._

Initial funding came from Tornado Cash on Ethereum (via an [intermediary address](https://etherscan.io/address/0x5e42dd64266c3852cad3d294f71b171459cf0a48#internaltx)), which in turn funded the ARB, OP, BASE and (unused) Scroll addresses. [MATIC](https://polygonscan.com/tx/0x97bbc29dca45fea09e27f67cfcce6eda739cbb9c2a3b0e82693642d4df51ed17) and [AVAX](https://snowtrace.io/tx/0x736accbc8c4f8e325a36af9c699d385f95a0757b744573e43262d6847dd6c416) funding came from FixedFloat.

_According to [KyberSwap’s docs](https://docs.kyberswap.com/reference/audits), the current version of Elastic had been audited by [ChainSecurity](https://chainsecurity.com/security-audit/kyberswap-elastic/) and via a [Sherlock contest](https://audits.sherlock.xyz/contests/103)._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

The exploiter clearly has on-chain flair, showing their working via [tx event logs](https://etherscan.io/tx/0x485e08dc2b6a4b3aeadcb89c3d18a37666dc7d9424961a2091d6b3696792f0f3#eventlog) throughout the attack, leaving charming comments such as “_Step 2, finding liquidity required_”, “_Is it enough?_” and “_Raping Now_”.

**They also [sent 1000 ETH](https://arbiscan.io/tx/0xd5ec02f4fb46ed2c6b030fd5c310f68505295fe1ea8745e532568cc47f7eb8c5) on Arbitrum to an address [associated](https://etherscan.io/address/0x84e66f86c28502c0fc8613e1d9cbbed806f7adb4) with the [$16M hack of Indexed Finance](https://rekt.news/indexed-finance-rekt/) in October 2021.**

While this may be simple misdirection, the move _does_ sound [plausibly](https://twitter.com/Mudit__Gupta/status/1727618570232934700) like the actions of the Indexed hacker, limelight-loving Andean Medjedovic, who has [previous](https://www.dlnews.com/articles/people-culture/andean-medjedovic-canadian-fugitive-hacker-code-is-law-whitehat/) in being performatively offensive.

The timing is also strange, given the recent (thwarted) governance [attack](https://twitter.com/functi0nZer0/status/1725922016484597975) on Indexed Finance’s abandoned treasury. While the fallout is [ongoing](https://twitter.com/functi0nZer0/status/1727498381440762003), the initial attempt appears [linked to Lazarus](https://twitter.com/zachxbt/status/1726002049123340666).

**However, while [many recent hacks](https://twitter.com/tayvano_/status/1727384134061052410) have [Lazarus](https://rekt.news/big-phish/) written all over them, this incident looks different.**

_Candid on-chain easter-eggs and attempts at misdirection aren’t Lazarus’ style; they don’t waste time planting red-herrings._

Instead, they opt to work openly, relying on [complex webs](https://twitter.com/tayvano_/status/1668935273047261185) of transactions to bore and confuse investigators, or throw them off the scent.

_And if it were Lazarus, they certainly wouldn’t be looking to negotiate…_

**Whoever the hacker may turn out to be, it appears that all hope is not lost.**

The the following [on-chain message](https://etherscan.io/tx/0x7a8912583520304ce2364fa165dafe94461a91ab2dcf45dab942e296594dc40a) was sent from the exploiter’s address upon completion of the attack:

>Dear Kyberswap Developers, Employees, DAO members and LPs,
>
>Negotiations will start in a few hours when I am fully rested.
>
>Thank you.

**Perhaps there’s some good news in store for KyberSwap and LPs.**

_Or is the attacker just toying with us all?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
