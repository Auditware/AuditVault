---
tags:
  - blockchain/bsc
  - sector/bridge
  - sector/dex
  - sector/gaming
  - sector/privacy
  - precondition/insider
title: "Transit Swap - REKT"
protocol: "[[Transit Swap]]"
date: 2022-10-02
loss_usd: 21200000
auditors:
source: "https://rekt.news/transit-swap-rekt"
excerpt: "Transit Swap has lost $21M to a vulnerability in its swap contracts. The cooperation between multiple security teams led to 70% of funds being returned. But a protocol using live, unverified contracts"
genome:
  - "[[insider]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
---
# Transit Swap - REKT

> **Loss:** $21,200,000 | **Date:** 2022-10-02 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/10/transit-header.png)

_Working on the weekend like usual…_

Sunday morning notifications of a cross-chain protocol losing millions.

Just like the good old days.

**[Transit Swap](https://transit.finance/) has lost $21M to a vulnerability which allowed an unknown attacker to drain the wallets of users who had approved the protocol's swap contracts.**

But unfortunately for the hacker, over $1M was [lost in transit](https://twitter.com/SlowMist_Team/status/1576488479357214721)… _not all MEV bots are [down 0xbad](https://rekt.news/ripmevbot/) this week._

The team paused the affected contracts before [announcing the incident](https://twitter.com/TransitFinance/status/1576331732349222912) on Twitter.

Then came an update that via “_the joint efforts of the [@SlowMist_Team](https://twitter.com/SlowMist_Team), the [@Bitrace_Team](https://twitter.com/Bitrace_team), the [@peckshield](https://twitter.com/peckshield) security team,_” key info about the hacker, including their “_IP, email address, and associated on-chain addresses_” had been uncovered.

As the attacker’s anonymity began to slip away, it seems they had second thoughts. So far, over [70% of the funds](https://twitter.com/TransitFinance/status/1576463550557483008) have been returned.

_Finding a vulnerability in an unverified contract; diligent decompiler, or someone acting on insider info?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**Though the vulnerability was in the project’s code, this attack targeted the users directly via a vulnerability in the use of the transferFrom() function. Any tokens approved for trading on Transit Swap could be transferred directly from users’ wallets to the unknown exploiter’s address.**

The first [attack tx](https://etherscan.io/tx/0xba75ad7a43e784f51fe777d749fc55ae10f1df2bcb01cde97641613b19acb6ec) occurred just after 18:30 UTC, with the attack lasting approximately half an hour before swapping stolen tokens to ETH and BNB.

**Exploiter’s address on [ETH](https://etherscan.io/address/0x75f2aba6a44580d7be2c4e42885d4a1917bffd46) and [BSC](https://bscscan.com/address/0x75f2aba6a44580d7be2c4e42885d4a1917bffd46):** 0x75f2aba6a44580d7be2c4e42885d4a1917bffd46

**Vulnerable contract (revoke approvals on both ETH and BSC):** 0xed1afc8c4604958c2f38a3408fa63b32e737c428

_Credit: [Supremacy Inc.](https://twitter.com/Supremacy_CA/status/1576332076277993475), [SlowMist](https://slowmist.medium.com/cross-chain-dex-aggregator-transit-swap-hacked-analysis-74ba39c22020)_

The project’s smart contracts are unverified. However, they can be decompiled from the published bytecode:

>After understanding the hacker's attack path, we tried to find out the cause of the vulnerability, but the smart contracts of the project are closed-source contracts. So we decompiled it and finally found the root cause of this attack: a controllable transferFrom external call

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/10/transit-code.png)

>Because it is decompiled code, it is a little obscure for readers to understand. We can understand that varg0 is the token address, varg1, varg2 and varg3 are the from, to and amount parameters of the transferFrom function.
>
>0x23b872dd in the figure is transferFrom() function signature of the function. Therefore, the claimTokens function calls the transferFrom function of an address, and the address and function parameters are controllable.

**For a more detailed explanation, see [SlowMist’s analysis](https://slowmist.medium.com/cross-chain-dex-aggregator-transit-swap-hacked-analysis-74ba39c22020).**

Peckshield also provided a visual [summary](https://twitter.com/peckshield/status/1576419241414524929/photo/1) of the attacker’s activities.

The returned funds have been consolidated into the same address (0xD989f7B4320c6e69ceA3d914444c19AB67D3a35E) on [ETH](https://etherscan.io/address/0xD989f7B4320c6e69ceA3d914444c19AB67D3a35E) and [BSC](https://bscscan.com/address/0xD989f7B4320c6e69ceA3d914444c19AB67D3a35E), which holds a total of ~$16.5M across the two chains.

**Stolen funds:**

- 3180 ETH ($4.2M), [returned](https://etherscan.io/tx/0x2e9d1f3ef02f1e3dc944b62976427a83f85ad280a42e6eb5b37bb366f6c017d8).
- 1500 Binance-pegged ETH ($2M), [returned](https://bscscan.com/tx/0x34e30dbfdeef6dcb3cb897e297de45e9e246b8c94c8a18b5ad4c4b776924ef0a).
- 50k BNB ($14M), [$10.4M returned](https://bscscan.com/tx/0x0a6d27a3a6ef006760f5904c6f03b5e269b4615a1243cbe77e07d4f5bb83280a).

**At the time of writing, the exploiter’s [BSC address](https://bscscan.com/address/0x75f2aba6a44580d7be2c4e42885d4a1917bffd46) still holds over $3.5M in stolen BNB and [previously sent 2500 BNB](https://bscscan.com/txs?toaddress=0x0d5550d52428e7e3175bfc9550207e4ad3859b17&address=0x75f2aba6a44580d7be2c4e42885d4a1917bffd46) ($715k) to Tornado Cash.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

The fast response and cooperation between multiple security teams meant this incident had a happier ending than most.

**But a protocol using live, unverified contracts is never a good look in DeFi, where open-source is the name of the game.**

Hiding contract code makes DYOR all but impossible, and impedes the work of whitehats to spot vulnerabilities before they’re exploited.

**Closed-source code also breeds suspicion in the blockchain world, where [exploits, rug-pulls and “compromised keys”](https://rekt.news/leaderboard/) are often forgotten within weeks.**

_Could this be a case of an insider using privileged info against their users, before returning most of the funds and hoping it will all blow over?_

_Business as usual._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
